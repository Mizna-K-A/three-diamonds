import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import TeamMember from '../../../../lib/models/TeamMember';

export async function GET() {
    try {
        await connectDB();
        const team = await TeamMember.find({ active: true }).sort({ order: 1, createdAt: 1 });
        return NextResponse.json(team);
    } catch (error) {
        console.error('Public team GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
    }
}
