import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

const PropertyStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a status name'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug'],
    trim: true,
    lowercase: true,
    sparse: true
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
    default: '#6b7280',
  },
  icon: {
    type: String,
    default: '',
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

PropertyStatusSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  NextResponse.next();
});

PropertyStatusSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

PropertyStatusSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id }, isDefault: true },
      { $set: { isDefault: false } }
    );
  }
  NextResponse.next();
});

PropertyStatusSchema.statics.getBySlug = function(slug) {
  return this.findOne({ slug, isActive: true });
};

PropertyStatusSchema.statics.getActiveStatuses = function() {
  return this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};

PropertyStatusSchema.statics.getDefaultStatus = function() {
  return this.findOne({ isDefault: true, isActive: true });
};

// Delete cached model so schema changes take effect immediately
delete mongoose.models.PropertyStatus;

export default mongoose.model('PropertyStatus', PropertyStatusSchema);