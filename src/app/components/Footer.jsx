// components/Footer.jsx
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <Image 
                src="/threediamond.png" 
                alt="Three Diamonds Logo" 
                width={32} 
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span className="text-2xl font-bold">THREE DIAMONDS</span>
            </div>
            <p className="text-gray-400">Real Estate Brokerage & Property Management</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 w-8">📞:</span>
              <a href="tel:0529398258" className="text-white hover:text-gray-300">0529398258,0567770905</a>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 w-8">📧:</span>
              <a href="mailto:info@threediamonds.ae" className="text-white hover:text-gray-300">info@threediamonds.ae</a>
            </div>
            {/* <div className="flex items-center space-x-3">
              <span className="text-gray-400 w-8">🌐:</span>
              <a href="https://www.threediamonds.ae" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">www.threediamonds.ae</a>
            </div> */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 w-8">ⓕ:</span>
              <a href="#" className="text-white hover:text-gray-300">threediamondsreal-estate</a>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 pt-8 border-t border-gray-800">
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Commercial Leasing</li>
              <li>Residential Leasing</li>
              <li>Business Solutions</li>
              <li>Property Management</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Our Properties</a></li>
              <li><a href="#" className="hover:text-white">Services</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Goshi Warehouses City</h3>
            <p className="text-gray-400 mb-2">Al Quoz Industrial Area - 3</p>
            <p className="text-gray-400">Dubai - U.A.E</p>
            <p className="text-gray-400 mt-2 text-sm">Managed by Three Diamonds Real Estate</p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Three Diamonds Real Estate. All rights reserved</p>
          <p className="mt-2 md:mt-0">Dubai's most trusted Real Estate partner since 2021</p>
        </div>
      </div>
    </footer>
  );
}