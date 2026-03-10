// components/Header.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X, Wrench, ChevronDown, Home, Building, Warehouse, Hotel, Building2, ClipboardCheck, Search, TrendingUp, Users, Key, Computer } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Resolve Lucide icon by name string (from PropertyType.icon)
function getIconComponent(name) {
  if (!name) return Home;
  const pascalName = String(name)
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return LucideIcons[pascalName] || Home;
}

export default function Header({ propertyTypes: initialPropertyTypes = [] }) {
  const [propertyTypes, setPropertyTypes] = useState(initialPropertyTypes);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isPropertiesDropdownOpen, setIsPropertiesDropdownOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobilePropertiesOpen, setIsMobilePropertiesOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isLogoVisible, setIsLogoVisible] = useState(false);

  const servicesRef = useRef(null);
  const propertiesRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const headerRef = useRef(null);
  const logoRef = useRef(null);

  // Sync server-passed property types or fetch when empty (client pages)
  useEffect(() => {
    if (initialPropertyTypes?.length > 0) {
      setPropertyTypes(initialPropertyTypes);
      return;
    }
    fetch('/api/property-types')
      .then((res) => res.json())
      .then((data) => setPropertyTypes(Array.isArray(data) ? data : []))
      .catch(() => setPropertyTypes([]));
  }, [initialPropertyTypes]);

  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close mobile menu on larger screens
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        setIsMobileServicesOpen(false);
        setIsMobilePropertiesOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Trigger logo animation after component mounts
    setTimeout(() => {
      setIsLogoVisible(true);
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle click outside for desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setIsServicesDropdownOpen(false);
      }
      if (propertiesRef.current && !propertiesRef.current.contains(event.target)) {
        setIsPropertiesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle click outside for mobile menu
  useEffect(() => {
    const handleClickOutsideMobile = (event) => {
      if (isMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('button') &&
        windowWidth < 768) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideMobile);
    return () => document.removeEventListener('mousedown', handleClickOutsideMobile);
  }, [isMenuOpen, windowWidth]);

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
      setIsMobileServicesOpen(false);
      setIsMobilePropertiesOpen(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen && windowWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, windowWidth]);

  // Build Properties dropdown from dynamic property types (server-rendered)
  const propertiesDropdownItems = [
    { label: 'All Properties', href: '/properties', icon: Home },
    ...propertyTypes.map((type) => ({
      label: type.name,
      href: `/properties?type=${encodeURIComponent(type.slug)}`,
      icon: getIconComponent(type.icon),
    })),
  ];

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
        { label: 'Maintenance', href: '/services/maintenance', icon: Wrench },
        { label: 'Research & Consultancy', href: '/services/research-consultancy', icon: Search },
        { label: 'Capital Markets', href: '/services/capital-markets', icon: TrendingUp },
        { label: 'Tenant Representation', href: '/services/tenant-representation', icon: Users },
        { label: 'Landlord Agency', href: '/services/landlord-agency', icon: Key },
        { label: 'Techinical Services', href: '/services/technical-service', icon: Computer },
      ]
    },
    {
      label: 'Properties',
      href: '/properties',
      hasDropdown: true,
      dropdownItems: propertiesDropdownItems,
    },
    { label: 'Insights', href: '/insights' },
    { label: 'Contact Us', href: '/contact' },
  ];

  // Responsive logo sizing
  const getLogoSizes = () => {
    if (windowWidth < 640) { // mobile
      return {
        scrolled: { width: 32, height: 32 },
        normal: { width: 120, height: 36 }
      };
    } else if (windowWidth < 1024) { // tablet
      return {
        scrolled: { width: 36, height: 36 },
        normal: { width: 140, height: 42 }
      };
    } else { // desktop
      return {
        scrolled: { width: 40, height: 40 },
        normal: { width: 160, height: 48 }
      };
    }
  };

  const logoSizes = getLogoSizes();

  // Get header height for mobile menu positioning
  const getHeaderHeight = () => {
    if (windowWidth < 640) return '56px'; // mobile
    if (windowWidth < 768) return '64px'; // small tablet
    return '72px'; // tablet/desktop
  };

  return (
    <header
      ref={headerRef}
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
          ? 'bg-black/95 backdrop-blur-md shadow-lg py-2 md:py-3'
          : 'bg-transparent py-3 md:py-4'
        } ${isMenuOpen ? 'bg-black' : ''}`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo with sliding animation */}
          <Link 
            href="/" 
            className="flex items-center shrink-0 overflow-hidden"
            ref={logoRef}
          >
            <div 
              className={`transform transition-transform duration-700 ease-out ${
                isLogoVisible ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              {isScrolled ? (
                <Image
                  src="/threediamond.png"
                  alt="Three Diamonds Real Estate"
                  width={logoSizes.scrolled.width}
                  height={logoSizes.scrolled.height}
                  className="object-contain"
                  priority
                />
              ) : (
                <Image
                  src="/logo-diamond.png"
                  alt="Three Diamonds Real Estate"
                  width={logoSizes.normal.width}
                  height={logoSizes.normal.height}
                  className="object-contain"
                  priority
                />
              )}
            </div>
          </Link>

          {/* Desktop Navigation (tablet and up) */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                ref={
                  item.label === 'Services' ? servicesRef :
                    item.label === 'Properties' ? propertiesRef :
                      null
                }
              >
                {item.hasDropdown ? (
                  <>
                    <button
                      className="font-medium text-white hover:text-gray-300 transition-colors duration-300 flex items-center gap-1 text-sm lg:text-base whitespace-nowrap px-2 py-1"
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
                        if (windowWidth >= 1024) { // Only on desktop
                          if (item.label === 'Services') {
                            setIsServicesDropdownOpen(true);
                            setIsPropertiesDropdownOpen(false);
                          } else if (item.label === 'Properties') {
                            setIsPropertiesDropdownOpen(true);
                            setIsServicesDropdownOpen(false);
                          }
                        }
                      }}
                      aria-expanded={
                        (item.label === 'Services' && isServicesDropdownOpen) ||
                        (item.label === 'Properties' && isPropertiesDropdownOpen)
                      }
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        size={windowWidth < 1024 ? 14 : 16}
                        className={`transition-transform duration-300 ${(item.label === 'Services' && isServicesDropdownOpen) ||
                            (item.label === 'Properties' && isPropertiesDropdownOpen) ? 'rotate-180' : ''
                          }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {((item.label === 'Services' && isServicesDropdownOpen) ||
                      (item.label === 'Properties' && isPropertiesDropdownOpen)) && (
                        <div
                          className={`absolute top-full left-0 mt-2 ${windowWidth < 1024 ? 'w-56' : 'w-64'
                            } bg-black/95 backdrop-blur-sm rounded-lg shadow-xl py-2 border border-gray-800`}
                          onMouseLeave={() => {
                            if (windowWidth >= 1024) {
                              if (item.label === 'Services') {
                                setIsServicesDropdownOpen(false);
                              } else if (item.label === 'Properties') {
                                setIsPropertiesDropdownOpen(false);
                              }
                            }
                          }}
                        >
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.label}
                              href={dropdownItem.href}
                              className={`block px-4 py-2.5 lg:py-3 text-white hover:bg-gray-800 transition-colors duration-300 flex items-center gap-3 ${windowWidth < 1024 ? 'text-sm' : 'text-base'
                                }`}
                              onClick={() => {
                                if (item.label === 'Services') {
                                  setIsServicesDropdownOpen(false);
                                } else if (item.label === 'Properties') {
                                  setIsPropertiesDropdownOpen(false);
                                }
                              }}
                            >
                              {dropdownItem.icon && <dropdownItem.icon size={windowWidth < 1024 ? 16 : 18} />}
                              <span className="truncate">{dropdownItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="font-medium text-white hover:text-gray-300 transition-colors duration-300 flex items-center gap-1 text-sm lg:text-base whitespace-nowrap px-2 py-1"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button (mobile only) */}
          <button
            className="md:hidden text-white transition-colors duration-300 p-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation (mobile only) - FIXED POSITIONING */}
        {isMenuOpen && (
          <div
            ref={mobileMenuRef}
            className={`md:hidden fixed left-0 w-full bg-black/98 backdrop-blur-sm transition-all duration-300 overflow-y-auto ${isScrolled ? 'top-[57px]' : 'top-[60px]'
              }`}
            style={{
              height: `calc(100vh - ${getHeaderHeight()})`,
              zIndex: 40
            }}
          >
            <div className="container mx-auto px-4 py-4 sm:py-6">
              <div className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <div key={item.label} className="border-b border-gray-800 last:border-0">
                    {item.hasDropdown ? (
                      <>
                        <button
                          className="font-medium py-3 sm:py-4 text-white hover:text-gray-300 transition-colors duration-300 flex items-center justify-between w-full text-left"
                          onClick={() => {
                            if (item.label === 'Services') {
                              setIsMobileServicesOpen(!isMobileServicesOpen);
                              setIsMobilePropertiesOpen(false);
                            } else if (item.label === 'Properties') {
                              setIsMobilePropertiesOpen(!isMobilePropertiesOpen);
                              setIsMobileServicesOpen(false);
                            }
                          }}
                          aria-expanded={
                            (item.label === 'Services' && isMobileServicesOpen) ||
                            (item.label === 'Properties' && isMobilePropertiesOpen)
                          }
                        >
                          <span className="text-base sm:text-lg">{item.label}</span>
                          <ChevronDown
                            size={18}
                            className={`transition-transform duration-300 ${(item.label === 'Services' && isMobileServicesOpen) ||
                                (item.label === 'Properties' && isMobilePropertiesOpen) ? 'rotate-180' : ''
                              }`}
                          />
                        </button>

                        {/* Mobile Dropdown */}
                        {((item.label === 'Services' && isMobileServicesOpen) ||
                          (item.label === 'Properties' && isMobilePropertiesOpen)) && (
                            <div className="ml-3 sm:ml-4 mt-1 mb-2 space-y-2 border-l-2 border-gray-700 pl-3 sm:pl-4">
                              {item.dropdownItems.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.label}
                                  href={dropdownItem.href}
                                  className="block py-2 sm:py-2.5 text-white hover:text-gray-300 transition-colors duration-300 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
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
                                  <span>{dropdownItem.label}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="block font-medium py-3 sm:py-4 text-white hover:text-gray-300 transition-colors duration-300 text-base sm:text-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for when mobile menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden"
          style={{ zIndex: 30, top: getHeaderHeight() }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}