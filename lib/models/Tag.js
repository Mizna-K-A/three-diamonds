import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a tag name'],
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
  category: {
    type: String,
    enum: ['PURPOSE', 'FEATURE', 'AMENITY', 'CONDITION', 'OTHER'],
    default: 'PURPOSE',
    index: true,
  },
  color: {
    type: String,
    default: 'gray',
    enum: ['gray', 'red', 'green', 'blue', 'yellow', 'purple', 'orange', 'indigo', 'cyan', 'emerald', 'pink', 'amber'],
  },
  icon: {
    type: String,
    default: '🏷️',
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
  // For hierarchical tags
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

// Update timestamps middleware
TagSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  NextResponse.next();
});

TagSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

// Ensure only one default per category
TagSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { 
        _id: { $ne: this._id }, 
        category: this.category,
        isDefault: true 
      },
      { $set: { isDefault: false } }
    );
  }
  NextResponse.next();
});

// Get tags by category
TagSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .populate('parentId', 'name label');
};

// Get purpose tags (for sale, for rent, lease, etc.)
TagSchema.statics.getPurposeTags = function() {
  return this.getByCategory('PURPOSE');
};

// Get all active tags
TagSchema.statics.getActiveTags = function() {
  return this.find({ isActive: true })
    .sort({ category: 1, sortOrder: 1, name: 1 });
};

// Get default tag for category
TagSchema.statics.getDefaultForCategory = async function(category) {
  let defaultTag = await this.findOne({ category, isDefault: true, isActive: true });
  if (!defaultTag) {
    defaultTag = await this.findOne({ category, isActive: true }).sort({ sortOrder: 1 });
  }
  return defaultTag;
};

export default mongoose.models.Tag || mongoose.model('Tag', TagSchema);