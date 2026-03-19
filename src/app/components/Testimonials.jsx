import connectDB from '../../../lib/mongodb';
import Testimonial from '../../../lib/models/Testimonial';
import TestimonialsClient from './TestimonialsClient';

export const dynamic = 'force-dynamic';

async function getTestimonials() {
  await connectDB();
  const docs = await Testimonial.find({ active: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return docs.map((d) => ({
    ...d,
    _id: d._id.toString(),
  }));
}

export default async function Testimonials() {
  const testimonials = await getTestimonials();
  if (!testimonials || testimonials.length === 0) {
    return null;
  }
  return <TestimonialsClient testimonials={testimonials} />;
}