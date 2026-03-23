import connectDB from '../../../..//lib/mongodb';
import Insight from '../../../../lib/models/Insight';
import InsightsClient from './InsightsClient';
import { createInsight, updateInsight, deleteInsight } from '../../../../lib/actions/insight';
import { uploadImageAction } from '../../../../lib/actions/upload';

export const dynamic = 'force-dynamic';

export default async function InsightsAdminPage() {
    await connectDB();
    const insights = await Insight.find({}).sort({ date: -1 }).lean();

    // Serialize MongoDB objects
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

    return (
        <InsightsClient
            initialInsights={serializedInsights}
            createInsight={createInsight}
            updateInsight={updateInsight}
            deleteInsight={deleteInsight}
            uploadImageAction={uploadImageAction}
        />
    );
}
