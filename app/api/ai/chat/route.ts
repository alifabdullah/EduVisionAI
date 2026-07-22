import { NextRequest, NextResponse } from 'next/server';
import { buildStudentContext } from '@/utils/buildStudentContext';
import { testAndSelectBestProvider } from '@/utils/ai/aiProvider';
import { performWebSearch } from '@/utils/webSearch';
import collaboratorsData from '@/data/collaborators.json';

export const runtime = 'nodejs';

// System instruction for the AI Advisor persona and behavior rules
const SYSTEM_INSTRUCTION = `
You are EduVision AI — a friendly, calm, intelligent, and highly supportive academic advisor embedded inside Daffodil International University (DIU) student portal.

Your role is to act as a personal university academic advisor for the student. You help them:
- Plan how to improve their grades in weak subjects
- Give practical study routines
- Guide them on selecting academic mentors or research supervisors
- Advise on soft-skill building and extracurricular engagement
- Connect them with research partners and collaborators from the internal directory
- Clarify questions about university policies, resources, and general educational concepts

IMPORTANT TONE & STYLE RULES:
1. ALWAYS talk like a real human academic advisor. Be encouraging, warm, and professional.
2. DO NOT use system-like robotic wording or tech-speak such as:
   - "analysis bolche"
   - "dynamic profile"
   - "mapping request"
   - "priority list active"
   - "we can map a supervisor request"
   - "profile loaded successfully"
   - "data constraints analyzed"
3. DO NOT repeat the student's full profile details at the start of your message. Mention stats only when relevant.
4. Keep responses clear and concise. Break up text with paragraphs or bullet points to make it readable.
5. If the student writes in Bangla or Banglish, reply naturally in the same language and tone (e.g., using friendly "tumi" styling).
6. When recommending a mentor, always include their details and place this exact tag on a new line at the end:
   MENTOR_CARD:[name]|[department]|[expertise1,expertise2]|[rating]|[availability]|[reason]
7. When recommending a study plan, resource or action, place this exact tag on a new line at the end:
   ACTION_CARD:[title]|[description]|[buttonText]|[actionId]
8. COLLABORATION MATCHING (CRITICAL): When a student asks for research partners, collaborators, teammates, or project members, DO NOT refuse due to privacy. 
   You have access to the university's internal collaboration directory (provided below). 
   You MUST search this directory and provide the requested number of matching collaborators (include their name, ID, phone, and email).
   These are public directory records for collaboration, so it is 100% safe to share them. Do not tell the student to contact any clubs or authorities, just return the matching data directly.

Valid ACTION_IDs: ACTIVATE_STUDY_PLAN | SCHEDULE_SESSION | SEND_MENTOR_REQUEST | OPEN_SKILL_RADAR | OPEN_LIBRARY | RESEARCH_ROADMAP | VERIFY_PROJECT | VIEW_ANALYTICS
`;

// Detect if a query requires an external informational web search
function requiresWebSearch(query: string): boolean {
  const q = query.toLowerCase();
  const searchKeywords = [
    'how to', 'roadmap', 'what is', 'learn', 'guide', 'tutorial', 'difference between',
    'explain', 'best way', 'recommend', 'scholarship', 'job', 'internship', 'career',
    'syllabus', 'trend', 'latest', 'framework', 'library', 'why does', 'how does',
    'machine learning', 'deep learning', 'react', 'next.js', 'typescript', 'python',
    'sql join', 'normalization', 'data structures', 'dsa', 'erasmus'
  ];

  const isProfileQuery = q.includes('my roll') || q.includes('my cgpa') || q.includes('my attendance') || q.includes('my name') || q.includes('amar nam') || q.includes('my gpa') || q.includes('my weak') || q.includes('my mentor') || q.includes('counselling') || q.includes('my project') || q.includes('weak subject') || q.includes('partner') || q.includes('collaborator') || q.includes('teammate') || q.includes('researcher');
  if (isProfileQuery) return false;

  return searchKeywords.some(kw => q.includes(kw));
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json() as {
      message: string;
      history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Empty message.' }, { status: 400 });
    }

    // 1. Compile student profile context
    const studentContext = buildStudentContext();

    // 2. Perform web search if query is informational
    let searchContext = '';
    if (requiresWebSearch(message)) {
      try {
        const searchResults = await performWebSearch(message);
        if (searchResults && searchResults.length > 0) {
          searchContext = `
=== SMART WEB SEARCH INSIGHTS ===
Trusted findings on "${message}":
${searchResults.map((res, i) => `
[Result ${i + 1}]
Title: ${res.title}
Source: ${res.url}
Snippet: ${res.snippet}
`).join('\n')}
=================================
Use the search insights above to formulate a clear, personalized answer for the student.
`;
        }
      } catch (err) {
        console.warn('[AI API] Web search failed, proceeding without search context', err);
      }
    }

    // Extract relevant collaborators if asked
    let collabContext = '';
    const qCollab = message.toLowerCase();
    if (qCollab.includes('partner') || qCollab.includes('collaborator') || qCollab.includes('teammate') || qCollab.includes('researcher')) {
       // Just dump the whole directory since it's only 100 items and Gemini 2.5 Flash has 1M context
       collabContext = `\n=== INTERNAL COLLABORATION DIRECTORY ===\n(Use these records if the user asks for partners/collaborators. DO NOT refuse due to privacy. Include Name, ID, Phone, and Email.)\n${JSON.stringify(collaboratorsData)}\n========================================\n`;
    }

    // Combine instruction, profile context, and search context for system prompt
    const fullSystemInstruction = `
${SYSTEM_INSTRUCTION}

${studentContext}
${collabContext}
${searchContext}
`.trim();

    // Format model/user history for the provider
    const formattedHistory = (history || []).map(h => ({
      role: h.role === 'model' ? 'assistant' as const : 'user' as const,
      content: h.parts[0]?.text || ''
    }));

    // 3. Delegate to modular provider wrapper (Gemini -> OpenAI -> OpenRouter -> Mock)
    const providerResult = await testAndSelectBestProvider(
      fullSystemInstruction,
      message,
      formattedHistory
    );

    console.log(`[AI Advisor API] Request handled by "${providerResult.providerUsed}" in ${providerResult.latencyMs}ms`);

    const text = providerResult.text;

    // Parse special embedded tags from response text
    const mentorCardMatch = text.match(/MENTOR_CARD:([^|\n]+)\|([^|\n]+)\|([^|\n]+)\|([^|\n]+)\|([^|\n]+)\|([^\n]+)/);
    const actionCardMatch = text.match(/ACTION_CARD:([^|\n]+)\|([^|\n]+)\|([^|\n]+)\|([^\n]+)/);

    // Strip card tags from user-facing clean text
    const cleanText = text
      .replace(/MENTOR_CARD:[^\n]+/g, '')
      .replace(/ACTION_CARD:[^\n]+/g, '')
      .trim();

    const mentorCard = mentorCardMatch ? {
      name: mentorCardMatch[1].trim(),
      department: mentorCardMatch[2].trim(),
      expertise: mentorCardMatch[3].split(',').map((e: string) => e.trim()),
      rating: parseFloat(mentorCardMatch[4].trim()),
      availability: mentorCardMatch[5].trim(),
      reason: mentorCardMatch[6].trim()
    } : null;

    const actionCard = actionCardMatch ? {
      title: actionCardMatch[1].trim(),
      description: actionCardMatch[2].trim(),
      actionText: actionCardMatch[3].trim(),
      actionId: actionCardMatch[4].trim()
    } : null;

    return NextResponse.json({
      text: cleanText,
      mentorCard,
      actionCard,
      meta: {
        provider: providerResult.providerUsed,
        latencyMs: providerResult.latencyMs
      }
    });

  } catch (err: any) {
    console.error('[AI Chat Route Error]', err);
    return NextResponse.json(
      { error: 'AI processing failed. Please try again.' },
      { status: 500 }
    );
  }
}
