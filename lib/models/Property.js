import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
  },
  address: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  zipCode: {
    type: String,
    trim: true,
  },
  mapLink: {
    type: String,
    trim: true,
  },
  agentName: {
    type: String,
    trim: true,
  },
  agentPhone: {
    type: String,
    trim: true,
  },
  agentEmail: {
    type: String,
    trim: true,
  },
  area: {
    type: Number,
    min: [0, 'Area cannot be negative'],
  },
  statusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PropertyStatus',
    required: [true, 'Please provide a status'],
    index: true,
  },
  propertyTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PropertyType',
    index: true,
  },
  tagIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    index: true,
  }],
  purposeTagId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  // Updated images schema to match new structure
  images: [{
    original: {
      filename: String,
      size: Number,
      contentType: String,
    },
    webp: {
      thumbnail: {
        url: String,
        width: Number,
        height: Number,
        size: Number,
      },
      small: {
        url: String,
        width: Number,
        height: Number,
        size: Number,
      },
      medium: {
        url: String,
        width: Number,
        height: Number,
        size: Number,
      },
      large: {
        url: String,
        width: Number,
        height: Number,
        size: Number,
      },
      original: {
        url: String,
        width: Number,
        height: Number,
        size: Number,
      },
    },
    caption: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  features: [{
    name: {
      type: String,
      required: true,
    }
  }],
  views: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  publishedAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
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
PropertySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  NextResponse.next();
});

PropertySchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

// Post-save to set purposeTagId
PropertySchema.post('save', async function(doc) {
  if (doc.tagIds && doc.tagIds.length > 0) {
    const Tag = mongoose.model('Tag');
    const purposeTag = await Tag.findOne({
      _id: { $in: doc.tagIds },
      category: 'PURPOSE'
    });
    
    if (purposeTag && (!doc.purposeTagId || doc.purposeTagId.toString() !== purposeTag._id.toString())) {
      doc.purposeTagId = purposeTag._id;
      await doc.constructor.findByIdAndUpdate(doc._id, { purposeTagId: purposeTag._id });
    }
  }
});

// Add indexes
PropertySchema.index({ price: 1 });
PropertySchema.index({ city: 1, state: 1 });
PropertySchema.index({ createdAt: -1 });
PropertySchema.index({ 'images.isPrimary': 1 });
PropertySchema.index({ tagIds: 1 });
PropertySchema.index({ purposeTagId: 1 });
PropertySchema.index({ isFeatured: 1, isPublished: 1 });
PropertySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for formatted price
PropertySchema.virtual('formattedPrice').get(function() {
  return this.price ? `$${this.price.toLocaleString()}` : 'N/A';
});

// Virtual for full address
PropertySchema.virtual('fullAddress').get(function() {
  const parts = [];
  if (this.address) parts.push(this.address);
  if (this.city) parts.push(this.city);
  if (this.state) parts.push(this.state);
  if (this.zipCode) parts.push(this.zipCode);
  return parts.join(', ') || 'No address provided';
});

// Virtual for primary image URL (for backward compatibility)
PropertySchema.virtual('primaryImageUrl').get(function() {
  const primary = this.images?.find(img => img.isPrimary);
  return primary?.webp?.medium?.url || primary?.webp?.small?.url || primary?.webp?.original?.url || null;
});

// Virtual for all image URLs (for backward compatibility)
PropertySchema.virtual('imageUrls').get(function() {
  return this.images?.map(img => img.webp?.medium?.url || img.webp?.small?.url || img.webp?.original?.url).filter(Boolean) || [];
});

// Virtual for purpose tag
PropertySchema.virtual('purposeTag', {
  ref: 'Tag',
  localField: 'purposeTagId',
  foreignField: '_id',
  justOne: true,
});

// Method to get image by size
PropertySchema.methods.getImageUrl = function(imageIndex = 0, size = 'medium') {
  const image = this.images?.[imageIndex];
  if (!image) return null;
  return image.webp?.[size]?.url || image.webp?.original?.url || null;
};

// Method to check if property has tag
PropertySchema.methods.hasTag = function(tagId) {
  return this.tagIds?.some(id => id.toString() === tagId.toString());
};

// Method to add tag
PropertySchema.methods.addTag = async function(tagId) {
  if (!this.hasTag(tagId)) {
    this.tagIds.push(tagId);
    await this.save();
  }
  return this;
};

// Method to remove tag
PropertySchema.methods.removeTag = async function(tagId) {
  this.tagIds = this.tagIds.filter(id => id.toString() !== tagId.toString());
  await this.save();
  return this;
};

// Static method to find by tag
PropertySchema.statics.findByTag = function(tagId) {
  return this.find({ tagIds: tagId, isPublished: true })
    .sort({ createdAt: -1 });
};

// Static method to find by purpose
PropertySchema.statics.findByPurpose = function(purposeSlug) {
  return this.aggregate([
    {
      $lookup: {
        from: 'tags',
        localField: 'tagIds',
        foreignField: '_id',
        as: 'tags'
      }
    },
    {
      $match: {
        'tags.slug': purposeSlug,
        'tags.category': 'PURPOSE',
        isPublished: true
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);
};

// Static method to get tag statistics
PropertySchema.statics.getTagStats = async function() {
  const stats = await this.aggregate([
    {
      $unwind: '$tagIds'
    },
    {
      $group: {
        _id: '$tagIds',
        count: { $sum: 1 },
        totalValue: { $sum: '$price' }
      }
    },
    {
      $lookup: {
        from: 'tags',
        localField: '_id',
        foreignField: '_id',
        as: 'tag'
      }
    },
    {
      $unwind: '$tag'
    },
    {
      $project: {
        tagId: '$_id',
        tagName: '$tag.name',
        tagLabel: '$tag.label',
        tagCategory: '$tag.category',
        tagColor: '$tag.color',
        tagIcon: '$tag.icon',
        count: 1,
        totalValue: 1,
        _id: 0
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  return stats;
};

// Populate references automatically (except images to avoid huge data transfer)
PropertySchema.pre(/^find/, function() {
  this.populate('statusId', 'name label color icon description')
      .populate('propertyTypeId', 'name slug icon')
      .populate('tagIds', 'name label color icon category')
      .populate('purposeTagId', 'name label color icon');
});

export default mongoose.models.Property || mongoose.model('Property', PropertySchema);