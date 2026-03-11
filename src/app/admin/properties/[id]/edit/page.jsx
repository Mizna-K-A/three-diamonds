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

// Helper function to process and save image
async function processAndSaveImage(file, index, isPrimary = false) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const originalName = file.name;
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const baseFilename = `${timestamp}-${random}`;
    
    const uploadDir = path.join(process.cwd(), 'public/uploads/properties');
    await mkdir(uploadDir, { recursive: true });
    
    const metadata = await sharp(buffer).metadata();
    
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 85, effort: 6 })
      .toBuffer();
    
    const mainFilename = `${baseFilename}.webp`;
    const mainPath = path.join(uploadDir, mainFilename);
    await writeFile(mainPath, webpBuffer);
    
    const mainMetadata = await sharp(webpBuffer).metadata();
    
    const sizes = [
      { name: 'thumbnail', width: 150, height: 150, quality: 70, fit: 'cover' },
      { name: 'small', width: 400, height: 300, quality: 75, fit: 'inside' },
      { name: 'medium', width: 800, height: 600, quality: 80, fit: 'inside' },
      { name: 'large', width: 1200, height: 900, quality: 85, fit: 'inside' }
    ];
    
    const webpVersions = {
      thumbnail: null,
      small: null,
      medium: null,
      large: null
    };
    
    for (const { name, width, height, quality, fit } of sizes) {
      if (width < metadata.width || height < metadata.height) {
        const resizedBuffer = await sharp(buffer)
          .resize(width, height, { fit, withoutEnlargement: true, position: 'center' })
          .webp({ quality, effort: 6 })
          .toBuffer();
        
        const sizeFilename = `${baseFilename}-${name}.webp`;
        const sizePath = path.join(uploadDir, sizeFilename);
        await writeFile(sizePath, resizedBuffer);
        
        const sizeMetadata = await sharp(resizedBuffer).metadata();
        
        webpVersions[name] = {
          url: `/uploads/properties/${sizeFilename}`,
          width: sizeMetadata.width,
          height: sizeMetadata.height,
          size: resizedBuffer.length,
        };
      }
    }
    
    return {
      original: {
        filename: originalName,
        size: buffer.length,
        contentType: file.type,
      },
      webp: {
        thumbnail: webpVersions.thumbnail,
        small: webpVersions.small,
        medium: webpVersions.medium,
        large: webpVersions.large,
        original: {
          url: `/uploads/properties/${mainFilename}`,
          width: mainMetadata.width,
          height: mainMetadata.height,
          size: webpBuffer.length,
        },
      },
      caption: '',
      alt: '',
      isPrimary,
      sortOrder: index,
      uploadedAt: new Date(),
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error(`Failed to process image: ${error.message}`);
  }
}

// Helper function to delete image files
async function deleteImageFiles(image) {
  try {
    if (image.webp) {
      const urls = [
        image.webp.original?.url,
        image.webp.thumbnail?.url,
        image.webp.small?.url,
        image.webp.medium?.url,
        image.webp.large?.url
      ];
      
      for (const url of urls) {
        if (url) {
          const filePath = path.join(process.cwd(), 'public', url);
          await unlink(filePath).catch(() => {});
        }
      }
    }
  } catch (error) {
    console.error('Error deleting image files:', error);
  }
}

async function getProperty(id) {
  try {
    await connectDB();

    const property = await Property.findById(id)
      .populate('statusId', 'name label color icon')
      .populate('propertyTypeId', 'name slug icon')
      .populate('tagIds', 'name label color icon category')
      .populate('purposeTagId', 'name label color icon')
      .lean();

    if (!property) {
      return null;
    }

    const processedImages = (property.images || []).map((img, index) => ({
      ...img,
      id: img._id?.toString() || `img-${index}-${Date.now()}`,
      isPrimary: img.isPrimary || false,
    }));

    return {
      ...property,
      _id: property._id.toString(),
      statusId: property.statusId?._id?.toString() || '',
      propertyTypeId: property.propertyTypeId?._id?.toString() || '',
      tagIds: property.tagIds?.map(t => t._id.toString()) || [],
      tagId: property.purposeTagId?._id?.toString() || property.tagIds?.[0]?._id?.toString() || '',
      purposeTagId: property.purposeTagId?._id?.toString() || '',
      images: processedImages,
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
      PropertyStatus.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean(),
      Tag.find({ isActive: true }).sort({ category: 1, sortOrder: 1, name: 1 }).lean(),
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

// Server Action for updating property
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

    const images = [];
    
    const existingImages = [];
    let i = 0;
    while (formData.has(`existing_images[${i}]`)) {
      const existingImage = JSON.parse(formData.get(`existing_images[${i}]`));
      existingImages.push(existingImage);
      i++;
    }
    
    const keepImageIds = new Set(existingImages.map(img => img.id || img._id));
    
    const currentProperty = await Property.findById(id);
    if (currentProperty) {
      const imagesToDelete = (currentProperty.images || []).filter(
        img => !keepImageIds.has(img.id) && !keepImageIds.has(img._id?.toString())
      );
      
      for (const img of imagesToDelete) {
        await deleteImageFiles(img);
      }
    }
    
    images.push(...existingImages);
    
    const imageFiles = formData.getAll('images');
    const imageCaptions = formData.getAll('image_captions');
    const imageAlts = formData.getAll('image_alts');
    const imageIsPrimary = formData.getAll('image_isPrimary');
    
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const caption = imageCaptions[i] || '';
      const alt = imageAlts[i] || caption;
      const isPrimary = imageIsPrimary[i] === 'true';
      
      const processedImage = await processAndSaveImage(file, images.length + i, isPrimary);
      processedImage.caption = caption;
      processedImage.alt = alt;
      
      images.push(processedImage);
    }
    
    const hasPrimary = images.some(img => img.isPrimary);
    if (!hasPrimary && images.length > 0) {
      images[0].isPrimary = true;
    } else if (images.length > 0) {
      let primarySet = false;
      images.forEach(img => {
        if (img.isPrimary && !primarySet) {
          primarySet = true;
        } else if (img.isPrimary) {
          img.isPrimary = false;
        }
      });
    }

    const tagId = formData.get('tagId');
    const tagIds = tagId ? [tagId] : [];

    // Update property - REMOVED bedrooms and bathrooms
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
        // bedrooms and bathrooms removed
        area: parseFloat(formData.get('area')) || 0,
        statusId,
        propertyTypeId: formData.get('propertyTypeId') || null,
        tagIds,
        purposeTagId: tagId || null,
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