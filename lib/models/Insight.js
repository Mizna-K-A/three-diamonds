import mongoose from 'mongoose';

const InsightSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        excerpt: { type: String, required: true },
        content: { type: String }, // For the full article
        category: { type: String, required: true },
        categoryName: { type: String, required: true },
        date: { type: Date, default: Date.now },
        readTime: { type: String },
        author: { type: String },
        authorRole: { type: String },
        image: { type: String },
        featured: { type: Boolean, default: false },
        trending: { type: Boolean, default: false },
        views: { type: Number, default: 0 },
        tags: [{ type: String }],
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Insight || mongoose.model('Insight', InsightSchema);
