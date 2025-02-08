// src/pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, llmType } = req.body;

  if (!prompt || !llmType) {
    return res.status(400).json({ error: 'Missing prompt or llmType' });
  }

  // Placeholder logic – replace with actual API calls later
  let responseText = '';
  if (llmType === 'openai') {
    responseText = `OpenAI response for prompt: "${prompt}"`;
  } else if (llmType === 'gemini') {
    responseText = `Gemini response for prompt: "${prompt}"`;
  } else {
    responseText = `Default response for prompt: "${prompt}"`;
  }

  return res.status(200).json({ response: responseText });
}
