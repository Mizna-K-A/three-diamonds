import Header from '../../../app/components/Header';
import { TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ServiceNavigation from '../ServiceNavigation';

export default function CapitalMarketsPage() {
  const features = [
    'Investment Banking',
    'Debt Advisory',
    'Equity Placement',
    'M&A Advisory',
    'Portfolio Analysis',
    'Capital Raising',
    'Structured Finance',
    'Joint Ventures'
  ];

  const benefits = [
    'Access to capital',
    'Strategic advisory',
    'Market expertise',
    'Deal structuring',
    'Network of investors'
  ];

  return (
   <>
   <Header/>
    <main className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <ServiceNavigation/>
        
        {/* Header */}
        <div className="mb-12">
          <TrendingUp className="w-16 h-16 text-gray-300 mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Capital Markets</h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            Strategic capital markets advisory for real estate investments, acquisitions, and portfolio management.
          </p>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-gray-400 mb-4">
              Our capital markets team provides comprehensive advisory services for real estate investments and transactions. 
              We connect clients with capital sources and structure deals that optimize returns.
            </p>
            <p className="text-gray-400">
              From debt financing to equity placement, we guide you through the complex world of real estate capital markets, 
              ensuring you have the resources needed to execute your investment strategy.
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
          <h2 className="text-3xl font-bold mb-4">Looking to Optimize Your Capital Structure?</h2>
          <p className="text-xl mb-8 text-gray-400">Contact our capital markets team today</p>
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