// components/Contact.jsx
'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      alert('Thank you for your inquiry! We will contact you shortly.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyType: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: ['052 939 8258', '056 777 0905'],
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Mail,
      title: 'Email Address',
      details: ['info@threediamonds.ae', 'sales@threediamonds.ae'],
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: MapPin,
      title: 'Our Location',
      details: ['Al Quoz Industrial Area - 3', 'Dubai, U.A.E'],
      color: 'bg-red-50 text-red-600'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  // Animation variants
  const cardHover = {
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const iconHover = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const buttonHover = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
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

  const inputFocus = {
    focus: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const socialIconHover = {
    hover: {
      scale: 1.15,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <section id="contact" className="section-padding bg-white p-5">
      <div className="container-custom">
        <div className="text-center mb-12 slide-up">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Get in Touch</span>
            <div className="w-16 h-0.5 bg-black mt-2 mx-auto"></div>
          </div>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            CONTACT US
          </motion.h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ready to find your perfect property? Contact us today for personalized assistance.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div 
            className="lg:col-span-1 fade-in"
            whileHover="hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="bg-gray-50 rounded-2xl p-8 h-full"
              variants={cardHover}
              whileHover="hover"
            >
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div 
                    key={info.title} 
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <motion.div 
                      className={`${info.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}
                      variants={iconHover}
                      whileHover="hover"
                    >
                      <info.icon size={24} />
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">{info.title}</h4>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Media */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  <motion.a 
                    href="#" 
                    className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800"
                    variants={socialIconHover}
                    whileHover="hover"
                    whileTap={{ scale: 0.9 }}
                  >
                    f
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800"
                    variants={socialIconHover}
                    whileHover="hover"
                    whileTap={{ scale: 0.9 }}
                  >
                    in
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800"
                    variants={socialIconHover}
                    whileHover="hover"
                    whileTap={{ scale: 0.9 }}
                  >
                    @
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-2 fade-in" 
            style={{ animationDelay: '0.2s' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="bg-white rounded-2xl border border-gray-200 p-8"
              variants={cardHover}
              whileHover="hover"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <MessageSquare size={20} />
                </motion.div>
                <h3 className="text-2xl font-bold">Send us a Message</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div variants={inputFocus} whileHover="hover">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-all duration-300"
                      required
                      placeholder="Enter your name"
                    />
                  </motion.div>
                  <motion.div variants={inputFocus} whileHover="hover">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-all duration-300"
                      required
                      placeholder="Enter your email"
                    />
                  </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div variants={inputFocus} whileHover="hover">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-all duration-300"
                      required
                      placeholder="Enter your phone number"
                    />
                  </motion.div>
                  <motion.div variants={inputFocus} whileHover="hover">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type Interest
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-all duration-300"
                    >
                      <option value="">Select property type</option>
                      <option value="commercial">Commercial</option>
                      <option value="residential">Residential</option>
                      <option value="warehouse">Warehouse</option>
                      <option value="land">Land</option>
                    </select>
                  </motion.div>
                </div>

                <motion.div variants={inputFocus} whileHover="hover">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-all duration-300 resize-none"
                    required
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                </motion.div>

                <div className="flex items-center gap-4">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-2 px-8 py-4"
                    variants={buttonHover}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </motion.button>
                  <p className="text-sm text-gray-500">
                    We typically respond within 24 hours
                  </p>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}