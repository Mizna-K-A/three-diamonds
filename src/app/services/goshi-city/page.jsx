"use client";

import React from 'react';
import Image from 'next/image';
import Header from '../../components/Header';
import { motion, useInView } from 'framer-motion';

const GoshiCityPage = () => {
  const images = {
    heroBg: "/goshi-city/goshi-city3.webp",
    passionImg: "/goshi-city/goshi-city8.webp",
    logoGoshi: "/goshi-city/goshi-city1.webp",
    logoEst1974: "/goshi-city/goshi-city2.webp",
    cafeMonkeyHub: "/goshi-city/goshi-city4.webp",
    contactCard: "/goshi-city/goshi-city5.webp",
    pawStreetArt: "/goshi-city/goshi-city9.webp",
  };

  // Grid images array - replace with your actual image paths
  const gridImages = [
    { src: "/goshi-city/goshi-city6.webp", alt: "Gallery Image 1" },
    { src: "/goshi-city/goshi-city10.webp", alt: "Gallery Image 2" },
    { src: "/goshi-city/goshi-city7.webp", alt: "Gallery Image 3" },
    { src: "/goshi-city/goshi-city.webp", alt: "Gallery Image 4" },
    { src: "/goshi-city/goshi-city9.webp", alt: "Gallery Image 5" },
    { src: "/goshi-city/goshi-city3.webp", alt: "Gallery Image 6" },
    { src: "/goshi-city/goshi-city5.webp", alt: "Gallery Image 7" },
    { src: "/goshi-city/goshi-city8.webp", alt: "Gallery Image 8" },
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const gridItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Custom hook for scroll animations
  const ScrollReveal = ({ children, variants = fadeInUp }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={variants}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <>
      <Header />
      <div className="font-sans bg-white text-gray-900 overflow-hidden">
        {/* Hero Section - Animated */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <motion.div 
            className="absolute inset-0 z-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <Image
              src={images.heroBg}
              alt="Goshi Warehouses City interior"
              fill
              className="object-cover brightness-50"
              priority
            />
          </motion.div>
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              DISCOVER the potential within
              <motion.span 
                className="block text-4xl md:text-6xl mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                PREMIUM SPACES
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              GOSHI WAREHOUSES CITY, proudly managed by Three Diamonds Real Estate,
              stands as a distinguished commercial destination in the heart of Al Quoz
              Industrial Area 3, Dubai.
            </motion.p>
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.a 
                href="#contact" 
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-md transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Spaces
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* Introduction / Overview - Animated */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal variants={fadeInLeft}>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                  Where Industrial Heritage Meets Modern Vision
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  This cutting-edge complex redefines industrial excellence by offering
                  an eclectic mix of premium warehouse spaces tailored to accommodate a
                  variety of ventures — from health and wellness centers to high-end
                  boutiques, contemporary art galleries, photography studios, and luxury
                  showrooms.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Established in 1974, Goshi Warehouses City brings decades of legacy
                  into a vibrant hub for creators, entrepreneurs, and established brands.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal variants={fadeInRight}>
              <motion.div 
                className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={images.cafeMonkeyHub}
                  alt="Warehouse interior with art gallery setup"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </ScrollReveal>
          </div>
        </section>

        {/* Passion and Success Quote Section - Animated */}
        <section className="relative py-24 px-4 flex items-center justify-center text-center overflow-hidden">
          <motion.div 
            className="absolute inset-0 z-0"
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            <Image
              src={images.passionImg}
              alt="Creative workspace with passion"
              fill
              className="object-cover brightness-25"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/40 z-0"></div>
          <motion.div 
            className="relative z-10 max-w-3xl mx-auto text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              "SUCCESS FINDS THOSE WHO ARE TOO DRIVEN BY THEIR PASSION TO SEEK IT OUT"
            </motion.h2>
          </motion.div>
        </section>

        {/* Grid Images with Centered Text - Animated */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              {/* Background decorative elements */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                <div className="w-[120%] h-[120%] bg-gradient-radial from-amber-100/20 via-transparent to-transparent rounded-full"></div>
              </motion.div>
              
              {/* Image Grid */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 relative z-10"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {gridImages.map((image, index) => (
                  <motion.div 
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer group"
                    variants={gridItemVariants}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <motion.div 
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                    ></motion.div>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Centered Text Overlay */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.div 
                  className="bg-white/90 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl max-w-xs md:max-w-md text-center transform transition-all duration-500"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.h3 
                    className="text-2xl md:text-4xl font-bold text-gray-800 mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    UNLEASH THE
                  </motion.h3>
                  <motion.p 
                    className="text-3xl md:text-5xl font-black text-amber-600 mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.9, type: "spring" }}
                  >
                    POTENTIAL
                  </motion.p>
                  <motion.h3 
                    className="text-2xl md:text-4xl font-bold text-gray-800"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                  >
                    OF EXCEPTIONAL SPACES
                  </motion.h3>
                  <motion.div 
                    className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: 80 }}
                    transition={{ duration: 0.8, delay: 1.3 }}
                  ></motion.div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Optional description text below grid */}
            <ScrollReveal>
              <div className="text-center mt-12 max-w-3xl mx-auto">
                <p className="text-gray-600 text-lg">
                  Discover versatile spaces designed to inspire creativity, foster innovation, 
                  and elevate your business to new heights.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Strategic Location Section - Animated */}
        <section className="bg-gray-50 py-20 px-4 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollReveal variants={fadeInLeft}>
                <motion.div 
                  className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl order-2 md:order-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={images.pawStreetArt}
                    alt="Al Quoz Industrial Area, Dubai - strategic location"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </ScrollReveal>
              <ScrollReveal variants={fadeInRight}>
                <div className="order-1 md:order-2">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                    Strategically Positioned for Success
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Nestled within one of Dubai's most dynamic industrial zones, Goshi
                    Warehouses City boasts unparalleled connectivity and visibility.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Its prime location ensures seamless access to major highways and
                    transport networks, positioning businesses for optimum exposure and
                    operational efficiency.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Contact & Management Section - Animated */}
        <section id="contact" className="relative bg-gray-900 text-white py-16 px-4 overflow-hidden">
          {/* Background Image */}
          <motion.div 
            className="absolute inset-0 z-0"
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            <Image
              src={images.contactCard}
              alt="Background"
              fill
              className="object-cover brightness-50"
            />
          </motion.div>

          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60 z-0"></div>

          <motion.div 
            className="relative z-10 max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Image src="/logo-diamond.png" alt="Goshi Warehouses City" width={160} height={60} className="mx-auto mb-6" />
            </motion.div>
            <motion.h3 
              className="text-2xl font-semibold mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Managed by Three Diamonds Real Estate
            </motion.h3>
            <motion.div 
              className="flex flex-col md:flex-row justify-center gap-6 mt-6 text-lg"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeInUp}>
                <p className="font-bold">📞 Phone</p>
                <p>052-939 8258</p>
                <p>056-777 0905</p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <p className="font-bold">✉️ Email</p>
                <p>info@threediamonds.ae</p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <p className="font-bold">🌐 Website</p>
                <p>www.threediamonds.ae</p>
              </motion.div>
            </motion.div>
            <motion.div 
              className="mt-8 flex justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div 
                className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg inline-flex items-center gap-2"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(55,65,81,0.9)" }}
                transition={{ duration: 0.2 }}
              >
                <span>📱</span>
                <span>@goshi_warehouses_city</span>
              </motion.div>
              <motion.div 
                className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg inline-flex items-center gap-2"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(55,65,81,0.9)" }}
                transition={{ duration: 0.2 }}
              >
                <span>🏢</span>
                <span>Al Quoz Industrial Area - 3, Dubai - U.A.E</span>
              </motion.div>
            </motion.div>
            <motion.div 
              className="mt-8 text-sm text-gray-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              ESTD. 1974 | Since four decades of excellence
            </motion.div>
          </motion.div>
        </section>

        {/* Footer - Animated */}
        <motion.footer 
          className="bg-black text-gray-400 py-6 text-center text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <p>© {new Date().getFullYear()} Goshi Warehouses City | Managed by Three Diamonds Real Estate. All rights reserved.</p>
        </motion.footer>
      </div>
    </>
  );
};

export default GoshiCityPage;