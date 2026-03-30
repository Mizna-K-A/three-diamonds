import connectDB from '../../../lib/mongodb';
import Insight from '../../../lib/models/Insight';
import InsightsPublicClient from './InsightsPublicClient';

// Use dynamic rendering
export const dynamic = 'force-dynamic';

export default async function InsightsPage() {
    await connectDB();

    // Fetch all active insights from DB
    const query = { active: true };
    const insights = await Insight.find(query).sort({ date: -1 }).lean();

    const serializedInsights = insights.map(i => {
        const categories = {
            'market-reports': 'Market Reports',
            'investment': 'Investment',
            'residential': 'Residential',
            'commercial': 'Commercial',
            'industrial': 'Industrial',
            'sustainability': 'Sustainability',
            'technology': 'Technology',
            'luxury': 'Luxury'
        };
        const categoryName = i.categoryName || categories[i.category] || 'Market Reports';
        const slug = i.slug || i.title?.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-') || i._id.toString();
        return {
            ...i,
            _id: i._id.toString(),
            slug: slug,
            categoryName,
            date: i.date?.toISOString(),
            createdAt: i.createdAt?.toISOString(),
            updatedAt: i.updatedAt?.toISOString(),
        };
    });

    // Pass all insights to the client component
    // Filtering will be handled client-side if needed
    return <InsightsPublicClient
        initialInsights={serializedInsights}
    />;
}