'use client'

import React from 'react';

export default function LocationMap({ address }) {
  // Lekki Phase 1, Lagos coordinates
  const lat = 6.4350;
  const lng = 3.4700;
  
  // Create the OpenStreetMap URL
  // We're using specific coordinates for Lekki Phase 1, Lagos
  const openStreetMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01}%2C${lat-0.01}%2C${lng+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-md relative">
      {/* OpenStreetMap Embed */}
      <iframe
        title="Location Map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        src={openStreetMapUrl}
        allowFullScreen
      ></iframe>
      
      {/* Overlay with address */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-3 text-sm">
        <strong>Address:</strong> {address}
      </div>
    </div>
  );
}
