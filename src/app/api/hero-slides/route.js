import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import HeroSlide from '../../../../lib/models/HeroSlide';


// Public endpoint — no auth required, used by Hero.jsx on client
export async function GET() {
    try {
        await connectDB();
        const slides = await HeroSlide.find({ active: true }).sort({ order: 1, createdAt: 1 });
        return NextResponse.json(slides);
    } catch (error) {
        console.error('Public hero slides GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
    }
}
