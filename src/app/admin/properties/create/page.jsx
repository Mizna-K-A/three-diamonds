import PropertyForm from '../PropertyForm';
import Tag from '../../../../../lib/models/Tag';
import PropertyType from '../../../../../lib/models/PropertyType';
import PropertyStatus from '../../../../../lib/models/PropertyStatus';
import connectDB from '../../../../../lib/mongodb';
import Property from '../../../../../lib/models/Property';
import { writeFile, mkdir } from 'fs/promises';
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

// Server Action for creating property - UPDATED for multiple tags and simplified images
async function createProperty(formData) {
  'use server';
  
  try {
    await connectDB();
    
    // Validate required fields
    const title = formData.get('title');
    const statusId = formData.get('statusId');
    const price = formData.get('price');
    
    if (!title || !statusId || !price) {
      return { error: 'Title, status, and price are required' };
    }
    
    // Parse features
    const features = formData.get('features') 
      ? JSON.parse(formData.get('features')) 
      : [];
    
    // Handle images - UPDATED for simplified schema
    const images = [];
    
    // Process new image files
    const imageFiles = formData.getAll('new_images');
    const imageAlts = formData.getAll('new_image_alts');
    const imageIsPrimary = formData.getAll('new_image_isPrimary');
    
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const alt = imageAlts[i] || title;
      const isPrimary = imageIsPrimary[i] === 'true' || (images.length === 0 && i === 0);
      
      const processedImage = await processAndSaveImage(file, images.length + i, isPrimary, alt);
      images.push(processedImage);
    }
    
    // Ensure only one primary image
    if (images.length > 0) {
      const hasPrimary = images.some(img => img.isPrimary);
      if (!hasPrimary) {
        images[0].isPrimary = true;
      } else {
        // Ensure only one primary
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
    
    // Generate slug
    const slug = formData.get('slug') || generateSlug(title);
    
    // Create property - UPDATED schema
    const property = await Property.create({
      title,
      slug,
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
    });
    
    // Revalidate paths
    revalidatePath('/admin/properties');
    revalidatePath('/properties');
    
    // Return success with redirect URL
    return { 
      success: true, 
      redirect: `/admin/properties/${property._id}`
    };
    
  } catch (error) {
    console.error('Error creating property:', error);
    return { error: error.message };
  }
}

async function getFormData() {
  try {
    await connectDB();
    
    const [propertyTypes, statuses, tags] = await Promise.all([
      PropertyType.find({}).sort({ name: 1 }).lean(),
      // Remove isActive filter and sortOrder sorting
      PropertyStatus.find({}).sort({ name: 1 }).lean(),
      // Remove isActive filter and category/sortOrder sorting
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

export default async function CreatePropertyPage() {
  const { propertyTypes, statuses, tags } = await getFormData();
  
  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Create New Property</h1>
        <p className="text-gray-400">Add a new property listing</p>
      </div>
      
      <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
        <PropertyForm
          propertyTypes={propertyTypes}
          statuses={statuses}
          tags={tags}
          action={createProperty}
          buttonText="Create Property"
        />
      </div>
    </div>
  );
}