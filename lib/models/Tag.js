import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a tag name'],
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
  category: {
    type: String,
    enum: ['PURPOSE', 'FEATURE', 'AMENITY', 'CONDITION', 'OTHER'],
    default: 'PURPOSE',
    index: true,
  },
  color: {
    type: String,
    default: '#6b7280',
    // No enum - supports any hex color
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
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    default: null,
  },
  metadata: {
    type: Map,
    of: String,
    default: {},
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

TagSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  NextResponse.next();
});

TagSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

TagSchema.pre('save', async function (next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id }, category: this.category, isDefault: true },
      { $set: { isDefault: false } }
    );
  }
  NextResponse.next();
});

TagSchema.statics.getByCategory = function (category) {
  return this.find({ category, isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .populate('parentId', 'name label');
};

TagSchema.statics.getPurposeTags = function () {
  return this.getByCategory('PURPOSE');
};

TagSchema.statics.getActiveTags = function () {
  return this.find({ isActive: true }).sort({ category: 1, sortOrder: 1, name: 1 });
};

TagSchema.statics.getDefaultForCategory = async function (category) {
  let defaultTag = await this.findOne({ category, isDefault: true, isActive: true });
  if (!defaultTag) {
    defaultTag = await this.findOne({ category, isActive: true }).sort({ sortOrder: 1 });
  }
  return defaultTag;
};

// Delete cached model so schema changes take effect immediately
delete mongoose.models.Tag;

export default mongoose.model('Tag', TagSchema);