import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        experience: { type: String, required: true },
        description: { type: String, required: true },
        specialties: { type: [String], default: [] },
        image: { type: String, required: true },
        alt: { type: String },
        order: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.TeamMember ||
    mongoose.model('TeamMember', TeamMemberSchema);
