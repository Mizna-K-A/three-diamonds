import Property from '../../../../lib/models/Property';
import PropertyStatus from '../../../../lib/models/PropertyStatus';
import connectDB from '../../../../lib/mongodb';
import PropertiesClient from './PropertiesClient';
import PropertyType from '../../../../lib/models/PropertyType';
import Tag from '../../../../lib/models/Tag';

export async function getProperties() {
  try {
    await connectDB();
    
    const properties = await Property.find({})
      .populate('statusId', 'name label color icon slug') // Added slug
      .populate('propertyTypeId', 'name slug icon')
      .populate('tagIds', 'name label color icon category slug') // Added slug
      .populate('purposeTagId', 'name label color icon slug') // Added slug
      .sort({ createdAt: -1 })
      .lean();
    
    return properties.map(property => ({
      ...property,
      _id: property._id.toString(),
      id: property._id.toString(),
      statusId: property.statusId?._id?.toString() || null,
      status: property.statusId ? {
        ...property.statusId,
        _id: property.statusId._id.toString(),
        slug: property.statusId.slug, // Include slug
      } : null,
      propertyTypeId: property.propertyTypeId?._id?.toString() || null,
      propertyType: property.propertyTypeId ? {
        ...property.propertyTypeId,
        _id: property.propertyTypeId._id.toString(),
        slug: property.propertyTypeId.slug, // Include slug
      } : null,
      tagIds: property.tagIds?.map(t => t._id.toString()) || [],
      tags: property.tagIds?.map(tag => ({
        ...tag,
        _id: tag._id.toString(),
        slug: tag.slug, // Include slug
      })) || [],
      purposeTagId: property.purposeTagId?._id?.toString() || null,
      purposeTag: property.purposeTagId ? {
        ...property.purposeTagId,
        _id: property.purposeTagId._id.toString(),
        slug: property.purposeTagId.slug, // Include slug
      } : null,
      userId: property.userId?.toString() || null,
      // Fix: Properly serialize the images array with the simplified schema
      images: (property.images || []).map(image => ({
        url: image.url,
        thumbnailUrl: image.thumbnailUrl || null,
        alt: image.alt || '', // Alt field is now the main descriptive field
        isPrimary: image.isPrimary || false,
        sortOrder: image.sortOrder || 0,
        uploadedAt: image.uploadedAt?.toISOString() || new Date().toISOString(),
        _id: image._id?.toString() || null,
      })),
      // Fix: Properly serialize the features array
      features: (property.features || []).map(feature => {
        if (feature._id) {
          return {
            ...feature,
            _id: feature._id.toString(),
          };
        }
        return feature;
      }),
      createdAt: property.createdAt?.toISOString(),
      updatedAt: property.updatedAt?.toISOString(),
      publishedAt: property.publishedAt?.toISOString(),
      expiresAt: property.expiresAt?.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

async function getPropertyTypes() {
  try {
    await connectDB();
    const types = await PropertyType.find({}).sort({ name: 1 }).lean();
    return types.map(type => ({
      ...type,
      _id: type._id.toString(),
      id: type._id.toString(),
      slug: type.slug, // Ensure slug is included
    }));
  } catch (error) {
    console.error('Error fetching property types:', error);
    return [];
  }
}

async function getPropertyStatuses() {
  try {
    await connectDB();
    // Remove the isActive filter if the field doesn't exist
    const statuses = await PropertyStatus.find({}) // Changed from { isActive: true }
      .sort({ name: 1 }) // Changed from sortOrder since it doesn't exist
      .lean();
    return statuses.map(status => ({
      ...status,
      _id: status._id.toString(),
      id: status._id.toString(),
      slug: status.slug,
    }));
  } catch (error) {
    console.error('Error fetching property statuses:', error);
    return [];
  }
}

async function getTags() {
  try {
    await connectDB();
    // Remove filters and sort by name only
    const tags = await Tag.find({}) // Changed from { isActive: true }
      .sort({ name: 1 }) // Simplified sorting
      .lean();
    return tags.map(tag => ({
      ...tag,
      _id: tag._id.toString(),
      id: tag._id.toString(),
      slug: tag.slug,
      // Handle parentId if it exists in the schema, otherwise set to null
      parentId: tag.parentId?.toString() || null,
    }));
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Helper function to convert slug to ID for tags
async function getTagIdsFromSlugs(slugs = []) {
  if (!slugs.length) return [];
  
  try {
    await connectDB();
    const tags = await Tag.find({ slug: { $in: slugs } }).select('_id').lean();
    return tags.map(tag => tag._id.toString());
  } catch (error) {
    console.error('Error converting slugs to IDs:', error);
    return [];
  }
}

// Helper function to get slug from ID (for response)
async function getTagSlugFromId(id) {
  if (!id) return null;
  
  try {
    await connectDB();
    const tag = await Tag.findById(id).select('slug').lean();
    return tag?.slug || null;
  } catch (error) {
    console.error('Error getting tag slug:', error);
    return null;
  }
}

// Server Actions
async function createProperty(formData) {
  'use server';
  
  try {
    await connectDB();
    
    // Parse features and images from JSON strings
    const features = formData.get('features') ? JSON.parse(formData.get('features')) : [];
    const images = formData.get('images') ? JSON.parse(formData.get('images')) : [];
    
    // Handle tags - support both IDs and slugs
    let tagIds = [];
    const tagInput = formData.get('tagIds');
    
    if (tagInput) {
      const parsedTags = JSON.parse(tagInput);
      
      // Check if the first item is a slug (string without ObjectId format)
      if (parsedTags.length > 0 && typeof parsedTags[0] === 'string' && !parsedTags[0].match(/^[0-9a-fA-F]{24}$/)) {
        // Input is slugs, convert to IDs
        tagIds = await getTagIdsFromSlugs(parsedTags);
      } else {
        // Input is already IDs
        tagIds = parsedTags;
      }
    }
    
    // Prepare images with simplified schema
    const processedImages = images.map((img, index) => ({
      url: img.url,
      thumbnailUrl: img.thumbnailUrl || null,
      alt: img.alt || formData.get('title') || 'Property image', // Use alt or fallback to title
      isPrimary: img.isPrimary || index === 0, // First image is primary by default
      sortOrder: img.sortOrder || index,
      uploadedAt: new Date(),
    }));
    
    const property = await Property.create({
      title: formData.get('title'),
      description: formData.get('description') || '',
      price: parseFloat(formData.get('price')) || 0,
      address: formData.get('address') || '',
      city: formData.get('city') || '',
      state: formData.get('state') || '',
      zipCode: formData.get('zipCode') || '',
      agentName: formData.get('agentName'),
      agentPhone: formData.get('agentPhone'),
      agentEmail: formData.get('agentEmail'),
      bedrooms: parseInt(formData.get('bedrooms')) || 0,
      bathrooms: parseFloat(formData.get('bathrooms')) || 0,
      area: parseFloat(formData.get('area')) || 0,
       NoOFCheck: formData.get('NoOFCheck'),
      RentalPeriod: formData.get('RentalPeriod'),
      statusId: formData.get('statusId'),
      propertyTypeId: formData.get('propertyTypeId') || null,
      tagIds: tagIds,
      userId: formData.get('userId') || null,
      images: processedImages,
      features: features,
      isFeatured: formData.get('isFeatured') === 'true',
      isPublished: formData.get('isPublished') === 'true',
      expiresAt: formData.get('expiresAt') || null,
    });
    
    // Fetch populated property
    const populatedProperty = await Property.findById(property._id)
      .populate('statusId', 'name label color icon slug')
      .populate('propertyTypeId', 'name slug icon')
      .populate('tagIds', 'name label color icon category slug')
      .populate('purposeTagId', 'name label color icon slug')
      .lean();
    
    return { 
      success: true,
      data: {
        ...populatedProperty,
        _id: populatedProperty._id.toString(),
        id: populatedProperty._id.toString(),
        statusId: populatedProperty.statusId?._id?.toString() || null,
        status: populatedProperty.statusId ? {
          ...populatedProperty.statusId,
          _id: populatedProperty.statusId._id.toString(),
          slug: populatedProperty.statusId.slug,
        } : null,
        propertyTypeId: populatedProperty.propertyTypeId?._id?.toString() || null,
        propertyType: populatedProperty.propertyTypeId ? {
          ...populatedProperty.propertyTypeId,
          _id: populatedProperty.propertyTypeId._id.toString(),
          slug: populatedProperty.propertyTypeId.slug,
        } : null,
        tagIds: populatedProperty.tagIds?.map(t => t._id.toString()) || [],
        tags: populatedProperty.tagIds?.map(tag => ({
          ...tag,
          _id: tag._id.toString(),
          slug: tag.slug,
        })) || [],
        purposeTagId: populatedProperty.purposeTagId?._id?.toString() || null,
        purposeTag: populatedProperty.purposeTagId ? {
          ...populatedProperty.purposeTagId,
          _id: populatedProperty.purposeTagId._id.toString(),
          slug: populatedProperty.purposeTagId.slug,
        } : null,
        // Return simplified images
        images: (populatedProperty.images || []).map(img => ({
          url: img.url,
          thumbnailUrl: img.thumbnailUrl,
          alt: img.alt,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
          uploadedAt: img.uploadedAt?.toISOString(),
          _id: img._id?.toString(),
        })),
      }
    };
  } catch (error) {
    console.error('Error creating property:', error);
    return { error: error.message };
  }
}

async function updateProperty(id, formData) {
  'use server';
  
  try {
    await connectDB();
    
    // Parse features and images from JSON strings
    const features = formData.get('features') ? JSON.parse(formData.get('features')) : [];
    const images = formData.get('images') ? JSON.parse(formData.get('images')) : [];
    
    // Handle tags - support both IDs and slugs
    let tagIds = [];
    const tagInput = formData.get('tagIds');
    
    if (tagInput) {
      const parsedTags = JSON.parse(tagInput);
      
      // Check if the first item is a slug (string without ObjectId format)
      if (parsedTags.length > 0 && typeof parsedTags[0] === 'string' && !parsedTags[0].match(/^[0-9a-fA-F]{24}$/)) {
        // Input is slugs, convert to IDs
        tagIds = await getTagIdsFromSlugs(parsedTags);
      } else {
        // Input is already IDs
        tagIds = parsedTags;
      }
    }
    
    // Prepare images with simplified schema
    const processedImages = images.map((img, index) => ({
      url: img.url,
      thumbnailUrl: img.thumbnailUrl || null,
      alt: img.alt || formData.get('title') || 'Property image',
      isPrimary: img.isPrimary || index === 0,
      sortOrder: img.sortOrder || index,
      uploadedAt: img.uploadedAt ? new Date(img.uploadedAt) : new Date(),
    }));
    
    const property = await Property.findByIdAndUpdate(
      id,
      {
        title: formData.get('title'),
        description: formData.get('description') || '',
        price: parseFloat(formData.get('price')) || 0,
        address: formData.get('address') || '',
        city: formData.get('city') || '',
        state: formData.get('state') || '',
        zipCode: formData.get('zipCode') || '',
        agentName: formData.get('agentName'),
        agentPhone: formData.get('agentPhone'),
        agentEmail: formData.get('agentEmail'),
        bedrooms: parseInt(formData.get('bedrooms')) || 0,
        bathrooms: parseFloat(formData.get('bathrooms')) || 0,
        area: parseFloat(formData.get('area')) || 0,
        NoOFCheck: formData.get('NoOFCheck'),
        RentalPeriod: formData.get('RentalPeriod'),
        statusId: formData.get('statusId'),
        propertyTypeId: formData.get('propertyTypeId') || null,
        tagIds: tagIds,
        images: processedImages,
        features: features,
        isFeatured: formData.get('isFeatured') === 'true',
        isPublished: formData.get('isPublished') === 'true',
        expiresAt: formData.get('expiresAt') || null,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).populate('statusId', 'name label color icon slug')
     .populate('propertyTypeId', 'name slug icon')
     .populate('tagIds', 'name label color icon category slug')
     .populate('purposeTagId', 'name label color icon slug');
    
    if (!property) {
      return { error: 'Property not found' };
    }
    
    const propertyObj = property.toObject();
    
    return { 
      success: true,
      data: {
        ...propertyObj,
        _id: propertyObj._id.toString(),
        id: propertyObj._id.toString(),
        statusId: propertyObj.statusId?._id?.toString() || null,
        status: propertyObj.statusId ? {
          ...propertyObj.statusId,
          _id: propertyObj.statusId._id.toString(),
          slug: propertyObj.statusId.slug,
        } : null,
        propertyTypeId: propertyObj.propertyTypeId?._id?.toString() || null,
        propertyType: propertyObj.propertyTypeId ? {
          ...propertyObj.propertyTypeId,
          _id: propertyObj.propertyTypeId._id.toString(),
          slug: propertyObj.propertyTypeId.slug,
        } : null,
        tagIds: propertyObj.tagIds?.map(t => t._id.toString()) || [],
        tags: propertyObj.tagIds?.map(tag => ({
          ...tag,
          _id: tag._id.toString(),
          slug: tag.slug,
        })) || [],
        purposeTagId: propertyObj.purposeTagId?._id?.toString() || null,
        purposeTag: propertyObj.purposeTagId ? {
          ...propertyObj.purposeTagId,
          _id: propertyObj.purposeTagId._id.toString(),
          slug: propertyObj.purposeTagId.slug,
        } : null,
        // Return simplified images
        images: (propertyObj.images || []).map(img => ({
          url: img.url,
          thumbnailUrl: img.thumbnailUrl,
          alt: img.alt,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
          uploadedAt: img.uploadedAt?.toISOString(),
          _id: img._id?.toString(),
        })),
      }
    };
  } catch (error) {
    console.error('Error updating property:', error);
    return { error: error.message };
  }
}

async function deleteProperty(id) {
  'use server';
  
  try {
    await connectDB();
    
    const property = await Property.findByIdAndDelete(id);
    
    if (!property) {
      return { error: 'Property not found' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting property:', error);
    return { error: error.message };
  }
}

async function toggleFeature(id) {
  'use server';
  
  try {
    await connectDB();
    
    const property = await Property.findById(id);
    if (!property) {
      return { error: 'Property not found' };
    }
    
    property.isFeatured = !property.isFeatured;
    await property.save();
    
    return { success: true, isFeatured: property.isFeatured };
  } catch (error) {
    console.error('Error toggling feature:', error);
    return { error: error.message };
  }
}

async function togglePublish(id) {
  'use server';
  
  try {
    await connectDB();
    
    const property = await Property.findById(id);
    if (!property) {
      return { error: 'Property not found' };
    }
    
    property.isPublished = !property.isPublished;
    if (property.isPublished && !property.publishedAt) {
      property.publishedAt = new Date();
    }
    await property.save();
    
    return { success: true, isPublished: property.isPublished };
  } catch (error) {
    console.error('Error toggling publish:', error);
    return { error: error.message };
  }
}

export default async function PropertiesPage() {
  const [properties, propertyTypes, statuses, tags] = await Promise.all([
    getProperties(),
    getPropertyTypes(),
    getPropertyStatuses(),
    getTags(),
  ]);
  
  return (
    <PropertiesClient 
      initialProperties={properties}
      propertyTypes={propertyTypes}
      statuses={statuses}
      tags={tags}
      createProperty={createProperty}
      updateProperty={updateProperty}
      deleteProperty={deleteProperty}
      toggleFeature={toggleFeature}
      togglePublish={togglePublish}
    />
  );
}