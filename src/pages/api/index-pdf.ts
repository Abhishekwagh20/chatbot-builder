// src/pages/api/index-pdf.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import * as lancedb from '@lancedb/lancedb';

// Simulated function to generate an embedding from text.
// In production, replace this with a proper embedding model.
function generateEmbedding(text: string): number[] {
  // Generate an array of 128 random numbers
  return Array.from({ length: 128 }, () => Math.random());
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Missing text data' });
  }

  // Connect to LanceDB (ensure the directory "data/my_lancedb" exists in your project root)
  const db = await lancedb.connect('data/my_lancedb');

  // Try to retrieve the table; if it doesn't exist, create it.
  let table;
  try {
    table = await db.table('pdf_embeddings');
  } catch (error) {
    // Create the table with updated column types.
    table = await db.createTable('pdf_embeddings', {
      columns: [
        { name: 'text', type: 'string' },
        { name: 'embedding', type: 'vector' }, // Changed from 'float[]' to 'vector'
      ],
    });
  }

  const embedding = generateEmbedding(text);
  const record = { text, embedding };

  try {
    const result = await table.insert(record);
    return res.status(200).json({ message: 'Text indexed', record: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
