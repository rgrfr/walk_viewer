import React from 'react';

const HeroIllustration = () => {
  return (
    <div className="mb-6 rounded-lg overflow-hidden relative">
      <img 
        src="/assets/images/walk_app_header_-_og-image-1753745402745.png" 
        alt="Walk Viewer - Discover Local Walks" 
        className="w-full h-48 object-cover rounded-lg"
      />
      
      {/* Centered title overlay with transparent background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg px-6 py-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Discover Local Walks</h1>
            <p className="text-white/90 text-sm">Find and join group hiking events in your area</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroIllustration;