'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Wrench } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '#services' },
    { label: 'Properties', href: '/properties' },
    { label: 'Technical Services', href: '/technical-services' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black shadow-lg py-2' : 'bg-transparent py-4'
    }`}>
      <nav className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {isScrolled ? (
              <Image
                src="/threediamond.png"
                alt="Three Diamonds Real Estate"
                width={40}
                height={40}
                className="object-contain"
              />
            ) : (
              <Image
                src="/logo-diamond.png"
                alt="Three Diamonds Real Estate"
                width={200}
                height={60}
                className="object-contain"
              />
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-medium text-white hover:text-gray-300 transition-colors duration-300 flex items-center gap-1"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden mt-4 pb-4 fade-in rounded-lg ${
            isScrolled ? 'bg-black shadow-lg' : 'bg-black/90 backdrop-blur-sm'
          }`}>
            <div className="flex flex-col space-y-4 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-medium py-2 text-white hover:text-gray-300 transition-colors duration-300 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}