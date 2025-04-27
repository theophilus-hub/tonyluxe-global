'use client'

import { MapPinIcon } from "lucide-react";
import React from "react";
import { Separator } from "./ui/separator";
import Link from "next/link";
import NavigationBar from "./navigation/NavigationBar";
import { FooterSection }from "./sections/FooterSection";





export default function AboutPage() {
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full relative">
        {/* Navigation */}
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
          <NavigationBar />
        </div>

        {/* Spacer to prevent content overlap with fixed navigation */}
   
        {/* Hero Section */}
        <header className="relative w-full h-[653px] bg-[url(/rectangle-1.png)] bg-cover bg-center">
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/70"></div>

          {/* Hero Content */}
          <div className="flex flex-col items-center gap-6 sm:gap-8 absolute top-1/4 left-1/2 transform -translate-x-1/2 max-w-[90%] sm:max-w-[80%] md:max-w-[707px] w-full px-4 z-10">
            <h1 className="font-heading-2 font-bold text-white text-3xl sm:text-4xl md:text-5xl text-center tracking-tight leading-tight">
              About us
            </h1>

            <p className="font-base text-white text-sm sm:text-md md:text-lg text-center tracking-normal leading-relaxed">
              At TONYLUXE GLOBAL LIMITED, we believe luxury isn&apos;t reserved
              for the few—it&apos;s an experience that should be accessible to
              anyone who values quality and comfort. <br />
              <br />
              Our team of experienced professionals is dedicated to helping you
              find a space that feels uniquely yours, whether it&apos;s a chic
              apartment in the city, a modern villa in a serene neighborhood, or
              a luxury car that makes a statement. We&apos;re passionate about
              quality, integrity, and exceptional service—ensuring that every
              interaction you have with us is as refined and comfortable as the
              properties we represent.
            </p>
          </div>
        </header>

        {/* Our Mission Section */}
        <section className="flex flex-col md:flex-row items-center justify-between max-w-[1200px] mx-auto py-12 sm:py-16 px-4 gap-8 md:gap-12">
          <div className="flex flex-col items-start gap-4 w-full md:w-1/2">
            <h2 className="font-heading-3 font-bold text-gray-900 text-2xl sm:text-3xl tracking-tight leading-tight">
              Our Mission
            </h2>

            <p className="font-body-text text-gray-800 text-base sm:text-lg tracking-normal leading-relaxed">
              Based in Nigeria, our mission is to offer premium properties,
              stylish cars, and curated Airbnb options that reflect both local
              charm and international standards.
            </p>
          </div>

          <div className="relative w-full md:w-1/2 h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden md:mt-0">
            <div className="w-full h-full flex items-center justify-center">
              <img
                className="w-full h-full object-contain"
                alt="Mission illustration"
                src="/target.png"
              />
            </div>
          </div>
        </section>

        <Separator className="max-w-[1200px] mx-auto" />

        {/* Our Vision Section */}
        <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-[1200px] mx-auto py-12 sm:py-16 px-4 gap-8 md:gap-12">
          <div className="relative w-full md:w-1/2 h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden flex items-center justify-center">
            <img
              className="w-full h-full object-contain"
              alt="Binoculars"
              src="/binoculars-1.png"
            />
          </div>

          <div className="flex flex-col items-start gap-4 w-full md:w-1/2">
            <h2 className="font-heading-3 font-bold text-gray-900 text-2xl sm:text-3xl tracking-tight leading-tight">
              Our Vision
            </h2>

            <p className="font-body-text text-gray-800 text-base sm:text-lg tracking-normal leading-relaxed">
              At TONYLUXE GLOBAL LIMITED, we believe luxury isn&apos;t reserved
              for the few—it&apos;s an experience that should be accessible to
              anyone who values quality and comfort. Based in Nigeria, our
              mission is to offer premium properties, stylish cars, and curated
              Airbnb options that reflect both local charm and international
              standards.
            </p>
          </div>
        </section>

        {/* Footer */}
        <FooterSection />
      </div>
    </div>
  );
}
