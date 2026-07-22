import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { buildTeacherContext } from '@/utils/buildTeacherContext';

export const runtime = 'nodejs';

const TEACHER_SYSTEM_INSTRUCTION = `
You are EduVision AI — an intelligent AI teaching assistant and decision-support advisor embedded inside a university faculty portal.

Your role is to act as a smart academic co-pilot for the teacher whose profile data is given below. You help the teacher:
- Identify at-risk students and suggest targeted interventions
- Analyze course performance and weak topic clusters
- Generate actionable teaching strategies and classroom improvements
- Suggest personalized mentorship plans for struggling students
- Provide research, curriculum, and pedagogical recommendations
- Analyze attendance, quiz, and assignment trends
- Generate concise, structured reports and summaries on request
- Answer questions about university academic policies and best practices

IMPORTANT BEHAVIORAL RULES:
1. NEVER repeat the full teacher profile in every response.
2. Be conversational, professional, and solution-focused.
3. Use the profile data silently to personalize every answer.
4. When mentioning a student, always cite their actual metrics from the profile.
5. When recommending an action, make it specific and actionable.
6. Keep responses concise but complete. Use bullet points for lists and action plans.
7. Understand Bangla, English, and Banglish naturally.
8. Remember conversation context — refer back to earlier topics.
9. When generating teaching suggestions, prioritize the highest-risk situations first.
10. When asked about a specific student, provide their metrics and a tailored recommendation.
11. If generating a study/intervention plan, use PLAN_CARD tag:
    PLAN_CARD:[title]|[summary]|[actionText]|[actionId]
    Valid ACTION_IDs: SCHEDULE_EXTRA_CLASS | SEND_STUDENT_ALERT | GENERATE_REPORT | VIEW_AT_RISK | REVIEW_CURRICULUM | CONTACT_AUTHORITY | MENTORSHIP_PLAN
`;

// Fallback teacher chatbot response (no API key)
function getTeacherFallbackResponse(message: string): string {
  const q = message.toLowerCase();

  if (q.includes('at-risk') || q.includes('risk') || q.includes('struggling')) {
    return `Based on your course data, I've identified **2 high-risk students**:\n\n- **Mia Reynolds** (CS21046) — Marks: 55%, Attendance: 60% in Data Structures. She has missed 3 consecutive classes.\n- **Liam Scott** (CS21049) — Marks: 45%, Attendance: 50% in Data Structures. Critical performance decline.\n\n**Recommended Actions:**\n- Schedule individual 1-on-1 check-ins this week\n- Send attendance warning notifications\n- Connect them with peer study groups\n- Consider assigning extra practice problems with solutions`;
  }

  if (q.includes('suggestion') || q.includes('improve') || q.includes('teaching')) {
    return `Here are my top AI teaching suggestions for your courses:\n\n**High Priority:**\n🚨 Data Structures (CSE301) — 45% of students are struggling with Dynamic Programming. Consider introducing **visual algorithm animations** and step-by-step walkthroughs.\n\n**Medium Priority:**\n⚠️ Database Systems (CSE303) — Engagement declining in lectures. Try **interactive polls every 20 minutes** to maintain attention.\n\n**Low Priority:**\n💡 Review grading rubrics for assignments to ensure consistency across all submissions.`;
  }

  if (q.includes('attendance') || q.includes('absent')) {
    return `**Attendance Analysis across your courses:**\n\n- Database Systems (CSE303): **85%** avg — ✅ Good\n- Data Structures (CSE301): **78%** avg — ⚠️ Slightly below target\n- Discrete Math (CSE201): **90%** avg — ✅ Excellent\n\n**Students with critical low attendance:**\n- Mia Reynolds: 60% — Send formal attendance warning\n- Liam Scott: 50% — Requires immediate intervention and parent/guardian notification`;
  }

  if (q.includes('performance') || q.includes('marks') || q.includes('grade')) {
    return `**Course Performance Summary:**\n\n| Course | Avg Marks | Risk Level |\n|--------|-----------|------------|\n| CSE303 Database Systems | 78% | 🟢 Low |\n| CSE301 Data Structures | 68% | 🟡 Medium |\n| CSE201 Discrete Math | 82% | 🟢 Low |\n\n**Key Weak Topics detected:**\n- CSE303: Normalization, Concurrency Control\n- CSE301: Graph Algorithms, Dynamic Programming\n- CSE201: Combinatorics, Graph Theory\n\nWould you like me to suggest targeted revision plans for any of these topics?`;
  }

  if (q.includes('mentor') || q.includes('mentee') || q.includes('counsel')) {
    return `**Your Current Mentees:**\n\n1. **Noah Wilson** (CS21050) — Focus: Database Optimization, Query tuning\n2. **Emma Davis** (CS21051) — Focus: Research Paper Writing, Literature reviews\n\n**Suggested Mentorship Actions:**\n- Schedule bi-weekly check-ins with both mentees\n- Share relevant reading materials (SQL optimization guides, research writing templates)\n- Set milestone goals for this semester\n\nWould you like me to generate a structured mentorship plan for either student?`;
  }

  if (q.includes('report') || q.includes('summary')) {
    return `**Quick Faculty Report — Fall 2024:**\n\n📊 **Overview:**\n- Total Students Under Supervision: 145\n- At-Risk: 8 students (5.5%)\n- Avg Class Performance: 76%\n- Avg Attendance: 82%\n\n⚠️ **Top Concerns:**\n1. Data Structures class has the highest at-risk percentage (18%)\n2. Two students need immediate intervention (Mia Reynolds, Liam Scott)\n3. Normalization topic showing 45% failure rate in CSE303\n\n✅ **Positives:**\n- Discrete Math performing well (82% avg)\n- Database Systems assignment completion at 92%\n\nWould you like a detailed breakdown of any specific course?`;
  }

  return `I'm your EduVision AI Teaching Assistant! I can help you with:\n\n- 🚨 **At-risk student identification** — "Show me at-risk students"\n- 📊 **Course performance analysis** — "How is CSE301 performing?"\n- 💡 **Teaching suggestions** — "Give me AI teaching recommendations"\n- 📅 **Attendance analysis** — "Check attendance issues"\n- 🤝 **Mentorship guidance** — "Help me with mentorship plans"\n- 📋 **Quick reports** — "Generate a faculty summary"\n\nWhat would you like to analyze first?`;
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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      const fallbackText = getTeacherFallbackResponse(message);
      return NextResponse.json({ text: fallbackText, planCard: null });
    }

    const teacherContext = buildTeacherContext();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `${TEACHER_SYSTEM_INSTRUCTION}\n\n${teacherContext}`
    });

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
        topP: 0.9,
      }
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    // Parse optional PLAN_CARD tags
    const planCardMatch = text.match(/PLAN_CARD:([^|\n]+)\|([^|\n]+)\|([^|\n]+)\|([^\n]+)/);
    const cleanText = text.replace(/PLAN_CARD:[^\n]+/g, '').trim();

    const planCard = planCardMatch ? {
      title: planCardMatch[1].trim(),
      summary: planCardMatch[2].trim(),
      actionText: planCardMatch[3].trim(),
      actionId: planCardMatch[4].trim(),
    } : null;

    return NextResponse.json({ text: cleanText, planCard });

  } catch (err: unknown) {
    console.error('[Teacher AI Chat Error]', err);
    try {
      const body = await req.clone().json() as { message: string };
      const fallbackText = getTeacherFallbackResponse(body.message || '');
      return NextResponse.json({ text: fallbackText, planCard: null });
    } catch {
      return NextResponse.json(
        { error: 'AI response failed. Please try again.' },
        { status: 500 }
      );
    }
  }
}
