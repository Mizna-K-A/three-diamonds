'use server';

import connectDB from '../mongodb';
import Insight from '../models/Insight';
import { revalidatePath } from 'next/cache';


const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

export async function createInsight(data) {
    try {
        await connectDB();

        // Generate slug if not provided
        if (data.title && !data.slug) {
            let baseSlug = slugify(data.title);
            let slug = baseSlug;
            let counter = 1;

            // Ensure unique slug
            while (await Insight.findOne({ slug })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            data.slug = slug;
        }

        const insight = await Insight.create(data);
        revalidatePath('/insights');
        revalidatePath('/admin/insights');
        return { success: true, data: JSON.parse(JSON.stringify(insight)) };
    } catch (error) {
        console.error('Error creating insight:', error);
        return { error: error.message };
    }
}

export async function updateInsight(id, data) {
    try {
        await connectDB();

        // If title is changed and slug is not provided, regenerate slug
        if (data.title && !data.slug) {
            let baseSlug = slugify(data.title);
            let slug = baseSlug;
            let counter = 1;

            while (await Insight.findOne({ slug, _id: { $ne: id } })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            data.slug = slug;
        }

        const insight = await Insight.findByIdAndUpdate(id, data, { new: true });
        revalidatePath('/insights');
        revalidatePath('/admin/insights');
        revalidatePath(`/insights/${insight.slug}`);
        return { success: true, data: JSON.parse(JSON.stringify(insight)) };
    } catch (error) {
        console.error('Error updating insight:', error);
        return { error: error.message };
    }
}


export async function deleteInsight(id) {
    try {
        await connectDB();
        await Insight.findByIdAndDelete(id);
        revalidatePath('/insights');
        revalidatePath('/admin/insights');
        return { success: true };
    } catch (error) {
        console.error('Error deleting insight:', error);
        return { error: error.message };
    }
}
