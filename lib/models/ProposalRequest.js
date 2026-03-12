import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

const ProposalRequestSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
        index: true,
    },
    propertyTitle: {
        type: String,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    agentName: {
        type: String,
    },
    agentEmail: {
        type: String,
    },
    status: {
        type: String,
        enum: ['new', 'processed', 'completed'],
        default: 'new',
        index: true,
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

ProposalRequestSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    NextResponse.next();
});

export default mongoose.models.ProposalRequest || mongoose.model('ProposalRequest', ProposalRequestSchema);
