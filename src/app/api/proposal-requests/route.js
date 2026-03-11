import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import ProposalRequest from '../../../../lib/models/ProposalRequest';
import Property from '../../../../lib/models/Property';
import PropertyType from '../../../../lib/models/PropertyType';
import PropertyStatus from '../../../../lib/models/PropertyStatus';
import Tag from '../../../../lib/models/Tag';

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
        let agentEmail = '';
        let agentName = '';

        try {
            const property = await Property.findById(propertyId).select('title agentEmail agentName').lean();
            propertyTitle = property?.title || '';
            agentEmail = property?.agentEmail || '';
            agentName = property?.agentName || '';
        } catch {
            // ignore property lookup errors; still store request
        }

        const doc = await ProposalRequest.create({
            propertyId,
            propertyTitle,
            agentName,
            agentEmail,
            name,
            email,
            phone,
            status: 'new',
        });

        // Send Email Notifications
        try {
            const { sendMail, getProposalEmailTemplate, getAdminNotificationTemplate } = await import('../../../../lib/mail');

            // 1. Send to Client
            const clientMail = getProposalEmailTemplate(name, propertyTitle);
            await sendMail({
                to: email,
                ...clientMail
            });

            // 2. Send to Admin
            const adminMail = getAdminNotificationTemplate('Property Proposal Request', {
                name,
                email,
                phone,
                property: propertyTitle,
                id: propertyId
            });
            if (process.env.ADMIN_EMAIL) {
                await sendMail({
                    to: process.env.ADMIN_EMAIL,
                    ...adminMail
                });
            }

            // 3. Send to Agent
            if (agentEmail) {
                const agentMail = getAdminNotificationTemplate('Direct Property Inquiry (Proposal)', {
                    agent: agentName,
                    customer: name,
                    email,
                    phone,
                    property: propertyTitle,
                    id: propertyId
                });
                await sendMail({
                    to: agentEmail,
                    ...agentMail
                });
            }
        } catch (mailError) {
            console.error('Email notification failed but request was saved:', mailError);
        }

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
