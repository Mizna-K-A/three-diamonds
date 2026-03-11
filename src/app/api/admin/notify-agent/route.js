import { NextResponse } from 'next/server';
import { sendMail, getAdminNotificationTemplate } from '../../../../../lib/mail';
import ProposalRequest from '../../../../../lib/models/ProposalRequest';
import connectDB from '../../../../../lib/mongodb';

export async function POST(request) {
    try {
        const { proposalId } = await request.json();

        if (!proposalId) {
            return NextResponse.json({ success: false, message: 'Proposal ID is required' }, { status: 400 });
        }

        await connectDB();
        const proposal = await ProposalRequest.findById(proposalId);

        if (!proposal) {
            return NextResponse.json({ success: false, message: 'Proposal request not found' }, { status: 404 });
        }

        if (!proposal.agentEmail) {
            return NextResponse.json({ success: false, message: 'No agent assigned to this property' }, { status: 400 });
        }

        const agentMail = getAdminNotificationTemplate('Manual Agent Notification (Proposal)', {
            agent: proposal.agentName || 'Representative',
            customer: proposal.name,
            email: proposal.email,
            phone: proposal.phone,
            property: proposal.propertyTitle || 'Property Inquiry',
            id: proposal.propertyId
        });

        await sendMail({
            to: proposal.agentEmail,
            ...agentMail
        });

        return NextResponse.json({ success: true, message: 'Email sent to agent successfully' });
    } catch (error) {
        console.error('Error notifying agent:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
