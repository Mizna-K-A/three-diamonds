import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import ProposalRequest from '../../../../lib/models/ProposalRequest';
import Property from '../../../../lib/models/Property';

export async function POST(request) {
    try {
        const data = await request.json();

        const { propertyId, name, email, phone } = data;

        if (!propertyId || !name || !email || !phone) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 },
            );
        }

        await connectDB();

        let propertyTitle = '';
        try {
            const property = await Property.findById(propertyId).select('title').lean();
            propertyTitle = property?.title || '';
        } catch {
            // ignore property lookup errors; still store request
        }

        const doc = await ProposalRequest.create({
            propertyId,
            propertyTitle,
            name,
            email,
            phone,
            status: 'new',
        });

        return NextResponse.json({
            success: true,
            id: doc._id.toString(),
        });
    } catch (error) {
        console.error('Error creating proposal request:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 },
        );
    }
}

export async function GET() {
    try {
        await connectDB();
        const requests = await ProposalRequest.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(requests);
    } catch (error) {
        console.error('Error fetching proposal requests:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 },
        );
    }
}
