import React from 'react';
import Image from 'next/image';
import Header from '../../components/Header';

const GoshiCityPage = () => {
  const images = {
    heroBg: "/g3.png",
    passionImg: "/g8.png",
    logoGoshi: "/g1.png",
    logoEst1974: "/g2.png",
    cafeMonkeyHub: "/g4.png",
    contactCard: "/g5.png",
    pawStreetArt: "/g9.png",
  };

  // Grid images array - replace with your actual image paths
  const gridImages = [
    { src: "/g6.png", alt: "Gallery Image 1" },
    { src: "/g10.png", alt: "Gallery Image 2" },
    { src: "/g4.png", alt: "Gallery Image 3" },
    { src: "/g8.png", alt: "Gallery Image 4" },
    { src: "/g9.png", alt: "Gallery Image 5" },
    { src: "/g3.png", alt: "Gallery Image 6" },
    { src: "/g5.png", alt: "Gallery Image 7" },
    { src: "/g7.png", alt: "Gallery Image 8" },
  ];

  return (
    <>
      <Header />
      <div className="font-sans bg-white text-gray-900">
        {/* Hero Section - Inspired by Page 2 layout */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={images.heroBg}
              alt="Goshi Warehouses City interior"
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              DISCOVER the potential within
              <span className="block text-4xl md:text-6xl mt-2">PREMIUM SPACES</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              GOSHI WAREHOUSES CITY, proudly managed by Three Diamonds Real Estate,
              stands as a distinguished commercial destination in the heart of Al Quoz
              Industrial Area 3, Dubai.
            </p>
            <div className="mt-8">
              <a href="#contact" className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-md transition-colors">
                Explore Spaces
              </a>
            </div>
          </div>
        </section>

        {/* Introduction / Overview - Detailed text from PDF Page 2 */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                Where Industrial Heritage Meets Modern Vision
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                This cutting-edge complex redefines industrial excellence by offering
                an eclectic mix of premium warehouse spaces tailored to accommodate a
                variety of ventures — from health and wellness centers to high-end
                boutiques, contemporary art galleries, photography studios, and luxury
                showrooms.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Established in 1974, Goshi Warehouses City brings decades of legacy
                into a vibrant hub for creators, entrepreneurs, and established brands.
              </p>
            </div>
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src={images.cafeMonkeyHub}
                alt="Warehouse interior with art gallery setup"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Passion and Success Quote Section - Page 4 */}
        <section className="relative py-24 px-4 flex items-center justify-center text-center">
          <div className="absolute inset-0 z-0">
            <Image
              src={images.passionImg}
              alt="Creative workspace with passion"
              fill
              className="object-cover brightness-25"
            />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              "SUCCESS FINDS THOSE WHO ARE TOO DRIVEN BY THEIR PASSION TO SEEK IT OUT"
            </h2>
          </div>
        </section>

        {/* NEW SECTION: Grid Images with Centered Text */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            {/* Grid Container */}
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[120%] h-[120%] bg-gradient-radial from-amber-100/20 via-transparent to-transparent rounded-full"></div>
              </div>
              
              {/* Image Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 relative z-10">
                {gridImages.map((image, index) => (
                  <div 
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer group"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Optional overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                  </div>
                ))}
              </div>
              
              {/* Centered Text Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl max-w-xs md:max-w-md text-center transform transition-all duration-500 hover:scale-105">
                  <h3 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
                    UNLEASH THE
                  </h3>
                  <p className="text-3xl md:text-5xl font-black text-amber-600 mb-2">
                    POTENTIAL
                  </p>
                  <h3 className="text-2xl md:text-4xl font-bold text-gray-800">
                    OF EXCEPTIONAL SPACES
                  </h3>
                  <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Optional description text below grid */}
            <div className="text-center mt-12 max-w-3xl mx-auto">
              <p className="text-gray-600 text-lg">
                Discover versatile spaces designed to inspire creativity, foster innovation, 
                and elevate your business to new heights.
              </p>
            </div>
          </div>
        </section>

        {/* Strategic Location Section - Page 3 */}
        <section className="bg-gray-50 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl order-2 md:order-1">
                <Image
                  src={images.pawStreetArt}
                  alt="Al Quoz Industrial Area, Dubai - strategic location"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                  Strategically Positioned for Success
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Nestled within one of Dubai's most dynamic industrial zones, Goshi
                  Warehouses City boasts unparalleled connectivity and visibility.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Its prime location ensures seamless access to major highways and
                  transport networks, positioning businesses for optimum exposure and
                  operational efficiency.
                </p>

              </div>
            </div>
          </div>
        </section>

        {/* Contact & Management Section - inspired by PDF page 1 and g5.png */}
        <section id="contact" className="relative bg-gray-900 text-white py-16 px-4 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={images.contactCard}
              alt="Background"
              fill
              className="object-cover brightness-50"
            />
          </div>

          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60 z-0"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            {/* Logo from g1.png or combined logo */}
            <Image src="/logo-diamond.png" alt="Goshi Warehouses City" width={160} height={60} className="mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-2">Managed by Three Diamonds Real Estate</h3>
            <div className="flex flex-col md:flex-row justify-center gap-6 mt-6 text-lg">
              <div>
                <p className="font-bold">📞 Phone</p>
                <p>052-939 8258</p>
                <p>056-777 0905</p>
              </div>
              <div>
                <p className="font-bold">✉️ Email</p>
                <p>info@threediamonds.ae</p>
              </div>
              <div>
                <p className="font-bold">🌐 Website</p>
                <p>www.threediamonds.ae</p>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              {/* Social / Contact from g5.png style */}
              <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg inline-flex items-center gap-2">
                <span>📱</span>
                <span>@goshi_warehouses_city</span>
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg inline-flex items-center gap-2">
                <span>🏢</span>
                <span>Al Quoz Industrial Area - 3, Dubai - U.A.E</span>
              </div>
            </div>
            <div className="mt-8 text-sm text-gray-300">
              ESTD. 1974 | Since four decades of excellence
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-gray-400 py-6 text-center text-sm">
          <p>© {new Date().getFullYear()} Goshi Warehouses City | Managed by Three Diamonds Real Estate. All rights reserved.</p>
        </footer>
      </div>
    </>

  );
};

export default GoshiCityPage;