import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import HeroSlide from '../../../../../lib/models/HeroSlide';

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

// Seed defaults if DB is empty
async function seedIfEmpty() {
    const count = await HeroSlide.countDocuments();
    if (count === 0) {
        await HeroSlide.insertMany(DEFAULT_SLIDES);
    }
}

// GET - list all slides
export async function GET() {
    try {
        await connectDB();
        await seedIfEmpty();
        const slides = await HeroSlide.find().sort({ order: 1, createdAt: 1 });
        return NextResponse.json(slides);
    } catch (error) {
        console.error('Hero slides GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
    }
}

// POST - create new slide
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { title, subtitle, cta, image, order, active } = body;
        const slide = await HeroSlide.create({ title, subtitle, cta, image, order: order ?? 0, active: active ?? true });
        return NextResponse.json(slide, { status: 201 });
    } catch (error) {
        console.error('Hero slides POST error:', error);
        return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
    }
}

// PUT - update existing slide
export async function PUT(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { id, ...updates } = body;
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
        const slide = await HeroSlide.findByIdAndUpdate(id, updates, { new: true });
        if (!slide) return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
        return NextResponse.json(slide);
    } catch (error) {
        console.error('Hero slides PUT error:', error);
        return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
    }
}

// DELETE - remove slide
export async function DELETE(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
        await HeroSlide.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Hero slides DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
    }
}
