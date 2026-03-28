import connectDB from '../../../lib/mongodb';
import Testimonial from '../../../lib/models/Testimonial';
import TestimonialsClient from './TestimonialsClient';

import { unstable_cache } from 'next/cache';

const getCachedTestimonials = unstable_cache(
  async () => {
    await connectDB();
    const docs = await Testimonial.find({ active: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return docs.map((d) => ({
      ...d,
      _id: d._id.toString(),
    }));
  },
  ['testimonials'],
  { revalidate: 3600, tags: ['testimonials'] }
);

export default async function Testimonials() {
  const testimonials = await getCachedTestimonials();
  if (!testimonials || testimonials.length === 0) {
    return null;
  }
  return <TestimonialsClient testimonials={testimonials} />;
}