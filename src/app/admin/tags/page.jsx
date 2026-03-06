import Property from '../../../../lib/models/Property';
import Tag from '../../../../lib/models/Tag';
import connectDB from '../../../../lib/mongodb';
import TagsClient from './TagsClient';

const CATEGORY_OPTIONS = [
  { value: 'PURPOSE', label: 'Purpose (For Sale, For Rent, Lease, etc.)' },
  { value: 'FEATURE', label: 'Features' },
  { value: 'AMENITY', label: 'Amenities' },
  { value: 'CONDITION', label: 'Condition' },
  { value: 'OTHER', label: 'Other' },
];

async function getTags() {
  try {
    await connectDB();
    
    const tags = await Tag.find({})
      .populate('parentId', 'name label')
      .sort({ category: 1, sortOrder: 1, name: 1 })
      .lean();
    
    return tags.map(tag => ({
      ...tag,
      _id: tag._id.toString(),
      id: tag._id.toString(),
      parentId: tag.parentId?._id?.toString() || null,
      parentName: tag.parentId?.name || null,
      parentLabel: tag.parentId?.label || null,
      // Fix: Handle metadata correctly - it's stored as a plain object, not a Map
      metadata: tag.metadata || {},
      createdAt: tag.createdAt?.toISOString(),
      updatedAt: tag.updatedAt?.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

async function getTagUsageCounts() {
  try {
    await connectDB();
    const stats = await Property.getTagStats();
    
    // Convert to map for easy lookup
    const usageMap = {};
    stats.forEach(stat => {
      usageMap[stat.tagId.toString()] = stat.count;
    });
    
    return usageMap;
  } catch (error) {
    console.error('Error getting tag usage:', error);
    return {};
  }
}

// Server Actions
async function createTag(formData) {
  'use server';
  
  try {
    await connectDB();
    
    // Check if name or slug already exists
    const existing = await Tag.findOne({
      $or: [
        { name: formData.get('name') },
        { slug: formData.get('slug') }
      ]
    });
    
    if (existing) {
      return { error: 'Tag with this name or slug already exists' };
    }
    
    // Parse metadata if provided
    let metadata = {};
    const metadataStr = formData.get('metadata');
    if (metadataStr) {
      try {
        metadata = JSON.parse(metadataStr);
      } catch (e) {
        console.error('Error parsing metadata:', e);
      }
    }
    
    const tag = await Tag.create({
      name: formData.get('name'),
      slug: formData.get('slug'),
      label: formData.get('label'),
      description: formData.get('description') || '',
      category: formData.get('category') || 'PURPOSE',
      color: formData.get('color') || 'gray',
      icon: formData.get('icon') || '🏷️',
      isDefault: formData.get('isDefault') === 'true',
      isActive: formData.get('isActive') === 'true',
      sortOrder: parseInt(formData.get('sortOrder')) || 0,
      parentId: formData.get('parentId') || null,
      metadata: metadata,
    });
    
    return { 
      success: true,
      data: {
        ...tag.toObject(),
        _id: tag._id.toString(),
        id: tag._id.toString(),
        metadata: metadata, // Already an object
      }
    };
  } catch (error) {
    console.error('Error creating tag:', error);
    return { error: error.message };
  }
}

async function updateTag(id, formData) {
  'use server';
  
  try {
    await connectDB();
    
    // Check if name or slug already exists (excluding current)
    const existing = await Tag.findOne({
      $and: [
        { _id: { $ne: id } },
        { $or: [
          { name: formData.get('name') },
          { slug: formData.get('slug') }
        ]}
      ]
    });
    
    if (existing) {
      return { error: 'Tag with this name or slug already exists' };
    }
    
    // Parse metadata if provided
    let metadata = {};
    const metadataStr = formData.get('metadata');
    if (metadataStr) {
      try {
        metadata = JSON.parse(metadataStr);
      } catch (e) {
        console.error('Error parsing metadata:', e);
      }
    }
    
    // If setting this as default for category, unset any existing default
    if (formData.get('isDefault') === 'true') {
      await Tag.updateMany(
        { 
          _id: { $ne: id }, 
          category: formData.get('category'),
          isDefault: true 
        },
        { $set: { isDefault: false } }
      );
    }
    
    const tag = await Tag.findByIdAndUpdate(
      id,
      {
        name: formData.get('name'),
        slug: formData.get('slug'),
        label: formData.get('label'),
        description: formData.get('description') || '',
        category: formData.get('category'),
        color: formData.get('color'),
        icon: formData.get('icon'),
        isDefault: formData.get('isDefault') === 'true',
        isActive: formData.get('isActive') === 'true',
        sortOrder: parseInt(formData.get('sortOrder')) || 0,
        parentId: formData.get('parentId') || null,
        metadata: metadata,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );
    
    if (!tag) {
      return { error: 'Tag not found' };
    }
    
    return { 
      success: true,
      data: {
        ...tag.toObject(),
        _id: tag._id.toString(),
        id: tag._id.toString(),
        metadata: metadata, // Already an object
      }
    };
  } catch (error) {
    console.error('Error updating tag:', error);
    return { error: error.message };
  }
}

async function deleteTag(id) {
  'use server';
  
  try {
    await connectDB();
    
    // Check if this is a default tag
    const tagToDelete = await Tag.findById(id);
    if (tagToDelete?.isDefault) {
      return { error: 'Cannot delete default tag. Please set another tag as default first.' };
    }
    
    // Check if tag has children
    const childrenCount = await Tag.countDocuments({ parentId: id });
    if (childrenCount > 0) {
      return { error: `Cannot delete: ${childrenCount} child tags depend on this tag.` };
    }
    
    // Check if tag is being used by any properties
    const propertiesCount = await Property.countDocuments({ tagIds: id });
    
    if (propertiesCount > 0) {
      return { error: `Cannot delete: ${propertiesCount} properties are using this tag. Please remove the tag from those properties first.` };
    }
    
    await Tag.findByIdAndDelete(id);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting tag:', error);
    return { error: error.message };
  }
}

export default async function TagsPage() {
  const tags = await getTags();
  const usageCounts = await getTagUsageCounts();
  
  // Group tags by category
  const tagsByCategory = {};
  CATEGORY_OPTIONS.forEach(cat => {
    tagsByCategory[cat.value] = tags.filter(t => t.category === cat.value);
  });
  
  return (
    <TagsClient 
      initialTags={tags}
      tagsByCategory={tagsByCategory}
      usageCounts={usageCounts}
      categoryOptions={CATEGORY_OPTIONS}
      createTag={createTag}
      updateTag={updateTag}
      deleteTag={deleteTag}
    />
  );
}