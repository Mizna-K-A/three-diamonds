// components/Header.jsx
'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Wrench, ChevronDown, Home, Building, Warehouse, Hotel, Building2, ClipboardCheck, Search, TrendingUp, Users, Key } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isPropertiesDropdownOpen, setIsPropertiesDropdownOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobilePropertiesOpen, setIsMobilePropertiesOpen] = useState(false);

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
    { 
      label: 'Services', 
      href: '/services',
      hasDropdown: true,
      dropdownItems: [
        { label: 'All Services', href: '/services', icon: ClipboardCheck },
        { label: 'Property Management', href: '/services/property-management', icon: Building2 },
        { label: 'Maintenance of Property', href: '/services/maintenance', icon: Wrench },
        { label: 'Research and Consultancy', href: '/services/research-consultancy', icon: Search },
        { label: 'Capital Markets', href: '/services/capital-markets', icon: TrendingUp },
        { label: 'Tenant Representation', href: '/services/tenant-representation', icon: Users },
        { label: 'Landlord Agency Leasing', href: '/services/landlord-agency', icon: Key },
      ]
    },
    { 
      label: 'Properties', 
      href: '/properties',
      hasDropdown: true,
      dropdownItems: [
        { label: 'All Properties', href: '/properties', icon: Home },
        { label: 'Residential', href: '/properties?type=residential', icon: Home },
        { label: 'Commercial', href: '/properties?type=commercial', icon: Building },
        { label: 'Industrial', href: '/properties?type=industrial', icon: Warehouse },
        { label: 'Luxury Estates', href: '/properties?type=luxury', icon: Hotel },
        { label: 'New Developments', href: '/properties?type=new-developments', icon: Building2 },
      ]
    },
    { label: 'Contact', href: '/contact' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.services-dropdown') && !event.target.closest('.properties-dropdown')) {
        setIsServicesDropdownOpen(false);
        setIsPropertiesDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
              <div 
                key={item.label} 
                className={`relative ${
                  item.label === 'Services' ? 'services-dropdown' : 
                  item.label === 'Properties' ? 'properties-dropdown' : ''
                }`}
              >
                {item.hasDropdown ? (
                  <>
                    <button
                      className="font-medium text-white hover:text-gray-300 transition-colors duration-300 flex items-center gap-1"
                      onClick={() => {
                        if (item.label === 'Services') {
                          setIsServicesDropdownOpen(!isServicesDropdownOpen);
                          setIsPropertiesDropdownOpen(false);
                        } else if (item.label === 'Properties') {
                          setIsPropertiesDropdownOpen(!isPropertiesDropdownOpen);
                          setIsServicesDropdownOpen(false);
                        }
                      }}
                      onMouseEnter={() => {
                        if (item.label === 'Services') {
                          setIsServicesDropdownOpen(true);
                          setIsPropertiesDropdownOpen(false);
                        } else if (item.label === 'Properties') {
                          setIsPropertiesDropdownOpen(true);
                          setIsServicesDropdownOpen(false);
                        }
                      }}
                    >
                      {item.label}
                      <ChevronDown size={16} className={`transition-transform duration-300 ${
                        (item.label === 'Services' && isServicesDropdownOpen) || 
                        (item.label === 'Properties' && isPropertiesDropdownOpen) ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {((item.label === 'Services' && isServicesDropdownOpen) || 
                      (item.label === 'Properties' && isPropertiesDropdownOpen)) && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-sm rounded-lg shadow-xl py-2 border border-gray-800"
                        onMouseLeave={() => {
                          if (item.label === 'Services') {
                            setIsServicesDropdownOpen(false);
                          } else if (item.label === 'Properties') {
                            setIsPropertiesDropdownOpen(false);
                          }
                        }}
                      >
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.label}
                            href={dropdownItem.href}
                            className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors duration-300 flex items-center gap-3"
                            onClick={() => {
                              if (item.label === 'Services') {
                                setIsServicesDropdownOpen(false);
                              } else if (item.label === 'Properties') {
                                setIsPropertiesDropdownOpen(false);
                              }
                            }}
                          >
                            {dropdownItem.icon && <dropdownItem.icon size={18} />}
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="font-medium text-white hover:text-gray-300 transition-colors duration-300 flex items-center gap-1"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
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
                <div key={item.label}>
                  {item.hasDropdown ? (
                    <>
                      <button
                        className="font-medium py-2 text-white hover:text-gray-300 transition-colors duration-300 flex items-center justify-between w-full"
                        onClick={() => {
                          if (item.label === 'Services') {
                            setIsMobileServicesOpen(!isMobileServicesOpen);
                            setIsMobilePropertiesOpen(false);
                          } else if (item.label === 'Properties') {
                            setIsMobilePropertiesOpen(!isMobilePropertiesOpen);
                            setIsMobileServicesOpen(false);
                          }
                        }}
                      >
                        {item.label}
                        <ChevronDown size={16} className={`transition-transform duration-300 ${
                          (item.label === 'Services' && isMobileServicesOpen) || 
                          (item.label === 'Properties' && isMobilePropertiesOpen) ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {/* Mobile Dropdown */}
                      {((item.label === 'Services' && isMobileServicesOpen) || 
                        (item.label === 'Properties' && isMobilePropertiesOpen)) && (
                        <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-700 pl-4">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.label}
                              href={dropdownItem.href}
                              className="block py-2 text-white hover:text-gray-300 transition-colors duration-300 flex items-center gap-2"
                              onClick={() => {
                                setIsMenuOpen(false);
                                if (item.label === 'Services') {
                                  setIsMobileServicesOpen(false);
                                } else if (item.label === 'Properties') {
                                  setIsMobilePropertiesOpen(false);
                                }
                              }}
                            >
                              {dropdownItem.icon && <dropdownItem.icon size={16} />}
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block font-medium py-2 text-white hover:text-gray-300 transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}