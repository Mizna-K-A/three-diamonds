'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Wrench, Search, TrendingUp, Users, Key, ClipboardCheck, Computer } from 'lucide-react';

export default function ServiceNavigation() {
  const pathname = usePathname();
  
  const services = [
    { name: 'All Services', href: '/services', icon: ClipboardCheck },
    { name: 'Property Management', href: '/services/property-management', icon: Building2 },
    { name: 'Maintenance of Property', href: '/services/maintenance', icon: Wrench },
    { name: 'Research and Consultancy', href: '/services/research-consultancy', icon: Search },
    { name: 'Capital Markets', href: '/services/capital-markets', icon: TrendingUp },
    { name: 'Tenant Representation', href: '/services/tenant-representation', icon: Users },
    { name: 'Landlord Agency Leasing', href: '/services/landlord-agency', icon: Key },
    { name: 'Technique Service', href: '/services/technical-service', icon: Computer },
  ];

  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-2 justify-center">
        {services.map((service) => {
          const isActive = pathname === service.href;
          const Icon = service.icon;
          
          return (
            <Link
              key={service.href}
              href={service.href}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-gray-100 text-gray-900 shadow-lg' 
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
                }
              `}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{service.name}</span>
              <span className="sm:hidden">{service.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}