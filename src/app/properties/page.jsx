// app/properties/page.jsx
"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import Header from '../components/Header';

export default function PropertiesPage() {
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
      image: '🏢'
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
      image: '🏡'
    },
    {
      id: 3,
      title: 'BUSINESS BAY OFFICES',
      type: 'Commercial',
      category: 'Commercial',
      location: 'Business Bay',
      description: 'Modern office spaces in Dubai\'s central business district.',
      specs: ['Flexible Leases', 'Meeting Rooms', 'Parking', 'High-Speed Internet'],
      badge: 'Prime',
      price: 'AED 1.8M',
      image: '🏢'
    },
    {
      id: 4,
      title: 'AL QUOZ STUDIOS',
      type: 'Creative Spaces',
      category: 'Commercial',
      location: 'Al Quoz',
      description: 'Creative studios and photography spaces for artists and designers.',
      specs: ['Natural Light', 'High Ceilings', 'Storage', 'Event Space'],
      badge: 'Creative',
      price: 'AED 950K',
      image: '🎨'
    },
    {
      id: 5,
      title: 'PALM JUMEIRAH VILLA',
      type: 'Luxury Residential',
      category: 'Residential',
      location: 'Palm Jumeirah',
      description: 'Exclusive beachfront villa with private beach access.',
      specs: ['7 Bedrooms', 'Private Pool', 'Beach Access', 'Home Cinema'],
      badge: 'Luxury',
      price: 'AED 25M',
      image: '🏖️'
    },
    {
      id: 6,
      title: 'DIFC OFFICE TOWER',
      type: 'Grade A Office',
      category: 'Commercial',
      location: 'DIFC',
      description: 'Premium office space in the heart of Dubai\'s financial district.',
      specs: ['Floor-to-ceiling windows', 'VAV AC', '24/7 Access', 'Valet Parking'],
      badge: 'Premium',
      price: 'AED 3.2M',
      image: '🏛️'
    },
    {
      id: 7,
      title: 'DUBAI CREEK TOWER',
      type: 'Residential Apartment',
      category: 'Residential',
      location: 'Dubai Creek Harbour',
      description: 'Luxury apartments with iconic skyline views.',
      specs: ['1-3 Bedrooms', 'Balcony', 'Smart Home', 'Pool & Gym'],
      badge: 'New Launch',
      price: 'AED 1.2M',
      image: '🌊'
    },
    {
      id: 8,
      title: 'AL SERKAL AVENUE',
      type: 'Retail Space',
      category: 'Retail',
      location: 'Al Quoz',
      description: 'Prime retail spaces in a vibrant art and design district.',
      specs: ['Glass Frontage', 'High Footfall', 'Parking', 'Storage'],
      badge: 'Prime Location',
      price: 'AED 750K',
      image: '🛍️'
    }
  ];

  const categories = ['All', 'Residential', 'Commercial', 'Retail', 'Luxury'];

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesType = selectedType === 'All' || property.category === selectedType;
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [selectedType, searchQuery]);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
   <>
   <Header/>
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container-custom relative z-10 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
              ALL PROPERTIES
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover our complete portfolio of premium real estate opportunities across Dubai
            </p>
          </motion.div>
        </div>
      </section>

     <div className='p-10'>
         {/* Filters Section */}
      <section className="py-8 border-t border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm z-20 p-5">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filters */}
            <motion.div 
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedType(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedType === category
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
              transition={{ delay: 0.3 }}
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
        <div className="container-custom">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                variants={{
                  initial: { opacity: 0, y: 30 },
                  animate: { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.5,
                      delay: index * 0.1 
                    }
                  }
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.2 }
                }}
                className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center text-6xl"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {property.image}
                  </motion.div>
                  
                  {/* Badge */}
                  <motion.div
                    className="absolute top-4 left-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <span className="bg-gray-900 text-gray-100 px-3 py-1 text-xs font-bold rounded-full border border-gray-600">
                      {property.badge}
                    </span>
                  </motion.div>

                  {/* Price Tag */}
                  <motion.div
                    className="absolute top-4 right-4"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <span className="bg-black text-white px-3 py-1 text-sm font-bold rounded-full">
                      {property.price}
                    </span>
                  </motion.div>

                  {/* Hover Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                    <motion.button
                      className="flex-1 bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Details
                    </motion.button>
                    <motion.button
                      className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      📞
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredProperties.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-400 text-xl">No properties found matching your criteria</p>
              <button
                onClick={() => {
                  setSelectedType('All');
                  setSearchQuery('');
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
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Contact our team for personalized property recommendations tailored to your specific requirements.
            </p>
            <motion.a
              href="#contact"
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
    </main>
   </>
  );
}