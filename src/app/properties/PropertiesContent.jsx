"use client";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Mail, 
  MessageCircle, 
  MapPin, 
  Home, 
  Star, 
  Search,
  X,
  ChevronDown,
  Tag
} from 'lucide-react';
import Image from 'next/image';
import * as LucideIcons from 'lucide-react';

// Dynamically resolve a Lucide icon by name string
function LucideIcon({ name, size = 14, className = '' }) {
  if (!name) return null;

  const pascalName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  const Icon = LucideIcons[pascalName];
  if (!Icon) return null;

  return <Icon size={size} className={className} />;
}

export default function PropertiesContent({
  initialProperties = [],
  propertyTypes = [],
  statuses = [],
  tags = []
}) {
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState(initialProperties);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const router = useRouter();

  // Read filters from URL on initial load and when URL changes
  useEffect(() => {
    const typeParam = searchParams.get('type');
    const statusParam = searchParams.get('status');
    const searchParam = searchParams.get('search');
    const tagsParam = searchParams.get('tags');

    if (typeParam) {
      setSelectedType(typeParam);
    } else {
      setSelectedType('all');
    }

    if (statusParam) {
      setSelectedStatus(statusParam);
    } else {
      setSelectedStatus('all');
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery('');
    }

    if (tagsParam) {
      setSelectedTags(tagsParam.split(','));
    } else {
      setSelectedTags([]);
    }
  }, [searchParams]);

  // Get unique categories from property types or use default
  const categories = useMemo(() => {
    if (propertyTypes && propertyTypes.length > 0) {
      return ['all', ...propertyTypes.map(type => type.name)];
    }
    return ['all', 'Residential', 'Commercial', 'Industrial', 'Retail', 'Luxury'];
  }, [propertyTypes]);

  // Filter properties based on selected filters
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        property.title?.toLowerCase().includes(searchLower) ||
        property.fullAddress?.toLowerCase().includes(searchLower) ||
        property.city?.toLowerCase().includes(searchLower) ||
        property.description?.toLowerCase().includes(searchLower);

      // Type filter
      const matchesType = selectedType === 'all' ||
        (property.propertyType && property.propertyType.name === selectedType) ||
        property.category === selectedType;

      // Status filter
      const matchesStatus = selectedStatus === 'all' ||
        (property.status && property.status._id === selectedStatus);

      // Tags filter
      const matchesTags = selectedTags.length === 0 ||
        (property.tags && property.tags.some(tag => selectedTags.includes(tag._id)));

      return matchesSearch && matchesType && matchesStatus && matchesTags;
    });
  }, [properties, selectedType, selectedStatus, selectedTags, searchQuery]);

  // Update URL when filters change
  const updateFilters = (type, status, search, tags) => {
    const url = new URL(window.location);

    if (type && type !== 'all') {
      url.searchParams.set('type', type);
    } else {
      url.searchParams.delete('type');
    }

    if (status && status !== 'all') {
      url.searchParams.set('status', status);
    } else {
      url.searchParams.delete('status');
    }

    if (search) {
      url.searchParams.set('search', search);
    } else {
      url.searchParams.delete('search');
    }

    if (tags && tags.length > 0) {
      url.searchParams.set('tags', tags.join(','));
    } else {
      url.searchParams.delete('tags');
    }

    window.history.pushState({}, '', url);
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    updateFilters(
      type === 'all' ? null : type,
      selectedStatus === 'all' ? null : selectedStatus,
      searchQuery || null,
      selectedTags
    );
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    updateFilters(
      selectedType === 'all' ? null : selectedType,
      status === 'all' ? null : status,
      searchQuery || null,
      selectedTags
    );
  };

  const handleSearchChange = (e) => {
    const search = e.target.value;
    setSearchQuery(search);
    updateFilters(
      selectedType === 'all' ? null : selectedType,
      selectedStatus === 'all' ? null : selectedStatus,
      search || null,
      selectedTags
    );
  };

  const handleTagToggle = (tagId) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newTags);
    updateFilters(
      selectedType === 'all' ? null : selectedType,
      selectedStatus === 'all' ? null : selectedStatus,
      searchQuery || null,
      newTags
    );
  };

  const clearFilters = () => {
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedTags([]);
    setSearchQuery('');
    const url = new URL(window.location);
    url.searchParams.delete('type');
    url.searchParams.delete('status');
    url.searchParams.delete('search');
    url.searchParams.delete('tags');
    window.history.pushState({}, '', url);
  };

  const removeTag = (tagId) => {
    const newTags = selectedTags.filter(id => id !== tagId);
    setSelectedTags(newTags);
    updateFilters(
      selectedType === 'all' ? null : selectedType,
      selectedStatus === 'all' ? null : selectedStatus,
      searchQuery || null,
      newTags
    );
  };

  const formatPrice = (price) => {
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
    return colorMap[status.color] || 'bg-gray-900 text-gray-300';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        when: "afterChildren",
        staggerChildren: 0.02,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  // Get selected tag objects
  const selectedTagObjects = tags.filter(tag => selectedTags.includes(tag._id));

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
              {selectedType === 'all' ? 'ALL PROPERTIES' : `${selectedType.toUpperCase()} PROPERTIES`}
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {selectedType === 'all'
                ? 'Discover our complete portfolio of premium real estate opportunities across Dubai'
                : `Explore our exclusive collection of ${selectedType.toLowerCase()} properties in prime locations`}
            </p>
          </motion.div>
        </div>
      </section>

      <div className='p-10'>
        {/* Filters Section */}
        <section className="py-8 border-t border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col gap-4">
              {/* Main Filters Row */}
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Type Dropdown */}
                <div className="w-full lg:w-auto">
                  <select
                    value={selectedType}
                    onChange={handleTypeChange}
                    className="w-full lg:w-48 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-gray-500 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="all">All Types</option>
                    {categories.filter(c => c !== 'all').map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Dropdown */}
                {statuses && statuses.length > 0 && (
                  <div className="w-full lg:w-auto">
                    <select
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      className="w-full lg:w-48 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-gray-500 appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="all">All Statuses</option>
                      {statuses.map(status => (
                        <option key={status._id} value={status._id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Tags Dropdown */}
                {tags && tags.length > 0 && (
                  <div className="relative w-full lg:w-auto">
                    <button
                      onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                      className="w-full lg:w-48 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Tag size={16} />
                        <span>Filter by Tags</span>
                      </div>
                      <ChevronDown size={16} className={`transform transition-transform ${isTagDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Tags Dropdown Menu */}
                    <AnimatePresence>
                      {isTagDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-30"
                        >
                          <div className="p-2 max-h-60 overflow-y-auto">
                            {tags.map(tag => (
                              <label
                                key={tag._id}
                                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedTags.includes(tag._id)}
                                  onChange={() => handleTagToggle(tag._id)}
                                  className="rounded border-gray-600 bg-gray-700 text-white focus:ring-0"
                                />
                                {tag.icon && <LucideIcon name={tag.icon} size={14} />}
                                <span className="text-sm text-gray-300">{tag.label}</span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Search Bar */}
                <div className="relative flex-1 w-full lg:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearchChange({ target: { value: '' } })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Active Filters */}
              {(selectedTags.length > 0 || selectedType !== 'all' || selectedStatus !== 'all' || searchQuery) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap items-center gap-2"
                >
                  <span className="text-sm text-gray-400">Active filters:</span>
                  
                  {selectedType !== 'all' && (
                    <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 flex items-center gap-1">
                      Type: {selectedType}
                      <button onClick={() => handleTypeChange({ target: { value: 'all' } })}>
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {selectedStatus !== 'all' && (
                    <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 flex items-center gap-1">
                      Status: {statuses.find(s => s._id === selectedStatus)?.label}
                      <button onClick={() => handleStatusChange({ target: { value: 'all' } })}>
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {selectedTagObjects.map(tag => (
                    <span
                      key={tag._id}
                      className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 flex items-center gap-1"
                    >
                      {tag.icon && <LucideIcon name={tag.icon} size={10} />}
                      {tag.label}
                      <button onClick={() => removeTag(tag._id)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}

                  {searchQuery && (
                    <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 flex items-center gap-1">
                      Search: "{searchQuery}"
                      <button onClick={() => handleSearchChange({ target: { value: '' } })}>
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  <button
                    onClick={clearFilters}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-xs text-white transition-colors"
                  >
                    Clear all
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Results Count */}
        <div className="py-4 text-gray-400">
          Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
        </div>

        {/* Properties Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedType + selectedStatus + selectedTags.join(',') + searchQuery}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProperties.map((property) => (
                  <motion.div
                    key={property._id}
                    variants={itemVariants}
                    layout
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.2 }
                    }}
                    className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(`/properties/${property._id}`)}
                  >
                    {/* Image Section */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <Image
                          src={(() => {
                            const primaryImage = property.images.find(img => img.isPrimary === true) || property.images[0];
                            return primaryImage.webp?.medium?.url || primaryImage.webp?.original?.url || primaryImage.original?.url;
                          })()}
                          alt={property.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <Home size={48} className="text-gray-700" />
                        </div>
                      )}

                      {/* Status Badge */}
                      {property.status && (
                        <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(property.status)}`}>
                          {property.status.icon && (
                            <LucideIcon name={property.status.icon} size={12} />
                          )}
                          {property.status.label}
                        </div>
                      )}

                      {/* Price Tag */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-black text-white px-3 py-1 text-sm font-bold rounded-full">
                          {formatPrice(property.price)}
                        </span>
                      </div>

                      {/* Featured Badge */}
                      {property.isFeatured && (
                        <div className="absolute bottom-4 left-4 z-10">
                          <span className="bg-yellow-500/90 text-black px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1">
                            <Star size={12} />
                            Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details Section */}
                    <div className="p-6">
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          {property.propertyType && (
                            <span className="text-sm text-gray-400 font-medium flex items-center gap-1">
                              {property.propertyType.icon && (
                                <LucideIcon name={property.propertyType.icon} size={14} />
                              )}
                              {property.propertyType.name}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white mt-1 line-clamp-1">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-gray-400 mt-2">
                          <MapPin className="w-4 h-4 mr-1 shrink-0" />
                          <span className="text-sm line-clamp-1">
                            {property.fullAddress || property.address || 'No address'}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {property.description}
                      </p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-gray-900/50 rounded-lg p-2 text-center">
                          <span className="text-gray-500 text-xs">Beds</span>
                          <div className="text-white font-medium text-sm">{property.bedrooms || 0}</div>
                        </div>
                        <div className="bg-gray-900/50 rounded-lg p-2 text-center">
                          <span className="text-gray-500 text-xs">Baths</span>
                          <div className="text-white font-medium text-sm">{property.bathrooms || 0}</div>
                        </div>
                        <div className="bg-gray-900/50 rounded-lg p-2 text-center">
                          <span className="text-gray-500 text-xs">Area</span>
                          <div className="text-white font-medium text-sm">{property.area || 0} sqft</div>
                        </div>
                      </div>

                      {/* Tags */}
                      {property.tags && property.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {property.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag._id}
                              className="px-2 py-1 bg-gray-900/50 rounded-lg text-xs text-gray-400 flex items-center gap-1"
                            >
                              {tag.icon && (
                                <LucideIcon name={tag.icon} size={11} className="shrink-0" />
                              )}
                              {tag.label}
                            </span>
                          ))}
                          {property.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-900/50 rounded-lg text-xs text-gray-400">
                              +{property.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link href={`/properties/${property._id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                          <motion.button
                            className="w-full bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            View Details
                          </motion.button>
                        </Link>

                        {/* Email Button */}
                        <motion.a
                          href={`mailto:info@example.com?subject=Inquiry: ${property.title}&body=I'm interested in ${property.title} located at ${property.fullAddress || property.address}`}
                          className="px-3 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          title="Send Email"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail size={16} />
                        </motion.a>

                        {/* WhatsApp Button */}
                        <motion.a
                          href={`https://wa.me/971XXXXXXXXX?text=I'm%20interested%20in%20${encodeURIComponent(property.title)}%20at%20${encodeURIComponent(property.fullAddress || property.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          title="Send WhatsApp Message"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageCircle size={16} />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* No Results */}
            {filteredProperties.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <Home size={48} className="mx-auto text-gray-700 mb-3" />
                <p className="text-gray-400 text-xl">No properties found matching your criteria</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t border-gray-800 bg-gray-900/30">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Contact our team for personalized property recommendations tailored to your specific requirements.
              </p>
              <motion.a
                href="/contact"
                className="inline-block px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}