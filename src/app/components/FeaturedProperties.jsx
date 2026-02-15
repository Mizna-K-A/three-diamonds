// components/FeaturedProperties.jsx
"use client";

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';


export default function FeaturedProperties() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.2 }); 

  const properties = [
    {
      id: 1,
      title: 'GOSHI WAREHOUSES CITY',
      type: 'Commercial Complex',
      location: 'Al Quoz Industrial Area 3',
      description: 'Premium warehouse spaces for health centers, boutiques, galleries, and luxury showrooms.',
      specs: ['50,000 sq.ft.', '24/7 Security', 'Customizable Spaces', 'Prime Location'],
      badge: 'Featured'
    },
    {
      id: 2,
      title: 'DUBAI HILLS VILLAS',
      type: 'Residential',
      location: 'Dubai Hills Estate',
      description: 'Luxury villas with premium amenities and breathtaking views.',
      specs: ['4-6 Bedrooms', 'Private Pool', 'Garden', 'Maid Room'],
      badge: 'New'
    },
    {
      id: 3,
      title: 'BUSINESS BAY OFFICES',
      type: 'Commercial',
      location: 'Business Bay',
      description: 'Modern office spaces in Dubai\'s central business district.',
      specs: ['Flexible Leases', 'Meeting Rooms', 'Parking', 'High-Speed Internet'],
      badge: 'Prime'
    },
    {
      id: 4,
      title: 'AL QUOZ STUDIOS',
      type: 'Creative Spaces',
      location: 'Al Quoz',
      description: 'Creative studios and photography spaces for artists and designers.',
      specs: ['Natural Light', 'High Ceilings', 'Storage', 'Event Space'],
      badge: 'Creative'
    }
  ];

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  // Header animations
  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  // Card animations - different for each card
  const getCardVariants = (index) => {
    const variants = [
      // Card 1: Slide from left with rotation
      {
        hidden: { opacity: 0, x: -100, rotateY: -15 },
        visible: {
          opacity: 1,
          x: 0,
          rotateY: 0,
          transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      },
      // Card 2: Slide from right with scale
      {
        hidden: { opacity: 0, x: 100, scale: 0.8 },
        visible: {
          opacity: 1,
          x: 0,
          scale: 1,
          transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      },
      // Card 3: Slide from bottom with bounce
      {
        hidden: { opacity: 0, y: 100 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.7,
            ease: [0.34, 1.56, 0.64, 1]
          }
        }
      },
      // Card 4: Fade with scale and rotation
      {
        hidden: { opacity: 0, scale: 0.5, rotate: -10 },
        visible: {
          opacity: 1,
          scale: 1,
          rotate: 0,
          transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }
    ];
    return variants[index % variants.length];
  };

  return (
    <section id="properties" className="section-padding bg-white p-5" ref={sectionRef}>
      <div className="container-custom">
        {/* Animated Header */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headerVariants}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Featured Listings</span>
            <motion.div
              className="w-16 h-0.5 bg-black mt-2 mx-auto"
              initial={{ width: 0 }}
              animate={isInView ? { width: 64 } : { width: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
          </motion.div>
          
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            FEATURED PROPERTIES
          </motion.h2>
          
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Discover our handpicked selection of premium properties across Dubai.
          </motion.p>
        </motion.div>

        {/* Animated Property Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300"
              variants={getCardVariants(index)}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              {/* Property Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-4xl">🏢</div>
                </motion.div>
                
                <motion.div
                  className="absolute top-4 left-4"
                  initial={{ x: -50, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <motion.span
                    className="bg-black text-white px-3 py-1 text-xs font-bold rounded-full inline-block"
                    whileHover={{ scale: 1.1, backgroundColor: "#333" }}
                    transition={{ duration: 0.2 }}
                  >
                    {property.badge}
                  </motion.span>
                </motion.div>

                {/* Hover overlay effect */}
                <motion.div
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Property Details */}
              <div className="p-6">
                <motion.div
                  className="mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                >
                  <span className="text-sm text-gray-500 font-medium">{property.type}</span>
                  <h3 className="text-xl font-bold mt-1">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mt-2">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{property.location}</span>
                  </div>
                </motion.div>

                <motion.p
                  className="text-gray-600 text-sm mb-4"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                >
                  {property.description}
                </motion.p>

                <motion.div
                  className="grid grid-cols-2 gap-2 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                >
                  {property.specs.map((spec, idx) => (
                    <motion.div
                      key={idx}
                      className="text-xs text-gray-500"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ duration: 0.3, delay: 1 + index * 0.1 + idx * 0.05 }}
                    >
                      <span className="font-medium">✓</span> {spec}
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="flex justify-between items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                >
                  <motion.button
                    className="btn-primary text-sm px-4 py-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    View Details
                  </motion.button>
                  <motion.button
                    className="btn-outline text-sm px-4 py-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    Schedule Viewing
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Animated CTA Button */}
        <motion.div
                  className="text-center mt-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                >
                  <Link href="/properties" passHref>
                    <motion.a
                      className="btn-outline px-8 py-3 inline-block"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      View All Properties
                    </motion.a>
                  </Link>
                </motion.div>
      </div>
    </section>
  );
}