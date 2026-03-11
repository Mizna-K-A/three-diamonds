import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
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
  NoOFCheck: {
    type: String,
    trim: true,
  },
  RentalPeriod: {
    type: String,
    trim: true,
  },
  statusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PropertyStatus',
    required: [true, 'Please provide a status'],
  },
  propertyTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PropertyType',
  },
  tagIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  purposeTagId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Simplified images schema with only alt field
  images: [{
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    alt: {
      type: String,
      default: '',
    },
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

// Update timestamps and slug middleware
PropertySchema.pre('save', function (next) {
  this.updatedAt = new Date();

  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Generate slug if not present
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove non-word chars
      .replace(/[\s_-]+/g, '-') // swap spaces for dash
      .replace(/^-+|-+$/g, ''); // trim dashes
  }

  // NextResponse.next() is NOT a thing here, it seems the user added it by mistake in a previous turn
  // It should just be next();
  next();
});

PropertySchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

// Post-save to set purposeTagId
PropertySchema.post('save', async function (doc) {
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
PropertySchema.virtual('formattedPrice').get(function () {
  return this.price ? `$${this.price.toLocaleString()}` : 'N/A';
});

// Virtual for full address
PropertySchema.virtual('fullAddress').get(function () {
  const parts = [];
  if (this.address) parts.push(this.address);
  if (this.city) parts.push(this.city);
  if (this.state) parts.push(this.state);
  if (this.zipCode) parts.push(this.zipCode);
  return parts.join(', ') || 'No address provided';
});

// Virtual for primary image URL
PropertySchema.virtual('primaryImageUrl').get(function () {
  const primary = this.images?.find(img => img.isPrimary);
  return primary?.url || primary?.thumbnailUrl || null;
});

// Virtual for all image URLs
PropertySchema.virtual('imageUrls').get(function () {
  return this.images?.map(img => img.url).filter(Boolean) || [];
});

// Virtual for purpose tag
PropertySchema.virtual('purposeTag', {
  ref: 'Tag',
  localField: 'purposeTagId',
  foreignField: '_id',
  justOne: true,
});

// Method to get image by index
PropertySchema.methods.getImageUrl = function (imageIndex = 0, useThumbnail = false) {
  const image = this.images?.[imageIndex];
  if (!image) return null;
  return useThumbnail ? (image.thumbnailUrl || image.url) : image.url;
};

// Method to get image alt text
PropertySchema.methods.getImageAlt = function (imageIndex = 0) {
  const image = this.images?.[imageIndex];
  return image?.alt || this.title || 'Property image';
};

// Method to check if property has tag
PropertySchema.methods.hasTag = function (tagId) {
  return this.tagIds?.some(id => id.toString() === tagId.toString());
};

// Method to add tag
PropertySchema.methods.addTag = async function (tagId) {
  if (!this.hasTag(tagId)) {
    this.tagIds.push(tagId);
    await this.save();
  }
  return this;
};

// Method to remove tag
PropertySchema.methods.removeTag = async function (tagId) {
  this.tagIds = this.tagIds.filter(id => id.toString() !== tagId.toString());
  await this.save();
  return this;
};

// Method to find tag by slug (for editing)
PropertySchema.methods.findTagBySlug = async function (slug) {
  const Tag = mongoose.model('Tag');
  const tag = await Tag.findOne({ slug });
  return tag;
};

// Method to add tag by slug
PropertySchema.methods.addTagBySlug = async function (slug) {
  const tag = await this.findTagBySlug(slug);
  if (tag && !this.hasTag(tag._id)) {
    this.tagIds.push(tag._id);
    await this.save();
  }
  return this;
};

// Method to remove tag by slug
PropertySchema.methods.removeTagBySlug = async function (slug) {
  const tag = await this.findTagBySlug(slug);
  if (tag) {
    this.tagIds = this.tagIds.filter(id => id.toString() !== tag._id.toString());
    await this.save();
  }
  return this;
};

// Static method to find by tag slug
PropertySchema.statics.findByTagSlug = async function (slug) {
  const Tag = mongoose.model('Tag');
  const tag = await Tag.findOne({ slug });
  if (!tag) return [];
  return this.find({ tagIds: tag._id, isPublished: true })
    .sort({ createdAt: -1 });
};

// Static method to find by purpose slug
PropertySchema.statics.findByPurposeSlug = async function (purposeSlug) {
  const Tag = mongoose.model('Tag');
  const purposeTag = await Tag.findOne({
    slug: purposeSlug,
    category: 'PURPOSE'
  });

  if (!purposeTag) return [];

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
        'tags._id': purposeTag._id,
        isPublished: true
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);
};

// Static method to get tag statistics by slug
PropertySchema.statics.getTagStatsBySlug = async function (slug) {
  const Tag = mongoose.model('Tag');
  const tag = await Tag.findOne({ slug });

  if (!tag) return null;

  const stats = await this.aggregate([
    {
      $match: {
        tagIds: tag._id,
        isPublished: true
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        totalValue: { $sum: '$price' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    }
  ]);

  return {
    tag: {
      id: tag._id,
      name: tag.name,
      label: tag.label,
      slug: tag.slug,
      category: tag.category,
      color: tag.color,
      icon: tag.icon
    },
    ...(stats[0] || { count: 0, totalValue: 0, avgPrice: 0, minPrice: 0, maxPrice: 0 })
  };
};

// Populate references automatically
PropertySchema.pre(/^find/, function () {
  this.populate('statusId', 'name label color icon description slug')
    .populate('propertyTypeId', 'name slug icon')
    .populate('tagIds', 'name label color icon category slug')
    .populate('purposeTagId', 'name label color icon slug');
});

export default mongoose.models.Property || mongoose.model('Property', PropertySchema);