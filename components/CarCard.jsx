'use client'

import React from "react";
import { Card } from "./ui/card";
import { CarIcon, Calendar, Settings, Tag, MapPin } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "../lib/utils";

export default function CarCard({ car }) {
  return (
    <Link href={`/cars/${car.id}`} className="block cursor-pointer transition-transform hover:scale-[1.02] duration-200">
      <Card className="w-full bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden p-0 m-0">
      <div className="relative">
        <img
          className="w-full h-[240px] object-cover"
          alt="Car image"
          src={car.image}
        />
      </div>

      <div className="p-4 space-y-2 flex flex-col justify-start items-start">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Tag className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-sm">Price:</span>
            <span className="font-semibold text-sm">{formatCurrency(car.price, car.currency)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-sm">Condition:</span>
            <span className="font-semibold text-sm">{car.condition || 'Used'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-sm">Location:</span>
            <span className="font-semibold text-sm">{car.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <CarIcon className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-sm">Make/Model:</span>
            <span className="font-semibold text-sm">{car.make}/{car.model}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-sm">Year:</span>
            <span className="font-semibold text-sm">{car.year}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-sm">Status:</span>
            <span className="font-semibold text-sm">{car.status}</span>
          </div>
        </div>
      </div>
      </Card>
    </Link>
  );
}
