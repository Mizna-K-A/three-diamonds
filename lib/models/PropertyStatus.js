import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

const PropertyStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a status name'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  label: {
    type: String,
    required: [true, 'Please provide a display label'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'gray',
    enum: ['gray', 'red', 'green', 'blue', 'yellow', 'purple', 'orange', 'indigo', 'cyan', 'emerald'],
  },
  icon: {
    type: String,
    default: '📌',
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
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

// Update timestamps middleware
PropertyStatusSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  NextResponse.next();
 });

PropertyStatusSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

// Ensure only one default status
PropertyStatusSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id }, isDefault: true },
      { $set: { isDefault: false } }
    );
  }
  NextResponse.next();
});

// Get status by slug
PropertyStatusSchema.statics.getBySlug = function(slug) {
  return this.findOne({ slug, isActive: true });
};

// Get all active statuses sorted
PropertyStatusSchema.statics.getActiveStatuses = function() {
  return this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};

// Get default status
PropertyStatusSchema.statics.getDefaultStatus = function() {
  return this.findOne({ isDefault: true, isActive: true });
};

export default mongoose.models.PropertyStatus || mongoose.model('PropertyStatus', PropertyStatusSchema);