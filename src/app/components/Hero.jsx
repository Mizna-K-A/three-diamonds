// components/Hero.jsx — Server Component
import connectDB from '../../../lib/mongodb';
import HeroSlide from '../../../lib/models/HeroSlide';
import HeroClient from './HeroClient';

import { unstable_cache } from 'next/cache';

const FALLBACK_SLIDES = [
  {
    _id: 'fallback-1',
    title: 'Premium Commercial Spaces',
    subtitle: 'Warehouses • Showrooms • Offices',
    image: '/default-home-img1.webp',
    cta: 'Explore Commercial Properties',
  },
  {
    _id: 'fallback-2',
    title: 'Luxury Residential Properties',
    subtitle: 'Villas • Apartments • Townhouses',
    image: '/default-home-img2.webp',
    cta: 'View Residential Listings',
  },
  {
    _id: 'fallback-3',
    title: 'Expert Property Management',
    subtitle: 'Relax While We Handle Everything',
    image: '/default-home-img3.webp',
    cta: 'Learn About Our Services',
  },
];

const getCachedHeroSlides = unstable_cache(
  async () => {
    try {
      await connectDB();
      const docs = await HeroSlide.find({ active: true })
        .sort({ order: 1, createdAt: 1 })
        .lean();
      return docs.map((d) => ({
        ...d,
        _id: d._id.toString(),
      }));
    } catch {
      return [];
    }
  },
  ['hero-slides'],
  { revalidate: 3600, tags: ['hero-slides'] }
);

export default async function Hero() {
  const slides = await getCachedHeroSlides();
  const heroSlides = slides.length > 0 ? slides : FALLBACK_SLIDES;
  return <HeroClient slides={heroSlides} />;
}
