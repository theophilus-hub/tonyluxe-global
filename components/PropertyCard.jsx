'use client'

import React from "react";
import { BookmarkIcon, MapPinIcon, HomeIcon } from "lucide-react";
import { Card } from "./ui/card";

export default function PropertyCard({ property }) {
  return (
    <Card className="w-full bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative">
        <img
          className="w-full h-[240px] object-cover"
          alt="Property exterior"
          src={property.image}
        />
        <button className="absolute top-3 right-3 bg-white p-1.5 rounded shadow-sm">
          <BookmarkIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2v20M2 5h7.5a3.5 3.5 0 0 1 0 7H2M2 12h7.5a3.5 3.5 0 0 1 0 7H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="font-medium text-sm">Price:</span>
            <span className="font-semibold text-sm">{property.price}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <MapPinIcon className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-sm">Location:</span>
            <span className="font-semibold text-sm">{property.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <HomeIcon className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-sm">Bedrooms/bathrooms:</span>
            <span className="font-semibold text-sm">{property.bedBath}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
