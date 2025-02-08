// src/pages/api/train.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: 'No training data provided' });
  }

  // Placeholder: Replace this with actual integration (e.g., LanceDB) later.
  return res.status(200).json({ message: 'Training data received', data });
}
