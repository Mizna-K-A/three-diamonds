import connectDB from '../../../lib/mongodb';
import Property from '../../../lib/models/Property';
import ContactSubmission from '../../../lib/models/ContactSubmission';
import ScheduleViewing from '../../../lib/models/ScheduleViewing';
import ProposalRequest from '../../../lib/models/ProposalRequest';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  await connectDB();

  // Fetch counts
  const propertiesCount = await Property.countDocuments();
  const contactInquiriesCount = await ContactSubmission.countDocuments();
  const viewingsCount = await ScheduleViewing.countDocuments();
  const proposalsCount = await ProposalRequest.countDocuments();

  const stats = [
    { id: 'properties', name: 'Total Properties', value: propertiesCount, link: '/admin/properties' },
    { id: 'contacts', name: 'Contact Inquiries', value: contactInquiriesCount, link: '/admin/contacts' },
    { id: 'viewings', name: 'Viewings Scheduled', value: viewingsCount, link: '/admin/viewings' },
    { id: 'proposals', name: 'Proposal Requests', value: proposalsCount, link: '/admin/proposals' },
  ];

  // Fetch recent activity
  const recentContacts = await ContactSubmission.find().sort({ createdAt: -1 }).limit(5).lean();
  const recentViewings = await ScheduleViewing.find().sort({ createdAt: -1 }).limit(5).lean();
  const recentProposals = await ProposalRequest.find().sort({ createdAt: -1 }).limit(5).lean();

  const allActivity = [
    ...recentContacts.map(c => ({
      id: c._id.toString(),
      type: 'Contact',
      name: c.name,
      email: c.email,
      date: c.createdAt,
      details: c.message ? `Message: ${c.message.substring(0, 50)}...` : 'No message',
      link: '/admin/contacts',
    })),
    ...recentViewings.map(v => ({
      id: v._id.toString(),
      type: 'Viewing',
      name: v.name,
      email: v.email,
      date: v.createdAt,
      details: `Property: ${v.propertyTitle || 'Unknown'}`,
      link: '/admin/viewings',
    })),
    ...recentProposals.map(p => ({
      id: p._id.toString(),
      type: 'Proposal',
      name: p.name,
      email: p.email,
      date: p.createdAt,
      details: `Property: ${p.propertyTitle || 'Unknown'}`,
      link: '/admin/proposals',
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

  return <DashboardClient stats={stats} allActivity={allActivity} />;
}