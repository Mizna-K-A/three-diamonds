'use server';

import connectDB from '../../../../lib/mongodb';
import Agent from '../../../../lib/models/Agent';
import { revalidatePath } from 'next/cache';

export async function getAgents() {
    try {
        await connectDB();
        const agents = await Agent.find().sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(agents));
    } catch (error) {
        console.error('getAgents error:', error);
        throw new Error('Failed to fetch agents');
    }
}

export async function createAgent(formData) {
    try {
        await connectDB();
        const agent = await Agent.create(formData);
        revalidatePath('/admin/agents');
        return JSON.parse(JSON.stringify(agent));
    } catch (error) {
        console.error('createAgent error:', error);
        throw new Error('Failed to create agent');
    }
}

export async function updateAgent(id, formData) {
    try {
        await connectDB();
        const agent = await Agent.findByIdAndUpdate(id, formData, { new: true });
        revalidatePath('/admin/agents');
        return JSON.parse(JSON.stringify(agent));
    } catch (error) {
        console.error('updateAgent error:', error);
        throw new Error('Failed to update agent');
    }
}

export async function deleteAgent(id) {
    try {
        await connectDB();
        await Agent.findByIdAndDelete(id);
        revalidatePath('/admin/agents');
        return { success: true };
    } catch (error) {
        console.error('deleteAgent error:', error);
        throw new Error('Failed to delete agent');
    }
}
