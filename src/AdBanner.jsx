import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AdBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-[300px] h-[350px] mx-auto shrink-0 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white dark:bg-white">
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsVisible(false);
        }}
        className="absolute top-2 right-2 z-20 bg-white/90 hover:bg-white text-slate-800 p-1.5 rounded-full shadow-sm backdrop-blur-sm transition-colors border border-slate-200"
        aria-label="Close Advertisement"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Banner Image as Link */}
      <a
        href="https://indianspacehub.com/app"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full"
      >
        <img
          src="https://i.pinimg.com/736x/04/0c/71/040c71a1c7e9864fce5526207528b1ba.jpg"
          alt="Indian Space Hub"
          className="w-full h-full object-cover"
        />
      </a>
    </div>
  );
}
