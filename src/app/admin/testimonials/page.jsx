import connectDB from '../../../../lib/mongodb';
import Testimonial from '../../../../lib/models/Testimonial';
import TestimonialsAdminClient from './TestimonialsAdminClient';

export const dynamic = 'force-dynamic';

async function getTestimonials() {
    await connectDB();
    const docs = await Testimonial.find().sort({ order: 1, createdAt: -1 }).lean();
    return docs.map((d) => ({
        ...d,
        _id: d._id.toString(),
    }));
}

export default async function TestimonialsAdminPage() {
    const testimonials = await getTestimonials();
    return <TestimonialsAdminClient initialTestimonials={testimonials} />;
}