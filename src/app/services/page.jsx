import Link from 'next/link';
import { Building2, Wrench, Search, TrendingUp, Users, Key, ArrowRight, HardHat } from 'lucide-react';
import Header from '../components/Header';

export default function ServicesPage() {
 const services = [
    {
      title: 'Property Management',
      description: 'Comprehensive property management services including tenant screening, rent collection, maintenance coordination, and financial reporting.',
      icon: Building2,
      href: '/services/property-management',
      features: ['Tenant Screening', 'Rent Collection', 'Maintenance Coordination', 'Financial Reporting']
    },
    {
      title: 'Maintenance of Property',
      description: 'Professional maintenance services to keep your property in optimal condition, including repairs, renovations, and preventive maintenance.',
      icon: Wrench,
      href: '/services/maintenance',
      features: ['Repairs & Renovations', 'Preventive Maintenance', 'Emergency Services', 'Vendor Management']
    },
    {
      title: 'Research and Consultancy',
      description: 'Expert market research and consultancy services to help you make informed real estate investment decisions.',
      icon: Search,
      href: '/services/research-consultancy',
      features: ['Market Analysis', 'Investment Advisory', 'Feasibility Studies', 'Valuation Services']
    },
    {
      title: 'Capital Markets',
      description: 'Strategic capital markets advisory for real estate investments, acquisitions, and portfolio management.',
      icon: TrendingUp,
      href: '/services/capital-markets',
      features: ['Investment Banking', 'Debt Advisory', 'Equity Placement', 'M&A Advisory']
    },
    {
      title: 'Tenant Representation',
      description: 'Dedicated representation for tenants to find the perfect space and negotiate favorable lease terms.',
      icon: Users,
      href: '/services/tenant-representation',
      features: ['Space Selection', 'Lease Negotiation', 'Market Analysis', 'Relocation Strategy']
    },
    {
      title: 'Landlord Agency Leasing',
      description: 'Professional leasing services for landlords to maximize property value and secure quality tenants.',
      icon: Key,
      href: '/services/landlord-agency',
      features: ['Tenant Sourcing', 'Lease Marketing', 'Rent Optimization', 'Lease Administration']
    },
    {
      title: 'Technical Services',
      description: 'Comprehensive technical due diligence and building consultancy services for property acquisitions, developments, and portfolio management.',
      icon: HardHat, 
      href: '/services/technical-service',
      features: ['Technical Due Diligence', 'Building Surveys', 'Project Monitoring', 'Sustainability Consulting', 'Health & Safety Compliance', 'Condition Assessments']
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive real estate solutions tailored to meet your unique needs
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className="group bg-gray-900 rounded-xl p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300"
              >
                <service.icon className="w-12 h-12 text-gray-300 mb-6 group-hover:text-white transition-colors" />
                <h2 className="text-2xl font-semibold mb-4 group-hover:text-white transition-colors text-gray-200">
                  {service.title}
                </h2>
                <p className="text-gray-400 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center text-gray-300 group-hover:text-white group-hover:gap-2 transition-all">
                  Learn More <ArrowRight className="ml-1 w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}