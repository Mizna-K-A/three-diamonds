"use server";

import { revalidatePath } from "next/cache";
import connectDB from "../../../../lib/mongodb";
import HeroSlide from "../../../../lib/models/HeroSlide";

const DEFAULT_SLIDES = [
    {
        title: 'Premium Commercial Spaces',
        subtitle: 'Warehouses • Showrooms • Offices',
        image: '/d11.webp',
        cta: 'Explore Commercial Properties',
        order: 0,
        active: true,
    },
    {
        title: 'Luxury Residential Properties',
        subtitle: 'Villas • Apartments • Townhouses',
        image: '/d2.jpg',
        cta: 'View Residential Listings',
        order: 1,
        active: true,
    },
    {
        title: 'Expert Property Management',
        subtitle: 'Relax While We Handle Everything',
        image: '/d3.webp',
        cta: 'Learn About Our Services',
        order: 2,
        active: true,
    },
];

function serialize(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return { ...obj, _id: obj._id?.toString?.() ?? obj._id };
}

async function seedIfEmpty() {
    const count = await HeroSlide.countDocuments();
    if (count === 0) {
        await HeroSlide.insertMany(DEFAULT_SLIDES);
    }
}

export async function createHeroSlide(input) {
    await connectDB();
    await seedIfEmpty();
    const maxOrder = (await HeroSlide.countDocuments()) - 1;
    const doc = await HeroSlide.create({
        title: input?.title ?? 'New Slide',
        subtitle: input?.subtitle ?? 'Add subtitle here',
        cta: input?.cta ?? 'Learn More',
        image: input?.image ?? '/d11.webp',
        order: typeof input?.order === 'number' ? input.order : maxOrder + 1,
        active: typeof input?.active === 'boolean' ? input.active : true,
    });
    revalidatePath('/admin/hero-slides');
    revalidatePath('/');
    return serialize(doc);
}

export async function updateHeroSlide(id, updates) {
    await connectDB();
    if (!id) throw new Error('id required');
    const doc = await HeroSlide.findByIdAndUpdate(id, updates, { new: true });
    if (!doc) throw new Error('Slide not found');
    revalidatePath('/admin/hero-slides');
    revalidatePath('/');
    return serialize(doc);
}

export async function deleteHeroSlide(id) {
    await connectDB();
    if (!id) throw new Error('id required');
    await HeroSlide.findByIdAndDelete(id);
    revalidatePath('/admin/hero-slides');
    revalidatePath('/');
    return { success: true };
}

export async function reorderHeroSlides(orderUpdates) {
    await connectDB();
    const updates = Array.isArray(orderUpdates) ? orderUpdates : [];
    await Promise.all(
        updates.map((u) =>
            HeroSlide.findByIdAndUpdate(u.id, { order: u.order }, { new: false })
        )
    );
    revalidatePath('/admin/hero-slides');
    revalidatePath('/');
    return { success: true };
}
