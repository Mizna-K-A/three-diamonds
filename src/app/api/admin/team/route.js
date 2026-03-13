import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectDB from '../../../../../lib/mongodb';
import TeamMember from '../../../../../lib/models/TeamMember';

const DEFAULT_TEAM = [
    {
        name: 'MR. SAJIKUMAR',
        role: 'FOUNDER & MANAGING DIRECTOR',
        experience: '15+ Years',
        description: 'With over 15 years transforming UAE\'s real estate landscape, Kumar launched Three Diamonds in 2021 with a mission to deliver exceptional service and propel the company to top 10 position in Dubai.',
        specialties: ['Commercial Real Estate', 'Business Strategy', 'Client Relations', 'Market Analysis'],
        image: '/founder.png',
        alt: 'Mr. Sajikumar - Founder & Managing Director of Three Diamonds',
        order: 0,
        active: true,
    },
    {
        name: 'MRS. INDULEKHA',
        role: 'CO-FOUNDER & MANAGING PARTNER',
        experience: '17+ Years',
        description: 'Embodies the Dubai dream with 17 years of experience. Her journey from property consultant to leadership roles in prestigious firms like Al Ghurair fuels Three Diamonds\' strategic vision.',
        specialties: ['Residential Properties', 'Leasing', 'Development', 'Team Leadership'],
        image: '/co-founder.png',
        alt: 'Mrs. Indulekha - Co-Founder & Managing Partner of Three Diamonds',
        order: 1,
        active: true,
    }
];

async function seedIfEmpty() {
    const count = await TeamMember.countDocuments();
    if (count === 0) {
        await TeamMember.insertMany(DEFAULT_TEAM);
    }
}

export async function GET() {
    try {
        await connectDB();
        await seedIfEmpty();
        const team = await TeamMember.find().sort({ order: 1, createdAt: 1 });
        return NextResponse.json(team);
    } catch (error) {
        console.error('Admin team GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
    }
}

export async function POST(request) {
    console.log('API: POST /api/admin/team hit');
    try {
        await connectDB();
        const body = await request.json();
        const teamMember = await TeamMember.create(body);
        return NextResponse.json(teamMember, { status: 201 });
    } catch (error) {
        console.error('Admin team POST error:', error);
        return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { id, ...updates } = body;
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
        const teamMember = await TeamMember.findByIdAndUpdate(id, updates, { new: true });
        if (!teamMember) return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
        return NextResponse.json(teamMember);
    } catch (error) {
        console.error('Admin team PUT error:', error);
        return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
        await TeamMember.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Admin team DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
    }
}
