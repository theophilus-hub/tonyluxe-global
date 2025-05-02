"use client";

import {
  BanknoteIcon,
  ChevronDownIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { FooterSection } from "./sections/FooterSection";
import NavigationBar from "./navigation/NavigationBar";
import PropertyCard from "./PropertyCard";

export default function ListPage() {
  // State for properties data
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePropertyType, setActivePropertyType] = useState('Buy');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 0
  });
  
  // State for filters
  const [filters, setFilters] = useState({
    location: '',
    bedrooms: '',
    minPrice: '',
    maxPrice: ''
  });

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        // Build query string with all active filters
        let queryString = `/api/public/properties?propertyType=${activePropertyType}&page=${pagination.page}`;
        
        if (filters.location) queryString += `&location=${encodeURIComponent(filters.location)}`;
        if (filters.bedrooms) queryString += `&bedrooms=${filters.bedrooms}`;
        if (filters.minPrice) queryString += `&minPrice=${filters.minPrice}`;
        if (filters.maxPrice) queryString += `&maxPrice=${filters.maxPrice}`;
        
        const response = await fetch(queryString);
        
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        
        const data = await response.json();
        setProperties(data.properties);
        setPagination(data.pagination);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [activePropertyType, pagination.page, filters]);

  // Handle property type change
  const handlePropertyTypeChange = (type) => {
    setActivePropertyType(type);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 when changing property type
  };
  
  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 when changing filters
  };

  // Property filter options
  const filterOptions = [
    {
      icon: <MapPinIcon className="w-4 h-4" />,
      label: "Location",
      endIcon: <ChevronDownIcon className="w-4 h-4" />,
      filterName: "location",
      type: "text",
      placeholder: "Enter location"
    },
    {
      icon: <BanknoteIcon className="w-4 h-4" />,
      label: "Bedrooms",
      endIcon: <ChevronDownIcon className="w-4 h-4" />,
      filterName: "bedrooms",
      type: "select",
      options: [
        { value: "", label: "Any" },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4+" }
      ]
    },
    {
      icon: <BanknoteIcon className="w-4 h-4" />,
      label: "Min Price",
      endIcon: <ChevronDownIcon className="w-4 h-4" />,
      filterName: "minPrice",
      type: "number",
      placeholder: "Min price"
    },
    {
      icon: <BanknoteIcon className="w-4 h-4" />,
      label: "Max Price",
      endIcon: <ChevronDownIcon className="w-4 h-4" />,
      filterName: "maxPrice",
      type: "number",
      placeholder: "Max price"
    },
  ];

  // Property type options
  const propertyTypeOptions = [
    { label: "Buy", isActive: activePropertyType === 'Buy' },
    { label: "Rent", isActive: activePropertyType === 'Rent' },
    { label: "Airbnb", isActive: activePropertyType === 'Airbnb' },
  ];

  // Function to split properties into columns for different layouts
  const getPropertyColumns = () => {
    if (!properties || properties.length === 0) return [[], [], []];
    
    const totalProperties = properties.length;
    const column1 = [];
    const column2 = [];
    const column3 = [];
    
    // Distribute properties across three columns
    properties.forEach((property, index) => {
      if (index % 3 === 0) column1.push(property);
      else if (index % 3 === 1) column2.push(property);
      else column3.push(property);
    });
    
    return [column1, column2, column3];
  };
  
  // Get columns for layout
  const columns = getPropertyColumns();

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
              onClick={() => handlePropertyTypeChange(option.label)}
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
              <div key={index} className="relative group">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full border border-solid border-gray-500"
                >
                  <span className="hidden sm:inline-flex">{filter.icon}</span>
                  <span className="font-medium text-gray-500 text-sm tracking-normal leading-normal">
                    {filter.label}
                  </span>
                  <span className="hidden sm:inline-flex">{filter.endIcon}</span>
                </Button>
                
                {/* Filter dropdown */}
                <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-2 hidden group-hover:block">
                  {filter.type === 'text' && (
                    <input
                      type="text"
                      placeholder={filter.placeholder}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={filters[filter.filterName]}
                      onChange={(e) => handleFilterChange(filter.filterName, e.target.value)}
                    />
                  )}
                  
                  {filter.type === 'number' && (
                    <input
                      type="number"
                      placeholder={filter.placeholder}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={filters[filter.filterName]}
                      onChange={(e) => handleFilterChange(filter.filterName, e.target.value)}
                    />
                  )}
                  
                  {filter.type === 'select' && (
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={filters[filter.filterName]}
                      onChange={(e) => handleFilterChange(filter.filterName, e.target.value)}
                    >
                      {filter.options.map((option, idx) => (
                        <option key={idx} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Properties Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-red-500">{error}</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500">No properties found. Please try different filters.</p>
            </div>
          ) : (
            <>
              {/* Mobile view: single column */}
              <div className="md:hidden flex flex-col gap-6 justify-center mx-auto max-w-[500px]">
                {properties.map((property, index) => (
                  <PropertyCard key={`mobile-${property.id || index}`} property={property} />
                ))}
              </div>

              {/* Tablet view: two columns */}
              <div className="hidden md:flex lg:hidden flex-wrap gap-6 justify-center mx-auto max-w-[768px]">
                <div className="flex flex-col w-[calc(50%-12px)] gap-6">
                  {columns[0]
                    .concat(columns[2].slice(0, Math.min(4, columns[2].length)))
                    .map((property, index) => (
                      <PropertyCard
                        key={`tablet-col1-${property.id || index}`}
                        property={property}
                      />
                    ))}
                </div>
                <div className="flex flex-col w-[calc(50%-12px)] gap-6">
                  {columns[1]
                    .concat(columns[2].slice(Math.min(4, columns[2].length)))
                    .map((property, index) => (
                      <PropertyCard
                        key={`tablet-col2-${property.id || index}`}
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
                    {column.map((property) => (
                      <PropertyCard
                        key={`desktop-${columnIndex}-${property.id}`}
                        property={property}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Pagination */}
          {!loading && !error && properties.length > 0 && (
            <div className="flex justify-center items-center mt-10 mb-16 gap-2">
              <Button 
                variant="outline" 
                disabled={pagination.page <= 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Previous
              </Button>
              <span className="mx-2 text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button 
                variant="outline" 
                disabled={pagination.page >= pagination.pages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Next
              </Button>
            </div>
          )}
        </section>

        {/* Footer Section */}
        <FooterSection />
      </div>
    </div>
  );
}
