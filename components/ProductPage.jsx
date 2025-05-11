'use client'

import {
  BookmarkIcon,
  DollarSignIcon,
  HomeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  CarIcon,
  Calendar,
  Settings,
  Tag,
  Fuel,
  Gauge,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import Link from "next/link";
import NavigationBar from "./navigation/NavigationBar";
import { FooterSection } from "./sections/FooterSection";

// Helper function to generate thumbnails based on available images
function generateThumbnails(images, productType, onThumbnailClick) {
  if (!images || images.length === 0) {
    // If no images, show placeholders
    return Array.from({ length: 3 }).map((_, index) => (
      <div
        key={`placeholder-${index}`}
        className="w-full h-[80px] md:h-[130px] bg-gray-200 rounded-sm flex items-center justify-center"
      >
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    ));
  }
  
  // If only one image, duplicate it for all thumbnails
  if (images.length === 1) {
    return Array.from({ length: 3 }).map((_, index) => (
      <img
        key={`single-${index}`}
        className="w-full h-[80px] md:h-[130px] object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity duration-200 border-2 border-transparent hover:border-blue-500"
        alt={`${productType} view ${index + 1}`}
        src={images[0]}
        onClick={() => onThumbnailClick(0)}
      />
    ));
  }
  
  // If 2-3 images, show what we have and fill the rest with alternating images
  if (images.length < 4) {
    const thumbnails = [];
    for (let i = 0; i < 3; i++) {
      const imageIndex = i % images.length;
      thumbnails.push(
        <img
          key={`thumb-${i}`}
          className="w-full h-[80px] md:h-[130px] object-cover rounded-sm cursor-pointer hover:opacity-80 transition-opacity duration-200 border-2 border-transparent hover:border-blue-500"
          alt={`${productType} view ${i + 1}`}
          src={images[imageIndex]}
          onClick={() => onThumbnailClick(imageIndex)}
        />
      );
    }
    return thumbnails;
  }
  
  // If 4+ images, show the first 3 thumbnails (excluding the main image which is shown separately)
  return images.map((image, index) => (
    <img
      key={`multi-${index}`}
      className={`w-full h-[80px] md:h-[130px] object-cover rounded-sm cursor-pointer hover:opacity-80 transition-opacity duration-200 border-2 ${index === 0 ? 'border-blue-500' : 'border-transparent hover:border-blue-500'}`}
      alt={`${productType} view ${index + 1}`}
      src={image}
      onClick={() => onThumbnailClick(index)}
    />
  )).slice(0, 3);
}

// Main image carousel component with auto-rotation
const MainImageCarousel = React.forwardRef(function MainImageCarousel({ images, type }, ref) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (!images || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setTimeout(() => setIsTransitioning(false), 30);
      }, 100);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images]);
  
  // Handle manual navigation
  const goToPrevious = () => {
    if (!images || images.length <= 1 || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
      setTimeout(() => setIsTransitioning(false), 30);
    }, 100);
  };
  
  const goToNext = () => {
    if (!images || images.length <= 1 || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      setTimeout(() => setIsTransitioning(false), 30);
    }, 100);
  };
  
  // Expose methods to parent component
  React.useImperativeHandle(ref, () => ({
    setImageIndex: (index) => {
      if (index >= 0 && index < images.length) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentImageIndex(index);
          setTimeout(() => setIsTransitioning(false), 30);
        }, 100);
      }
    }
  }));
  
  if (!images || images.length === 0) {
    return (
      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }
  
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div 
        className={`h-full w-full bg-cover bg-center transition-opacity duration-200 ${isTransitioning ? 'opacity-85' : 'opacity-100'}`}
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
      />
      
      {/* Navigation buttons (only show if more than one image) */}
      {images.length > 1 && (
        <>
          <button 
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-sm hover:bg-black/70 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-sm hover:bg-black/70 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
          
          {/* Image counter */}
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-sm text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
});

export default function ProductPage({ product, type = 'property' }) {
  const carouselRef = React.useRef(null);
  // Determine if this is a property or car
  const isProperty = type === 'property';
  const isCar = type === 'car';

  // Generate product details based on type
  const productDetails = isProperty
    ? [
        {
          icon: <HomeIcon className="w-5 h-5 text-contentstrong" />,
          label: "Type:",
          value: product?.propertyType || "Residential",
        },
        {
          icon: <MapPinIcon className="w-5 h-5 text-contentstrong" />,
          label: "Location:",
          value: product?.location || "Lagos, Nigeria",
        },
        {
          icon: <DollarSignIcon className="w-5 h-5 text-contentstrong" />,
          label: "Price:",
          value: product?.formattedPrice || `₦${product?.price?.toLocaleString() || '0'}`,
        },
        {
          icon: <BookmarkIcon className="w-5 h-5 text-contentstrong" />,
          label: "Status:",
          value: product?.status || "For Sale",
        },
        {
          icon: <HomeIcon className="w-5 h-5 text-contentstrong" />,
          label: "Bedrooms:",
          value: product?.bedrooms || "N/A",
        },
        {
          icon: <HomeIcon className="w-5 h-5 text-contentstrong" />,
          label: "Bathrooms:",
          value: product?.bathrooms || "N/A",
        },
        {
          icon: <HomeIcon className="w-5 h-5 text-contentstrong" />,
          label: "Size:",
          value: product?.size ? `${product.size} sqm` : "N/A",
        },
      ]
    : [
        {
          icon: <CarIcon className="w-5 h-5 text-contentstrong" />,
          label: "Make/Model:",
          value: `${product?.make || 'N/A'} ${product?.model || 'N/A'}`,
        },
        {
          icon: <MapPinIcon className="w-5 h-5 text-contentstrong" />,
          label: "Location:",
          value: product?.location || "Lagos, Nigeria",
        },
        {
          icon: <Calendar className="w-5 h-5 text-contentstrong" />,
          label: "Year:",
          value: product?.year || "N/A",
        },
        {
          icon: <Settings className="w-5 h-5 text-contentstrong" />,
          label: "Condition:",
          value: product?.condition || "Used",
        },
        {
          icon: <DollarSignIcon className="w-5 h-5 text-contentstrong" />,
          label: "Price:",
          value: product?.formattedPrice || `₦${product?.price?.toLocaleString() || '0'}`,
        },
      ];
      
  // Agent contact details
  const agentDetails = [
    {
      icon: <PhoneIcon className="w-5 h-5 text-contentstrong" />,
      label: "Phone number:",
      value: "+234 814 096 6769",
    },
    {
      icon: <MapPinIcon className="w-5 h-5 text-contentstrong" />,
      label: "WhatsApp:",
      value: "+234 912 073 9354",
    },
    {
      icon: <MailIcon className="w-5 h-5 text-contentstrong" />,
      label: "Email:",
      value: "Info@tonyluxeglobal.org",
    },
  ];

  // Product page configuration

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-full relative">
        {/* Navigation */}
        <NavigationBar />

        <main className="px-4 sm:px-6 md:px-10 lg:px-[120px]">
          {/* Product Gallery with Auto-Rotating Carousel */}
          <section className="flex flex-col md:flex-row items-start gap-6 mb-10">
            {/* Main large image with carousel */}
            <div className="relative w-full md:w-[70%] h-[300px] sm:h-[400px] md:h-[500px] bg-contentstrong rounded-lg overflow-hidden">
              {/* Main Image */}
              {product?.images?.length > 0 ? (
                <MainImageCarousel 
                  images={product.images} 
                  type={isProperty ? 'Property' : 'Car'} 
                  ref={carouselRef}
                />
              ) : (
                <div 
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: 'url(/image.png)' }}
                />
              )}
            </div>

            {/* Thumbnail images */}
            <div className="flex flex-row md:flex-col w-full md:w-[25%] items-center gap-3 mt-3 md:mt-0">
              {/* Generate thumbnails based on available images */}
              {generateThumbnails(
                product?.images || [], 
                isProperty ? 'Property' : 'Car',
                (index) => {
                  if (carouselRef.current) {
                    carouselRef.current.setImageIndex(index);
                  }
                }
              )}
            </div>
          </section>

          {/* Property Content */}
          <section className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Property Details */}
            <div className="flex flex-col w-full lg:w-[65%] gap-8">
              <h1 className="font-heading-5 font-[number:var(--heading-5-font-weight)] text-black text-[length:var(--heading-5-font-size)] tracking-[var(--heading-5-letter-spacing)] leading-[var(--heading-5-line-height)] [font-style:var(--heading-5-font-style)]">
                {product?.title || (isProperty ? 'Modern Property' : 'Quality Vehicle')}
              </h1>

              <div className="flex flex-col gap-10">
                {/* Description */}
                <div className="flex flex-col gap-2">
                  <h2 className="font-heading-6 font-[number:var(--heading-6-font-weight)] text-contentmuted text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] [font-style:var(--heading-6-font-style)]">
                    Description:
                  </h2>
                  <p className="font-body-text font-[number:var(--body-text-font-weight)] text-contentstrong text-[length:var(--body-text-font-size)] tracking-[var(--body-text-letter-spacing)] leading-[var(--body-text-line-height)] [font-style:var(--body-text-font-style)]">
                    {product?.description || 'No description available.'}
                  </p>
                </div>

                <Separator className="w-full" />

                {/* Amenities */}
                <div className="flex flex-col gap-2">
                  <h2 className="font-heading-6 font-bold text-black text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] [font-style:var(--heading-6-font-style)]">
                    {isProperty ? 'Amenities' : 'Specifications'}
                  </h2>
                  <div className="font-body-text font-[number:var(--body-text-font-weight)] text-contentstrong text-[length:var(--body-text-font-size)] tracking-[var(--body-text-letter-spacing)] leading-[var(--body-text-line-height)] [font-style:var(--body-text-font-style)]">
                    {isProperty ? (
                      <>
                        <span className="font-semibold">Interior Features:</span>
                        <br />
                        {product?.amenities?.filter(a => a.type === 'interior')?.length > 0 ? 
                          product.amenities.filter(a => a.type === 'interior').map((amenity, index) => (
                            <React.Fragment key={index}>
                              {amenity.name}
                              <br />
                            </React.Fragment>
                          )) : 
                          <>
                            Modern kitchen with high-end appliances<br />
                            Spacious bedrooms with en-suite bathrooms<br />
                            Walk-in closet in the master suite<br />
                            Private balcony<br />
                          </>
                        }
                        <br />
                        <span className="font-semibold">Exterior Features:</span>
                        <br />
                        {product?.amenities?.filter(a => a.type === 'exterior')?.length > 0 ? 
                          product.amenities.filter(a => a.type === 'exterior').map((amenity, index) => (
                            <React.Fragment key={index}>
                              {amenity.name}
                              <br />
                            </React.Fragment>
                          )) : 
                          <>
                            Landscaped garden<br />
                            Swimming pool<br />
                            Covered patio<br />
                            Secure gated community<br />
                            24/7 security<br />
                          </>
                        }
                      </>
                    ) : (
                      <>
                        Vehicle Specifications:
                        <br />
                        Make: {product?.make || 'N/A'}
                        <br />
                        Model: {product?.model || 'N/A'}
                        <br />
                        Year: {product?.year || 'N/A'}
                        <br />
                        Mileage: {product?.mileage?.toLocaleString() || 'N/A'} km
                        <br />
                        Fuel Type: {product?.fuelType || 'N/A'}
                        <br />
                        Transmission: {product?.transmission || 'N/A'}
                        <br />
                        Color: {product?.color || 'N/A'}
                        <br />
                        Condition: {product?.condition || 'Used'}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Price and Contact */}
            <Card className="w-full lg:w-[350px] h-fit lg:mt-[68px] mt-4 rounded-2xl overflow-hidden">
              <CardContent className="flex flex-col gap-[18px] p-6">
                <h2 className="font-heading-4 font-[number:var(--heading-4-font-weight)] text-contentmuted text-[length:var(--heading-4-font-size)] tracking-[var(--heading-4-letter-spacing)] leading-[var(--heading-4-line-height)] [font-style:var(--heading-4-font-style)]">
                  {product?.formattedPrice || `₦${product?.price?.toLocaleString() || '0'}`}
                </h2>

                <Separator className="w-full" />

                {/* Key Details */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading-5 font-[number:var(--heading-5-font-weight)] text-contentnormal text-[length:var(--heading-5-font-size)] tracking-[var(--heading-5-letter-spacing)] leading-[var(--heading-5-line-height)] [font-style:var(--heading-5-font-style)]">
                    Key Details
                  </h3>

                  <div className="flex flex-col gap-1">
                    {productDetails.map((detail, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-1 py-0.5"
                      >
                        {detail.icon}
                        <div className="[font-family:'Inter',Helvetica] font-normal text-contentstrong text-base tracking-[0.16px] leading-4">
                          <span className="tracking-[0.03px] leading-6">
                            {detail.label}{" "}
                          </span>
                          <span className="font-heading-6 font-[number:var(--heading-6-font-weight)] text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] [font-style:var(--heading-6-font-style)]">
                            {detail.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="w-full" />

                {/* Agent Details */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading-5 font-[number:var(--heading-5-font-weight)] text-contentnormal text-[length:var(--heading-5-font-size)] tracking-[var(--heading-5-letter-spacing)] leading-[var(--heading-5-line-height)] [font-style:var(--heading-5-font-style)]">
                    Agent details
                  </h3>

                  <div className="flex flex-col gap-1">
                    {agentDetails.map((detail, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-1 py-0.5"
                      >
                        {detail.icon}
                        <div className="[font-family:'Inter',Helvetica] font-normal text-contentstrong text-base tracking-[0.16px] leading-4">
                          <span className="tracking-[0.03px] leading-6">
                            {detail.label}{" "}
                          </span>
                          <span className="font-heading-6 font-[number:var(--heading-6-font-weight)] text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] [font-style:var(--heading-6-font-style)]">
                            {detail.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/contact">
                  <Button className="w-full py-3 bg-brand-primary text-white rounded-sm relative overflow-hidden shadow-[0px_4px_10px_#0a0a0a0f,inset_0px_4px_10px_#ffffff1a]">
                    <span className="font-heading-6 font-[number:var(--heading-6-font-weight)] text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] [font-style:var(--heading-6-font-style)]">
                      Contact Tony
                    </span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>

          {/* Additional space at bottom */}
          <div className="h-10"></div>
        </main>

        {/* Footer */}
        <FooterSection />
      </div>
    </div>
  );
}
