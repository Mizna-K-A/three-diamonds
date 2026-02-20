// components/Footer.jsx
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Navigation, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const [mapLoaded, setMapLoaded] = useState(false);

  // Office coordinates for Three Diamonds Real Estate
  const officeLocation = {
    lat: 25.1345,
    lng: 55.2356,
    address: "Al Quoz Industrial Area 3, Dubai, UAE"
  };

  // Google Maps embed URL
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1781845735043!2d55.2334!3d25.1345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA4JzA0LjIiTiA1NcKwMTQnMDEuMCJF!5e0!3m2!1sen!2sae!4v1234567890!5m2!1sen!2sae";

  const openDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${officeLocation.lat},${officeLocation.lng}`, '_blank');
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
              <span className="text-gray-400 w-8">📞:</span>
              <a href="tel:0529398258" className="text-white hover:text-gray-300">0529398258,0567770905</a>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 w-8">📧:</span>
              <a href="mailto:info@threediamonds.ae" className="text-white hover:text-gray-300">info@threediamonds.ae</a>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 w-8">ⓕ:</span>
              <a href="#" className="text-white hover:text-gray-300">threediamondsreal-estate</a>
            </div>
          </div>
        </div>

        {/* Map Section - Styled like property details page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800">
            {/* Map Container */}
            <div className="relative w-full h-[300px] md:h-[350px] group">
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-10">
                  <div className="text-center">
                    <div className="w-10 h-10 border-4 border-gray-700 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-400 text-sm">Loading map...</p>
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
              <div className="absolute bottom-3 right-3 flex gap-2">
                <motion.button
                  onClick={openDirections}
                  className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-black transition-colors border border-gray-700 flex items-center gap-1.5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Directions
                </motion.button>
              </div>

              {/* Mini Location Info Card */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
                className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-gray-700 max-w-[200px]"
              >
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">Three Diamonds</h4>
                    <p className="text-[10px] text-gray-300 leading-tight">{officeLocation.address}</p>
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
                  {officeLocation.lat.toFixed(4)}° N, {officeLocation.lng.toFixed(4)}° E
                </span>
              </div>
              
              <motion.a
                href={`https://www.google.com/maps/search/?api=1&query=${officeLocation.lat},${officeLocation.lng}`}
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
            </div>
          </div>
        </motion.div>
        
        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 pt-8 border-t border-gray-800">
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Commercial Leasing</li>
              <li>Residential Leasing</li>
              <li>Business Solutions</li>
              <li>Property Management</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our Properties</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Goshi Warehouses City</h3>
            <p className="text-gray-400 mb-2 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <span>Al Quoz Industrial Area - 3, Dubai - U.A.E</span>
            </p>
            <div className="space-y-1 mt-3">
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-500" />
                <span>052-939 8258 · 056-777 0905</span>
              </p>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-500" />
                <span>info@threediamonds.ae</span>
              </p>
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