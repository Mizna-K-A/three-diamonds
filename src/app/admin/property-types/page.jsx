
import PropertyTypesClient from './PropertyTypesClient';
import connectDB from '../../../../lib/mongodb';
import PropertyType from '../../../../lib/models/PropertyType';
import Property from '../../../../lib/models/Property';

export async function getPropertyTypes() {
  try {
    await connectDB();

    // Get all property types with property count using aggregation
    const propertyTypes = await PropertyType.aggregate([
      {
        $lookup: {
          from: 'properties',
          localField: '_id',
          foreignField: 'propertyTypeId',
          as: 'properties'
        }
      },
      {
        $addFields: {
          propertyCount: { $size: '$properties' }
        }
      },
      {
        $project: {
          properties: 0 // Remove the properties array from the result
        }
      },
      {
        $sort: { name: 1 }
      }
    ]);

    // Convert MongoDB documents to plain objects with string IDs
    return propertyTypes.map(type => ({
      _id: type._id.toString(),
      id: type._id.toString(),
      name: type.name || '',
      slug: type.slug || '',
      description: type.description || '',
      icon: type.icon || '',
      propertyCount: type.propertyCount || 0,
      createdAt: type.createdAt?.toISOString(),
      updatedAt: type.updatedAt?.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching property types:', error);
    return [];
  }
}

// Server Action for creating property type
async function createPropertyType(formData) {
  'use server';

  try {
    await connectDB();

    // Check if name or slug already exists
    const existing = await PropertyType.findOne({
      $or: [
        { name: formData.get('name') },
        { slug: formData.get('slug') }
      ]
    });

    if (existing) {
      return { error: 'Property type with this name or slug already exists' };
    }

    const propertyType = await PropertyType.create({
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description') || '',
      icon: formData.get('icon') || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      data: {
        _id: propertyType._id.toString(),
        id: propertyType._id.toString(),
        name: propertyType.name,
        slug: propertyType.slug,
        description: propertyType.description,
        icon: propertyType.icon,
        propertyCount: 0,
      }
    };
  } catch (error) {
    console.error('Error creating property type:', error);
    return { error: error.message };
  }
}

// Server Action for updating property type
async function updatePropertyType(id, formData) {
  'use server';

  try {
    await connectDB();

    // Check if name or slug already exists (excluding current document)
    const existing = await PropertyType.findOne({
      $and: [
        { _id: { $ne: id } },
        {
          $or: [
            { name: formData.get('name') },
            { slug: formData.get('slug') }
          ]
        }
      ]
    });

    if (existing) {
      return { error: 'Property type with this name or slug already exists' };
    }

    const propertyType = await PropertyType.findByIdAndUpdate(
      id,
      {
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description') || '',
        icon: formData.get('icon') || '',
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!propertyType) {
      return { error: 'Property type not found' };
    }

    const propertyCount = await Property.countDocuments({ propertyTypeId: id });

    return {
      success: true,
      data: {
        _id: propertyType._id.toString(),
        id: propertyType._id.toString(),
        name: propertyType.name,
        slug: propertyType.slug,
        description: propertyType.description,
        icon: propertyType.icon,
        propertyCount,
      }
    };
  } catch (error) {
    console.error('Error updating property type:', error);
    return { error: error.message };
  }
}

// Server Action for deleting property type
async function deletePropertyType(id) {
  'use server';

  try {
    await connectDB();

    // Check if property type exists
    const propertyType = await PropertyType.findById(id);
    if (!propertyType) {
      return { error: 'Property type not found' };
    }

    // Check if there are any properties using this type
    const propertiesCount = await Property.countDocuments({ propertyTypeId: id });

    if (propertiesCount > 0) {
      // Remove the reference from properties (set to null)
      await Property.updateMany(
        { propertyTypeId: id },
        { $set: { propertyTypeId: null } }
      );
    }

    // Delete the property type
    await PropertyType.findByIdAndDelete(id);

    return {
      success: true,
      message: `Property type deleted successfully. ${propertiesCount > 0 ? `Updated ${propertiesCount} properties.` : ''}`
    };
  } catch (error) {
    console.error('Error deleting property type:', error);
    return { error: error.message };
  }
}

export default async function PropertyTypesPage() {
  const propertyTypes = await getPropertyTypes();

  return (
    <PropertyTypesClient
      initialPropertyTypes={propertyTypes}
      createPropertyType={createPropertyType}
      updatePropertyType={updatePropertyType}
      deletePropertyType={deletePropertyType}
    />
  );
}