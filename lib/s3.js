import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// ---------------------------------------------------------------------------
// S3 Client singleton
// ---------------------------------------------------------------------------
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// ---------------------------------------------------------------------------
// Helper: build the public URL for an S3 object.
// Returns CloudFront URL when CLOUDFRONT_URL is set, otherwise direct S3 URL.
// ---------------------------------------------------------------------------
export function getS3Url(key) {
  const cfBase = process.env.CLOUDFRONT_URL?.replace(/\/$/, '');
  if (cfBase) return `${cfBase}/${key}`;
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

// ---------------------------------------------------------------------------
// Upload a Buffer to S3.
// NOTE: Do NOT pass ACL — rely on a bucket policy for public read access.
//       Newer AWS buckets block ACLs by default; bucket policy is the correct approach.
// Returns: { url, key }
// ---------------------------------------------------------------------------
export async function uploadToS3({ buffer, key, contentType = 'application/octet-stream' }) {
  if (!BUCKET_NAME) throw new Error('AWS_BUCKET_NAME is not set in environment variables.');
  if (!process.env.AWS_ACCESS_KEY_ID) throw new Error('AWS_ACCESS_KEY_ID is not set in environment variables.');

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    // No ACL — use a bucket policy for public-read access instead.
    // Bucket policy example (allows anyone to read objects):
    // {
    //   "Effect": "Allow",
    //   "Principal": "*",
    //   "Action": "s3:GetObject",
    //   "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    // }
  });

  await s3Client.send(command);
  return { key, url: getS3Url(key) };
}

// ---------------------------------------------------------------------------
// Delete an object from S3 by its key
// ---------------------------------------------------------------------------
export async function deleteFromS3(key) {
  const command = new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key });
  await s3Client.send(command);
}

// ---------------------------------------------------------------------------
// Generate a pre-signed URL for temporary private access
// expiresIn: seconds (default 1 hour)
// ---------------------------------------------------------------------------
export async function getPresignedUrl(key, expiresIn = 3600) {
  const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
  return getSignedUrl(s3Client, command, { expiresIn });
}

// ---------------------------------------------------------------------------
// Extract S3 key from a CloudFront or direct S3 URL stored in the DB.
// Returns null for local /uploads/ paths — nothing to delete from S3.
// ---------------------------------------------------------------------------
export function keyFromUrl(url) {
  if (!url) return null;

  // CloudFront URL  →  https://d13bzymge9vu8q.cloudfront.net/<key>
  const cfBase = process.env.CLOUDFRONT_URL?.replace(/\/$/, '');
  if (cfBase && url.startsWith(cfBase + '/')) return url.slice(cfBase.length + 1);

  // Direct S3 URL  →  https://<bucket>.s3.<region>.amazonaws.com/<key>
  const s3Prefix = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
  if (url.startsWith(s3Prefix)) return url.slice(s3Prefix.length);

  return null;
}

export { s3Client, BUCKET_NAME };
