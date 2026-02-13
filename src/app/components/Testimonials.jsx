// components/Testimonials.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';

export default function Testimonials() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });

  const testimonials = [
    {
      name: 'Ahmed Al Mansoori',
      company: 'Tech Startup Founder',
      content: 'Three Diamonds helped us find the perfect commercial space in Al Quoz. Their professionalism and attention to detail made the entire process seamless.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Sarah Johnson',
      company: 'Boutique Owner',
      content: 'As a first-time business owner in Dubai, I was overwhelmed. The team at Three Diamonds guided me through every step and found me a beautiful showroom space.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Mohammed Ali',
      company: 'Property Investor',
      content: 'Their property management services have been exceptional. I can finally relax knowing my investments are in good hands.',
      rating: 5,
      avatar: '🧑‍💼'
    },
    {
      name: 'Elena Rodriguez',
      company: 'Art Gallery Director',
      content: 'Finding the right space for our gallery was challenging until we worked with Three Diamonds. Their knowledge of the market is impressive.',
      rating: 5,
      avatar: '👩‍🎨'
    }
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <motion.svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-gray-200' : 'text-gray-700'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </motion.svg>
        ))}
      </div>
    );
  };

  const nextTestimonial = () => {
    setDirection(1);
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section
      className="section-padding bg-gradient-to-b from-black to-gray-950 text-white relative overflow-hidden p-5"
      ref={sectionRef}
    >
      {/* Sophisticated animated background elements - pure gray */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-gray-700/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-96 h-96 bg-gray-600/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.03, 0.08, 0.03]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Subtle grid pattern - pure white lines at minimum opacity */}
      <div
        className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id=%22grid%22%20width=%2260%22%20height=%2260%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M%2060%200%20L%200%200%200%2060%22%20fill=%22none%22%20stroke=%22rgba(255,255,255,0.02)%22%20stroke-width=%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20fill=%22url(%23grid)%22/%3E%3C/svg%3E')]"
      />

      <div className="container-custom relative z-10">
        {/* Header - Pure gray scale */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
              Client Testimonials
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            WHAT OUR CLIENTS SAY
          </motion.h2>

          <motion.p
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Hear from business owners and investors who have trusted us with their real estate needs.
          </motion.p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Main Testimonial Card - Pure black/gray gradient */}
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl p-8 md:p-12 mb-8 relative overflow-hidden border border-gray-800"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{
              boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)',
              y: -5
            }}
          >
            {/* Decorative quote icon - Subtle gray */}
            <motion.div
              className="absolute top-8 left-8 text-8xl text-gray-700/30"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              "
            </motion.div>

            <div className="relative z-10">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={activeTestimonial}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                >
                  <div className="mb-6">
                    {renderStars(testimonials[activeTestimonial].rating)}
                  </div>

                  <p className="text-xl md:text-2xl text-gray-300 italic mb-10 leading-relaxed pl-6 border-l-4 border-gray-600">
                    "{testimonials[activeTestimonial].content}"
                  </p>

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-3xl border border-gray-600"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {testimonials[activeTestimonial].avatar}
                      </motion.div>
                      <div>
                        <h4 className="font-bold text-xl text-white">{testimonials[activeTestimonial].name}</h4>
                        <p className="text-gray-500">{testimonials[activeTestimonial].company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.button
                        onClick={prevTestimonial}
                        className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center hover:bg-gray-700/50 backdrop-blur-sm transition-colors duration-300 border border-gray-700 text-gray-300"
                        whileHover={{ scale: 1.1, x: -5, borderColor: '#9CA3AF' }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Previous testimonial"
                      >
                        ←
                      </motion.button>
                      <motion.button
                        onClick={nextTestimonial}
                        className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center hover:bg-gray-700/50 backdrop-blur-sm transition-colors duration-300 border border-gray-700 text-gray-300"
                        whileHover={{ scale: 1.1, x: 5, borderColor: '#9CA3AF' }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Next testimonial"
                      >
                        →
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bar - Pure gray */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gray-500 to-gray-700"
              initial={{ width: '0%' }}
              animate={{ width: isAutoPlaying ? '100%' : '0%' }}
              transition={{ duration: 5, ease: "linear" }}
              key={activeTestimonial}
            />
          </motion.div>

          {/* Testimonial Navigation Dots - Pure gray */}
          <div className="flex justify-center gap-3 mb-16">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setDirection(index > activeTestimonial ? 1 : -1);
                  setActiveTestimonial(index);
                  setIsAutoPlaying(false);
                  setTimeout(() => setIsAutoPlaying(true), 10000);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${activeTestimonial === index ? 'bg-gray-300 w-8' : 'bg-gray-700 w-2 hover:bg-gray-500'
                  }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Stats Grid - Pure black/gray cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              {
                label: 'Verified Properties',
                value: '100%',
                description: 'All properties are thoroughly vetted',
                icon: '✓',
                color: 'from-gray-700/20 to-gray-900/20'
              },
              {
                label: 'Client Satisfaction',
                value: '98%',
                description: 'Based on client feedback surveys',
                icon: '⭐',
                color: 'from-gray-600/20 to-gray-800/20'
              },
              {
                label: 'Successful Deals',
                value: '500+',
                description: 'Deals completed successfully',
                icon: '🤝',
                color: 'from-gray-700/20 to-gray-900/20'
              },
              {
                label: 'Years Experience',
                value: '15+',
                description: 'In Dubai real estate',
                icon: '📅',
                color: 'from-gray-700/20 to-gray-900/20'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-center relative overflow-hidden group border border-gray-800"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{
                  y: -10,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)',
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <motion.div
                  className="text-4xl mb-3 text-gray-300"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  {stat.icon}
                </motion.div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300 font-medium mb-2">{stat.label}</div>
                <div className="text-gray-500 text-sm">{stat.description}</div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section - Pure black/gray gradient */}
          <motion.div
            className="bg-gradient-to-r from-gray-900 via-gray-950 to-black rounded-2xl p-8 relative overflow-hidden border border-gray-800"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, delay: 1 }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 25px 50px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.1)'
            }}
          >
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-gray-700/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 30, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2 text-white">Ready to Experience Excellence?</h3>
                <p className="text-gray-400">Join our growing list of satisfied clients.</p>
              </div>
              <motion.a
                href="#contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-4 rounded-xl font-bold border border-gray-700 hover:border-gray-500 transition-colors duration-300"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 30px rgba(255,255,255,0.1)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Started Today</span>
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}