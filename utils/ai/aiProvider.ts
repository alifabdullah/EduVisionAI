// utils/ai/aiProvider.ts
// Modular AI Provider supporting Gemini, OpenAI, and OpenRouter with static imports, logging, and automatic fallback.

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getMockAdvisorResponse } from './mockAdvisorEngine';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ProviderResult {
  text: string;
  providerUsed: 'gemini' | 'openai' | 'openrouter' | 'mock';
  latencyMs: number;
}

export async function testAndSelectBestProvider(
  systemInstruction: string,
  userMessage: string,
  history: ChatMessage[]
): Promise<ProviderResult> {
  const startTime = Date.now();

  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  // Logging full outgoing AI payload for production debugging
  console.log('=== [AI PROVIDER OUTGOING PAYLOAD] ===');
  console.log('User Message:', userMessage);
  console.log('History Length:', history.length);
  console.log('History Payload:', JSON.stringify(history, null, 2));
  console.log('System Instruction (Full Payload):');
  console.log(systemInstruction);
  console.log('Available API Keys Configured:', {
    gemini: !!geminiKey && geminiKey !== 'your_api_key_here',
    openai: !!openaiKey && !openaiKey.includes('def755'),
    openrouter: !!openrouterKey && !openrouterKey.includes('or-v1')
  });
  console.log('=======================================');

  // Ordered list of providers to attempt based on user keys and stability
  const providersToTry = [
    { name: 'gemini' as const, key: geminiKey },
    { name: 'openai' as const, key: openaiKey },
    { name: 'openrouter' as const, key: openrouterKey }
  ];

  for (const provider of providersToTry) {
    if (!provider.key || provider.key === 'your_api_key_here' || provider.key.includes('def755') || (provider.name === 'openrouter' && provider.key.includes('sk-or-v1-9163ae'))) {
      continue; // Skip invalid or placeholder keys
    }

    try {
      let text = '';
      if (provider.name === 'gemini') {
        const genAI = new GoogleGenerativeAI(provider.key);
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
          systemInstruction: systemInstruction,
        });

        // Format history for Gemini API
        const geminiHistory = history.map(h => ({
          role: h.role === 'assistant' ? 'model' as const : 'user' as const,
          parts: [{ text: h.content }]
        }));

        const chat = model.startChat({
          history: geminiHistory,
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          }
        });

        const result = await chat.sendMessage(userMessage);
        text = result.response.text();
      } 
      else if (provider.name === 'openai') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${provider.key}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemInstruction },
              ...history.map(h => ({ role: h.role === 'assistant' ? 'assistant' as const : 'user' as const, content: h.content })),
              { role: 'user', content: userMessage }
            ],
            max_tokens: 1024,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          throw new Error(`OpenAI error: ${response.statusText}`);
        }
        const data = await response.json();
        text = data.choices[0]?.message?.content || '';
      } 
      else if (provider.name === 'openrouter') {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${provider.key}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'EduVision AI Advisor'
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: systemInstruction },
              ...history.map(h => ({ role: h.role === 'assistant' ? 'assistant' as const : 'user' as const, content: h.content })),
              { role: 'user', content: userMessage }
            ],
            max_tokens: 1024,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          throw new Error(`OpenRouter error: ${response.statusText}`);
        }
        const data = await response.json();
        text = data.choices[0]?.message?.content || '';
      }

      if (text) {
        console.log(`[AI PROVIDER SUCCESS] Provider used: ${provider.name} in ${Date.now() - startTime}ms`);
        return {
          text,
          providerUsed: provider.name,
          latencyMs: Date.now() - startTime
        };
      }
    } catch (e) {
      console.warn(`[AI PROVIDER WARNING] ${provider.name} failed. Error info:`, e);
    }
  }

  // Fallback to local mock engine if all APIs fail or are unauthorized
  console.log('[AI PROVIDER FALLBACK] Falling back to local mock engine.');
  const mockResult = getMockAdvisorResponse(userMessage, history);

  let responseText = mockResult.response;
  if (mockResult.mentorCard) {
    const mc = mockResult.mentorCard;
    responseText += `\n\nMENTOR_CARD:${mc.name}|${mc.department}|${mc.expertise.join(',')}|${mc.rating}|${mc.availability}|${mc.reason}`;
  }
  if (mockResult.actionCard) {
    const ac = mockResult.actionCard;
    responseText += `\n\nACTION_CARD:${ac.title}|${ac.description}|${ac.actionText}|${ac.actionId}`;
  }

  return {
    text: responseText,
    providerUsed: 'mock',
    latencyMs: Date.now() - startTime
  };
}
