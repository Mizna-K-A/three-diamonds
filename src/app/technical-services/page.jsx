// app/technical-services/page.tsx
'use client';

import Image from 'next/image';
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

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-black to-gray-900 text-white py-32">
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative container mx-auto px-4 text-center z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700">
              <span className="text-lg font-semibold text-gray-300">TECHNICAL SERVICES</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Three Diamonds</h1>
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-300">Technical Services L.L.C</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8 text-gray-300">
            We are a team of highly skilled technicians dedicated to providing exceptional service 
            and ensuring your comfort year-round.
          </p>
          <p className="text-lg max-w-2xl mx-auto bg-black/50 p-4 rounded-lg border border-gray-800 text-gray-300">
            Welcome to Three Diamonds AC Services, your trusted partner for all your air conditioning needs.
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">Who We Are</h2>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
              <h3 className="text-2xl font-semibold mb-4 text-black">Customer-Focused Approach</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Daily wear and tear can significantly impact the longevity and efficiency of both residential 
                and commercial properties. Our comprehensive annual maintenance services, backed by advanced 
                technology and skilled technicians, offer a range of solutions from routine inspections to 
                emergency repairs. By investing in our annual maintenance contracts (AMCs), you can benefit 
                from proactive maintenance, enhanced safety and hygiene, optimized property performance, 
                24/7 emergency response, and cost-effective solutions. Trust us to keep your property in 
                optimal condition, year-round.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Goals Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-black">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {goals.map((goal, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <goal.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-4 text-black">{goal.title}</h3>
                <p className="text-gray-600 text-center">{goal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-black">Our Vision</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {visionItems.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-4 text-black">{item.title}</h3>
                <p className="text-gray-600 text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-black">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-center mb-2 text-black">{value.title}</h3>
                <p className="text-gray-600 text-sm text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-black">Our Services</h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                  <CheckCircle className="w-5 h-5 text-gray-800 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-black">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center border border-gray-200">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-black">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Contact Us</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Get in touch with us to schedule an appointment, inquire about our services, 
            or simply ask a question. Our friendly team is always happy to assist you.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-10">
            <div className="flex items-center space-x-3 bg-gray-900 px-6 py-3 rounded-full border border-gray-800">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="text-lg text-gray-300">+971 XX XXX XXXX</span>
            </div>
            <div className="flex items-center space-x-3 bg-gray-900 px-6 py-3 rounded-full border border-gray-800">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-lg text-gray-300">info@threediamonds.ae</span>
            </div>
            <div className="flex items-center space-x-3 bg-gray-900 px-6 py-3 rounded-full border border-gray-800">
              <Globe className="w-5 h-5 text-gray-400" />
              <span className="text-lg text-gray-300">www.threediamonds.ae</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="bg-gray-900 text-gray-400 py-4 text-center text-sm border-t border-gray-800">
        <p>Your Comfort, Our Priority</p>
      </div>
    </div>
    </>
  );
}