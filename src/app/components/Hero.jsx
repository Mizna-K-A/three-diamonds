// components/Hero.jsx — Server Component
import connectDB from '../../../lib/mongodb';
import HeroSlide from '../../../lib/models/HeroSlide';
import HeroClient from './HeroClient';

export const dynamic = 'force-dynamic';

const FALLBACK_SLIDES = [
  {
    _id: 'fallback-1',
    title: 'Premium Commercial Spaces',
    subtitle: 'Warehouses • Showrooms • Offices',
    image: '/d11.webp',
    cta: 'Explore Commercial Properties',
  },
  {
    _id: 'fallback-2',
    title: 'Luxury Residential Properties',
    subtitle: 'Villas • Apartments • Townhouses',
    image: '/d2.jpg',
    cta: 'View Residential Listings',
  },
  {
    _id: 'fallback-3',
    title: 'Expert Property Management',
    subtitle: 'Relax While We Handle Everything',
    image: '/d3.webp',
    cta: 'Learn About Our Services',
  },
];

async function getHeroSlides() {
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
}

export default async function Hero() {
  const slides = await getHeroSlides();
  const heroSlides = slides.length > 0 ? slides : FALLBACK_SLIDES;
  return <HeroClient slides={heroSlides} />;
}
