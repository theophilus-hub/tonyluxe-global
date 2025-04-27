"use client";

import React from "react";
import { ImageCarousel } from "./ImageCarousel";
import { FooterSection } from "./sections/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import MainContentSection from "./sections/MainContentSection";
import NavigationBar from "./navigation/NavigationBar";

export default function HomePage() {
  const carouselImages = [
    {
      src: "/pexels-expect-best-79873-323780.png",
      alt: "Luxury property showcase 1",
    },
    {
      src: "/pexels-expect-best-79873-323780-1.png",
      alt: "Luxury property showcase 2",
    },
    {
      src: "/pexels-expect-best-79873-323780-2.png",
      alt: "Luxury property showcase 3",
    },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-full relative">
        {/* Navigation */}
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
          <NavigationBar />
        </div>

        {/* Hero section with carousel */}
        <div className="relative w-full">
          <ImageCarousel images={carouselImages} />
        </div>

        {/* Main content section */}
        <MainContentSection />

        {/* Footer section */}
        <FooterSection />
      </div>
    </div>
  );
}
