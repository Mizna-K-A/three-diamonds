import connectDB from '../../../../lib/mongodb';
import TeamMember from '../../../../lib/models/TeamMember';
import TeamAdminClient from './TeamAdminClient';

export const dynamic = 'force-dynamic';

async function getTeamMembers() {
    await connectDB();
    const docs = await TeamMember.find().sort({ order: 1, createdAt: 1 }).lean();
    return docs.map((d) => ({
        ...d,
        _id: d._id.toString(),
    }));
}

export default async function TeamAdminPage() {
    const members = await getTeamMembers();
    return <TeamAdminClient initialMembers={members} />;
}