// components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-white rounded-full"></div>
              <span className="text-xl font-bold">THREE DIAMONDS</span>
            </div>
            <p className="text-gray-400">Real Estate Brokerage & Property Management</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400 mb-2">© {new Date().getFullYear()} Three Diamonds Real Estate</p>
            <p className="text-gray-400">All rights reserved</p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>Dubai's most trusted Real Estate partner delivering exceptional service since 2021</p>
        </div>
      </div>
    </footer>
  );
}