"use server";

import { revalidatePath } from "next/cache";
import connectDB from "../../../../lib/mongodb";
import TeamMember from "../../../../lib/models/TeamMember";

function serialize(member) {
  if (!member) return null;
  const obj = member.toObject ? member.toObject() : member;
  return {
    ...obj,
    _id: obj._id?.toString?.() ?? obj._id,
  };
}

export async function createTeamMember(input) {
  await connectDB();
  const doc = await TeamMember.create({
    name: input?.name ?? "New Member",
    role: input?.role ?? "Team Member",
    experience: input?.experience ?? "1 Year",
    description: input?.description ?? "Add description here",
    specialties: input?.specialties ?? [],
    image: input?.image ?? "/founder.png",
    alt: input?.alt ?? input?.name ?? "Team member",
    order: typeof input?.order === "number" ? input.order : 0,
    active: typeof input?.active === "boolean" ? input.active : true,
  });
  revalidatePath("/admin/team");
  return serialize(doc);
}

export async function updateTeamMember(id, updates) {
  await connectDB();
  if (!id) throw new Error("id required");
  const doc = await TeamMember.findByIdAndUpdate(id, updates, { new: true });
  if (!doc) throw new Error("Team member not found");
  revalidatePath("/admin/team");
  return serialize(doc);
}

export async function deleteTeamMember(id) {
  await connectDB();
  if (!id) throw new Error("id required");
  await TeamMember.findByIdAndDelete(id);
  revalidatePath("/admin/team");
  return { success: true };
}

export async function reorderTeamMembers(orderUpdates) {
  await connectDB();
  const updates = Array.isArray(orderUpdates) ? orderUpdates : [];
  await Promise.all(
    updates.map((u) =>
      TeamMember.findByIdAndUpdate(u.id, { order: u.order }, { new: false })
    )
  );
  revalidatePath("/admin/team");
  return { success: true };
}

