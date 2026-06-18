import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Agent from '../../../../../lib/models/Agent';
import { deleteFromS3, keyFromUrl } from '../../../../../lib/s3';

// GET - list all agents
export async function GET() {
    try {
        await connectDB();
        const agents = await Agent.find().sort({ createdAt: -1 });
        return NextResponse.json(agents);
    } catch (error) {
        console.error('Agents GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
    }
}

// POST - create new agent
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, phone, email, image } = body;

        if (!name || !phone || !email || !image) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const agent = await Agent.create({ name, phone, email, image });
        return NextResponse.json(agent, { status: 201 });
    } catch (error) {
        console.error('Agents POST error:', error);
        return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
    }
}

// PUT - update existing agent
export async function PUT(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { id, ...updates } = body;
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

        const agent = await Agent.findByIdAndUpdate(id, updates, { new: true });
        if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

        return NextResponse.json(agent);
    } catch (error) {
        console.error('Agents PUT error:', error);
        return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
    }
}

// DELETE - remove agent + its S3 image
export async function DELETE(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

        const agent = await Agent.findByIdAndDelete(id);

        // Clean up S3 image
        if (agent?.image) {
            const key = keyFromUrl(agent.image);
            if (key) await deleteFromS3(key).catch(console.error);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Agents DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 });
    }
}
