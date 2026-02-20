import Header from '../../../app/components/Header';
import { Key, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ServiceNavigation from '../ServiceNavigation';

export default function LandlordAgencyPage() {
  const features = [
    'Tenant Sourcing',
    'Lease Marketing',
    'Rent Optimization',
    'Lease Administration',
    'Market Analysis',
    'Property Showings',
    'Tenant Screening',
    'Lease Renewals'
  ];

  const benefits = [
    'Quality tenants',
    'Maximum rental income',
    'Reduced vacancy',
    'Professional marketing',
    'Expert negotiation'
  ];

  return (
   <>
   <Header/>
    <main className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <ServiceNavigation/>
        
        {/* Header */}
        <div className="mb-12">
          <Key className="w-16 h-16 text-gray-300 mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Landlord Agency Leasing</h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            Professional leasing services for landlords to maximize property value and secure quality tenants.
          </p>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-gray-400 mb-4">
              Our landlord agency services help property owners maximize their investment returns through strategic leasing. 
              We market your property effectively, screen tenants thoroughly, and negotiate leases that protect your interests.
            </p>
            <p className="text-gray-400">
              With our extensive network and market expertise, we minimize vacancy periods and secure quality tenants who 
              pay on time and care for your property.
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
          <h2 className="text-3xl font-bold mb-4">Ready to Lease Your Property?</h2>
          <p className="text-xl mb-8 text-gray-400">Contact us today for professional landlord agency services</p>
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