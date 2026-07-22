import { getMockAdvisorResponse, ChatMessage } from './ai/mockAdvisorEngine';

export type { ChatMessage };

export function getChatbotResponse(message: string, history: ChatMessage[]): {
  response: string;
  actionCard?: ChatMessage['actionCard'];
  mentorCard?: ChatMessage['mentorCard'];
  suggestedPrompts: string[];
} {
  // Call the dedicated mock AI engine
  const advisorRes = getMockAdvisorResponse(message, history);

  // Generate suggested prompts dynamically based on context or randomly
  const allPrompts = [
    'How can I improve my GPA?',
    'Which subject should I focus on first?',
    'Suggest a mentor for Database Systems.',
    'Analyze my Skill Radar.',
    'Create a 7-day study plan.',
    'Am I ready for research?',
    'Show my weak subject details.',
    'How is my attendance in other subjects?'
  ];

  // Pick 3-4 suggested prompts excluding the current query
  const query = message.toLowerCase().trim();
  const filtered = allPrompts.filter(p => !p.toLowerCase().includes(query));
  const suggestedPrompts = filtered.sort(() => 0.5 - Math.random()).slice(0, 4);

  return {
    ...advisorRes,
    suggestedPrompts
  };
}
