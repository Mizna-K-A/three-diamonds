'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageGallery({ images, title }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length > 0 && active >= images.length) {
      setActive(0);
    }
  }, [images, active]);

  if (!images?.length) return null;

  // Get main image URL
  const getMainImageUrl = (image) => {
    // For complex schema (with webp)
    if (image.webp) {
      return image.webp?.medium?.url ||
        image.webp?.large?.url ||
        image.webp?.small?.url ||
        image.webp?.thumbnail?.url ||
        image.webp?.original?.url ||
        null;
    }
    // For simplified schema
    return image.url || null;
  };

  // Get thumbnail URL
  const getThumbnailUrl = (image) => {
    // For complex schema (with webp)
    if (image.webp) {
      return image.webp?.thumbnail?.url ||
        image.webp?.small?.url ||
        image.webp?.medium?.url ||
        null;
    }
    // For simplified schema
    return image.thumbnailUrl || image.url || null;
  };

  const mainImages = images.map(getMainImageUrl).filter(Boolean);
  const thumbnails = images.map((img, i) => ({
    url: getThumbnailUrl(img) || mainImages[i],
    alt: img.alt || `${title} - Image ${i + 1}`
  })).filter(t => t.url);

  if (mainImages.length === 0) return null;

  const prev = () => setActive((i) => Math.max(0, i - 1));
  const next = () => setActive((i) => Math.min(mainImages.length - 1, i + 1));

  return (
    <>
      {/* Main Image */}
      <div className="relative h-[460px] bg-[#0a0a0a] overflow-hidden group">
        <img
          src={mainImages[active]}
          alt={thumbnails[active]?.alt || `${title} — photo ${active + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Counter */}
        <div className="absolute bottom-4 left-4 text-xs text-white/75 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 font-medium">
          {active + 1} / {mainImages.length}
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
            disabled={active === mainImages.length - 1}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white/85 hover:bg-white/20 disabled:opacity-30 disabled:cursor-default flex items-center justify-center transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      {mainImages.length > 1 && (
        <div className="flex flex-wrap gap-0.5 p-0.5 bg-[#080808]">
          {thumbnails.map((thumb, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              className={`w-[72px] h-16 overflow-hidden cursor-pointer relative transition-all duration-200 ${
                active === i ? 'ring-2 ring-white/90 scale-105 z-10' : ''
              }`}
            >
              <img
                src={thumb.url}
                alt={thumb.alt}
                className={`w-full h-full object-cover transition-all duration-250 ${
                  active === i 
                    ? 'opacity-100' 
                    : 'opacity-60 hover:opacity-80 hover:scale-105'
                }`}
                onError={(e) => {
                  // If thumbnail fails, try to use the main image
                  e.target.src = mainImages[i] || '/placeholder-image.jpg';
                }}
              />
              
              {active === i && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}