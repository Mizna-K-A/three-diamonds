'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Home,
  MapPin,
  DollarSign,
  Ruler,
  User,
  Phone,
  Mail,
  Calendar,
  Star,
  Eye,
  Image as ImageIcon,
  Tag,
  Check,
  X,
  ChevronRight,
  Upload,
  Loader2,
  List,
  HomeIcon
} from 'lucide-react';

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    + '-' + Date.now();
}

// Reusable Input Component
const FormInput = ({ label, icon: Icon, error, ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-300">
      {label} {props.required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-3">
          <Icon size={18} className="text-gray-500" />
        </div>
      )}
      <input
        {...props}
        className={`
          w-full bg-[#1a1a1a] border border-gray-800 rounded-xl 
          text-white placeholder-gray-600
          focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent
          transition-all duration-200
          ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
          ${error ? 'border-red-500' : 'hover:border-gray-700'}
        `}
      />
    </div>
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

const FormTextarea = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-300">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute top-3 left-3 pointer-events-none">
          <Icon size={18} className="text-gray-500" />
        </div>
      )}
      <textarea
        {...props}
        className={`
          w-full bg-[#1a1a1a] border border-gray-800 rounded-xl 
          text-white placeholder-gray-600
          focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent
          transition-all duration-200
          ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
        `}
      />
    </div>
  </div>
);

const FormSelect = ({ label, icon: Icon, options, ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-300">
      {label} {props.required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon size={18} className="text-black" />
        </div>
      )}
      <select
        {...props}
        className={`
          w-full bg-[#1a1a1a] border border-gray-800 rounded-xl 
          text-white placeholder-gray-600
          focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent
          transition-all duration-200 appearance-none
          ${Icon ? 'pl-10' : 'pl-4'} pr-10 py-2.5
        `}
      >
        <option value="" className='text-white'>Select {label}</option>
        {options.map(option => (
          <option key={option._id} value={option._id} className='text-white'>
            {option.name}
          </option>
        ))}
      </select>
      <ChevronDown size={18} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
    </div>
  </div>
);

// Section Header Component
const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 pb-3 border-b border-gray-800">
    <div className="p-1.5 bg-gray-800 rounded-lg">
      <Icon size={18} className="text-gray-300" />
    </div>
    <h3 className="text-lg font-semibold text-white">{title}</h3>
  </div>
);

// Tag Button Component - Updated to handle multiple tag selection
const TagButton = ({ tag, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      px-4 py-2 rounded-xl text-sm font-medium
      transition-all duration-200 transform hover:scale-105
      ${isSelected
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 ring-1 ring-blue-500'
        : 'bg-[#1a1a1a] text-gray-400 hover:bg-gray-800 hover:text-gray-300 border border-gray-800'
      }
    `}
  >
    {tag.name}
    {isSelected && (
      <span className="ml-2 inline-flex">
        <Check size={14} />
      </span>
    )}
  </button>
);

// Feature Card Component
const FeatureCard = ({ feature, index, onUpdate, onRemove }) => (
  <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] border border-gray-800 rounded-xl group hover:border-gray-700 transition-all">
    <div className="flex-1">
      <input
        type="text"
        value={feature.name}
        onChange={(e) => onUpdate(index, 'name', e.target.value)}
        className="w-full px-3 py-2 bg-[#252525] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
        placeholder="Feature name (e.g., Pool, Garage, Garden)"
      />
    </div>
    <button
      type="button"
      onClick={() => onRemove(index)}
      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
    >
      <Trash2 size={18} />
    </button>
  </div>
);

// Image Card Component - Updated for simplified schema
const ImageCard = ({ image, index, total, onUpdate, onRemove, onMove, onSetPrimary }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (image.url) {
      setImageUrl(image.url);
    } else if (image.preview) {
      setImageUrl(image.preview);
    }
  }, [image]);

  return (
    <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] border border-gray-800 rounded-xl group hover:border-gray-700 transition-all">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onMove(index, -1)}
          disabled={index === 0}
          className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronUp size={16} />
        </button>
        <button
          type="button"
          onClick={() => onMove(index, 1)}
          disabled={index === total - 1}
          className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="w-12 h-12 bg-[#252525] rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={image.alt || 'Property image'}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon size={20} className="text-gray-600" />
        )}
      </div>

      <div className="flex-1">
        <input
          type="text"
          value={image.alt || ''}
          onChange={(e) => onUpdate(index, 'alt', e.target.value)}
          className="w-full px-3 py-2 bg-[#252525] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Alt text for image"
        />
      </div>

      <button
        type="button"
        onClick={() => onSetPrimary(index)}
        className={`
          px-3 py-1.5 rounded-lg text-xs font-medium transition-all
          ${image.isPrimary
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
            : 'bg-[#252525] text-gray-400 hover:bg-gray-700 border border-gray-700'
          }
        `}
      >
        {image.isPrimary ? 'Primary' : 'Set Primary'}
      </button>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

// File Upload Area Component
const FileUploadArea = ({ onFilesSelected, isUploading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    onFilesSelected(files);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center transition-all
        ${isDragging
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-gray-700 hover:border-gray-600 bg-[#1a1a1a]'
        }
      `}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />

      <div className="space-y-3">
        {isUploading ? (
          <>
            <Loader2 size={40} className="mx-auto text-blue-500 animate-spin" />
            <p className="text-gray-400">Uploading images...</p>
          </>
        ) : (
          <>
            <Upload size={40} className="mx-auto text-gray-600" />
            <div>
              <p className="text-gray-300 font-medium">Drop images here or click to upload</p>
              <p className="text-sm text-gray-500 mt-1">Supports: JPG, PNG, GIF, WebP (up to 10MB each)</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function PropertyForm({
  property,
  propertyTypes,
  statuses,
  tags,
  action,
  buttonText,
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    agentName: '',
    agentPhone: '',
    agentEmail: '',
    area: '',
    NoOFCheck: '',
    RentalPeriod: '',
    statusId: '',
    propertyTypeId: '',
    tagIds: [], // Changed from tagId to tagIds array
    images: [],
    features: [],
    isFeatured: false,
    isPublished: true,
    expiresAt: '',
    mapLink: '',
  });

  const [selectedTags, setSelectedTags] = useState([]); // Changed to array
  const [newFeatureName, setNewFeatureName] = useState('');

  // Group tags by category
  const tagsByCategory = tags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {});

  // Process existing property images
  useEffect(() => {
    if (property) {
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

      // Get tag IDs
      const tagIds = property.tagIds || (property.tagId ? [property.tagId] : []);

      // Find selected tags
      const selected = tags.filter(tag => tagIds.includes(tag._id));

      setFormData({
        title: property.title || '',
        description: property.description || '',
        price: property.price?.toString() || '',
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zipCode: property.zipCode || '',
        mapLink: property.mapLink || '',
        agentName: property.agentName || '',
        agentPhone: property.agentPhone || '',
        agentEmail: property.agentEmail || '',
        area: property.area?.toString() || '',
        NoOFCheck: property.NoOFCheck || '',
        RentalPeriod: property.RentalPeriod || '',
        statusId: property.statusId || '',
        propertyTypeId: property.propertyTypeId || '',
        tagIds: tagIds,
        images: processedImages,
        features: property.features || [],
        isFeatured: property.isFeatured || false,
        isPublished: property.isPublished !== false,
        expiresAt: property.expiresAt ? property.expiresAt.split('T')[0] : '',
      });

      setSelectedTags(selected);
    } else {
      // Set default status for new property
      const defaultStatus = statuses.find(s => s.isDefault);
      setFormData(prev => ({
        ...prev,
        statusId: defaultStatus?._id || '',
      }));
    }
  }, [property, statuses, tags]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.statusId) newErrors.statusId = 'Status is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (formData.price && isNaN(parseFloat(formData.price))) newErrors.price = 'Price must be a number';
    if (formData.price && parseFloat(formData.price) < 0) newErrors.price = 'Price cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setActiveTab('basic');
      return;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();

      // Add slug
      const slug = property?.slug || generateSlug(formData.title);
      submitData.append('slug', slug);

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          // Handle images separately
          const existingImages = [];
          const newFiles = [];

          value.forEach((image, index) => {
            if (image.file) {
              // New file upload
              newFiles.push({
                file: image.file,
                alt: image.alt || formData.title,
                isPrimary: image.isPrimary,
                sortOrder: image.sortOrder || index
              });
            } else {
              // Existing image
              existingImages.push({
                url: image.url,
                thumbnailUrl: image.thumbnailUrl,
                alt: image.alt,
                isPrimary: image.isPrimary,
                sortOrder: image.sortOrder || index
              });
            }
          });

          // Add existing images as JSON
          submitData.append('images', JSON.stringify(existingImages));

          // Add new files
          newFiles.forEach((fileData, index) => {
            submitData.append('new_images', fileData.file);
            submitData.append(`new_image_alts[${index}]`, fileData.alt);
            submitData.append(`new_image_isPrimary[${index}]`, fileData.isPrimary ? 'true' : 'false');
          });

        } else if (key === 'features') {
          submitData.append(key, JSON.stringify(value));
        } else if (key === 'tagIds') {
          submitData.append(key, JSON.stringify(value));
        } else {
          submitData.append(key, value?.toString() || '');
        }
      });

      let result;
      if (property) {
        result = await action(property._id, submitData);
      } else {
        result = await action(submitData);
      }

      if (result) {
        if (result.error) {
          throw new Error(result.error);
        }

        if (result.redirect) {
          router.push(result.redirect);
        } else if (result.success) {
          router.push('/admin/properties');
        }
      }

    } catch (error) {
      // Don't show alert for redirect errors
      if (error.message?.includes('NEXT_REDIRECT')) {
        return;
      }

      console.error('Error saving property:', error);
      alert(error.message || 'Error saving property');
    } finally {
      setIsLoading(false);
    }
  };

  // Updated tag toggle to handle multiple tags
  const handleTagToggle = (tag) => {
    let newTagIds;
    let newSelectedTags;

    if (selectedTags.some(t => t._id === tag._id)) {
      // Remove tag
      newTagIds = formData.tagIds.filter(id => id !== tag._id);
      newSelectedTags = selectedTags.filter(t => t._id !== tag._id);
    } else {
      // Add tag
      newTagIds = [...formData.tagIds, tag._id];
      newSelectedTags = [...selectedTags, tag];
    }

    setFormData({ ...formData, tagIds: newTagIds });
    setSelectedTags(newSelectedTags);
  };

  const handleFileUpload = async (files) => {
    setIsUploading(true);

    try {
      const newImages = await Promise.all(files.map(async (file, index) => {
        const preview = URL.createObjectURL(file);

        return {
          id: `new-${Date.now()}-${index}-${Math.random()}`,
          file,
          preview,
          alt: '',
          isPrimary: formData.images.length === 0 && index === 0,
          sortOrder: formData.images.length + index,
        };
      }));

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Error processing files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const addFeature = () => {
    if (newFeatureName.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, {
          name: newFeatureName.trim(),
          id: Date.now()
        }]
      });
      setNewFeatureName('');
    }
  };

  const updateFeature = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index][field] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const updateImage = (index, field, value) => {
    const newImages = [...formData.images];
    newImages[index][field] = value;
    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);

    // Revoke object URL if it's a new image
    if (formData.images[index].preview) {
      URL.revokeObjectURL(formData.images[index].preview);
    }

    // If we removed the primary image, set the first one as primary
    if (formData.images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    setFormData({ ...formData, images: newImages });
  };

  const setPrimaryImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    });
  };

  const moveImage = (index, direction) => {
    const newImages = [...formData.images];
    const temp = newImages[index];
    newImages[index] = newImages[index + direction];
    newImages[index + direction] = temp;

    newImages.forEach((img, i) => {
      img.sortOrder = i;
    });

    setFormData({ ...formData, images: newImages });
  };

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      formData.images.forEach(image => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, []);

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Home },
    { id: 'location', label: 'Location', icon: MapPin },
    // { id: 'tags', label: 'Tags', icon: Tag },
    { id: 'features', label: 'Features', icon: Check },
    { id: 'images', label: 'Images', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-2xl border border-gray-800">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-600 border-t-white"></div>
            <p className="text-gray-400 mt-4">Saving property...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-800">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/properties"
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {property ? 'Edit Property' : 'Add New Property'}
                </h1>
                <p className="text-sm text-gray-500">
                  {property ? 'Update property details' : 'Create a new property listing'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/properties"
                className="px-4 py-2 border border-gray-700 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                form="property-form"
                disabled={isLoading}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:hover:bg-gray-800"
              >
                {isLoading ? 'Saving...' : buttonText}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                  transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }
                `}
              >
                <tab.icon size={16} />
                {tab.label}
                {index < tabs.length - 1 && (
                  <ChevronRight size={16} className="text-gray-600 ml-2 hidden sm:block" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <form id="property-form" onSubmit={handleSubmit} className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Basic Information */}
          {activeTab === 'basic' && (
            <div className="space-y-6 animate-fadeIn">
              <SectionHeader title="Basic Information" icon={Home} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <FormInput
                    label="Title"
                    icon={Home}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    error={errors.title}
                    placeholder="e.g., Luxury Apartment in Downtown"
                  />
                </div>

                <div className="lg:col-span-2">
                  <FormTextarea
                    label="Description"
                    icon={Home}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={10}
                    placeholder="Describe the property, its unique features, and selling points..."
                  />
                </div>

                <FormInput
                  label="Price"
                  icon={DollarSign}
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  error={errors.price}
                  placeholder="0.00"
                />

                <FormSelect
                  label="Status"
                  icon={Eye}
                  value={formData.statusId}
                  onChange={(e) => setFormData({ ...formData, statusId: e.target.value })}
                  options={statuses}
                  required
                  error={errors.statusId}
                />

                <FormSelect
                  label="Property Type"
                  icon={Home}
                  value={formData.propertyTypeId}
                  onChange={(e) => setFormData({ ...formData, propertyTypeId: e.target.value })}
                  options={propertyTypes}
                />

                <FormInput
                  label="Area (sqft)"
                  icon={Ruler}
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="0"
                />
                <FormInput
                  label="No Of Check"
                  icon={List}
                  value={formData.NoOFCheck}
                  onChange={(e) => setFormData({ ...formData, NoOFCheck: e.target.value })}
                  placeholder="No Of Check"
                />
                <FormInput
                  label="Rental Period"
                  icon={HomeIcon}
                  value={formData.RentalPeriod}
                  onChange={(e) => setFormData({ ...formData, RentalPeriod: e.target.value })}
                  placeholder="Rental Period"
                />
              </div>
              <div className="space-y-6 animate-fadeIn">
                <SectionHeader title="Tags" icon={Tag} />

                <div className="space-y-6">
                  {Object.entries(tagsByCategory).map(([category, categoryTags]) => (
                    <div key={category} className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {categoryTags.map(tag => (
                          <TagButton
                            key={tag._id}
                            tag={tag}
                            isSelected={selectedTags.some(t => t._id === tag._id)}
                            onClick={() => handleTagToggle(tag)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedTags.length > 0 && (
                  <div className="mt-6 p-4 bg-[#1a1a1a] rounded-xl border border-gray-800">
                    <p className="text-sm text-gray-400 mb-2">Selected Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map(tag => (
                        <span
                          key={tag._id}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"
                        >
                          {tag.name}
                          <button
                            type="button"
                            onClick={() => handleTagToggle(tag)}
                            className="hover:bg-blue-700 rounded p-0.5"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Settings */}
              {/* <div className="mt-8 p-6 bg-[#1a1a1a] rounded-xl border border-gray-800">
                <h4 className="text-md font-medium text-gray-300 mb-4">Additional Settings</h4>
                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-700 bg-[#1a1a1a] text-blue-600"
                    />
                    <span className="flex items-center gap-2">
                      <Star size={16} className={formData.isFeatured ? 'text-yellow-500' : 'text-gray-600'} />
                      Featured Property
                    </span>
                  </label>

                  <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-700 bg-[#1a1a1a] text-green-600"
                    />
                    <span className="flex items-center gap-2">
                      <Eye size={16} className={formData.isPublished ? 'text-green-500' : 'text-gray-600'} />
                      Published
                    </span>
                  </label>

                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-gray-600" />
                    <input
                      type="date"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      className="px-3 py-2 bg-[#252525] border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div> */}
            </div>
          )}

          {/* Location */}
          {activeTab === 'location' && (
            <div className="space-y-6 animate-fadeIn">
              <SectionHeader title="Location" icon={MapPin} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <FormInput
                    label="Address"
                    icon={MapPin}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address"
                  />
                </div>

                <FormInput
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                />

                {/* <FormInput
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                />

                <FormInput
                  label="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="ZIP Code"
                /> */}

                <FormInput
                  label="Map Link"
                  value={formData.mapLink}
                  onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
                  placeholder="Google Maps URL"
                />
              </div>

              {/* Agent Information */}
              <div className="mt-8">
                <h4 className="text-md font-medium text-gray-300 mb-4">Agent Information</h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <FormInput
                    label="Agent Name"
                    icon={User}
                    value={formData.agentName}
                    onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                    placeholder="Full name"
                  />
                  <FormInput
                    label="Agent Phone"
                    icon={Phone}
                    value={formData.agentPhone}
                    onChange={(e) => setFormData({ ...formData, agentPhone: e.target.value })}
                    placeholder="Phone number"
                  />
                  <FormInput
                    label="Agent Email"
                    icon={Mail}
                    type="email"
                    value={formData.agentEmail}
                    onChange={(e) => setFormData({ ...formData, agentEmail: e.target.value })}
                    placeholder="Email address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tags - Updated for multiple selection */}

          {/* Features */}
          {activeTab === 'features' && (
            <div className="space-y-6 animate-fadeIn">
              <SectionHeader title="Features" icon={Check} />

              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <FeatureCard
                    key={feature.id || index}
                    feature={feature}
                    index={index}
                    onUpdate={updateFeature}
                    onRemove={removeFeature}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl border border-gray-800">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newFeatureName}
                    onChange={(e) => setNewFeatureName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    className="w-full px-3 py-2 bg-[#252525] border border-gray-700 rounded-lg text-white"
                    placeholder="Enter feature name"
                  />
                </div>
                <button
                  type="button"
                  onClick={addFeature}
                  disabled={!newFeatureName.trim()}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Feature
                </button>
              </div>

              {/* Feature suggestions */}
              {/* <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Suggested features:</p>
                <div className="flex flex-wrap gap-2">
                  {['Pool', 'Garage', 'Garden', 'Balcony', 'Fireplace', 'Central AC', 'Furnished', 'Gym', 'Parking', 'Storage'].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setNewFeatureName(suggestion);
                      }}
                      className="px-3 py-1 bg-[#252525] text-gray-400 rounded-lg text-sm hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div> */}
            </div>
          )}

          {/* Images - Updated for simplified schema */}
          {activeTab === 'images' && (
            <div className="space-y-6 animate-fadeIn">
              <SectionHeader title="Images" icon={ImageIcon} />

              <FileUploadArea
                onFilesSelected={handleFileUpload}
                isUploading={isUploading}
              />

              {formData.images.length > 0 && (
                <>
                  <div className="space-y-3 mt-6">
                    <h4 className="text-sm font-medium text-gray-400">Uploaded Images</h4>
                    {formData.images.map((image, index) => (
                      <ImageCard
                        key={image.id || index}
                        image={image}
                        index={index}
                        total={formData.images.length}
                        onUpdate={updateImage}
                        onRemove={removeImage}
                        onMove={moveImage}
                        onSetPrimary={setPrimaryImage}
                      />
                    ))}
                  </div>

                  <div className="mt-8">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Preview</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {formData.images.map((image, index) => {
                        let imageSrc = null;

                        if (image.url) {
                          imageSrc = image.url;
                        } else if (image.preview) {
                          imageSrc = image.preview;
                        }

                        return (
                          <div
                            key={image.id || index}
                            className={`
                              relative aspect-square rounded-lg overflow-hidden border-2
                              ${image.isPrimary ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-800'}
                            `}
                          >
                            {imageSrc ? (
                              <img
                                src={imageSrc}
                                alt={image.alt || 'Property image'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                                <ImageIcon size={24} className="text-gray-700" />
                              </div>
                            )}
                            {image.isPrimary && (
                              <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-lg shadow-lg">
                                Primary
                              </div>
                            )}
                            {image.file && (
                              <div className="absolute bottom-2 right-2 px-2 py-1 bg-green-600 text-white text-xs rounded-lg">
                                New
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </form>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}