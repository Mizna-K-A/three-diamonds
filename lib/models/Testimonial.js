import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        company: { type: String },
        content: { type: String, required: true },
        rating: { type: Number, default: 5 },
        avatar: { type: String, default: '👨‍💼' },
        order: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Testimonial ||
    mongoose.model('Testimonial', TestimonialSchema);
