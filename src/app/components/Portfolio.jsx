// components/Portfolio.jsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Portfolio() {
  const portfolioItems = [
    {
      category: 'COMMERCIAL',
      title: 'GOSHI WAREHOUSES CITY',
      description: 'A distinguished commercial destination in Al Quoz Industrial Area 3, offering premium warehouse spaces for various ventures.',
      highlights: ['Health & Wellness Centers', 'High-end Boutiques', 'Art Galleries', 'Photography Studios', 'Luxury Showrooms']
    },
    {
      category: 'INDUSTRIAL',
      title: 'AL QUOZ COMPLEX',
      description: 'Modern industrial spaces with unparalleled connectivity and visibility in Dubai\'s dynamic industrial zone.',
      highlights: ['24/7 Access', 'Heavy Duty Floors', 'Loading Bays', 'Office Spaces', 'Storage Facilities']
    },
    {
      category: 'RESIDENTIAL',
      title: 'PREMIUM VILLAS',
      description: 'Exclusive residential properties offering luxury living with premium amenities and strategic locations.',
      highlights: ['Swimming Pool', 'Private Garden', 'Maid Room', 'Garage', 'Smart Home Features']
    }
  ];

  // Refs for parallax effect
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Parallax transform values
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1.2]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const cardHover = {
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const highlightItem = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const quoteVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.5
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98
    }
  };

  const textGlow = {
    hover: {
      textShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
      transition: {
        duration: 0.3
      }
    }
  };

  // Simple on/off blink
  const simpleBlink = {
    blink: {
      opacity: [1, 0, 1, 0, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        times: [0, 0.25, 0.5, 0.75, 1],
        ease: "linear"
      }
    }
  };

  return (
    <section 
      id="portfolio" 
      ref={sectionRef}
      className="section-padding bg-black text-white p-6 relative overflow-hidden"
    >
      {/* Parallax Background Image */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{
          y,
          opacity,
          scale
        }}
      >
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: 'url(/d1.webp)',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/70" />
      </motion.div>

      <div className="container-custom relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-4">
            <motion.span 
              className="text-sm font-semibold text-gray-400 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Our Portfolio
            </motion.span>
            <motion.div 
              className="w-16 h-0.5 bg-gray-600 mt-2 mx-auto"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
          </div>
          
          {/* Vehicle Indicator Style Blinking Title */}
          <div className="mb-6">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-100"
              variants={simpleBlink}
              animate="blink"
            >
              WHY THREE DIAMONDS?
            </motion.h2>
          </div>
          
          <motion.p 
            className="text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            We believe in the power of transformation. Your dream property is not just a building, 
            but a springboard to a fulfilling life in Dubai.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.title}
              className="bg-gray-300/90 backdrop-blur-sm rounded-xl p-8 hover:bg-gray-500/90 transition-all duration-300 hover:border-gray-500"
              variants={itemVariants}
              whileHover="hover"
              custom={index}
              style={{ originY: 0 }}
            >
              <motion.div 
                variants={cardHover}
                whileHover="hover"
                className="h-full"
              >
                <div className="mb-4">
                  <motion.span 
                    className="text-sm font-semibold text-gray-900"
                    variants={textGlow}
                    whileHover="hover"
                  >
                    {item.category}
                  </motion.span>
                  <motion.h3 
                    className="text-2xl font-bold mt-2 text-gray-900"
                    whileHover={{ color: "#fff", scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.title}
                  </motion.h3>
                </div>
                <motion.p 
                  className="text-gray-900 mb-6"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.description}
                </motion.p>
                <ul className="space-y-2">
                  {item.highlights.map((highlight, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex items-center text-gray-900"
                      variants={highlightItem}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={idx}
                      whileHover={{ 
                        x: 5, 
                        color: "#fff",
                        transition: { duration: 0.2 }
                      }}
                    >
                      <motion.svg 
                        className="w-4 h-4 mr-3 text-gray-900" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        whileHover={{ scale: 1.2, rotate: 5, color: "#fff" }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </motion.svg>
                      {highlight}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="bg-gradient-to-r from-gray-400/90 to-black/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 text-center border border-gray-800"
          variants={quoteVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="max-w-3xl mx-auto">
            <motion.h3 
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              "SUCCESS FINDS THOSE WHO ARE TOO DRIVEN BY THEIR PASSION TO SEEK IT OUT"
            </motion.h3>
            <motion.p 
              className="text-gray-400 text-lg mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Whether you're a young entrepreneur seeking your first commercial space, or an established business owner 
              looking to expand, we're here to guide you every step of the way.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.a 
                href="#contact"
                className="btn-primary text-white inline-flex items-center gap-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Start Your Journey Today
                <motion.svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}