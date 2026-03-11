import Tag from '../../../../../../lib/models/Tag';
import PropertyType from '../../../../../../lib/models/PropertyType';
import connectDB from '../../../../../../lib/mongodb';
import { notFound } from 'next/navigation';
import Property from '../../../../../../lib/models/Property';
import PropertyStatus from '../../../../../../lib/models/PropertyStatus';
import PropertyForm from '../../PropertyForm';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';

// Helper function to generate slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    + '-' + Date.now();
}

// Helper function to process and save image - UPDATED for simplified schema
async function processAndSaveImage(file, index, isPrimary = false, alt = '') {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const baseFilename = `${timestamp}-${random}`;

    const uploadDir = path.join(process.cwd(), 'public/uploads/properties');
    await mkdir(uploadDir, { recursive: true });

    // Generate main image (WebP)
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 85, effort: 6 })
      .toBuffer();

    const mainFilename = `${baseFilename}.webp`;
    const mainPath = path.join(uploadDir, mainFilename);
    await writeFile(mainPath, webpBuffer);

    // Generate thumbnail
    const thumbnailBuffer = await sharp(buffer)
      .resize(150, 150, { fit: 'cover', position: 'center' })
      .webp({ quality: 70, effort: 6 })
      .toBuffer();

    const thumbnailFilename = `${baseFilename}-thumbnail.webp`;
    const thumbnailPath = path.join(uploadDir, thumbnailFilename);
    await writeFile(thumbnailPath, thumbnailBuffer);

    // Get metadata
    const mainMetadata = await sharp(webpBuffer).metadata();

    // Return simplified image object
    return {
      url: `/uploads/properties/${mainFilename}`,
      thumbnailUrl: `/uploads/properties/${thumbnailFilename}`,
      alt: alt || 'Property image',
      isPrimary,
      sortOrder: index,
      uploadedAt: new Date(),
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error(`Failed to process image: ${error.message}`);
  }
}

// Helper function to delete image files - UPDATED for simplified schema
async function deleteImageFiles(image) {
  try {
    if (image.url) {
      const filePath = path.join(process.cwd(), 'public', image.url);
      await unlink(filePath).catch(() => { });
    }
    if (image.thumbnailUrl) {
      const thumbnailPath = path.join(process.cwd(), 'public', image.thumbnailUrl);
      await unlink(thumbnailPath).catch(() => { });
    }
  } catch (error) {
    console.error('Error deleting image files:', error);
  }
}

async function getProperty(id) {
  try {
    await connectDB();

    const property = await Property.findById(id)
      .populate('statusId', 'name label color icon slug')
      .populate('propertyTypeId', 'name slug icon')
      .populate('tagIds', 'name label color icon category slug')
      .populate('purposeTagId', 'name label color icon slug')
      .lean();

    if (!property) {
      return null;
    }

    // Process images for simplified schema
    const processedImages = (property.images || []).map((img, index) => ({
      id: img._id?.toString() || `img-${index}-${Date.now()}`,
      url: img.url,
      thumbnailUrl: img.thumbnailUrl,
      alt: img.alt || property.title || 'Property image',
      isPrimary: img.isPrimary || false,
      sortOrder: img.sortOrder || index,
      uploadedAt: img.uploadedAt,
    }));

    // Process features to ensure they are plain objects
    const processedFeatures = (property.features || []).map(feature => ({
      _id: feature._id?.toString() || '',
      name: feature.name || '',
    }));

    return {
      ...property,
      _id: property._id.toString(),
      statusId: property.statusId?._id?.toString() || '',
      propertyTypeId: property.propertyTypeId?._id?.toString() || '',
      purposeTagId: property.purposeTagId?._id?.toString() || '',
      tagIds: property.tagIds?.map(t => t._id.toString()) || [],
      images: processedImages,
      features: processedFeatures,
      expiresAt: property.expiresAt ? property.expiresAt.toISOString().split('T')[0] : '',
    };
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

async function getFormData() {
  try {
    await connectDB();

    const [propertyTypes, statuses, tags] = await Promise.all([
      PropertyType.find({}).sort({ name: 1 }).lean(),
      // Remove the isActive filter and sortOrder sorting since they don't exist in schema
      PropertyStatus.find({}).sort({ name: 1 }).lean(),
      // Remove the isActive filter and category/sortOrder sorting since they don't exist in schema
      Tag.find({}).sort({ name: 1 }).lean(),
    ]);

    return {
      propertyTypes: propertyTypes.map(type => ({
        ...type,
        _id: type._id.toString(),
      })),
      statuses: statuses.map(status => ({
        ...status,
        _id: status._id.toString(),
      })),
      tags: tags.map(tag => ({
        ...tag,
        _id: tag._id.toString(),
      })),
    };
  } catch (error) {
    console.error('Error fetching form data:', error);
    return {
      propertyTypes: [],
      statuses: [],
      tags: [],
    };
  }
}

// Server Action for updating property - UPDATED for multiple tags and simplified images
async function updateProperty(id, formData) {
  'use server';

  try {
    await connectDB();

    const title = formData.get('title');
    const statusId = formData.get('statusId');
    const price = formData.get('price');

    if (!title || !statusId || !price) {
      return { error: 'Title, status, and price are required' };
    }

    const features = formData.get('features')
      ? JSON.parse(formData.get('features'))
      : [];

    // Handle images - UPDATED for simplified schema
    const images = [];

    // Process existing images
    const existingImagesJson = formData.get('images');
    const existingImages = existingImagesJson ? JSON.parse(existingImagesJson) : [];

    // Keep track of images to keep
    const keepImageUrls = new Set(existingImages.map(img => img.url));

    // Delete images that are no longer needed
    const currentProperty = await Property.findById(id);
    if (currentProperty) {
      const imagesToDelete = (currentProperty.images || []).filter(
        img => !keepImageUrls.has(img.url)
      );

      for (const img of imagesToDelete) {
        await deleteImageFiles(img);
      }
    }

    images.push(...existingImages);

    // Process new image files
    const newImages = [];
    let i = 0;
    while (formData.has(`new_image_alts[${i}]`)) {
      newImages.push({
        alt: formData.get(`new_image_alts[${i}]`),
        isPrimary: formData.get(`new_image_isPrimary[${i}]`) === 'true',
      });
      i++;
    }

    const imageFiles = formData.getAll('new_images');

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const { alt, isPrimary } = newImages[i] || { alt: title, isPrimary: false };

      const processedImage = await processAndSaveImage(file, images.length + i, isPrimary, alt);
      images.push(processedImage);
    }

    // Ensure only one primary image
    if (images.length > 0) {
      const hasPrimary = images.some(img => img.isPrimary);
      if (!hasPrimary) {
        images[0].isPrimary = true;
      } else {
        let primarySet = false;
        images.forEach(img => {
          if (img.isPrimary && !primarySet) {
            primarySet = true;
          } else if (img.isPrimary) {
            img.isPrimary = false;
          }
        });
      }
    }

    // Handle tags - UPDATED for multiple tags
    const tagIdsJson = formData.get('tagIds');
    const tagIds = tagIdsJson ? JSON.parse(tagIdsJson) : [];

    // Update property - UPDATED schema
    const property = await Property.findByIdAndUpdate(
      id,
      {
        title,
        slug: formData.get('slug') || generateSlug(title),
        description: formData.get('description') || '',
        price: parseFloat(price),
        address: formData.get('address') || '',
        city: formData.get('city') || '',
        state: formData.get('state') || '',
        zipCode: formData.get('zipCode') || '',
        mapLink: formData.get('mapLink') || '',
        agentName: formData.get('agentName') || '',
        agentPhone: formData.get('agentPhone') || '',
        agentEmail: formData.get('agentEmail') || '',
        area: parseFloat(formData.get('area')) || 0,
        NoOFCheck: formData.get('NoOFCheck') || '',
        RentalPeriod: formData.get('RentalPeriod') || '',
        statusId,
        propertyTypeId: formData.get('propertyTypeId') || null,
        tagIds,
        images,
        features,
        isFeatured: formData.get('isFeatured') === 'true',
        isPublished: formData.get('isPublished') === 'true',
        expiresAt: formData.get('expiresAt') || null,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!property) {
      return { error: 'Property not found' };
    }

    revalidatePath('/admin/properties');
    revalidatePath(`/admin/properties/${id}`);
    revalidatePath('/properties');

    return {
      success: true,
      redirect: `/admin/properties/${property._id}`
    };

  } catch (error) {
    console.error('Error updating property:', error);
    return { error: error.message };
  }
}

export default async function EditPropertyPage({ params }) {
  const { id } = await params;
  const [property, { propertyTypes, statuses, tags }] = await Promise.all([
    getProperty(id),
    getFormData(),
  ]);

  if (!property) {
    notFound();
  }

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Edit Property</h1>
        <p className="text-gray-400">Update property listing information</p>
      </div>

      <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
        <PropertyForm
          property={property}
          propertyTypes={propertyTypes}
          statuses={statuses}
          tags={tags}
          action={updateProperty}
          buttonText="Update Property"
        />
      </div>
    </div>
  );
}