// src/pages/api/index-pdf.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import * as lancedb from '@lancedb/lancedb';

// Simulated function to generate an embedding from text.
function generateEmbedding(text: string): number[] {
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
  
  // Connect to LanceDB; ensure that the directory "data/my_lancedb" exists in your project root.
  const db = await lancedb.connect('data/my_lancedb');
  let collection;
  
  try {
    // Try to retrieve an existing collection called "pdf_embeddings"
    collection = await db.collection('pdf_embeddings');
  } catch (err) {
    // If it doesn't exist, create it.
    // (Here we assume that the createCollection method accepts an options object with a "vectorSize" property.)
    collection = await db.createCollection('pdf_embeddings', { vectorSize: 128 });
  }
  
  const embedding = generateEmbedding(text);
  const record = { text, embedding };
  
  try {
    const result = await collection.insert(record);
    return res.status(200).json({ message: 'Text indexed', record: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
