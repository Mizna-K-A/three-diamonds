import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

const PropertyStatusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    label: {
        type: String,
        trim: true,
    },
    slug: {
        type: String,
        required: [true, 'Please provide a slug'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    icon: {
        type: String,
        default: '',
    },
    color: {
        type: String,
        default: '#6b7280',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

PropertyStatusSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    NextResponse.next();
});

PropertyStatusSchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: new Date() });
});

export default mongoose.models.PropertyStatus || mongoose.model('PropertyStatus', PropertyStatusSchema);
