'use server';

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function uploadImageAction(formData) {
    try {
        const file = formData.get('file');

        if (!file) {
            return { error: 'No file provided' };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure uploads directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        // Create unique filename
        const ext = path.extname(file.name) || '.jpg';
        const filename = `insight-${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);

        return { success: true, url: `/uploads/${filename}` };
    } catch (error) {
        console.error('Upload action error:', error);
        return { error: 'Upload failed: ' + error.message };
    }
}
