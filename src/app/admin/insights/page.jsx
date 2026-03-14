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
    const serializedInsights = insights.map(i => ({
        ...i,
        _id: i._id.toString(),
        date: i.date?.toISOString(),
        createdAt: i.createdAt?.toISOString(),
        updatedAt: i.updatedAt?.toISOString(),
    }));

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
