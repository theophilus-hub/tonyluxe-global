'use client'

import React from "react";
import { BookmarkIcon, MapPinIcon, HomeIcon, Tag, Bath, Bed, Info } from "lucide-react";
import { Card } from "./ui/card";
import Link from "next/link";
import { formatCurrency } from "../lib/utils";

export default function PropertyCard({ property }) {
  return (
    <Link href={`/properties/${property.id}`} className="block cursor-pointer transition-transform hover:scale-[1.02] duration-200">
      <Card className="w-full bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden p-0 m-0">
      <div className="relative">
        <img
          className="w-full h-[240px] object-cover"
          alt="Property exterior"
          src={property.image}
        />
        
      </div>

      <div className="p-4 space-y-2 flex flex-col justify-start items-start">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Tag className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-sm">Price:</span>
            <span className="font-semibold text-sm">
              {formatCurrency(property.price, property.currency)}
              {property.status === 'For Rent' ? '/yr' : ''}
            </span>
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
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-sm">Status:</span>
            <span className="font-semibold text-sm">{property.status}</span>
          </div>
        </div>
      </div>
      </Card>
    </Link>
  );
}
