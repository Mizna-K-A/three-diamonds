"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  Phone, Mail, MapPin, Globe, Facebook, MessageSquare, 
  Download, Send, User, Building2, FileText, CheckCircle,
  AlertCircle, X, Navigation, Maximize2, Minimize2,
  Instagram
} from "lucide-react";
import Header from "../components/Header";

// Animation Variants (keep all your existing animation variants)
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const fadeLeft = {
  hidden: { opacity: 0, x: -80 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

const fadeRight = {
  hidden: { opacity: 0, x: 80 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.8 }
  }
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

const cardHover = {
  hover: { 
    scale: 1.03,
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const buttonHover = {
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { 
    scale: 0.95 
  }
};

const inputFocus = {
  focus: { 
    scale: 1.02,
    borderColor: "#9CA3AF",
    transition: { duration: 0.2 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const listItem = {
  hidden: { opacity: 0, x: -20 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5 }
  }
};

// Modal Animation Variants
const modalOverlay = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const modalContent = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    y: 20
  },
  show: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.4
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: { duration: 0.2 }
  }
};

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      className={`fixed top-24 right-4 z-50 flex items-center gap-3 ${bgColor} text-white px-6 py-4 rounded-lg shadow-xl border border-white/20 max-w-md`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1">{message}</p>
      <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Brochure Modal Component
const BrochureModal = ({ isOpen, onClose, onSubmit, isDownloading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            variants={modalContent}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 mx-auto"
              >
                <Download className="w-10 h-10 text-white" />
              </motion.div>

              <h3 className="text-2xl font-bold text-center mb-2 text-white">Download Brochure</h3>
              <p className="text-gray-400 text-center mb-8">
                Please fill in your details to receive our comprehensive property brochure.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-300"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-300"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-300"
                      placeholder="+971 50 123 4567"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isDownloading}
                  className={`w-full bg-gray-800 text-white py-4 px-6 rounded-lg font-medium border border-gray-700 hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2 group mt-6 ${
                    isDownloading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Download className="w-5 h-5" />
                      </motion.div>
                      DOWNLOADING...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
                      DOWNLOAD BROCHURE
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                We respect your privacy. Your information will never be shared.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    propertyType: "commercial"
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ""
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const thumbnailRef = useRef(null);

  // Office coordinates for Three Diamonds Real Estate
  const officeLocation = {
    lat: 25.1345,
    lng: 55.2356,
    address: "Al Quoz Industrial Area 3, Dubai, UAE"
  };

  // Google Maps embed URL
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1781845735043!2d55.2334!3d25.1345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA4JzA0LjIiTiA1NcKwMTQnMDEuMCJF!5e0!3m2!1sen!2sae!4v1234567890!5m2!1sen!2sae";

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus({ submitted: true, success: true, message: "Thank you! We'll contact you shortly." });
    showToast("Thank you! We'll contact you shortly.", 'success');
    setTimeout(() => {
      setFormStatus({ submitted: false, success: false, message: "" });
    }, 5000);
  };

  const handleBrochureClick = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = (modalFormData) => {
    // Validate form data
    if (!modalFormData.name || !modalFormData.email || !modalFormData.phone) {
      showToast("Please fill in all fields", 'error');
      return;
    }

    setIsDownloading(true);
    
    // Simulate download preparation
    setTimeout(() => {
      // Create a link to the PDF file
      const pdfUrl = '/THREE DIAMONDS PROFILE (1).pdf'; // Path to your PDF in the public folder
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'THREE_DIAMONDS_PROFILE.pdf'; // Name for the downloaded file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsDownloading(false);
      setIsModalOpen(false);
      showToast("Brochure downloaded successfully!", 'success');
    }, 1500);
  };

  const openDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${officeLocation.lat},${officeLocation.lng}`, '_blank');
  };

  return (
    <>
      <Header />
      
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      {/* Brochure Modal */}
      <BrochureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        isDownloading={isDownloading}
      />
      
      {/* Hero Section with Animated Background */}
      <motion.section 
        initial="hidden"
        animate="show"
        className="relative pt-32 pb-20 bg-gradient-to-b from-black to-gray-900 overflow-hidden"
      >
        {/* Animated background elements */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
            rotate: [0, 45, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-gray-800 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, -45, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-gray-700 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1 
              variants={fadeUp}
              className="text-5xl md:text-6xl font-bold mb-6 text-white"
            >
              GET IN TOUCH
            </motion.h1>
            <motion.div 
              variants={scaleUp}
              className="w-24 h-1 bg-gray-600 mx-auto mb-6"
            />
            <motion.p 
              variants={fadeUp}
              className="text-xl text-gray-400"
            >
              Let's turn your Dubai dreams into a sparkling reality
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Cards Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 md:px-6 mt-20">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-32"
          >
            {/* Phone Card */}
            <motion.a
              href="tel:0529398258"
              variants={scaleUp}
              whileHover="hover"
              whileTap="tap"
              custom={1}
              className="p-8 bg-gray-900 rounded-xl flex flex-col items-center text-center group cursor-pointer border border-gray-800 hover:border-gray-600 transition-all duration-300 shadow-xl"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center mb-4 group-hover:from-gray-700 group-hover:to-gray-600 transition-all duration-300"
              >
                <Phone className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2 text-white">CALL US</h3>
              <p className="text-gray-400 mb-1">052-939 8258</p>
              <p className="text-gray-400">056-777 0905</p>
            </motion.a>

            {/* Email Card */}
            <motion.a
              href="mailto:info@threediamonds.ae"
              variants={scaleUp}
              whileHover="hover"
              whileTap="tap"
              custom={2}
              className="p-8 bg-gray-900 rounded-xl flex flex-col items-center text-center group cursor-pointer border border-gray-800 hover:border-gray-600 transition-all duration-300 shadow-xl"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center mb-4 group-hover:from-gray-700 group-hover:to-gray-600 transition-all duration-300"
              >
                <Mail className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2 text-white">EMAIL US</h3>
              <p className="text-gray-400">info@threediamonds.ae</p>
            </motion.a>

            {/* Location Card */}
            <motion.div
              variants={scaleUp}
              whileHover="hover"
              whileTap="tap"
              custom={3}
              className="p-8 bg-gray-900 rounded-xl flex flex-col items-center text-center border border-gray-800 hover:border-gray-600 transition-all duration-300 shadow-xl"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center mb-4"
              >
                <MapPin className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2 text-white">VISIT US</h3>
              <p className="text-gray-400">Al Quoz Industrial Area - 3</p>
              <p className="text-gray-400">Dubai - U.A.E</p>
            </motion.div>

            {/* Website Card */}
            <motion.a
              href="https://www.threediamonds.ae"
              target="_blank"
              rel="noopener noreferrer"
              variants={scaleUp}
              whileHover="hover"
              whileTap="tap"
              custom={4}
              className="p-8 bg-gray-900 rounded-xl flex flex-col items-center text-center group cursor-pointer border border-gray-800 hover:border-gray-600 transition-all duration-300 shadow-xl"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center mb-4 group-hover:from-gray-700 group-hover:to-gray-600 transition-all duration-300"
              >
                <Globe className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2 text-white">WEBSITE</h3>
              <p className="text-gray-400">www.threediamonds.ae</p>
            </motion.a>
          </motion.div>

          {/* Main Content Grid - Form and Brochure */}
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
            className="grid lg:grid-cols-2 gap-12 mt-20"
          >
            {/* Contact Form */}
            <motion.div variants={fadeLeft} className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <motion.h2 
                variants={fadeUp}
                className="text-3xl font-bold mb-6 text-white flex items-center gap-3"
              >
                <Send className="w-6 h-6 text-gray-400" />
                SEND US A MESSAGE
              </motion.h2>

              {formStatus.submitted && formStatus.success ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-900/30 border border-green-800 rounded-lg p-6 text-center"
                >
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-green-400 text-lg">{formStatus.message}</p>
                </motion.div>
              ) : (
                <motion.form 
                  variants={staggerContainer}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <motion.div variants={listItem}>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <motion.input
                        whileFocus="focus"
                        variants={inputFocus}
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-300"
                        placeholder="John Doe"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={listItem}>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <motion.input
                        whileFocus="focus"
                        variants={inputFocus}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-300"
                        placeholder="john@example.com"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={listItem}>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <motion.input
                        whileFocus="focus"
                        variants={inputFocus}
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-300"
                        placeholder="+971 50 123 4567"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={listItem}>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <motion.input
                        whileFocus="focus"
                        variants={inputFocus}
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-300"
                        placeholder="Your Company"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={listItem}>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Property Type</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                      <motion.select
                        whileFocus="focus"
                        variants={inputFocus}
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pl-12 text-white appearance-none focus:outline-none focus:border-gray-600 transition-colors duration-300"
                      >
                        <option value="commercial">Commercial</option>
                        <option value="residential">Residential</option>
                        <option value="industrial">Industrial</option>
                        <option value="warehouse">Warehouse</option>
                        <option value="land">Open Land</option>
                      </motion.select>
                    </div>
                  </motion.div>

                  <motion.div variants={listItem}>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                    <motion.textarea
                      whileFocus="focus"
                      variants={inputFocus}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-300 resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </motion.div>

                  <motion.button
                    type="submit"
                    variants={buttonHover}
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-700 text-white py-4 px-6 rounded-lg font-medium hover:from-gray-700 hover:to-gray-600 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    SEND MESSAGE
                  </motion.button>
                </motion.form>
              )}
            </motion.div>

            {/* Brochure Download Section */}
            <motion.div variants={fadeRight} className="space-y-8">
              {/* Download Card */}
              <motion.div 
                variants={scaleUp}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-800"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 mx-auto"
                >
                  <Download className="w-10 h-10 text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold text-center mb-4 text-white">DOWNLOAD BROCHURE</h3>
                <p className="text-gray-400 text-center mb-8">
                  Get our comprehensive property brochure with detailed information about available spaces, 
                  pricing, and investment opportunities.
                </p>

                <motion.button
                  onClick={handleBrochureClick}
                  variants={buttonHover}
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full bg-gray-800 text-white py-4 px-6 rounded-lg font-medium border border-gray-700 hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
                  DOWNLOAD BROCHURE
                </motion.button>

                <motion.div 
                  variants={staggerContainer}
                  className="mt-8 pt-8 border-t border-gray-800"
                >
                  <h4 className="text-sm font-semibold text-gray-400 mb-4">BROCHURE INCLUDES:</h4>
                  <motion.ul className="space-y-3">
                    {[
                      "Complete property listings",
                      "Floor plans & specifications",
                      "Pricing & payment plans",
                      "Location maps & accessibility",
                      "Investment highlights",
                      "Terms & conditions"
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        variants={listItem}
                        custom={index}
                        className="flex items-center gap-3 text-gray-400"
                      >
                        <CheckCircle className="w-4 h-4 text-gray-500" />
                        {item}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              </motion.div>

              {/* Social Media Section */}
              <motion.div 
                variants={scaleUp}
                className="bg-gray-900 rounded-2xl p-8 border border-gray-800 text-center"
              >
                <h3 className="text-2xl font-bold mb-6 text-white">CONNECT WITH US</h3>
                <div className="flex justify-center gap-4">
                  <motion.a
                    href="https://facebook.com/threediamondsreal-estate"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-300 border border-gray-700"
                  >
                    <Facebook className="w-6 h-6 text-white" />
                  </motion.a>
                  <motion.a
                    href="https://instagram.com/threediamondsrealestate"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-300 border border-gray-700"
                  >
                    <Instagram className="w-6 h-6 text-white" />
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Goshi Warehouses City Section */}
          <motion.div 
            variants={fadeUp}
            className="mt-20"
          >
            <motion.div 
              variants={container}
              className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 border border-gray-800"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
                GOSHI WAREHOUSES CITY
              </h2>
              
              <div className="grid md:grid-cols-2 gap-12">
                <motion.div variants={fadeLeft}>
                  <h3 className="text-xl font-bold mb-4 text-white">Managed by Three Diamonds Real Estate</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    A distinguished commercial destination in the heart of Al Quoz Industrial Area 3, 
                    Dubai. This cutting-edge complex redefines industrial excellence by offering an 
                    eclectic mix of premium warehouse spaces.
                  </p>
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="inline-flex items-center gap-2 text-gray-300"
                  >
                    <span className="font-semibold text-white">Est. 1974</span> · Al Quoz Industrial Area - 3, Dubai - U.A.E
                  </motion.div>
                </motion.div>
                
                <motion.div variants={fadeRight} className="space-y-4">
                  {[
                    { icon: Phone, text: "052-939 8258 · 056-777 0905" },
                    { icon: Mail, text: "info@threediamonds.ae" },
                    { icon: Globe, text: "www.threediamonds.ae" },
                    { icon: MessageSquare, text: "@goshi_warehouses_city" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3 text-gray-400 group cursor-pointer"
                    >
                      <item.icon className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors duration-300" />
                      <span className="group-hover:text-white transition-colors duration-300">{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Location Map Section - Styled like property details page */}
      <section className="relative py-16 border-t border-gray-800 bg-gradient-to-b from-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.05),transparent_70%)]" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
              Our Location
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {officeLocation.address}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50"
          >
            {/* Map Container */}
            <div className="relative w-full h-[400px] md:h-[500px] group">
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm z-10">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading map...</p>
                  </div>
                </div>
              )}
              
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setMapLoaded(true)}
                className="w-full h-full"
                title="Three Diamonds Real Estate Location"
              />

              {/* Map Overlay Controls */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <motion.button
                  onClick={openDirections}
                  className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors border border-gray-700 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </motion.button>
              </div>

              {/* Location Info Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 max-w-xs"
              >
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-red-400">📍</span>
                  Three Diamonds Real Estate
                </h3>
                <p className="text-sm text-gray-300 mb-3">{officeLocation.address}</p>
                
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">Contact:</p>
                  <div className="flex items-start gap-2 text-xs">
                    <Phone className="w-3 h-3 text-gray-500 mt-0.5" />
                    <span className="text-gray-300">052-939 8258</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <Mail className="w-3 h-3 text-gray-500 mt-0.5" />
                    <span className="text-gray-300">info@threediamonds.ae</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Map Footer */}
            <div className="p-4 border-t border-gray-700/50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-400">Interactive Map</span>
                </div>
                <span className="text-gray-600">|</span>
                <span className="text-sm text-gray-400">
                  {officeLocation.lat.toFixed(4)}° N, {officeLocation.lng.toFixed(4)}° E
                </span>
              </div>
              
              <div className="flex gap-3">
                <motion.a
                  href={`https://www.google.com/maps/search/?api=1&query=${officeLocation.lat},${officeLocation.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                  whileHover={{ x: 2 }}
                >
                  <span>View on Google Maps</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Nearby Places Grid - Added to match property details style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              "Sheikh Zayed Road (5 mins)",
              "Dubai Mall (15 mins)",
              "Al Maktoum Airport (25 mins)",
              "Jebel Ali Port (20 mins)"
            ].map((place, index) => (
              <div key={index} className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-sm font-medium text-white">{place.split('(')[0].trim()}</p>
                    <p className="text-xs text-gray-400">{place.match(/\((.*?)\)/)?.[1] || ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}