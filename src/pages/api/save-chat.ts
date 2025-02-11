// src/pages/api/save-chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userEmail, conversation } = req.body;
  if (!conversation) {
    return res.status(400).json({ error: 'No conversation provided' });
  }

  const { data, error } = await supabase
    .from('chat_history')
    .insert([{ user_email: userEmail || null, conversation }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ message: 'Chat saved successfully', data });
}
