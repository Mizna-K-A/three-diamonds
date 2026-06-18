'use server';

import sharp from 'sharp';
import { uploadToS3 } from '@lib/s3';

/**
 * Server action: upload an image to S3 (always — no local fallback).
 * @param {FormData} formData  - must contain a 'file' field (File/Blob)
 * @param {string}   folder    - S3 folder prefix (default: "uploads")
 * @returns {{ success: boolean, url?: string, key?: string, error?: string }}
 */
export async function uploadImageAction(formData, folder = 'uploads') {
  try {
    const file = formData.get('file');
    if (!file) return { error: 'No file provided' };
    if (!file.type.startsWith('image/')) return { error: 'File must be an image' };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name.replace(/\.[^/.]+$/, '');
    const cleanName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const filename = `${cleanName || 'image'}-${Date.now()}.webp`;
    const s3Key = `${folder}/${filename}`;

    const metadata = await sharp(buffer).metadata();
    const webpBuffer = await sharp(buffer).rotate().webp({
      quality: metadata.hasAlpha ? 100 : ((metadata.size ?? 0) > 5 * 1024 * 1024 ? 75 : 85),
      lossless: metadata.hasAlpha,
      alphaQuality: 100,
      smartSubsample: true,
      effort: 2,
    }).toBuffer();

    const { url } = await uploadToS3({
      buffer: webpBuffer,
      key: s3Key,
      contentType: 'image/webp',
    });

    return { success: true, url, key: s3Key };
  } catch (error) {
    console.error('Upload action error:', error);
    return { error: 'Upload failed: ' + error.message };
  }
}
