// app/properties/[id]/page.jsx
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';

// This would typically come from an API or database
const propertiesData = {
  1: {
    id: 1,
    title: 'GOSHI WAREHOUSES CITY',
    type: 'Commercial Complex',
    category: 'Commercial',
    location: 'Al Quoz Industrial Area 3',
    description: 'Premium warehouse spaces for health centers, boutiques, galleries, and luxury showrooms.',
    fullDescription: 'GOSHI WAREHOUSES CITY represents a new standard in industrial-commercial spaces, offering versatile warehouse units designed for modern businesses. Located in the heart of Al Quoz Industrial Area 3, these spaces are perfect for health centers, boutique stores, art galleries, and luxury showrooms seeking a unique industrial aesthetic combined with premium amenities.',
    specs: ['50,000 sq.ft.', '24/7 Security', 'Customizable Spaces', 'Prime Location'],
    features: [
      'High-speed internet connectivity',
      'Loading docks with levelers',
      '24/7 CCTV surveillance',
      'On-site maintenance team',
      'Electricity backup generator',
      'Ample parking space'
    ],
    badge: 'Featured',
    price: 'AED 2.5M',
    priceDetails: {
      paymentPlan: '70/30 payment plan available',
      maintenance: 'AED 25/sq.ft. annually',
      handover: 'Ready to move'
    },
    image: '/p1.jpg',
    gallery: [
      '/p1.jpg',
      '/p2.jpg', 
      '/p3.jpg',
      '/p1.jpg',
      '/p2.jpg', 
      '/p3.jpg',
      '/p4.jpg',
      '/p1.jpg',
      '/p1.jpg',
      '/p2.jpg', 
      '/p3.jpg',
      '/p1.jpg',
      '/p2.jpg', 
      '/p3.jpg',
      '/p4.jpg',
      '/p1.jpg',
      '/p2.jpg'
    ],
    amenities: [
      'Security Guard',
      'CCTV Surveillance',
      'Fire Alarm System',
      'Loading Docks',
      'Visitor Parking',
      'Elevators',
      'Waste Disposal',
      'Maintenance Staff'
    ],
    nearby: [
      'Sheikh Zayed Road (5 mins)',
      'Dubai Mall (15 mins)',
      'Al Maktoum International Airport (25 mins)',
      'Jebel Ali Port (20 mins)'
    ],
    agent: {
      name: 'Sarah Johnson',
      phone: '+971 50 123 4567',
      email: 'sarah.johnson@example.com',
      image: '/avatar.jpg'
    },
    coordinates: {
      lat: 25.1345,
      lng: 55.2356
    },
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1781845735043!2d55.2334!3d25.1345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA4JzA0LjIiTiA1NcKwMTQnMDEuMCJF!5e0!3m2!1sen!2sae!4v1234567890!5m2!1sen!2sae'
  },
  2: {
    id: 2,
    title: 'DUBAI HILLS VILLAS',
    type: 'Residential',
    category: 'Residential',
    location: 'Dubai Hills Estate',
    description: 'Luxury villas with premium amenities and breathtaking views.',
    fullDescription: 'Experience unparalleled luxury living in these stunning villas located in the prestigious Dubai Hills Estate. Each villa is meticulously designed with contemporary architecture, featuring spacious layouts, premium finishes, and breathtaking views of the golf course and Dubai skyline.',
    specs: ['4-6 Bedrooms', 'Private Pool', 'Garden', 'Maid Room'],
    features: [
      'Smart home automation',
      'Private elevator option',
      'Landscaped garden',
      'Covered parking for 4 cars',
      'Staff quarters',
      'Driver room'
    ],
    badge: 'New',
    price: 'AED 8.2M',
    priceDetails: {
      paymentPlan: '60/40 payment plan',
      maintenance: 'AED 15/sq.ft. annually',
      handover: 'Q4 2024'
    },
    image: '/images/property2.jpg',
    gallery: [
      '/images/property2-1.jpg',
      '/images/property2-2.jpg',
      '/images/property2-3.jpg', 
      '/images/property2-4.jpg'
    ],
    amenities: [
      'Community Pool',
      'Children Play Area',
      'Parks & Gardens',
      'Golf Course Access',
      'Clubhouse',
      'Gym & Spa',
      'Tennis Courts',
      'Running Tracks'
    ],
    nearby: [
      'Dubai Hills Mall (2 mins)',
      'Downtown Dubai (15 mins)',
      'Dubai Marina (20 mins)',
      'Al Maktoum International Airport (30 mins)'
    ],
    agent: {
      name: 'Mohammed Al Rashid',
      phone: '+971 50 987 6543',
      email: 'mohammed.alrashid@example.com',
      image: '/images/agent2.jpg'
    },
    coordinates: {
      lat: 25.0657,
      lng: 55.1713
    },
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.7892345678!2d55.1689!3d25.0657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDAzJzU2LjUiTiA1NcKwMTAnMTYuNyJF!5e0!3m2!1sen!2sae!4v1234567890!5m2!1sen!2sae'
  }
};

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const thumbnailRef = useRef(null);
  
  // Form states
  const [viewingFormData, setViewingFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    date: '',
    time: ''
  });

  const [brochureFormData, setBrochureFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const property = propertiesData[params.id];
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll thumbnail into view when selected image changes
  useEffect(() => {
    if (thumbnailRef.current && property?.gallery.length > 4) {
      const thumbnailElements = thumbnailRef.current.children;
      if (thumbnailElements[selectedImage]) {
        thumbnailElements[selectedImage].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedImage, property?.gallery.length]);

  // Available dates
  const availableDates = [
    { day: 'THU', date: '19 FEB' },
    { day: 'FRI', date: '20 FEB' },
    { day: 'SAT', date: '21 FEB' },
    { day: 'MON', date: '23 FEB' },
    { day: 'TUE', date: '24 FEB' }
  ];

  // Available times
  const availableTimes = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

  const handleViewingInputChange = (e) => {
    const { name, value } = e.target;
    setViewingFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBrochureInputChange = (e) => {
    const { name, value } = e.target;
    setBrochureFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewingSubmit = (e) => {
    e.preventDefault();
    console.log('Viewing scheduled:', viewingFormData);
    alert('Thank you! Your viewing has been scheduled. The agent will contact you shortly.');
    setViewingFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      date: '',
      time: ''
    });
  };

  const handleBrochureSubmit = (e) => {
    e.preventDefault();
    console.log('Brochure requested:', brochureFormData);
    alert('Thank you! The brochure has been sent to your email.');
    setShowBrochureModal(false);
    setBrochureFormData({
      name: '',
      email: '',
      phone: ''
    });
  };

  const scrollThumbnails = (direction) => {
    if (thumbnailRef.current) {
      const scrollAmount = 200;
      thumbnailRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const openDirections = () => {
    if (property?.coordinates) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${property.coordinates.lat},${property.coordinates.lng}`, '_blank');
    }
  };

  if (!property) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 pt-24">
          <div className="container mx-auto px-4 md:px-6 py-20 text-center">
            <h1 className="text-4xl font-bold mb-4">Property Not Found</h1>
            <p className="text-gray-400 mb-8">The property you're looking for doesn't exist or has been removed.</p>
            <Link 
              href="/properties"
              className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Properties
            </Link>
          </div>
        </main>
      </>
    );
  }

  const tabs = ['overview', 'features', 'amenities', 'location'];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
        {/* Hero Section */}
        <section className="relative pt-24 pb-12 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_50%)]" />
          
          {/* Back Button */}
          <div className="container mx-auto px-4 md:px-6 relative z-10 mt-10">
            <motion.button
              onClick={() => router.back()}
              className="group mb-6 inline-flex items-center px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/50"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg 
                className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Properties</span>
            </motion.button>

            {/* Property Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700">
                  {property.category}
                </span>
                <span className="px-3 py-1 bg-black text-white text-sm rounded-full border border-gray-600">
                  {property.badge}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-400 text-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {property.location}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 md:px-6 pb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Image Gallery & Details */}
            <div className="lg:col-span-2">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden mb-4 aspect-video relative group"
              >
                {property.gallery[selectedImage] ? (
                  <Image
                    src={property.gallery[selectedImage]}
                    alt={`${property.title} - Image ${selectedImage + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-9xl">🏢</span>
                  </div>
                )}
                
                {/* Navigation Arrows */}
                <button 
                  onClick={() => setSelectedImage(prev => (prev > 0 ? prev - 1 : property.gallery.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/90 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => setSelectedImage(prev => (prev < property.gallery.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/90 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {property.gallery.length}
                </div>
              </motion.div>

              {/* Thumbnail Gallery with Horizontal Scroll */}
              <motion.div 
                className="relative mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Scroll Buttons - only show if more than 4 images */}
                {property.gallery.length > 4 && (
                  <>
                    <button
                      onClick={() => scrollThumbnails('left')}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all backdrop-blur-sm -ml-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => scrollThumbnails('right')}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all backdrop-blur-sm -mr-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Thumbnails Container with Horizontal Scroll */}
                <div 
                  ref={thumbnailRef}
                  className={`flex gap-2 overflow-x-auto scrollbar-hide pb-2 ${
                    property.gallery.length > 4 ? 'px-2' : 'grid grid-cols-4'
                  }`}
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  {property.gallery.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden transition-all ${
                        selectedImage === index 
                          ? 'ring-2 ring-white scale-95 opacity-100' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${property.title} - Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </button>
                  ))}
                </div>

                {/* Scroll indicator dots for mobile */}
                {property.gallery.length > 4 && (
                  <div className="flex justify-center gap-1 mt-2 md:hidden">
                    {property.gallery.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          selectedImage === index ? 'bg-white w-3' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex gap-4 border-b border-gray-800 mb-6">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 capitalize font-medium transition-colors relative ${
                        activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="bg-gray-800/30 rounded-xl p-6">
                  {activeTab === 'overview' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-bold mb-4">Property Overview</h3>
                      <p className="text-gray-300 leading-relaxed mb-6">
                        {property.fullDescription}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <span className="text-gray-400 text-sm">Property Type</span>
                          <p className="text-white font-semibold">{property.type}</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <span className="text-gray-400 text-sm">Price</span>
                          <p className="text-white font-semibold">{property.price}</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <span className="text-gray-400 text-sm">Handover</span>
                          <p className="text-white font-semibold">{property.priceDetails.handover}</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <span className="text-gray-400 text-sm">Payment Plan</span>
                          <p className="text-white font-semibold">{property.priceDetails.paymentPlan}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'features' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-bold mb-4">Key Features</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {property.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-green-400 text-xl">✓</span>
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'amenities' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-bold mb-4">Amenities</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {property.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-blue-400 text-xl">•</span>
                            <span className="text-gray-300">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'location' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-bold mb-4">Nearby Locations</h3>
                      <div className="space-y-3">
                        {property.nearby.map((place, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-gray-400">📍</span>
                            <span className="text-gray-300">{place}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Contact & Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              {/* Price Card */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-6">
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-white">{property.price}</span>
                  <p className="text-gray-400 text-sm mt-1">{property.priceDetails.paymentPlan}</p>
                </div>

                {/* Agent Info */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-800/80 rounded-xl">
                  <div className="relative w-16 h-16 bg-gray-700 rounded-full overflow-hidden">
                    {property.agent.image ? (
                      <Image
                        src={property.agent.image}
                        alt={property.agent.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        👤
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Listing Agent</p>
                    <p className="font-semibold">{property.agent.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <a href={`tel:${property.agent.phone}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                        📞 Call
                      </a>
                      <span className="text-gray-600">|</span>
                      <a href={`mailto:${property.agent.email}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                        ✉️ Email
                      </a>
                    </div>
                  </div>
                </div>

                {/* Viewing Form - Always visible */}
                <div className="mb-6">
                  <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="text-blue-400">📅</span>
                      Schedule a Viewing
                    </h3>
                    
                    {/* Tour Options */}
                    <div className="mb-4">
                      <div className="flex gap-4 mb-3">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="tourType" value="in-person" className="text-blue-500" defaultChecked />
                          <span className="text-sm text-white">Tour In Person</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="tourType" value="video" />
                          <span className="text-sm text-white">Tour via video chat</span>
                        </label>
                      </div>
                    </div>
                    
                    {/* Date Selection */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">PICK A DATE</p>
                      <div className="grid grid-cols-5 gap-1">
                        {availableDates.map((date, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setViewingFormData(prev => ({ ...prev, date: `${date.day} ${date.date}` }))}
                            className={`p-1 text-center rounded-lg transition-all text-xs ${
                              viewingFormData.date === `${date.day} ${date.date}`
                                ? 'bg-white text-black'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            <div>{date.day}</div>
                            <div className="font-semibold">{date.date}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">PICK A TIME</p>
                      <p className="text-xs text-gray-500 mb-1">Choose your preferred time.</p>
                      <select
                        name="time"
                        value={viewingFormData.time}
                        onChange={handleViewingInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                      >
                        <option value="">Select time</option>
                        {availableTimes.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>

                    {/* Contact Info */}
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={viewingFormData.name}
                      onChange={handleViewingInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 mb-2 focus:outline-none focus:ring-2 focus:ring-white/20"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={viewingFormData.email}
                      onChange={handleViewingInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 mb-2 focus:outline-none focus:ring-2 focus:ring-white/20"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={viewingFormData.phone}
                      onChange={handleViewingInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 mb-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                      required
                    />
                    <textarea
                      name="message"
                      placeholder="Message to agent"
                      value={viewingFormData.message}
                      onChange={handleViewingInputChange}
                      rows="2"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 mb-3 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                    />

                    <button
                      onClick={handleViewingSubmit}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    className="w-full bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowBrochureModal(true)}
                  >
                    Download Brochure
                  </motion.button>
                  
                </div>

                {/* Specs */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="font-semibold mb-3">Property Specs</h4>
                  <div className="space-y-2">
                    {property.specs.map((spec, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-400">{spec.split(':')[0]}</span>
                        <span className="text-white font-medium">{spec.split(':')[1] || spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Location Map Section */}
        <section className="relative py-16 border-t border-gray-800">
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
                Location
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                {property.location}
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
                  src={property.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => setMapLoaded(true)}
                  className="w-full h-full"
                  title={`${property.title} location map`}
                />

                {/* Map Overlay Controls */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <motion.button
                    onClick={openDirections}
                    className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors border border-gray-700 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
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
                    Property Location
                  </h3>
                  <p className="text-sm text-gray-300 mb-3">{property.location}</p>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400">Nearby Places:</p>
                    {property.nearby.slice(0, 3).map((place, index) => (
                      <div key={index} className="flex items-start gap-2 text-xs">
                        <span className="text-gray-500 mt-0.5">•</span>
                        <span className="text-gray-300">{place}</span>
                      </div>
                    ))}
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
                    {property.coordinates ? `${property.coordinates.lat.toFixed(4)}° N, ${property.coordinates.lng.toFixed(4)}° E` : 'Location available'}
                  </span>
                </div>
                
                <div className="flex gap-3">
                  <motion.a
                    href={`https://www.google.com/maps/search/?api=1&query=${property.coordinates.lat},${property.coordinates.lng}`}
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

            {/* Nearby Places Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {property.nearby.map((place, index) => (
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
      </main>

      {/* Brochure Modal - Simple form with name, email, phone */}
      <AnimatePresence>
        {showBrochureModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBrochureModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="relative p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">Download Brochure</h2>
                <p className="text-gray-400 mt-1">Get detailed information about this property</p>
                <button
                  onClick={() => setShowBrochureModal(false)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Simple Form */}
              <form onSubmit={handleBrochureSubmit} className="p-6">
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={brochureFormData.name}
                      onChange={handleBrochureInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={brochureFormData.email}
                      onChange={handleBrochureInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={brochureFormData.phone}
                      onChange={handleBrochureInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Send Brochure
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add custom CSS for hiding scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}