// src/pages/api/get-file-url.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    res.status(200).json({ url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
