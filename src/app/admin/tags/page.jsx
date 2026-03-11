import Property from '../../../../lib/models/Property';
import Tag from '../../../../lib/models/Tag';
import connectDB from '../../../../lib/mongodb';
import TagsClient from './TagsClient';

// Simplified category options since we removed category from the model
// You might want to remove this entirely or keep for UI organization
const CATEGORY_OPTIONS = [
  { value: 'general', label: 'General Tags' },
];

export async function getTags() {
  try {
    await connectDB();
    
    const tags = await Tag.find({})
      .sort({ name: 1 }) // Simplified sorting
      .lean();
    
    return tags.map(tag => ({
      ...tag,
      _id: tag._id.toString(),
      id: tag._id.toString(),
      // Removed parent-related fields since parentId was removed
      parentId: null,
      parentName: null,
      parentLabel: null,
      // Removed metadata handling since it was removed
      metadata: {},
      // Add a default category for UI compatibility
      category: 'general',
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
    // You'll need to update this method in your Property model
    // or implement a simpler version
    const stats = await Property.aggregate([
      { $unwind: '$tagIds' },
      { $group: { _id: '$tagIds', count: { $sum: 1 } } }
    ]);
    
    // Convert to map for easy lookup
    const usageMap = {};
    stats.forEach(stat => {
      usageMap[stat._id.toString()] = stat.count;
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
    
    const tag = await Tag.create({
      name: formData.get('name'),
      slug: formData.get('slug'),
      icon: formData.get('icon') || '',
      color: formData.get('color') || '#6b7280',
    });
    
    return { 
      success: true,
      data: {
        ...tag.toObject(),
        _id: tag._id.toString(),
        id: tag._id.toString(),
        // Add UI compatibility fields
        category: 'general',
        metadata: {},
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
    
    const tag = await Tag.findByIdAndUpdate(
      id,
      {
        name: formData.get('name'),
        slug: formData.get('slug'),
        icon: formData.get('icon') || '',
        color: formData.get('color') || '#6b7280',
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
        // Add UI compatibility fields
        category: 'general',
        metadata: {},
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
  
  // Group tags by category (simplified - all in one category)
  const tagsByCategory = {
    general: tags
  };
  
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