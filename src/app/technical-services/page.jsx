// app/technical-services/page.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Award, 
  Users, 
  Target, 
  TrendingUp, 
  Heart, 
  Shield, 
  Star,
  Phone,
  Mail,
  Globe,
  Wrench,
  Wind,
  Zap,
  Droplets,
  Paintbrush,
  Hammer,
  Building2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import Header from '../components/Header';

export default function TechnicalServicesPage() {
  const services = [
    "False Ceiling & Light Partitions Installation",
    "Carpentry & Wood Flooring Works",
    "Electrical Fittings & Fixtures Repairing & Maintenance",
    "Building Cleaning Services",
    "Air-Conditioning, Ventilations & Air Filtration Systems",
    "Installation & Maintenance",
    "Plaster Works",
    "Wallpaper Fixing Works",
    "Electromechanical Equipment Installation and Maintenance",
    "Floor & Wall Tiling Works",
    "Plumbing & Sanitary Installation",
    "Engraving & Ornamentation Works"
  ];

  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description: "We are committed to honesty, transparency, and ethical business practices. We believe in delivering on our promises and acting with integrity in all our interactions."
    },
    {
      icon: Star,
      title: "Excellence",
      description: "We strive for excellence in everything we do. We are committed to delivering high-quality services and utilizing the best tools and techniques to ensure your satisfaction."
    },
    {
      icon: Heart,
      title: "Customer Focus",
      description: "We prioritize customer satisfaction and strive to understand and meet your needs. We are dedicated to providing exceptional service and building long-lasting relationships."
    },
    {
      icon: Users,
      title: "Teamwork",
      description: "We believe in the power of collaboration and teamwork. We work together to achieve common goals and provide the best possible service to our clients."
    }
  ];

  const whyChooseUs = [
    {
      icon: Award,
      title: "Expertise",
      description: "Our team of highly skilled and experienced technicians is equipped to handle any AC service with expertise and precision."
    },
    {
      icon: Shield,
      title: "Reliability",
      description: "We are committed to providing prompt and reliable service, ensuring you can always count on us to resolve any AC issues effectively."
    },
    {
      icon: Heart,
      title: "Customer Focus",
      description: "Your satisfaction is our priority. We prioritize clear communication, personalized solutions, and exceptional customer service."
    },
    {
      icon: Target,
      title: "Competitive Pricing",
      description: "We offer competitive pricing and transparent quotes for all our services, ensuring you receive excellent value for your money."
    }
  ];

  const goals = [
    {
      icon: Wind,
      title: "Optimize Comfort",
      description: "Our mission is to optimize your comfort and indoor environment by providing exceptional AC services that ensure a healthy and comfortable living space year-round."
    },
    {
      icon: TrendingUp,
      title: "Enhance Efficiency",
      description: "We strive to maximize the efficiency of your AC system, minimizing energy consumption and reducing your environmental impact while promoting cost-savings."
    },
    {
      icon: Users,
      title: "Build Trust",
      description: "We aim to build long-lasting relationships with our clients based on trust, reliability, and exceptional service."
    }
  ];

  const visionItems = [
    {
      icon: Zap,
      title: "Innovation",
      description: "We envision a future where AC technology continuously evolves to provide even more efficient, sustainable, and comfortable solutions."
    },
    {
      icon: Heart,
      title: "Impact",
      description: "Our vision is to make a positive impact on our community, promoting energy efficiency, environmental responsibility, and comfort for everyone."
    },
    {
      icon: Award,
      title: "Leadership",
      description: "We aspire to be recognized as the leading AC service provider in our community, setting the benchmark for industry standards."
    }
  ];

  // Animation Variants - Modified for replay on every scroll
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -60 },
    transition: { duration: 0.6 }
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.8 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.5 }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
    transition: { duration: 0.6 }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 60 },
    transition: { duration: 0.6 }
  };

  const floatAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseAnimation = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const rotateAnimation = {
    whileHover: { 
      rotate: 360,
      transition: { duration: 0.6 }
    }
  };

  return (
    <>
      <Header/>
      <div className="min-h-screen bg-white">
        {/* Hero Section with Parallax Effect */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative bg-gradient-to-r from-black to-gray-900 text-white overflow-hidden py-32"
        >
          <motion.div 
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1.2 }}
          />
          
          <motion.div 
            className="relative container mx-auto px-4 text-center z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700"
              >
                <span className="text-lg font-semibold text-gray-300">TECHNICAL SERVICES</span>
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Three Diamonds
            </motion.h1>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-light mb-6 text-gray-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Technical Services L.L.C
            </motion.h2>
            
            <motion.p 
              className="text-xl max-w-3xl mx-auto mb-8 text-gray-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              We are a team of highly skilled technicians dedicated to providing exceptional service 
              and ensuring your comfort year-round.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-lg max-w-2xl mx-auto bg-black/50 p-4 rounded-lg border border-gray-800 text-gray-300">
                Welcome to Three Diamonds AC Services, your trusted partner for all your air conditioning needs.
              </p>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <motion.div 
                className="w-1 h-2 bg-gray-400 rounded-full mt-2"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.section>

        {/* Who We Are Section - Modified for replay */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: false, amount: 0.3 }} // Changed to false for replay
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-4">
            <motion.div className="max-w-4xl mx-auto">
              <motion.h2 
                variants={fadeInUp}
                className="text-4xl font-bold text-center mb-12 text-black"
              >
                Who We Are
              </motion.h2>
              
              <motion.div 
                variants={slideInLeft}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 p-8 rounded-2xl border border-gray-200"
              >
                <motion.h3 
                  variants={fadeInUp}
                  className="text-2xl font-semibold mb-4 text-black"
                >
                  Customer-Focused Approach
                </motion.h3>
                <motion.p 
                  variants={fadeInUp}
                  className="text-gray-700 text-lg leading-relaxed"
                >
                  Daily wear and tear can significantly impact the longevity and efficiency of both residential 
                  and commercial properties. Our comprehensive annual maintenance services, backed by advanced 
                  technology and skilled technicians, offer a range of solutions from routine inspections to 
                  emergency repairs. By investing in our annual maintenance contracts (AMCs), you can benefit 
                  from proactive maintenance, enhanced safety and hygiene, optimized property performance, 
                  24/7 emergency response, and cost-effective solutions. Trust us to keep your property in 
                  optimal condition, year-round.
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Our Goals Section - Modified for replay */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: false, amount: 0.2 }} // Changed to false for replay
          className="py-20 bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl font-bold text-center mb-12 text-black"
            >
              Our Mission
            </motion.h2>
            
            <motion.div 
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
              {goals.map((goal, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="bg-white p-8 rounded-xl shadow-lg border border-gray-200"
                >
                  <motion.div 
                    variants={floatAnimation}
                    animate="animate"
                    className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 mx-auto"
                  >
                    <goal.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-center mb-4 text-black">{goal.title}</h3>
                  <p className="text-gray-600 text-center">{goal.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Our Vision Section - Modified for replay */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: false, amount: 0.2 }} // Changed to false for replay
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-4">
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl font-bold text-center mb-12 text-black"
            >
              Our Vision
            </motion.h2>
            
            <motion.div 
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
              {visionItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl border border-gray-200"
                >
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 mx-auto"
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-center mb-4 text-black">{item.title}</h3>
                  <p className="text-gray-600 text-center">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Our Values Section - Modified for replay */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: false, amount: 0.1 }} // Changed to false for replay
          className="py-20 bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl font-bold text-center mb-12 text-black"
            >
              Our Values
            </motion.h2>
            
            <motion.div 
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            >
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                >
                  <motion.div 
                    {...rotateAnimation}
                    className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mb-4 mx-auto"
                  >
                    <value.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-center mb-2 text-black">{value.title}</h3>
                  <p className="text-gray-600 text-sm text-center">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Our Services Section - Modified for replay */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: false, amount: 0.1 }} // Changed to false for replay
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-4">
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl font-bold text-center mb-12 text-black"
            >
              Our Services
            </motion.h2>
            
            <div className="max-w-5xl mx-auto">
              <motion.div 
                variants={staggerContainer}
                className="grid md:grid-cols-2 gap-4"
              >
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    variants={slideInLeft}
                    whileHover={{ 
                      x: 10,
                      backgroundColor: "#f3f4f6",
                      transition: { duration: 0.2 }
                    }}
                    className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-default"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <CheckCircle className="w-5 h-5 text-gray-800 flex-shrink-0 mt-1" />
                    </motion.div>
                    <span className="text-gray-700">{service}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Why Choose Us Section - Modified for replay */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: false, amount: 0.1 }} // Changed to false for replay
          className="py-20 bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl font-bold text-center mb-12 text-black"
            >
              Why Choose Us
            </motion.h2>
            
            <motion.div 
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            >
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="bg-white p-6 rounded-xl shadow-lg text-center border border-gray-200"
                >
                  <motion.div 
                    variants={pulseAnimation}
                    animate="animate"
                    className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 mx-auto"
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2 text-black">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section - Modified for replay */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: false, amount: 0.3 }} // Changed to false for replay
          className="py-16 bg-white"
        >
          <div className="container mx-auto px-4">
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {[
                { number: "500+", label: "Projects Completed" },
                { number: "50+", label: "Expert Technicians" },
                { number: "1000+", label: "Happy Clients" },
                { number: "24/7", label: "Emergency Support" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: false }} // Changed to false for replay
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Section - Modified for replay */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: false, amount: 0.3 }} // Changed to false for replay
          className="py-20 bg-black text-white relative overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black"
            initial={{ x: '-100%' }}
            whileInView={{ x: 0 }}
            viewport={{ once: false }} // Changed to false for replay
            transition={{ duration: 1 }}
          />
          
          <div className="relative container mx-auto px-4 text-center z-10">
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl font-bold mb-6"
            >
              Contact Us
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl mb-8 max-w-2xl mx-auto text-gray-300"
            >
              Get in touch with us to schedule an appointment, inquire about our services, 
              or simply ask a question. Our friendly team is always happy to assist you.
            </motion.p>
            
            <motion.div 
              variants={staggerContainer}
              className="flex flex-col md:flex-row justify-center items-center gap-8 mt-10"
            >
              {[
                { icon: Phone, text: "+971 XX XXX XXXX" },
                { icon: Mail, text: "info@threediamonds.ae" },
                { icon: Globe, text: "www.threediamonds.ae" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: "#1f2937",
                    transition: { duration: 0.2 }
                  }}
                  className="flex items-center space-x-3 bg-gray-900 px-6 py-3 rounded-full border border-gray-800 cursor-pointer"
                >
                  <item.icon className="w-5 h-5 text-gray-400" />
                  <span className="text-lg text-gray-300">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Footer Note with Animation */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }} // Changed to false for replay
          transition={{ duration: 0.8 }}
          className="bg-gray-900 text-gray-400 py-4 text-center text-sm border-t border-gray-800"
        >
          <motion.p
            animate={{ 
              color: ['#9ca3af', '#ffffff', '#9ca3af'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Your Comfort, Our Priority
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}