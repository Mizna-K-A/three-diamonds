import Header from '../../../app/components/Header';
import { Building2, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ServiceNavigation from '../ServiceNavigation';

export default function PropertyManagementPage() {
  const features = [
    'Tenant Screening and Selection',
    'Rent Collection and Financial Reporting',
    '24/7 Maintenance Coordination',
    'Property Inspections',
    'Lease Administration',
    'Eviction Processing',
    'Vendor Management',
    'Budget Planning'
  ];

  const benefits = [
    'Maximized rental income',
    'Reduced vacancy rates',
    'Professional tenant management',
    'Legal compliance assurance',
    'Stress-free ownership'
  ];

  return (
    <>
    <Header/>
    <main className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <ServiceNavigation/>
        
        {/* Header */}
        <div className="mb-12">
          <Building2 className="w-16 h-16 text-gray-300 mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Property Management</h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            Comprehensive property management solutions that maximize your investment returns while minimizing your stress.
          </p>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-gray-400 mb-4">
              Our property management services are designed to protect and enhance the value of your real estate investments. 
              We handle every aspect of property operations, from tenant screening to maintenance coordination, ensuring 
              your properties are well-maintained and profitable.
            </p>
            <p className="text-gray-400">
              With years of experience in the real estate industry, our team provides personalized attention to each property, 
              treating every asset as if it were our own. We combine local market expertise with professional management 
              practices to deliver exceptional results.
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h3 className="text-xl font-semibold mb-4">Why Choose Us</h3>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">Our Services Include</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:bg-gray-800 transition-colors">
                <CheckCircle className="w-5 h-5 text-gray-300 mb-3" />
                <h3 className="font-medium text-gray-200">{feature}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gray-900 rounded-2xl p-12 text-center border border-gray-800">
          <h2 className="text-3xl font-bold mb-4">Ready to Maximize Your Property's Potential?</h2>
          <p className="text-xl mb-8 text-gray-400">Contact us today to discuss your property management needs</p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors border border-gray-600"
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
    
    </>
  );
}