import connectDB from '../../../lib/mongodb';
import Insight from '../../../lib/models/Insight';
import InsightsPublicClient from './InsightsPublicClient';

// Use dynamic rendering since we are using searchParams for filtering
export const dynamic = 'force-dynamic';

export default async function InsightsPage({ searchParams }) {
    await connectDB();

    const { category, q } = searchParams;

    // Build the query
    const query = { active: true };
    if (category && category !== 'all') {
        query.category = category;
    }
    if (q) {
        query.$or = [
            { title: { $regex: q, $options: 'i' } },
            { excerpt: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } }
        ];
    }

    // Fetch insights from DB
    const insights = await Insight.find(query).sort({ date: -1 }).lean();

    const serializedInsights = insights.map(i => ({
        ...i,
        _id: i._id.toString(),
        date: i.date?.toISOString(),
        createdAt: i.createdAt?.toISOString(),
        updatedAt: i.updatedAt?.toISOString(),
    }));

    // For featured and trending sections, we fetch them separately or filter from all
    // To keep it efficient and "pure SSR", we'll pass the filtered list
    return <InsightsPublicClient
        initialInsights={serializedInsights}
        currentCategory={category || 'all'}
        currentSearch={q || ''}
    />;
}