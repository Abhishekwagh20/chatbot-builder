// src/pages/api/index-pdf.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import * as lancedb from '@lancedb/lancedb';
import { Schema, Field, Utf8, FixedSizeList, Float32 } from 'apache-arrow';

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
  
  // Connect to LanceDB
  const db = await lancedb.connect("data/my_lancedb");
  let table;
  
  try {
    table = await db.openTable("pdf_embeddings");
  } catch (err) {
    // Corrected schema definition
    const schema = new Schema([
      new Field("text", new Utf8()),
      new Field("embedding", new FixedSizeList(
        128,  // List size first
        new Field("item", new Float32())  // Child field second
      ))
    ]);
    table = await db.createTable("pdf_embeddings", [], { schema });
  }
  
  const embedding = generateEmbedding(text);
  const record = { text, embedding };
  
  try {
    const result = await table.add([record]);
    return res.status(200).json({ message: 'Text indexed', record: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}