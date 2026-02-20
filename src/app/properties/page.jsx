import { Suspense } from 'react';
import Header from '../components/Header';
import PropertiesContent from './PropertiesContent';

export default function PropertiesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
        <Suspense fallback={
          <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
            <div className="text-center">
              <div className="text-white text-xl mb-4">Loading properties...</div>
              <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        }>
          <PropertiesContent />
        </Suspense>
      </main>
    </>
  );
}