import mongoose from 'mongoose';

const HeroSlideSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        cta: { type: String, required: true },
        image: { type: String, required: true }, // public URL like /uploads/filename.jpg
        order: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.HeroSlide ||
    mongoose.model('HeroSlide', HeroSlideSchema);
