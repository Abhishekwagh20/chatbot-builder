import type { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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

  // Generate a unique file name for the upload
  const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.pdf`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    ContentType: 'application/pdf',
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    res.status(200).json({ url, fileName });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
