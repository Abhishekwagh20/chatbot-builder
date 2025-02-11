// src/pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

async function getContext(query: string): Promise<string> {
  return `Simulated context for query: "${query}"`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, llmType } = req.body;
  if (!prompt || !llmType) {
    return res.status(400).json({ error: 'Missing prompt or llmType' });
  }

  const context = await getContext(prompt);
  let responseText = '';

  if (llmType === 'openai') {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `${prompt}\n\nContext: ${context}` },
        ],
      });
      responseText = completion.choices[0].message.content || 'No response';
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  } else if (llmType === 'gemini') {
    // Placeholder for Gemini integration
    responseText = `Gemini response for prompt: "${prompt}" with context: "${context}"`;
  } else {
    responseText = `Default response for prompt: "${prompt}" with context: "${context}"`;
  }

  return res.status(200).json({ response: responseText });
}
