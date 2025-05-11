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
import CarCard from "./CarCard";

export default function CarsListPage() {
  // State for cars data
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCarType, setActiveCarType] = useState('All');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 0
  });
  
  // State for filters
  const [filters, setFilters] = useState({
    location: '',
    make: '',
    model: '',
    year: '',
    minPrice: '',
    maxPrice: ''
  });
  
  // State to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState(null);

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        
        // Build query string with all active filters
        let queryString = `/api/public/cars?status=${activeCarType !== 'All' ? activeCarType : ''}&page=${pagination.page}`;
        
        if (filters.location) queryString += `&location=${encodeURIComponent(filters.location)}`;
        if (filters.make) queryString += `&make=${encodeURIComponent(filters.make)}`;
        if (filters.model) queryString += `&model=${encodeURIComponent(filters.model)}`;
        if (filters.year) queryString += `&year=${filters.year}`;
        if (filters.minPrice) queryString += `&minPrice=${filters.minPrice}`;
        if (filters.maxPrice) queryString += `&maxPrice=${filters.maxPrice}`;
        
        const response = await fetch(queryString);
        
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        
        const data = await response.json();
        setCars(data.properties);
        setPagination(data.pagination);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load cars. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCars();
  }, [activeCarType, pagination.page, filters]);
  
  // Handle car type change
  const handleCarTypeChange = (type) => {
    setActiveCarType(type);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 when changing car type
  };
  
  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 when changing filters
  };
  
  // Toggle dropdown open/close
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown !== null) {
        const dropdowns = document.querySelectorAll('.car-filter-dropdown');
        let clickedInside = false;
        
        dropdowns.forEach((dropdown, index) => {
          if (dropdown.contains(event.target) || 
              document.querySelector(`.car-filter-button-${index}`)?.contains(event.target)) {
            clickedInside = true;
          }
        });
        
        if (!clickedInside) {
          setOpenDropdown(null);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Car filter options
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
      label: "Make",
      endIcon: <ChevronDownIcon className="w-4 h-4" />,
      filterName: "make",
      type: "text",
      placeholder: "Enter make"
    },
    {
      icon: <BanknoteIcon className="w-4 h-4" />,
      label: "Model",
      endIcon: <ChevronDownIcon className="w-4 h-4" />,
      filterName: "model",
      type: "text",
      placeholder: "Enter model"
    },
    {
      icon: <StarIcon className="w-4 h-4" />,
      label: "Year",
      endIcon: <StarIcon className="w-4 h-4" />,
      filterName: "year",
      type: "select",
      options: [
        { value: "", label: "Any" },
        { value: "2025", label: "2025" },
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
        { value: "2022", label: "2022" },
        { value: "2021", label: "2021" },
        { value: "2020", label: "2020" },
        { value: "2019", label: "2019" },
        { value: "2018", label: "2018" },
        { value: "2017", label: "2017" },
        { value: "2016", label: "2016" },
        { value: "2015", label: "2015" }
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

  // Car type options
  const carTypeOptions = [
    { label: "All", isActive: activeCarType === 'All' },
    { label: "New", isActive: activeCarType === 'New' },
    { label: "Used", isActive: activeCarType === 'Used' },
  ];

  // Function to split cars into columns for different layouts
  const getCarColumns = () => {
    if (!cars || cars.length === 0) return [[], [], []];
    
    const column1 = [];
    const column2 = [];
    const column3 = [];
    
    // Distribute cars across three columns
    cars.forEach((car, index) => {
      if (index % 3 === 0) column1.push(car);
      else if (index % 3 === 1) column2.push(car);
      else column3.push(car);
    });
    
    return [column1, column2, column3];
  };
  
  // Get columns for layout
  const columns = getCarColumns();

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
            The best cars for you
          </h1>

          <p className="font-body-text text-gray-800 text-sm sm:text-base md:text-lg text-center tracking-normal leading-relaxed max-w-xs sm:max-w-lg md:max-w-2xl">
            Explore exceptional vehicles, quality cars, and premium models
            <br className="hidden sm:block" />
            all designed to enhance your everyday life.
          </p>
        </section>

        {/* Car Type Toggle */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 mx-auto mt-6 sm:mt-8 bg-gray-100 rounded-full w-fit">
          {carTypeOptions.map((option, index) => (
            <Button
              key={index}
              variant={option.isActive ? "default" : "outline"}
              className={`px-2 sm:px-4 py-1 text-xs sm:text-sm rounded-full ${
                option.isActive
                  ? "bg-black text-white shadow-sm"
                  : "border border-solid border-gray-500 text-gray-500 shadow-sm"
              }`}
              onClick={() => handleCarTypeChange(option.label)}
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
              <div key={index} className="relative">
                <Button
                  variant="outline"
                  className={`car-filter-button-${index} flex items-center justify-center gap-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full border border-solid ${openDropdown === index || filters[filter.filterName] ? 'border-black text-black' : 'border-gray-500 text-gray-500'}`}
                  onClick={() => toggleDropdown(index)}
                >
                  <span className="hidden sm:inline-flex">{filter.icon}</span>
                  <span className="font-medium text-sm tracking-normal leading-normal">
                    {filter.label}
                    {filters[filter.filterName] && filter.type === 'select' && filter.options ? (
                      <>: <span className="font-semibold">{filter.options.find(opt => opt.value === filters[filter.filterName])?.label || filters[filter.filterName]}</span></>
                    ) : filters[filter.filterName] ? (
                      <>: <span className="font-semibold">{filters[filter.filterName]}</span></>
                    ) : null}
                  </span>
                  <span className="hidden sm:inline-flex">{filter.endIcon}</span>
                </Button>
                
                {/* Filter dropdown */}
                <div className={`car-filter-dropdown absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-2 ${openDropdown === index ? 'block' : 'hidden'}`}>
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

        {/* Cars Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500">Loading cars...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-red-500">{error}</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500">No cars found. Please try different filters.</p>
            </div>
          ) : (
            <>
              {/* Mobile view: single column */}
              <div className="md:hidden flex flex-col gap-6 justify-center mx-auto max-w-[500px]">
                {cars.map((car, index) => (
                  <CarCard key={`mobile-${car.id || index}`} car={car} />
                ))}
              </div>

              {/* Tablet view: two columns */}
              <div className="hidden md:flex lg:hidden flex-wrap gap-6 justify-center mx-auto max-w-[768px]">
                <div className="flex flex-col w-[calc(50%-12px)] gap-6">
                  {columns[0]
                    .concat(columns[2].slice(0, Math.min(4, columns[2].length)))
                    .map((car, index) => (
                      <CarCard
                        key={`tablet-col1-${car.id || index}`}
                        car={car}
                      />
                    ))}
                </div>
                <div className="flex flex-col w-[calc(50%-12px)] gap-6">
                  {columns[1]
                    .concat(columns[2].slice(Math.min(4, columns[2].length)))
                    .map((car, index) => (
                      <CarCard
                        key={`tablet-col2-${car.id || index}`}
                        car={car}
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
                    {column.map((car) => (
                      <CarCard
                        key={`desktop-${columnIndex}-${car.id}`}
                        car={car}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Pagination */}
          {!loading && !error && cars.length > 0 && (
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
