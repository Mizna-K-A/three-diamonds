import connectDB from "../../../lib/mongodb";
import TeamMember from "../../../lib/models/TeamMember";
import TeamClient from "./TeamClient";

import { unstable_cache } from 'next/cache';

const getCachedTeamMembers = unstable_cache(
  async () => {
    await connectDB();
    const docs = await TeamMember.find({ active: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return docs.map((d) => ({
      ...d,
      _id: d._id.toString(),
    }));
  },
  ['team-members'],
  { revalidate: 3600, tags: ['team'] }
);

export default async function Team() {
  const teamMembers = await getCachedTeamMembers();
  if (!teamMembers || teamMembers.length === 0) return null;
  return <TeamClient teamMembers={teamMembers} />;
}