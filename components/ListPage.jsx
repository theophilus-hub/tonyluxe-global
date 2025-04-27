"use client";

import {
  BanknoteIcon,
  ChevronDownIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { FooterSection } from "./sections/FooterSection";
import NavigationBar from "./navigation/NavigationBar";
import PropertyCard from "./PropertyCard";

export default function ListPage() {
  // Property filter options
  const filterOptions = [
    {
      icon: <MapPinIcon className="w-4 h-4" />,
      label: "Location",
      endIcon: <ChevronDownIcon className="w-4 h-4" />,
    },
    {
      icon: <BanknoteIcon className="w-4 h-4" />,
      label: "Bedrooms",
      endIcon: <ChevronDownIcon className="w-4 h-4" />,
    },
    {
      icon: <BanknoteIcon className="w-4 h-4" />,
      label: "Amenities",
      endIcon: <ChevronDownIcon className="w-4 h-4" />,
    },
    {
      icon: <StarIcon className="w-4 h-4" />,
      label: "Model/make",
      endIcon: <StarIcon className="w-4 h-4" />,
    },
    {
      icon: <BanknoteIcon className="w-4 h-4" />,
      label: "Price",
      endIcon: <ChevronDownIcon className="w-4 h-4" />,
    },
  ];

  // Property type options
  const propertyTypeOptions = [
    { label: "Buy", isActive: true },
    { label: "Rent", isActive: false },
    { label: "Airbnb", isActive: false },
  ];

  // Property data for mapping
  const propertyData = {
    image: "/pexels-pashal-337909-26.png",
    price: "₦2.3 Million/yr",
    location: "Jabi, Abuja",
    bedBath: "1/2",
  };

  // Create array of properties for each column
  const columns = [
    Array(9).fill(propertyData),
    Array(9).fill(propertyData),
    Array(9).fill(propertyData),
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-full max-w-[1440px] relative">
        {/* Navigation */}
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
          <NavigationBar />
        </div>

        {/* Spacer to prevent content overlap with fixed navigation */}
        <div className="h-20 sm:h-24 md:h-28"></div>

        {/* Hero Section */}
        <section className="flex flex-col items-center gap-3 sm:gap-4 py-8 sm:py-10 md:py-12 w-full px-4 sm:px-6">
          <h1 className="font-heading-1 text-black text-2xl sm:text-3xl md:text-4xl text-center tracking-tight leading-tight">
            The best properties for you
          </h1>

          <p className="font-body-text text-gray-800 text-sm sm:text-base md:text-lg text-center tracking-normal leading-relaxed max-w-xs sm:max-w-lg md:max-w-2xl">
            Explore exceptional properties, quality vehicles, and premium Airbnb
            <br className="hidden sm:block" />
            listings—all designed to enhance your everyday life.
          </p>
        </section>

        {/* Property Type Toggle */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 mx-auto mt-6 sm:mt-8 bg-gray-100 rounded-full w-fit">
          {propertyTypeOptions.map((option, index) => (
            <Button
              key={index}
              variant={option.isActive ? "default" : "outline"}
              className={`px-2 sm:px-4 py-1 text-xs sm:text-sm rounded-full ${
                option.isActive
                  ? "bg-black text-white shadow-sm"
                  : "border border-solid border-gray-500 text-gray-500 shadow-sm"
              }`}
            >
              <span
                className={
                  option.isActive
                    ? "font-heading-6 text-sm sm:text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] font-[number:var(--heading-6-font-weight)] [font-style:var(--heading-6-font-style)]"
                    : "font-bold-body-text text-sm sm:text-[length:var(--bold-body-text-font-size)] tracking-[var(--bold-body-text-letter-spacing)] leading-[var(--bold-body-text-line-height)] font-[number:var(--bold-body-text-font-weight)] [font-style:var(--bold-body-text-font-style)]"
                }
              >
                {option.label}
              </span>
            </Button>
          ))}
        </div>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-10 mx-auto mt-6 sm:mt-8 px-4 sm:px-0 w-full sm:w-fit">
          <div className="flex items-center justify-center gap-2.5 px-2 py-1">
            <span className="font-medium text-black text-sm tracking-normal leading-normal">
              Filters:
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap w-full sm:w-auto">
            {filterOptions.map((filter, index) => (
              <Button
                key={index}
                variant="outline"
                className="flex items-center justify-center gap-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full border border-solid border-gray-500"
              >
                <span className="hidden sm:inline-flex">{filter.icon}</span>
                <span className="font-medium text-gray-500 text-sm tracking-normal leading-normal">
                  {filter.label}
                </span>
                <span className="hidden sm:inline-flex">{filter.endIcon}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Properties Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8">
          {/* Mobile view: single column */}
          <div className="md:hidden flex flex-col gap-6 justify-center mx-auto max-w-[500px]">
            {columns.flat().map((property, index) => (
              <PropertyCard key={`mobile-${index}`} property={property} />
            ))}
          </div>

          {/* Tablet view: two columns */}
          <div className="hidden md:flex lg:hidden flex-wrap gap-6 justify-center mx-auto max-w-[768px]">
            <div className="flex flex-col w-[calc(50%-12px)] gap-6">
              {columns[0]
                .concat(columns[2].slice(0, 4))
                .map((property, index) => (
                  <PropertyCard
                    key={`tablet-col1-${index}`}
                    property={property}
                  />
                ))}
            </div>
            <div className="flex flex-col w-[calc(50%-12px)] gap-6">
              {columns[1].concat(columns[2].slice(4)).map((property, index) => (
                <PropertyCard
                  key={`tablet-col2-${index}`}
                  property={property}
                />
              ))}
            </div>
          </div>

          {/* Desktop view: three columns */}
          <div className="hidden lg:flex gap-6 xl:gap-[46px] justify-center mx-auto max-w-[1200px]">
            {columns.map((column, columnIndex) => (
              <div
                key={`desktop-col-${columnIndex}`}
                className="flex flex-col w-full max-w-[368px] gap-6 xl:gap-10"
              >
                {column.map((property, propertyIndex) => (
                  <PropertyCard
                    key={`desktop-${columnIndex}-${propertyIndex}`}
                    property={property}
                  />
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Footer Section */}
        <FooterSection />
      </div>
    </div>
  );
}
