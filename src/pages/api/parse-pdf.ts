import type { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import pdf from 'pdf-parse';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Helper to convert a Readable stream to a Buffer
function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.once('end', () => resolve(Buffer.concat(chunks)));
    stream.once('error', reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { fileName } = req.query;
  if (!fileName || typeof fileName !== 'string') {
    return res.status(400).json({ error: 'Missing fileName query parameter' });
  }
  
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
    });
    const s3Response = await s3Client.send(command);
    const stream = s3Response.Body as Readable;
    const buffer = await streamToBuffer(stream);
    const data = await pdf(buffer);
    res.status(200).json({ text: data.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
