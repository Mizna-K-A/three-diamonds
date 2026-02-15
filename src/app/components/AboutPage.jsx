'use client';

import { useState, useEffect } from 'react';
import { Award, Users, Target, Briefcase, Calendar, MapPin, Phone, Mail, Globe, Facebook, ChevronRight } from 'lucide-react';
import About from './About';
import Portfolio from './Portfolio';

export default function AboutPage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const stats = [
        { label: 'Years of Experience', value: '15+', icon: Calendar },
        { label: 'Properties Managed', value: '500+', icon: Briefcase },
        { label: 'Happy Clients', value: '1000+', icon: Users },
        { label: 'Team Members', value: '50+', icon: Award },
    ];

    const timelineEvents = [
        {
            year: '1974',
            title: 'Goshi Warehouses City Established',
            description: 'Foundation of iconic warehouse complex in Al Quoz Industrial Area-3'
        },
        {
            year: '2021',
            title: 'Three Diamonds Real Estate Founded',
            description: 'Launched by Saji Kumar with a mission to transform Dubai\'s real estate landscape'
        },
        {
            year: 'Present',
            title: 'Managing Goshi Warehouses City',
            description: 'Proudly managing one of Dubai\'s most distinguished commercial destinations'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-90"></div>
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className={`relative z-10 text-center max-w-4xl mx-auto px-4 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                        About Three Diamonds
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8">
                        Transforming Dubai's Real Estate Landscape Since 2021
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-gray-600 to-white mx-auto"></div>
                </div>
            </section>

            {/* Our Story Section */}
            <About />
            {/* <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 transition-all duration-1000 delay-200 transform ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}>
              <h2 className="text-4xl font-bold text-white mb-4">How We Began</h2>
              <div className="w-20 h-1 bg-gray-600 mb-6"></div>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our story began with a spark of trust. A single call from our landlord entrusting us 
                with their property ignited a fire in our hearts. We saw it as more than just bricks 
                and mortar. It was a chance to turn dreams into reality for both landlords and clients.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                With that, we embarked on a journey to become Dubai's trusted partner, unlocking the 
                full potential of every property and empowering a vibrant real estate community.
              </p>
            </div>
            <div className={`relative h-[400px] rounded-lg overflow-hidden shadow-2xl transition-all duration-1000 delay-400 transform ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 border-2 border-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">3D</span>
                  </div>
                  <p className="text-gray-400">Three Diamonds Real Estate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

            {/* Mission & Vision */}
            {/* <section className="py-20 px-4 bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`bg-gray-900 p-8 rounded-lg border border-gray-800 hover:border-gray-700 transition-all duration-500 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <Target className="w-12 h-12 text-white mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed">
                Fueled by a passion and commitment for connecting people with their dream properties, 
                we strive to be Dubai's most trusted Real Estate partners through exceptional service 
                and a dedication to excellence. We empower our clients to achieve their Real Estate 
                goals consistently.
              </p>
            </div>
            <div className={`bg-gray-900 p-8 rounded-lg border border-gray-800 hover:border-gray-700 transition-all duration-700 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <Award className="w-12 h-12 text-white mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-400 leading-relaxed">
                To be Dubai's most trusted Real Estate partner delivering seamless property management 
                and exceptional service that empowers landlords to relax and enjoy the peace of mind 
                their investments deserve.
              </p>
            </div>
          </div>
        </div>
      </section> */}





            {/* Why Choose Us */}
            <Portfolio />
            {/* Stats Section */}
            <section className="py-16 px-4 bg-black">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <stat.icon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-gray-500 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 px-4 bg-gray-900">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-4xl font-bold text-white text-center mb-4">Our Journey</h2>
                    <div className="w-20 h-1 bg-gray-600 mx-auto mb-12"></div>

                    <div className="space-y-8">
                        {timelineEvents.map((event, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-24 text-right">
                                    <span className="text-gray-400 font-bold">{event.year}</span>
                                </div>
                                <div className="flex-shrink-0 w-4 h-4 bg-gray-600 rounded-full mt-1.5"></div>
                                <div className="flex-grow pb-8">
                                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                    <p className="text-gray-500">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        Let's turn your Dubai dreams into a sparkling reality with Three Diamonds Real Estate.
                    </p>
                    <a
                        href="#contact"
                        className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
                    >
                        Contact Us Today
                        <ChevronRight className="ml-2 w-5 h-5" />
                    </a>
                </div>
            </section>
        </div>
    );
}