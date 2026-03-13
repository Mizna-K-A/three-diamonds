import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Testimonial from '../../../../lib/models/Testimonial';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const testimonials = await Testimonial.find({ active: true }).sort({ order: 1, createdAt: -1 });
        return NextResponse.json(testimonials);
    } catch (error) {
        console.error('Public testimonials GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}
