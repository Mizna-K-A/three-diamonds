// components/Footer.jsx
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Navigation, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle, Plus, ArrowRight } from 'lucide-react';

const SocialIcon = ({ platform, size = 20, className = "" }) => {
  switch (platform.toLowerCase()) {
    case 'facebook': return <Facebook size={size} className={className} />;
    case 'instagram': return <Instagram size={size} className={className} />;
    case 'twitter':
    case 'x': return <Twitter size={size} className={className} />;
    case 'linkedin': return <Linkedin size={size} className={className} />;
    case 'youtube': return <Youtube size={size} className={className} />;
    case 'whatsapp': return <MessageCircle size={size} className={className} />;
    default: return <Plus size={size} className={className} />;
  }
};

export default function Footer({ settings }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeLocationIdx, setActiveLocationIdx] = useState(0);

  // Office locations (sanitized by server action)
  const locations = settings?.locations || [];
  const activeLocation = locations[activeLocationIdx] || locations[0] || {
    title: 'Main Office',
    lat: 25.1345,
    lng: 55.2356,
    address: "Al Quoz Industrial Area 3, Dubai, UAE",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1781845735043!2d55.2334!3d25.1345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA4JzA0LjIiTiA1NcKwMTQnMDEuMCJF!5e0!3m2!1sen!2sae!4v1234567890!5m2!1sen!2sae"
  };

  const phoneNumbers = settings?.phoneNumbers || ['052 939 8258', '056 777 0905'];
  const emails = settings?.emails || ['info@threediamonds.ae'];
  const socialLinks = settings?.socialLinks || [];

  const openDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${activeLocation.lat},${activeLocation.lng}`, '_blank');
  };

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/threediamond.png"
                alt="Three Diamonds Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold tracking-tight">THREE DIAMONDS</span>
            </div>
            <p className="text-gray-400 max-w-sm">Real Estate Brokerage & Property Management. Transforming Dubai's Real Estate Landscape since 2021.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Call Us</p>
                  <a href={`tel:${phoneNumbers[0]}`} className="text-sm text-white hover:text-gray-300 transition-colors">{phoneNumbers[0]}</a>
                </div>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Email Us</p>
                  <a href={`mailto:${emails[0]}`} className="text-sm text-white hover:text-gray-300 transition-colors">{emails[0]}</a>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3">Follow Us</p>
              <div className="flex gap-3">
                {socialLinks.map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.1 }}
                    className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-gray-200 transition-all border border-white/10"
                    title={social.platform}
                  >
                    <SocialIcon platform={social.platform} size={18} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-[#111] rounded-3xl overflow-hidden border border-white/5">
            {/* Location Selector if multiple */}
            {locations.length > 1 && (
              <div className="flex overflow-x-auto gap-1 p-2 bg-black/40 border-b border-white/5 scrollbar-hide">
                {locations.map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setActiveLocationIdx(idx); setMapLoaded(false); }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeLocationIdx === idx ? 'bg-white text-black' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                      }`}
                  >
                    {loc.title || `Location ${idx + 1}`}
                  </button>
                ))}
              </div>
            )}

            <div className="relative w-full h-[350px] md:h-[400px] group">
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-md z-10">
                  <div className="text-center">
                    <div className="w-10 h-10 border-4 border-gray-700 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-400 text-sm">Loading map...</p>
                  </div>
                </div>
              )}

              <iframe
                src={activeLocation.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setMapLoaded(true)}
                className="w-full h-full"
                title={activeLocation.title || "Three Diamonds Real Estate Location"}
              />

              {/* Map Controls */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <motion.button
                  onClick={openDirections}
                  className="bg-black/90 backdrop-blur-md text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-black transition-all border border-white/10 flex items-center gap-2 shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </motion.button>
              </div>

              {/* Info Card */}
              <motion.div
                key={activeLocationIdx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-4 left-4 bg-black/90 backdrop-blur-md rounded-2xl p-4 border border-white/10 max-w-[260px] shadow-2xl"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{activeLocation.title}</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">{activeLocation.address}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Map Footer */}
            <div className="px-6 py-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 bg-black/40">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Active Database View</span>
                </div>
                {activeLocation.lat && activeLocation.lng && (
                  <span className="text-[10px] text-gray-600 font-medium">
                    {activeLocation.lat.toFixed(4)}° N, {activeLocation.lng.toFixed(4)}° E
                  </span>
                )}
              </div>

              <motion.a
                href={`https://www.google.com/maps/search/?api=1&query=${activeLocation.lat},${activeLocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-bold"
                whileHover={{ x: 3 }}
              >
                <span>Google Maps View</span>
                <ArrowRight size={14} className="group-hover:translate-x-1" />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mt-12 py-12 border-t border-white/5">
          <div className="md:col-span-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Our Expertise</h3>
            <ul className="space-y-3 text-sm text-gray-500 font-medium">
              <li><a href='/services/property-management' className="hover:text-white transition-colors">Property Management</a></li>
              <li><a href='/services/maintenance' className="hover:text-white transition-colors">Maintenance</a></li>
              <li><a href='/services/research-consultancy' className="hover:text-white transition-colors">Research & Consultancy</a></li>
              <li><a href='/services/capital-markets' className="hover:text-white transition-colors">Capital Markets</a></li>
              <li><a href='/services/tenant-representation' className="hover:text-white transition-colors">Tenant Representation</a></li>
              <li><a href='/services/technical-service' className="hover:text-white transition-colors">Technical Services</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Explore</h3>
            <ul className="space-y-3 text-sm text-gray-500 font-medium">
              <li><a href="/about" className="hover:text-white transition-colors">About Story</a></li>
              <li><a href="/properties" className="hover:text-white transition-colors">Property Portfolio</a></li>
              <li><a href="/services" className="hover:text-white transition-colors">Our Services</a></li>
              <li><a href="/insights" className="hover:text-white transition-colors">Market Insights</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Get in Touch</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 px-1">Connect with us</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {locations.map((loc, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wide flex items-center gap-2">
                    <MapPin size={14} className="text-red-500" />
                    {loc.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed mb-3">{loc.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em]">
          <p>© {new Date().getFullYear()} Three Diamonds Real Estate Brokerage L.L.C</p>
          <p className="mt-4 md:mt-0 text-white/40">Since 2021 · Dubai, UAE</p>
        </div>
      </div>
    </footer>
  );
}