import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Testimonial from '../../../../../lib/models/Testimonial';

export const dynamic = 'force-dynamic';

const DEFAULT_TESTIMONIALS = [
    {
        name: 'Ahmed Al Mansoori',
        company: 'Tech Startup Founder',
        content: 'Three Diamonds helped us find the perfect commercial space in Al Quoz. Their professionalism and attention to detail made the entire process seamless.',
        rating: 5,
        avatar: '👨‍💼',
        order: 0,
        active: true,
    },
    {
        name: 'Sarah Johnson',
        company: 'Boutique Owner',
        content: 'As a first-time business owner in Dubai, I was overwhelmed. The team at Three Diamonds guided me through every step and found me a beautiful showroom space.',
        rating: 5,
        avatar: '👩‍💼',
        order: 1,
        active: true,
    },
    {
        name: 'Mohammed Ali',
        company: 'Property Investor',
        content: 'Their property management services have been exceptional. I can finally relax knowing my investments are in good hands.',
        rating: 5,
        avatar: '🧑‍💼',
        order: 2,
        active: true,
    },
    {
        name: 'Elena Rodriguez',
        company: 'Art Gallery Director',
        content: 'Finding the right space for our gallery was challenging until we worked with Three Diamonds. Their knowledge of the market is impressive.',
        rating: 5,
        avatar: '👩‍🎨',
        order: 3,
        active: true,
    }
];

async function seedIfEmpty() {
    const count = await Testimonial.countDocuments();
    if (count === 0) {
        await Testimonial.insertMany(DEFAULT_TESTIMONIALS);
    }
}

export async function GET() {
    try {
        await connectDB();
        await seedIfEmpty();
        const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
        return NextResponse.json(testimonials);
    } catch (error) {
        console.error('Admin testimonials GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const testimonial = await Testimonial.create(body);
        return NextResponse.json(testimonial, { status: 201 });
    } catch (error) {
        console.error('Admin testimonial POST error:', error);
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { id, ...updates } = body;
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
        const testimonial = await Testimonial.findByIdAndUpdate(id, updates, { new: true });
        if (!testimonial) return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
        return NextResponse.json(testimonial);
    } catch (error) {
        console.error('Admin testimonial PUT error:', error);
        return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
        await Testimonial.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Admin testimonial DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
    }
}
