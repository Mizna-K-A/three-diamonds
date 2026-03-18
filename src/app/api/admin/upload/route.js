import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure uploads directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        // Get original filename without extension and clean it
        const originalName = path.parse(file.name).name;
        const cleanName = originalName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')  // Replace special chars with hyphen
            .replace(/-+/g, '-')          // Replace multiple hyphens with single
            .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
        
        // Create unique filename with .webp extension
        const timestamp = Date.now();
        const filename = `${cleanName || 'hero'}-${timestamp}.webp`;
        const filePath = path.join(uploadDir, filename);

        // Get image metadata
        const metadata = await sharp(buffer).metadata();

        // Initialize sharp instance
        let sharpInstance = sharp(buffer);

        // Auto-orient based on EXIF data
        sharpInstance = sharpInstance.rotate();

        // Resize if image is too large (optimal for hero slides)
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        
        if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
            sharpInstance = sharpInstance.resize(MAX_WIDTH, MAX_HEIGHT, {
                withoutEnlargement: true,
                fit: 'inside',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            });
        }

        // WebP conversion options
        const webpOptions = {
            quality: 85,              // 0-100, 85 is good balance
            alphaQuality: 100,         // Quality of alpha layer
            lossless: false,           // Use lossy compression (smaller files)
            nearLossless: false,       
            smartSubsample: true,       // Use smart subsampling
            effort: 6,                  // CPU effort (0-9)
        };

        // For images with transparency (PNG/GIF), use lossless compression
        if (metadata.hasAlpha) {
            webpOptions.lossless = true;
            webpOptions.quality = 100;
            webpOptions.effort = 9;     // Max effort for better compression
        }

        // For very large images, reduce quality
        if (metadata.size > 5 * 1024 * 1024) { // If original > 5MB
            webpOptions.quality = 75;
        }

        // Convert to WebP and save
        await sharpInstance
            .webp(webpOptions)
            .toFile(filePath);

        // Optional: Log conversion stats for debugging
        console.log(`✅ Image converted: ${file.name} → ${filename}`);
        console.log(`📦 Original size: ${(metadata.size / 1024).toFixed(2)}KB`);
        
        // Get converted file size
        const convertedStats = await sharp(filePath).metadata();
        console.log(`🎯 WebP size: ${(convertedStats.size / 1024).toFixed(2)}KB`);
        console.log(`💾 Savings: ${((1 - convertedStats.size / metadata.size) * 100).toFixed(1)}%`);

        return NextResponse.json({ 
            url: `/uploads/${filename}`,
            filename: filename,
            originalSize: metadata.size,
            webpSize: convertedStats.size
        });

    } catch (error) {
        console.error('❌ Upload error:', error);
        
        // Provide user-friendly error messages
        let errorMessage = 'Upload failed';
        
        if (error.message.includes('unsupported image format')) {
            errorMessage = 'Unsupported image format. Please upload JPEG, PNG, or GIF.';
        } else if (error.message.includes('Insufficient memory')) {
            errorMessage = 'Image is too large. Please upload a smaller image (max 10MB).';
        } else if (error.message.includes('Input buffer')) {
            errorMessage = 'Invalid image file. Please try again with a different image.';
        }
        
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// Optional: Add configuration for larger file uploads
export const config = {
    api: {
        bodyParser: false,
        sizeLimit: '15mb', // Increase limit for larger images
    },
};