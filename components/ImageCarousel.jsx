'use client'

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export const ImageCarousel = ({ images, interval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative w-full overflow-hidden h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] xl:h-[700px]">
      {/* Carousel Images */}
      <AnimatePresence mode="sync">
        <motion.img
          key={currentIndex}
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="absolute w-full h-full object-cover z-0"
          initial={{ opacity: 0  }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-content-black/60 z-10"></div>
      
      {/* Static Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="flex flex-col items-center gap-8 w-full max-w-[700px] px-6 text-center">
          <h1 className="font-heading-1 text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.2] sm:leading-tight">
            Luxury and comfort curated just for you
          </h1>
          
          <p className="font-body-text text-white text-md md:text-lg max-w-[600px] leading-relaxed">
            Explore exceptional properties, quality vehicles, and premium Airbnb
            listings—all designed to enhance your everyday life.
          </p>
          
          <Link href="/properties">
            <Button className="mt-4 relative flex items-center justify-center gap-2 px-6 py-3 bg-brand-light text-black rounded-md hover:bg-brand-primary hover:text-brand-light transition-colors shadow-lg w-auto">
              <span className="font-semibold">
                Explore our listings
              </span>
              <ArrowUpRightIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="flex items-center gap-[8.6px] absolute bottom-[50px] left-1/2 transform -translate-x-1/2 z-30">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-[68.76px] h-[8.6px] bg-white rounded transition-opacity duration-300 sm:w-[40px] ${
              index === currentIndex ? "opacity-100" : "opacity-20"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
