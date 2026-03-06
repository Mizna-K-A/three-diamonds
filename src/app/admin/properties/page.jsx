import Property from '../../../../lib/models/Property';
import PropertyStatus from '../../../../lib/models/PropertyStatus';
import connectDB from '../../../../lib/mongodb';
import PropertiesClient from './PropertiesClient';
import PropertyType from '../../../../lib/models/PropertyType';
import Tag from '../../../../lib/models/Tag';

async function getProperties() {
  try {
    await connectDB();
    
    const properties = await Property.find({})
      .populate('statusId', 'name label color icon')
      .populate('propertyTypeId', 'name slug icon')
      .populate('tagIds', 'name label color icon category')
      .populate('purposeTagId', 'name label color icon')
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
      } : null,
      propertyTypeId: property.propertyTypeId?._id?.toString() || null,
      propertyType: property.propertyTypeId ? {
        ...property.propertyTypeId,
        _id: property.propertyTypeId._id.toString(),
      } : null,
      tagIds: property.tagIds?.map(t => t._id.toString()) || [],
      tags: property.tagIds?.map(tag => ({
        ...tag,
        _id: tag._id.toString(),
      })) || [],
      purposeTagId: property.purposeTagId?._id?.toString() || null,
      purposeTag: property.purposeTagId ? {
        ...property.purposeTagId,
        _id: property.purposeTagId._id.toString(),
      } : null,
      userId: property.userId?.toString() || null,
      // Fix: Properly serialize the images array
      images: (property.images || []).map(image => ({
        ...image,
        _id: image._id?.toString() || null,
      })),
      // Fix: Properly serialize the features array if it contains ObjectIds
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
    }));
  } catch (error) {
    console.error('Error fetching property types:', error);
    return [];
  }
}

async function getPropertyStatuses() {
  try {
    await connectDB();
    const statuses = await PropertyStatus.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();
    return statuses.map(status => ({
      ...status,
      _id: status._id.toString(),
      id: status._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching property statuses:', error);
    return [];
  }
}

async function getTags() {
  try {
    await connectDB();
    const tags = await Tag.find({ isActive: true })
      .sort({ category: 1, sortOrder: 1, name: 1 })
      .lean();
    return tags.map(tag => ({
      ...tag,
      _id: tag._id.toString(),
      id: tag._id.toString(),
      parentId: tag.parentId?.toString() || null,
    }));
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
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
    const tagIds = formData.get('tagIds') ? JSON.parse(formData.get('tagIds')) : [];
    
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
      statusId: formData.get('statusId'),
      propertyTypeId: formData.get('propertyTypeId') || null,
      tagIds: tagIds,
      userId: formData.get('userId') || null,
      images: images,
      features: features,
      isFeatured: formData.get('isFeatured') === 'true',
      isPublished: formData.get('isPublished') === 'true',
      expiresAt: formData.get('expiresAt') || null,
    });
    
    // Fetch populated property
    const populatedProperty = await Property.findById(property._id)
      .populate('statusId', 'name label color icon')
      .populate('propertyTypeId', 'name slug icon')
      .populate('tagIds', 'name label color icon category')
      .populate('purposeTagId', 'name label color icon')
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
        } : null,
        propertyTypeId: populatedProperty.propertyTypeId?._id?.toString() || null,
        propertyType: populatedProperty.propertyTypeId ? {
          ...populatedProperty.propertyTypeId,
          _id: populatedProperty.propertyTypeId._id.toString(),
        } : null,
        tagIds: populatedProperty.tagIds?.map(t => t._id.toString()) || [],
        tags: populatedProperty.tagIds?.map(tag => ({
          ...tag,
          _id: tag._id.toString(),
        })) || [],
        purposeTagId: populatedProperty.purposeTagId?._id?.toString() || null,
        purposeTag: populatedProperty.purposeTagId ? {
          ...populatedProperty.purposeTagId,
          _id: populatedProperty.purposeTagId._id.toString(),
        } : null,
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
    const tagIds = formData.get('tagIds') ? JSON.parse(formData.get('tagIds')) : [];
    
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
        statusId: formData.get('statusId'),
        propertyTypeId: formData.get('propertyTypeId') || null,
        tagIds: tagIds,
        images: images,
        features: features,
        isFeatured: formData.get('isFeatured') === 'true',
        isPublished: formData.get('isPublished') === 'true',
        expiresAt: formData.get('expiresAt') || null,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).populate('statusId', 'name label color icon')
     .populate('propertyTypeId', 'name slug icon')
     .populate('tagIds', 'name label color icon category')
     .populate('purposeTagId', 'name label color icon');
    
    if (!property) {
      return { error: 'Property not found' };
    }
    
    return { 
      success: true,
      data: {
        ...property.toObject(),
        _id: property._id.toString(),
        id: property._id.toString(),
        statusId: property.statusId?._id?.toString() || null,
        status: property.statusId ? {
          ...property.statusId,
          _id: property.statusId._id.toString(),
        } : null,
        propertyTypeId: property.propertyTypeId?._id?.toString() || null,
        propertyType: property.propertyTypeId ? {
          ...property.propertyTypeId,
          _id: property.propertyTypeId._id.toString(),
        } : null,
        tagIds: property.tagIds?.map(t => t._id.toString()) || [],
        tags: property.tagIds?.map(tag => ({
          ...tag,
          _id: tag._id.toString(),
        })) || [],
        purposeTagId: property.purposeTagId?._id?.toString() || null,
        purposeTag: property.purposeTagId ? {
          ...property.purposeTagId,
          _id: property.purposeTagId._id.toString(),
        } : null,
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