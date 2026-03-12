'use client';

import { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  MapPin,
  Home,
  DollarSign,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Swal from 'sweetalert2';

function LucideIcon({ name, size = 14, className = '' }) {
  if (!name) return null;

  // Handle different icon name formats
  const pascalName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
    .replace(/[^a-zA-Z]/g, ''); // Remove any non-alphabetic characters

  const Icon = LucideIcons[pascalName] || LucideIcons[pascalName.replace(/icon$/i, '')];

  if (!Icon) {
    console.warn(`Icon not found: ${name} (${pascalName})`);
    return null;
  }

  return <Icon size={size} className={className} />;
}

export default function PropertiesClient({
  initialProperties,
  propertyTypes,
  statuses,
  tags,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleFeature,
  togglePublish,
}) {
  const [properties, setProperties] = useState(initialProperties || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  /* ── Tag toggle ── */
  const toggleTag = (id) =>
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );

  /* ── Filters ── */
  const filteredProperties = useMemo(() =>
    properties.filter(property => {
      if (!property) return false;

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        (property.title || '').toLowerCase().includes(searchLower) ||
        (property.address || '').toLowerCase().includes(searchLower) ||
        (property.city || '').toLowerCase().includes(searchLower);

      const matchesStatus = selectedStatus === 'all' || property.statusId === selectedStatus;
      const matchesType = selectedType === 'all' || property.propertyTypeId === selectedType;

      // Handle tags filtering - tags can be objects or IDs
      const matchesTags = selectedTags.length === 0 || (
        property.tags && property.tags.some((tag) => {
          // If tag is an object with _id, use that, otherwise use the tag itself
          const tagId = tag?._id || tag;
          return selectedTags.includes(tagId);
        })
      );

      return matchesSearch && matchesStatus && matchesType && matchesTags;
    }),
    [properties, searchTerm, selectedStatus, selectedType, selectedTags]
  );

  const hasFilters = searchTerm || selectedStatus !== 'all' || selectedType !== 'all' || selectedTags.length > 0;

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedType('all');
    setSelectedTags([]);
  };

  /* ── Handlers ── */
  const handleOpenModal = (property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      let result;
      if (editingProperty) {
        result = await updateProperty(editingProperty._id, formData);
      } else {
        result = await createProperty(formData);
      }
      if (result.error) throw new Error(result.error);
      if (editingProperty) {
        setProperties(prev => prev.map(p => p._id === editingProperty._id ? result.data : p));
      } else {
        setProperties(prev => [result.data, ...prev]);
      }
      handleCloseModal();
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Property ${editingProperty ? 'updated' : 'created'} successfully.`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error saving property:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || `Failed to ${editingProperty ? 'update' : 'create'} property.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // Find property for confirmation message
    const property = properties.find(p => p._id === id);
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: property?.title 
        ? `You are about to delete "${property.title}". This action cannot be undone.`
        : 'You are about to delete this property. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      background: '#111111',
      color: '#ffffff',
      customClass: {
        popup: 'border border-gray-800 rounded-xl',
        title: 'text-white text-lg font-semibold',
        htmlContainer: 'text-gray-300',
        confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors',
        cancelButton: 'bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors'
      }
    });

    if (!result.isConfirmed) return;

    setIsLoading(true);
    try {
      const deleteResult = await deleteProperty(id);
      if (deleteResult.error) throw new Error(deleteResult.error);
      
      setProperties(prev => prev.filter(p => p._id !== id));
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Property has been deleted successfully.',
        timer: 2000,
        showConfirmButton: false,
        background: '#111111',
        color: '#ffffff',
        customClass: {
          popup: 'border border-gray-800 rounded-xl'
        }
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to delete property.',
        background: '#111111',
        color: '#ffffff',
        customClass: {
          popup: 'border border-gray-800 rounded-xl'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFeature = async (id) => {
    try {
      const result = await toggleFeature(id);
      if (result.error) throw new Error(result.error);
      setProperties(prev => prev.map(p => p._id === id ? { ...p, isFeatured: result.isFeatured } : p));
      
      // Optional: Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Property ${result.isFeatured ? 'featured' : 'unfeatured'} successfully.`,
        timer: 1500,
        showConfirmButton: false,
        background: '#111111',
        color: '#ffffff',
        customClass: {
          popup: 'border border-gray-800 rounded-xl'
        }
      });
    } catch (error) {
      console.error('Error toggling feature:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to toggle feature status.',
        background: '#111111',
        color: '#ffffff',
        customClass: {
          popup: 'border border-gray-800 rounded-xl'
        }
      });
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const result = await togglePublish(id);
      if (result.error) throw new Error(result.error);
      setProperties(prev => prev.map(p => p._id === id ? { ...p, isPublished: result.isPublished } : p));
      
      // Optional: Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Property ${result.isPublished ? 'published' : 'unpublished'} successfully.`,
        timer: 1500,
        showConfirmButton: false,
        background: '#111111',
        color: '#ffffff',
        customClass: {
          popup: 'border border-gray-800 rounded-xl'
        }
      });
    } catch (error) {
      console.error('Error toggling publish:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to toggle publish status.',
        background: '#111111',
        color: '#ffffff',
        customClass: {
          popup: 'border border-gray-800 rounded-xl'
        }
      });
    }
  };

  const handleImageError = (propertyId) => {
    setImageErrors(prev => ({ ...prev, [propertyId]: true }));
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-900 text-gray-300';

    const colorMap = {
      gray: 'bg-gray-900 text-gray-300',
      red: 'bg-red-900 text-red-300',
      green: 'bg-green-900 text-green-300',
      blue: 'bg-blue-900 text-blue-300',
      yellow: 'bg-yellow-900 text-yellow-300',
      purple: 'bg-purple-900 text-purple-300',
      orange: 'bg-orange-900 text-orange-300',
    };

    // Handle color from status object or string
    const colorKey = status.color?.toLowerCase() || status.toLowerCase?.() || 'gray';
    return colorMap[colorKey] || 'bg-gray-900 text-gray-300';
  };

  // Function to get the best available image URL
  const getImageUrl = (image) => {
    if (!image) return null;
    // Try to get the best quality image available
    return image.url || image.thumbnailUrl || null;
  };

  // Function to get primary image or first image
  const getPrimaryImage = (images) => {
    if (!images || images.length === 0) return null;
    const primary = images.find(img => img.isPrimary === true);
    return primary || images[0];
  };

  // Function to render features
  const renderFeatures = (features) => {
    if (!features || features.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mb-3">
        {features.slice(0, 3).map((feature, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-900 rounded-lg text-xs text-gray-400"
          >
            {typeof feature === 'string' ? feature : feature.name || 'Feature'}
          </span>
        ))}
        {features.length > 3 && (
          <span className="px-2 py-1 bg-gray-900 rounded-lg text-xs text-gray-400">
            +{features.length - 3}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen">

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#111111] p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Properties</h1>
        <p className="text-gray-400">Manage your property listings</p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#111111] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-700"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 bg-[#111111] border border-gray-800 rounded-lg text-gray-300 focus:outline-none focus:border-gray-700"
        >
          <option value="all">All Statuses</option>
          {statuses?.map(status => (
            <option key={status._id} value={status._id}>{status.name}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 bg-[#111111] border border-gray-800 rounded-lg text-gray-300 focus:outline-none focus:border-gray-700"
        >
          <option value="all">All Types</option>
          {propertyTypes?.map(type => (
            <option key={type._id} value={type._id}>{type.name}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
          >
            Clear Filters
          </button>
        )}

        <Link
          href="/admin/properties/create"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Add Property</span>
        </Link>
      </div>

      {/* TAG PILLS */}
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => {
            const active = selectedTags.includes(tag._id);
            const tagColor = tag.color || '#6B7280'; // Default gray if no color provided

            return (
              <button
                key={tag._id}
                onClick={() => toggleTag(tag._id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${active
                    ? 'text-white border-transparent'
                    : 'text-gray-300 hover:text-white'
                  }`}
                style={{
                  backgroundColor: active ? tagColor : 'transparent',
                  borderColor: active ? tagColor : tagColor,
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
                title={tag.name}
              >
                {tag.icon && <LucideIcon name={tag.icon} size={11} className="shrink-0" />}
                {active && <span className="text-xs">✓</span>}
                <span>{tag.name}</span>
              </button>
            );
          })}
        </div>
      )}
      {/* Results count */}
      <p className="text-gray-500 text-sm mb-4">
        Showing {filteredProperties.length} of {properties.length} properties
      </p>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => {
          const primaryImage = getPrimaryImage(property.images);
          const imageUrl = !imageErrors[property._id] ? getImageUrl(primaryImage) : null;

          return (
            <div
              key={property._id}
              className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
            >
              <div className="relative h-48 bg-gray-900">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={primaryImage?.alt || property.title || 'Property image'}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(property._id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={48} className="text-gray-700" />
                  </div>
                )}

                {/* Status Badge */}
                {property.status && (
                  <div
                    className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 text-white"
                    style={{ backgroundColor: property.status.color || '#6B7280' }}
                  >
                    {property.status.icon && <LucideIcon name={property.status.icon} size={12} />}
                    {property.status.name}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                  {property.title || 'Untitled Property'}
                </h3>

                <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                  <MapPin size={14} />
                  <span className="line-clamp-1">
                    {[property.address, property.city, property.state]
                      .filter(Boolean)
                      .join(', ') || 'No address provided'}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1 text-gray-300">
                    <DollarSign size={16} className="text-gray-500" />
                    <span className="font-semibold">{formatPrice(property.price)}</span>
                  </div>
                  {property.propertyType && (
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      {property.propertyType.icon ? (
                        <LucideIcon name={property.propertyType.icon} size={14} />
                      ) : (
                        <Home size={14} />
                      )}
                      <span>{property.propertyType.name}</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="mb-3">
                  {/* Area display (if available) */}
                  {property.area && (
                    <div className="bg-gray-900 rounded-lg p-2 text-center mb-2 inline-block mr-2">
                      <span className="text-gray-500 text-xs block">Area</span>
                      <div className="text-white font-medium text-sm">{property.area} sqft</div>
                    </div>
                  )}
                </div>

                {/* Tags — clickable to filter, active ones highlighted */}
                {property.tags && property.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {property.tags.slice(0, 3).map(tag => {
                      // Handle both object and string tags
                      const tagId = tag?._id || tag;
                      const tagName = tag?.name || (typeof tag === 'string' ? tag : 'Tag');
                      const tagIcon = tag?.icon;
                      const tagColor = tag?.color || '#6B7280'; // Default gray if no color provided
                      const active = selectedTags.includes(tagId);

                      return (
                        <button
                          key={tagId}
                          onClick={() => toggleTag(tagId)}
                          className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition-all duration-150 border ${active
                              ? 'text-white border-transparent'
                              : 'text-gray-300 hover:text-white'
                            }`}
                          style={{
                            backgroundColor: active ? tagColor : 'transparent',
                            borderColor: tagColor,
                            borderWidth: '1px',
                            borderStyle: 'solid'
                          }}
                          title={tagName}
                        >
                          {tagIcon && <LucideIcon name={tagIcon} size={11} className="shrink-0" />}
                          <span>{tagName}</span>
                        </button>
                      );
                    })}
                    {property.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-900 rounded-lg text-xs text-gray-400">
                        +{property.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Calendar size={12} />
                    <span>
                      {property.createdAt
                        ? new Date(property.createdAt).toLocaleDateString()
                        : 'No date'}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <Link
                      href={`/admin/properties/${property._id}/`}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                      title="View property"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/admin/properties/${property._id}/edit`}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                      title="Edit property"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(property._id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete property"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredProperties.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Home size={48} className="mx-auto text-gray-700 mb-3" />
            <p className="text-gray-500 mb-1">No properties found</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 underline hover:text-white transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}