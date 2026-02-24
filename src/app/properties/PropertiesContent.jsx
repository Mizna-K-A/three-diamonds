"use client";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, MessageCircle } from 'lucide-react';
import Image from 'next/image';

export default function PropertiesContent() {
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Read type from URL on initial load and when URL changes
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      // Format the type parameter to match category names
      const formattedType = typeParam.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      // Map to correct category if needed
      const categoryMap = {
        'Residential': 'Residential',
        'Commercial': 'Commercial',
        'Industrial': 'Industrial',
        'Luxury': 'Luxury',
        'New Developments': 'Residential', // Map to Residential category
      };

      setSelectedType(categoryMap[formattedType] || formattedType);
    } else {
      setSelectedType('All');
    }
  }, [searchParams]);

  const properties = [
    {
      id: 1,
      title: 'GOSHI WAREHOUSES CITY',
      type: 'Commercial Complex',
      category: 'Commercial',
      location: 'Al Quoz Industrial Area 3',
      description: 'Premium warehouse spaces for health centers, boutiques, galleries, and luxury showrooms.',
      specs: ['50,000 sq.ft.', '24/7 Security', 'Customizable Spaces', 'Prime Location'],
      badge: 'Featured',
      price: 'AED 2.5M',
      image: '/p1.jpg'
    },
    {
      id: 2,
      title: 'DUBAI HILLS VILLAS',
      type: 'Residential',
      category: 'Residential',
      location: 'Dubai Hills Estate',
      description: 'Luxury villas with premium amenities and breathtaking views.',
      specs: ['4-6 Bedrooms', 'Private Pool', 'Garden', 'Maid Room'],
      badge: 'New',
      price: 'AED 8.2M',
      image: '/p2.jpg'
    }
  ];

  const categories = ['All', 'Residential', 'Commercial', 'Industrial', 'Retail', 'Luxury'];

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesType = selectedType === 'All' || property.category === selectedType;
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [selectedType, searchQuery]);

  // Update URL when filter changes
  const handleTypeChange = (category) => {
    setSelectedType(category);

    // Update URL without page reload
    const url = new URL(window.location);
    if (category === 'All') {
      url.searchParams.delete('type');
    } else {
      // Convert category to URL-friendly format
      const typeParam = category.toLowerCase().replace(' ', '-');
      url.searchParams.set('type', typeParam);
    }
    window.history.pushState({}, '', url);
  };

  // Animation variants for faster transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05 // Faster stagger
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

  return (
    <>
      {/* Header is imported in the page wrapper, not here */}

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
              {selectedType === 'All' ? 'ALL PROPERTIES' : `${selectedType.toUpperCase()} PROPERTIES`}
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {selectedType === 'All'
                ? 'Discover our complete portfolio of premium real estate opportunities across Dubai'
                : `Explore our exclusive collection of ${selectedType.toLowerCase()} properties in prime locations`}
            </p>
          </motion.div>
        </div>
      </section>

      <div className='p-10'>
        {/* Filters Section */}
        <section className="py-8 border-t border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm top-0 z-20 p-5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Category Filters */}
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => handleTypeChange(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${selectedType === category
                      ? 'bg-white text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </motion.div>

              {/* Search Bar */}
              <motion.div
                className="w-full md:w-64"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedType + searchQuery}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProperties.map((property) => (
                  <motion.div
                    key={property.id}
                    variants={itemVariants}
                    layout
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.2 }
                    }}
                    className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all duration-300"
                    onClick={() => router.push(`/properties/${property.id}`)}                  >
                    {/* Image Section */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden">
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={property.id <= 2} // Only prioritize first 2 images
                      />

                      {/* Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-gray-900 text-gray-100 px-3 py-1 text-xs font-bold rounded-full border border-gray-600">
                          {property.badge}
                        </span>
                      </div>

                      {/* Price Tag */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-black text-white px-3 py-1 text-sm font-bold rounded-full">
                          {property.price}
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-5"
                      />
                    </div>

                    {/* Details Section */}
                    <div className="p-6">
                      <div className="mb-3">
                        <span className="text-sm text-gray-400 font-medium">{property.type}</span>
                        <h3 className="text-xl font-bold text-white mt-1">{property.title}</h3>
                        <div className="flex items-center text-gray-400 mt-2">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm">{property.location}</span>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {property.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {property.specs.slice(0, 4).map((spec, idx) => (
                          <div key={idx} className="text-xs text-gray-400 flex items-center">
                            <span className="text-gray-300 mr-1">✓</span>
                            <span className="truncate">{spec}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/properties/${property.id}`} className="flex-1">
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
                          href={`mailto:info@example.com?subject=Inquiry: ${property.title}&body=I'm interested in ${property.title} located at ${property.location}`}
                          className="px-3 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          title="Send Email"
                        >
                          <Mail />
                        </motion.a>

                        {/* WhatsApp Button */}
                        <motion.a
                          href={`https://wa.me/971XXXXXXXXX?text=I'm%20interested%20in%20${encodeURIComponent(property.title)}%20at%20${encodeURIComponent(property.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          title="Send WhatsApp Message"
                        >
                          <MessageCircle />
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
                <p className="text-gray-400 text-xl">No properties found matching your criteria</p>
                <button
                  onClick={() => {
                    setSelectedType('All');
                    setSearchQuery('');
                    // Clear URL params
                    const url = new URL(window.location);
                    url.searchParams.delete('type');
                    window.history.pushState({}, '', url);
                  }}
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