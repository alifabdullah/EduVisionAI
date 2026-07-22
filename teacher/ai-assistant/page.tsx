'use client';
import AIAssistantWorkspace from '@/components/ai/AIAssistantWorkspace';

const AI_RESPONSES: Record<string, string> = {
  'Students below 75% attendance': `**Attendance Risk Report (Your Courses)**\n\nThe following students are currently below the 75% attendance threshold:\n\n**CSE201 - Data Structures:**\n- Fahim Faysal (68%)\n- Nabila Haque (72%)\n\n**CSE101 - Intro to Computing:**\n- Tanvir Ahmed (55% - Critical)\n\n**Action Recommended:** Send automated warning emails to these students.`,
  
  'Class performance': `**Course Performance Analysis**\n\n**CSE201 (Data Structures)**\n- Current Avg Score: 78%\n- Highest Score: 96% (Arafat Islam Rafi)\n- Students Failing (<40%): 3\n\n**Topic Weakness Detected:** 45% of the class failed the last quiz on 'Binary Search Trees'. I suggest dedicating 20 minutes to review this topic in your next lecture.`,
  
  'Generate quiz': `**Generated Quiz: Operating Systems (Memory Management)**\n\n1. What is the difference between internal and external fragmentation?\n2. Explain the concept of 'Thrashing' in virtual memory.\n3. How does a Translation Lookaside Buffer (TLB) improve performance?\n4. Describe the LRU page replacement algorithm.\n\n*Would you like me to export this to a PDF or directly to the Student Portal?*`,
  
  'AI lesson plan': `**AI Lesson Plan: Database Normalization**\n\n**Duration:** 1 Hour 15 Minutes\n\n**00:00 - 00:10:** Introduction & Real-world Database Anomalies\n**00:10 - 00:30:** 1NF, 2NF, and 3NF Concepts\n**00:30 - 00:50:** Live Example: Normalizing a poorly designed E-commerce schema\n**00:50 - 01:10:** Group Activity: Students normalize a given schema\n**01:10 - 01:15:** Q&A and Assignment Briefing\n\n*I can also generate the practice schema for the group activity if you'd like.*`
};

export default function TeacherAIAssistantPage() {
  const getAIResponse = (msg: string): string => {
    for (const key of Object.keys(AI_RESPONSES)) {
      if (msg.includes(key.replace(/^[^\s]+ /, ''))) return AI_RESPONSES[key];
    }
    return `**AI Analysis — Teacher Assistant**\n\nQuery: "${msg}"\n\nBased on your assigned courses:\n- Total Students: 120\n- Active Courses: 3\n- Average Attendance: 82%\n\nFor a more specific analysis regarding your classes, please use a quick prompt above.`;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <AIAssistantWorkspace
        title="AI Teacher Assistant"
        roleTitle="Academic Teaching Copilot"
        subtitle="Access restricted to your assigned courses and enrolled students."
        badgeColor="#50B748"
        contextBanner="3 Active Courses | 120 Students | 45 Past Lectures"
        quickPrompts={[
          '📉 Students below 75% attendance',
          '📊 Class performance',
          '📝 Generate quiz',
          '💡 AI lesson plan'
        ]}
        initialMessage="Welcome to your AI Teaching Copilot. I can analyze your students' performance, identify at-risk individuals, generate quizzes, and help you plan your lessons. How can I assist your teaching today?"
        getAIResponse={getAIResponse}
      />
    </div>
  );
}
