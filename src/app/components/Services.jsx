// components/Services.jsx
'use client';

import { motion } from "framer-motion";

// Container for staggered children
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Title animations
const titleVariant = {
  hidden: { opacity: 0, y: -30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const subtitleVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.8, delay: 0.2 }
  }
};

// 3D Flip card animation
const cardVariant = {
  hidden: { 
    opacity: 0,
    rotateY: -90,
    transformPerspective: 1000,
    scale: 0.9
  },
  show: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transition: { 
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Image/Icon animation - scale and rotate
const imageVariant = {
  hidden: { 
    opacity: 0,
    scale: 0,
    rotate: -180
  },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { 
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.3
    }
  }
};

// List items stagger animation
const listContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.4
    }
  }
};

const listItemVariant = {
  hidden: { 
    opacity: 0,
    x: -20
  },
  show: {
    opacity: 1,
    x: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Dot animation
const dotVariant = {
  hidden: { 
    scale: 0,
    opacity: 0
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 500,
      damping: 20
    }
  }
};

// Background glow animation - now in grayscale
const glowVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { 
    opacity: 0.15, 
    scale: 1,
    transition: { duration: 1, ease: "easeOut" }
  },
  hover: { opacity: 0.25, scale: 1.1 }
};

export default function Services() {
  const services = [
    {
      title: 'COMMERCIAL LEASING',
      icon: '🏢',
      gradient: 'from-gray-800 to-black',
      accentColor: 'border-gray-400',
      hoverColor: 'hover:border-gray-300',
      items: ['Warehouse', 'Showroom', 'Office Space', 'Open Land', 'Labour Camp', 'Staff Accommodation', 'Commercial Villa']
    },
    {
      title: 'RESIDENTIAL LEASING',
      icon: '🏠',
      gradient: 'from-gray-800 to-black',
      accentColor: 'border-gray-400',
      hoverColor: 'hover:border-gray-300',
      items: ['Villas', 'Apartments', 'Townhouses', 'Penthouses', 'Hotel Apartments']
    },
    {
      title: 'BUSINESS SOLUTIONS',
      icon: '💼',
       gradient: 'from-gray-800 to-black',
      accentColor: 'border-gray-400',
      hoverColor: 'hover:border-gray-300',
      items: [
        'Sell a Business',
        'Buy a Business',
        'Business Valuation',
        'Succession Planning',
        'Exit Strategy',
        'Financial Analysis',
        'Be in control'
      ]
    },
    {
      title: 'PROPERTY MANAGEMENT',
      icon: '🔑',
      gradient: 'from-gray-800 to-black',
      accentColor: 'border-gray-400',
      hoverColor: 'hover:border-gray-300',
      items: ['Maintenance', 'Tenant Screening', 'Rent Collection', 'Property Inspection', '24/7 Support', 'Legal Compliance']
    }
  ];

  return (
    <section id="services" className="py-20 bg-black text-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-16"
        >
          <motion.div 
            className="inline-block mb-4"
            variants={titleVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
          >
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Our Expertise</span>
            <div className="w-16 h-0.5 bg-gray-500 mt-2 mx-auto"></div>
          </motion.div>
          
          <motion.h2 
            variants={titleVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
          >
            OUR SERVICES
          </motion.h2>
          
          <motion.p 
            variants={subtitleVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
            className="text-gray-400 text-center max-w-2xl mx-auto text-lg"
          >
            Comprehensive real estate solutions tailored to your specific needs in Dubai's dynamic market
          </motion.p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ perspective: "1000px" }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={service.title}
              variants={cardVariant}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                borderColor: '#9CA3AF', // gray-400
                boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.1)",
                transition: { duration: 0.3 }
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
              className={`relative border-2 border-gray-800 rounded-2xl p-8 bg-gradient-to-br ${service.gradient} overflow-hidden group ${service.hoverColor}`}
            >
              {/* Background Glow - now white */}
              <motion.div 
                variants={glowVariant}
                initial="hidden"
                whileInView="show"
                whileHover="hover"
                className="absolute -inset-0.5 bg-gradient-to-r from-gray-400 to-gray-600 rounded-2xl opacity-0 blur"
              />

              {/* Icon/Image Section - grayscale effect */}
              <motion.div 
                variants={imageVariant}
                className="flex justify-center mb-6 relative z-10"
              >
                <motion.div 
                  className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-700 to-black border-2 border-gray-500 flex items-center justify-center text-4xl shadow-2xl grayscale"
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1,
                    borderColor: '#D1D5DB', // gray-300
                    transition: { duration: 0.6 }
                  }}
                >
                  {service.icon}
                </motion.div>
              </motion.div>

              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl font-bold mb-4 text-center text-gray-200 relative z-10"
              >
                {service.title}
              </motion.h3>
              
              <motion.ul 
                variants={listContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false }}
                className="space-y-3 relative z-10"
              >
                {service.items.map((item, idx) => (
                  <motion.li 
                    key={idx} 
                    variants={listItemVariant}
                    whileHover={{ x: 10, transition: { duration: 0.2 } }}
                    className="flex items-center text-gray-300 group/item"
                  >
                    <motion.div 
                      variants={dotVariant}
                      whileHover={{ scale: 1.5, backgroundColor: '#9CA3AF' }}
                      className="w-2 h-2 rounded-full mr-3 flex-shrink-0 bg-gray-500"
                    ></motion.div>
                    <span className="text-sm group-hover/item:text-white transition-colors duration-200">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Learn More Link */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ delay: 0.8 }}
                className="mt-8 pt-6 border-t border-gray-700 relative z-10"
              >
                <motion.a
                  href="#contact"
                  whileHover={{ x: 5 }}
                  className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <span>Learn More</span>
                  <motion.svg 
                    className="w-4 h-4 ml-2"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </motion.svg>
                </motion.a>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Bar - monochrome */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 text-center border border-gray-800"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '500+', label: 'Properties Managed', color: 'text-gray-300' },
              { value: '98%', label: 'Client Satisfaction', color: 'text-gray-300' },
              { value: '24/7', label: 'Support Available', color: 'text-gray-300' },
              { value: '15+', label: 'Years Experience', color: 'text-gray-300' },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: false }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section - monochrome */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Whether you're looking to lease, buy, sell, or manage properties in Dubai, 
            our expert team is here to provide personalized solutions that exceed expectations.
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, backgroundColor: '#374151', color: 'white' }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gray-800 text-gray-200 px-8 py-4 rounded-lg font-bold hover:bg-gray-700 transition-all duration-300 shadow-lg border border-gray-600"
          >
            <span>Start Your Real Estate Journey</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}