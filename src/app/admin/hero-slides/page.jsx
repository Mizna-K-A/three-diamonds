import connectDB from '../../../../lib/mongodb';
import HeroSlide from '../../../../lib/models/HeroSlide';
import HeroSlidesAdminClient from './HeroSlidesAdminClient';

export const dynamic = 'force-dynamic';

const DEFAULT_SLIDES = [
    { title: 'Premium Commercial Spaces', subtitle: 'Warehouses • Showrooms • Offices', image: '/default-home-img1.webp', cta: 'Explore Commercial Properties', order: 0, active: true },
    { title: 'Luxury Residential Properties', subtitle: 'Villas • Apartments • Townhouses', image: '/default-home-img2.webp', cta: 'View Residential Listings', order: 1, active: true },
    { title: 'Expert Property Management', subtitle: 'Relax While We Handle Everything', image: '/default-home-img3.webp', cta: 'Learn About Our Services', order: 2, active: true },
];

async function getHeroSlides() {
    await connectDB();
    const count = await HeroSlide.countDocuments();
    if (count === 0) {
        await HeroSlide.insertMany(DEFAULT_SLIDES);
    }
    const docs = await HeroSlide.find().sort({ order: 1, createdAt: 1 }).lean();
    return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

export default async function HeroSlidesPage() {
    const slides = await getHeroSlides();
    return <HeroSlidesAdminClient initialSlides={slides} />;
}
