'use server';

import connectDB from '../mongodb';
import Insight from '../models/Insight';
import { revalidatePath } from 'next/cache';

export async function createInsight(data) {
    try {
        await connectDB();
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
        const insight = await Insight.findByIdAndUpdate(id, data, { new: true });
        revalidatePath('/insights');
        revalidatePath('/admin/insights');
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
