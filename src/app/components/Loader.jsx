// app/components/Loader.jsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

const Loader = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (you can adjust this or remove for real loading)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center z-[9999]">
        <div className="text-center animate-fadeIn">
          <div className="mb-5 animate-blink">
            <Image
              src="/threediamond.png"
              alt="Loading..."
              width={200}
              height={200}
              priority
              className="filter brightness-90"
            />
          </div>
          <p className="text-gray-300 text-xl font-medium tracking-widest uppercase animate-pulse">
            Loading...
          </p>
        </div>

        <style jsx>{`
          @keyframes blink {
            0% {
              opacity: 1;
              transform: scale(1);
              filter: brightness(1);
            }
            50% {
              opacity: 0.4;
              transform: scale(0.95);
              filter: brightness(1.2);
            }
            100% {
              opacity: 1;
              transform: scale(1);
              filter: brightness(1);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-blink {
            animation: blink 1.5s infinite;
          }

          .animate-fadeIn {
            animation: fadeIn 1s ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  return children;
};

export default Loader;