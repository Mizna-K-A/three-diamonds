// components/Footer.jsx
"use client";

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Navigation, Phone, Mail, Facebook, Instagram, Linkedin, MessageCircle, Youtube, Globe, Twitter, ChevronDown } from 'lucide-react';

const SocialIcon = ({ platform, className = "w-4 h-4" }) => {
  switch (platform.toLowerCase()) {
    case 'facebook': return <Facebook className={className} />;
    case 'instagram': return <Instagram className={className} />;
    case 'linkedin': return <Linkedin className={className} />;
    case 'whatsapp': return <MessageCircle className={className} />;
    case 'youtube': return <Youtube className={className} />;
    case 'twitter':
    case 'x': return <Twitter className={className} />;
    default: return <Globe className={className} />;
  }
};

export default function Footer({ contactSettings }) {
  const [mapLoaded, setMapLoaded] = useState({});
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Fallback settings
  const settings = contactSettings || {
    phoneNumbers: ["052 939 8258", "056 777 0905"],
    emails: ["info@threediamonds.ae"],
    locations: [{
      address: "Al Quoz Industrial Area 3, Dubai, UAE",
      lat: 25.1345,
      lng: 55.2356,
      title: "Main Office",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1781845735043!2d55.2334!3d25.1345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA4JzA0LjIiTiA1NcKwMTQnMDEuMCJF!5e0!3m2!1sen!2sae!4v1234567890!5m2!1sen!2sae"
    }],
    socialLinks: [
      { platform: 'facebook', url: 'https://facebook.com/threediamondsreal-estate' },
      { platform: 'instagram', url: 'https://instagram.com/threediamondsrealestate' }
    ]
  };

  // Process locations to handle both single object and array of objects
  const locations = Array.isArray(settings.locations) 
    ? settings.locations.map((loc, index) => ({
        ...loc,
        name: loc.title || loc.name || `Branch ${index + 1}`, // Use title first, then name, then fallback
        uniqueId: `location-${index}-${loc._id || loc.address?.substring(0, 10) || index}`
      }))
    : settings.locations ? [{
        ...settings.locations,
        name: settings.locations.title || settings.locations.name || "Main Office",
        uniqueId: 'location-main'
      }] : [];

  const activeLocation = locations[activeLocationIndex] || locations[0] || {
    lat: 25.1345,
    lng: 55.2356,
    address: "Al Quoz Industrial Area 3, Dubai, UAE",
    name: "Main Office",
    mapEmbedUrl: "",
    uniqueId: 'location-fallback'
  };

  const openDirections = () => {
    if (activeLocation.lat && activeLocation.lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${activeLocation.lat},${activeLocation.lng}`, '_blank');
    }
  };

  const handleLocationChange = (index) => {
    setActiveLocationIndex(index);
    setShowLocationDropdown(false);
    // Reset map loaded state for new location
    setMapLoaded(prev => ({ ...prev, [index]: false }));
  };

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/threediamond.png"
                alt="Three Diamonds Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span className="text-2xl font-bold">THREE DIAMONDS</span>
            </div>
            <p className="text-gray-400">Real Estate Brokerage & Property Management</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 w-8"><Phone className="w-4 h-4" /></span>
              <div className="flex flex-wrap gap-2">
                {settings.phoneNumbers?.map((phone, idx) => (
                  <a 
                    key={`phone-${idx}-${phone}`} 
                    href={`tel:${phone}`} 
                    className="text-white hover:text-gray-300"
                  >
                    {phone}{idx < settings.phoneNumbers.length - 1 ? ', ' : ''}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 w-8"><Mail className="w-4 h-4" /></span>
              <div className="flex flex-wrap gap-2">
                {settings.emails?.map((email, idx) => (
                  <a 
                    key={`email-${idx}-${email}`} 
                    href={`mailto:${email}`} 
                    className="text-white hover:text-gray-300"
                  >
                    {email}{idx < settings.emails.length - 1 ? ', ' : ''}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              {settings.socialLinks?.map((social, idx) => (
                <a
                  key={`social-${idx}-${social.platform}`}
                  href={social.platform === 'whatsapp' ? `https://wa.me/${social.url.replace(/\D/g, '')}` : social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  title={social.platform}
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Map Section with Location Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800">
            {/* Location Tabs */}
            {locations.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-800 bg-gray-900/30">
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                  {locations.map((location, index) => (
                    <motion.button
                      key={location.uniqueId || `location-tab-${index}`}
                      onClick={() => handleLocationChange(index)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        activeLocationIndex === index
                          ? 'bg-white text-black'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {location.name}
                    </motion.button>
                  ))}
                </div>
                
                {/* Mobile Dropdown Alternative */}
                <div className="relative md:hidden ml-auto">
                  <motion.button
                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{activeLocation.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
                  </motion.button>
                  
                  <AnimatePresence>
                    {showLocationDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg overflow-hidden z-20 border border-gray-700"
                      >
                        {locations.map((location, index) => (
                          <button
                            key={location.uniqueId || `location-dropdown-${index}`}
                            onClick={() => handleLocationChange(index)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                              activeLocationIndex === index ? 'bg-gray-700 text-white' : 'text-gray-300'
                            }`}
                          >
                            {location.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Map Container */}
            <div className="relative w-full h-[300px] md:h-[350px] group">
              {!mapLoaded[activeLocationIndex] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-10">
                  <div className="text-center">
                    <div className="w-10 h-10 border-4 border-gray-700 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-400 text-sm">Loading {activeLocation.name} map...</p>
                  </div>
                </div>
              )}

              {activeLocation.mapEmbedUrl && activeLocation.mapEmbedUrl !== "wsdx" ? (
                <iframe
                  key={`map-${activeLocation.uniqueId || activeLocationIndex}`}
                  src={activeLocation.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => setMapLoaded(prev => ({ ...prev, [activeLocationIndex]: true }))}
                  className="w-full h-full"
                  title={`Three Diamonds Real Estate - ${activeLocation.name}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900/50">
                  <p className="text-gray-500">Map location not available for {activeLocation.name}</p>
                </div>
              )}

              {/* Map Overlay Controls */}
              <div className="absolute bottom-3 right-3 flex gap-2">
                <motion.button
                  onClick={openDirections}
                  className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-black transition-colors border border-gray-700 flex items-center gap-1.5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!activeLocation.lat || !activeLocation.lng || activeLocation.lat === 0}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Directions
                </motion.button>
              </div>

              {/* Mini Location Info Card */}
              <motion.div
                key={`info-card-${activeLocation.uniqueId || activeLocationIndex}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-gray-700 max-w-[200px]"
              >
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">{activeLocation.name}</h4>
                    <p className="text-[10px] text-gray-300 leading-tight">{activeLocation.address}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Map Footer */}
            <div className="px-4 py-2 border-t border-gray-800 flex flex-wrap items-center justify-between gap-2 bg-gray-900/30">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">Interactive Map</span>
                </div>
                <span className="text-gray-700 text-xs">|</span>
                <span className="text-xs text-gray-500">
                  {activeLocation.lat && activeLocation.lat !== 0 ? activeLocation.lat.toFixed(4) : 'N/A'}° N, {activeLocation.lng && activeLocation.lng !== 0 ? activeLocation.lng.toFixed(4) : 'N/A'}° E
                </span>
              </div>

              {activeLocation.lat && activeLocation.lng && activeLocation.lat !== 0 && (
                <motion.a
                  key={`map-link-${activeLocation.uniqueId || activeLocationIndex}`}
                  href={`https://www.google.com/maps/search/?api=1&query=${activeLocation.lat},${activeLocation.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
                  whileHover={{ x: 2 }}
                >
                  <span>View Larger Map</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 pt-8 border-t border-gray-800">
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-gray-400">
              {[
                'property-management',
                'maintenance',
                'research-consultancy',
                'capital-markets',
                'tenant-representation',
                'landlord-agency',
                'technical-service'
              ].map((service, index) => (
                <li key={`service-${index}-${service}`}>
                  <a href={`/services/${service}`} className="hover:text-white transition-colors">
                    {service.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Our Properties', path: '/properties' },
                { name: 'Services', path: '/services' },
                { name: 'Insights', path: '/insights' },
                { name: 'Contact Us', path: '/contact' }
              ].map((link, index) => (
                <li key={`quick-link-${index}-${link.path}`}>
                  <a href={link.path} className="hover:text-white transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{activeLocation.name}</h3>
            <p className="text-gray-400 mb-2 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <span>{activeLocation.address}</span>
            </p>
            <div className="space-y-1 mt-3">
              {settings.phoneNumbers?.slice(0, 2).map((phone, idx) => (
                <p key={`footer-phone-${idx}-${phone}`} className="text-gray-400 text-sm flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-500" />
                  <span>{phone}</span>
                </p>
              ))}
              {settings.emails?.slice(0, 1).map((email, idx) => (
                <p key={`footer-email-${idx}-${email}`} className="text-gray-400 text-sm flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-500" />
                  <span>{email}</span>
                </p>
              ))}
            </div>
            <p className="text-gray-500 mt-3 text-xs">Managed by Three Diamonds Real Estate</p>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} Three Diamonds Real Estate. All rights reserved</p>
          <p className="mt-2 md:mt-0">Dubai's most trusted Real Estate partner since 2021</p>
        </div>
      </div>
    </footer>
  );
}