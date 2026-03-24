// app/properties/[id]/ImageGallery.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageGallery({ images, title }) {
  const [active, setActive] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const thumbnailContainerRef = useRef(null);

  useEffect(() => {
    const urls = images.map(img => {
      return img.webp?.medium?.url || 
             img.webp?.large?.url || 
             img.webp?.small?.url || 
             img.webp?.thumbnail?.url || 
             img.webp?.original?.url || 
             img.url ||
             null;
    }).filter(Boolean);
    
    setImageUrls(urls);
    
    if (urls.length > 0 && active >= urls.length) {
      setActive(0);
    }
  }, [images, active]);

  // Scroll thumbnail into view when active changes
  useEffect(() => {
    if (thumbnailContainerRef.current && imageUrls.length > 0) {
      const thumbnailElement = thumbnailContainerRef.current.children[active];
      if (thumbnailElement) {
        thumbnailElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [active]);

  if (!images?.length || imageUrls.length === 0) return null;

  const prev = () => setActive((i) => Math.max(0, i - 1));
  const next = () => setActive((i) => Math.min(imageUrls.length - 1, i + 1));

  const getThumbnailUrl = (img) => {
    return img.webp?.thumbnail?.url || 
           img.webp?.small?.url || 
           img.webp?.medium?.url || 
           img.url ||
           '/placeholder-image.jpg';
  };

  return (
    <>
      {/* Main Image */}
      <div className="relative h-[460px] bg-[#0a0a0a] overflow-hidden group">
        <img 
          src={imageUrls[active]} 
          alt={`${title} — photo ${active + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        
        {/* Counter */}
        <div className="absolute bottom-4 left-4 text-xs text-white/75 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 font-medium">
          {active + 1} / {imageUrls.length}
        </div>
        
        {/* Navigation Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button 
            onClick={prev} 
            disabled={active === 0}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white/85 hover:bg-white/20 disabled:opacity-30 disabled:cursor-default flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <button 
            onClick={next} 
            disabled={active === imageUrls.length - 1}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white/85 hover:bg-white/20 disabled:opacity-30 disabled:cursor-default flex items-center justify-center transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Thumbnails - Horizontal Scrollable Container */}
      {imageUrls.length > 1 && (
        <div className="relative bg-[#080808]">
          {/* Scroll Buttons */}
          <div className="absolute left-0 top-0 bottom-0 flex items-center z-10">
            <button
              onClick={() => {
                if (thumbnailContainerRef.current) {
                  thumbnailContainerRef.current.scrollBy({
                    left: -200,
                    behavior: 'smooth'
                  });
                }
              }}
              className="w-8 h-8 bg-black/70 backdrop-blur-sm text-white rounded-r-md hover:bg-black/90 transition-colors flex items-center justify-center"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
          
          <div className="absolute right-0 top-0 bottom-0 flex items-center z-10">
            <button
              onClick={() => {
                if (thumbnailContainerRef.current) {
                  thumbnailContainerRef.current.scrollBy({
                    left: 200,
                    behavior: 'smooth'
                  });
                }
              }}
              className="w-8 h-8 bg-black/70 backdrop-blur-sm text-white rounded-l-md hover:bg-black/90 transition-colors flex items-center justify-center"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Scrollable Thumbnails Container */}
          <div
            ref={thumbnailContainerRef}
            className="flex overflow-x-auto gap-0.5 p-0.5 scrollbar-hide"
            style={{
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE/Edge
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {images.map((img, i) => {
              const thumbUrl = getThumbnailUrl(img);
              return (
                <div
                  key={i}
                  onClick={() => setActive(i)}
                  className={`flex-shrink-0 w-[72px] h-16 overflow-hidden cursor-pointer relative transition-opacity ${
                    active === i ? 'ring-2 ring-white/90' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={thumbUrl} 
                    alt={`${title} thumbnail ${i + 1}`}
                    className="w-full h-full object-cover transition-all duration-250 hover:scale-105"
                    onError={(e) => {
                      e.target.src = imageUrls[i] || '/placeholder-image.jpg';
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}