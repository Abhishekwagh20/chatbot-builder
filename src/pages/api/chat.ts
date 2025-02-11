// src/pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Simulated function to retrieve context.
// In a real integration, you might call your /api/retrieve-context endpoint or use a LanceDB SDK.
async function getContext(query: string): Promise<string> {
  // For example, you could use:
  // const res = await fetch('http://localhost:3000/api/retrieve-context', { ... });
  // return (await res.json()).context;
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

  // Retrieve context using our simulated RAG function
  const context = await getContext(prompt);

  let responseText = '';
  if (llmType === 'openai') {
    responseText = `OpenAI response for prompt: "${prompt}" with context: "${context}"`;
  } else if (llmType === 'gemini') {
    responseText = `Gemini response for prompt: "${prompt}" with context: "${context}"`;
  } else {
    responseText = `Default response for prompt: "${prompt}" with context: "${context}"`;
  }

  return res.status(200).json({ response: responseText });
}
