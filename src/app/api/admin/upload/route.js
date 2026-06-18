import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { uploadToS3 } from '@lib/s3';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // --- Clean filename ---
    const originalName = file.name.replace(/\.[^/.]+$/, '');
    const cleanName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const filename = `${cleanName || 'image'}-${Date.now()}.webp`;
    const s3Key = `${folder}/${filename}`;

    // --- Sharp: convert to WebP ---
    const metadata = await sharp(buffer).metadata();
    let sharpInstance = sharp(buffer).rotate();   // auto-orient via EXIF

    if (metadata.width > 1920 || metadata.height > 1080) {
      sharpInstance = sharpInstance.resize(1920, 1080, {
        withoutEnlargement: true,
        fit: 'inside',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      });
    }

    const webpBuffer = await sharpInstance.webp({
      quality: metadata.hasAlpha ? 100 : ((metadata.size ?? 0) > 5 * 1024 * 1024 ? 75 : 85),
      lossless: metadata.hasAlpha,
      alphaQuality: 100,
      smartSubsample: true,
      effort: 2,
    }).toBuffer();

    // --- Upload to S3 → served via CloudFront ---
    const { url } = await uploadToS3({
      buffer: webpBuffer,
      key: s3Key,
      contentType: 'image/webp',
    });

    console.log(`✅ S3 upload: ${s3Key} (${(webpBuffer.length / 1024).toFixed(1)} KB)`);

    return NextResponse.json({
      url,
      key: s3Key,
      filename,
      originalSize: file.size,
      webpSize: webpBuffer.length,
    });

  } catch (error) {
    console.error('❌ Upload error:', error);

    // User-friendly error messages
    const msg = error.message ?? '';
    let errorMessage =
      msg.includes('AWS_BUCKET_NAME') || msg.includes('AWS_ACCESS_KEY_ID')
        ? error.message   // our own clear messages
        : msg.includes('unsupported image format')
        ? 'Unsupported image format. Please upload JPEG, PNG, or GIF.'
        : msg.includes('Insufficient memory')
        ? 'Image is too large. Please upload a smaller image (max 10MB).'
        : msg.includes('InvalidAccessKeyId') || error.name === 'InvalidAccessKeyId'
        ? 'Invalid AWS credentials. Check AWS_ACCESS_KEY_ID in your .env file.'
        : msg.includes('NoSuchBucket') || error.name === 'NoSuchBucket'
        ? 'S3 bucket not found. Check AWS_BUCKET_NAME in your .env file.'
        : msg.includes('AccessDenied') || error.name === 'AccessDenied'
        ? 'S3 access denied. Make sure your IAM user has s3:PutObject permission.'
        : msg || 'Upload failed. Check server logs for details.';

    return NextResponse.json(
      { error: errorMessage, code: error.name },
      { status: 500 }
    );
  }
}