import connectDB from "../../../lib/mongodb";
import TeamMember from "../../../lib/models/TeamMember";
import TeamClient from "./TeamClient";

export const dynamic = "force-dynamic";

async function getTeamMembers() {
  await connectDB();
  const docs = await TeamMember.find({ active: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return docs.map((d) => ({
    ...d,
    _id: d._id.toString(),
  }));
}

export default async function Team() {
  const teamMembers = await getTeamMembers();
  if (!teamMembers || teamMembers.length === 0) return null;
  return <TeamClient teamMembers={teamMembers} />;
}