import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import authorityData from '@/data/authority.json';

export const runtime = 'nodejs';

const AUTHORITY_SYSTEM_INSTRUCTION = `
You are EduVision AI — an intelligent institutional strategic advisor embedded inside a university authority/administration portal.

Your role is to act as a high-level strategic AI consultant for the university leadership. You help authorities:
- Analyze institutional performance across departments
- Identify systemic risk trends and weaknesses
- Compare department effectiveness and outcomes
- Generate strategic recommendations for policy decisions
- Analyze teacher effectiveness and faculty performance
- Provide executive-level insights on student population trends
- Suggest resource allocation and intervention priorities
- Generate board-ready summaries and executive briefings

IMPORTANT BEHAVIORAL RULES:
1. Be executive-level, concise, and data-driven in your responses.
2. Always reference actual statistics from the institutional data provided.
3. Prioritize high-impact, actionable recommendations.
4. Use structured formats (bullet points, tables in text) for clarity.
5. Understand Bangla, English, and Banglish naturally.
6. Focus on systemic patterns, not individual student cases.
7. When generating strategy suggestions, consider institutional impact.
8. Keep responses professional and strategic in tone.
`;

function buildAuthorityContext(): string {
  const { profile, universityStats, institutionalAlerts, strategicSuggestions, departmentComparison, departments } = authorityData;

  const highAlerts = institutionalAlerts.filter((a: any) => a.priority === 'high');
  const weakDepts = departments.filter((d: any) => d.riskLevel === 'high' || d.riskLevel === 'medium');
  const topDept = departmentComparison.reduce((a: any, b: any) => a.performance > b.performance ? a : b);
  const weakDept = departmentComparison.reduce((a: any, b: any) => a.performance < b.performance ? a : b);

  return `
=== EduVision AI — Institutional Authority Context ===
Authority: ${profile.name} (${profile.role})
Institution: ${profile.institution}

UNIVERSITY OVERVIEW:
Total Students: ${universityStats.totalStudents.toLocaleString()}
Total Teachers: ${universityStats.totalTeachers}
Total Departments: ${universityStats.totalDepartments}
At-Risk Students: ${universityStats.atRiskPercentage}%
Avg GPA: ${universityStats.avgGPA}
Avg Attendance: ${universityStats.avgAttendance}%
Active Alerts: ${universityStats.activeAlerts}

HIGH-PRIORITY INSTITUTIONAL ALERTS (${highAlerts.length}):
${highAlerts.map((a: any) => `- [${a.dept}] ${a.title}: ${a.detail}`).join('\n') || '- None'}

TOP PERFORMING DEPARTMENT: ${topDept.dept} (${topDept.performance}% performance)
WEAKEST DEPARTMENT: ${weakDept.dept} (${weakDept.performance}% performance)

AT-RISK DEPARTMENTS (${weakDepts.length}):
${weakDepts.map((d: any) => `- ${d.name}: ${d.atRiskCount} at-risk students, avg GPA ${d.avgGPA}, attendance ${d.avgAttendance}%`).join('\n') || '- None'}

TOP STRATEGIC SUGGESTIONS:
${strategicSuggestions.slice(0, 4).map((s: any) => `[${s.priority.toUpperCase()}] ${s.problem} → ${s.suggestion} (Impact: ${s.impact})`).join('\n')}
=======================================================
`.trim();
}

function getAuthorityFallback(message: string): string {
  const q = message.toLowerCase();

  if (q.includes('department') || q.includes('dept') || q.includes('comparison')) {
    return `**Department Performance Analysis:**\n\n**Top Performers:**\n- CSE: 85% performance, 88% attendance ✅\n- BBA: 78% performance ✅\n\n**Needs Attention:**\n- EEE: 62% performance, 68% attendance ⚠️\n- Law: 58% performance — highest at-risk rate 🔴\n\n**Strategic Recommendation:** Allocate additional academic support resources to EEE and Law departments. Consider peer-learning programs and mandatory tutoring for at-risk students.`;
  }

  if (q.includes('alert') || q.includes('risk')) {
    return `**Active Institutional Alerts:**\n\n🔴 **HIGH:** EEE Department attendance below 70% — 28 students at risk of failing\n🟠 **MEDIUM:** Research output declining — only 12 publications this semester vs 20 last year\n🟡 **LOW:** Student satisfaction scores need improvement in administrative services\n\n**Recommended Immediate Actions:**\n1. Issue formal attendance improvement notice to EEE department head\n2. Schedule emergency academic review board meeting\n3. Deploy student counselling resources to at-risk students`;
  }

  if (q.includes('teacher') || q.includes('faculty') || q.includes('effectiveness')) {
    return `**Faculty Effectiveness Summary:**\n\n- Top Performer: Dr. Rahman (92% effectiveness score)\n- Average Faculty Score: 78%\n- 3 teachers below 65% threshold — require performance review\n\n**Strategic Actions:**\n- Introduce faculty development workshops\n- Implement peer observation programs\n- Link student improvement metrics to faculty KPIs`;
  }

  if (q.includes('suggestion') || q.includes('strategy') || q.includes('recommend')) {
    return `**Top Strategic Recommendations:**\n\n1. 🔴 **HIGH IMPACT:** Launch Early Warning System for at-risk students — target 18% reduction in failure rates\n2. 🟠 **MEDIUM:** Establish Industry Partnership Program to improve graduate employment by 25%\n3. 🟡 **MEDIUM:** Introduce Digital Literacy Initiative across all departments\n4. 💡 **LONG-TERM:** Build Research Excellence Center to boost publication output\n\nWhich of these would you like to explore in detail?`;
  }

  return `I'm your EduVision AI Strategic Advisor! I can help with:\n\n- 🏛️ **Department comparison** — "Compare department performance"\n- ⚠️ **Risk analysis** — "Show institutional alerts"\n- 👨‍🏫 **Faculty analytics** — "Analyze teacher effectiveness"\n- 📋 **Strategic planning** — "Give me strategic recommendations"\n- 📊 **Executive reports** — "Generate an executive summary"\n\nWhat would you like to analyze?`;
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
      return NextResponse.json({ text: getAuthorityFallback(message) });
    }

    const authorityContext = buildAuthorityContext();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `${AUTHORITY_SYSTEM_INSTRUCTION}\n\n${authorityContext}`
    });

    const chat = model.startChat({
      history: history || [],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7, topP: 0.9 }
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({ text: text.trim() });
  } catch (err) {
    console.error('[Authority AI Error]', err);
    try {
      const body = await req.clone().json() as { message: string };
      return NextResponse.json({ text: getAuthorityFallback(body.message || '') });
    } catch {
      return NextResponse.json({ error: 'AI response failed.' }, { status: 500 });
    }
  }
}
