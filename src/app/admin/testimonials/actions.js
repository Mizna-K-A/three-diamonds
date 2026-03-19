"use server";

import { revalidatePath } from "next/cache";
import connectDB from "../../../../lib/mongodb";
import Testimonial from "../../../../lib/models/Testimonial";

function serialize(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    _id: obj._id?.toString?.() ?? obj._id,
  };
}

export async function createTestimonial(input) {
  await connectDB();
  const doc = await Testimonial.create({
    name: input?.name ?? "New Client",
    company: input?.company ?? "Company Name",
    content: input?.content ?? "Write testimonial here...",
    rating: input?.rating ?? 5,
    avatar: input?.avatar ?? "👨‍💼",
    order: typeof input?.order === "number" ? input.order : 0,
    active: typeof input?.active === "boolean" ? input.active : true,
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return serialize(doc);
}

export async function updateTestimonial(id, updates) {
  await connectDB();
  if (!id) throw new Error("id required");
  const doc = await Testimonial.findByIdAndUpdate(id, updates, { new: true });
  if (!doc) throw new Error("Testimonial not found");
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return serialize(doc);
}

export async function deleteTestimonial(id) {
  await connectDB();
  if (!id) throw new Error("id required");
  await Testimonial.findByIdAndDelete(id);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

export async function reorderTestimonials(orderUpdates) {
  await connectDB();
  const updates = Array.isArray(orderUpdates) ? orderUpdates : [];
  await Promise.all(
    updates.map((u) =>
      Testimonial.findByIdAndUpdate(u.id, { order: u.order }, { new: false })
    )
  );
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

