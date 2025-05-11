'use client'

import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import * as Separator from "@radix-ui/react-separator";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

// Testimonial data for mapping
const testimonials = [
  {
    id: 1,
    text: "Tonyluxe Global provided exceptional service in helping me find my dream property. Their attention to detail and understanding of my needs made the process seamless and enjoyable.",
    name: "Mr. Adeyemi Williamson",
    image: "/ellipse-2-6.png",
  },
  {
    id: 2,
    text: "I've worked with many real estate companies, but none compare to the professionalism and dedication of Tonyluxe Global. They helped me secure an excellent investment property that has appreciated significantly in value.",
    name: "Mr. Ladi",
    image: "/ellipse-2-7.png",
  },
  {
    id: 3,
    text: "As a busy medical professional, I needed a hassle-free experience when purchasing my new home. Tonyluxe Global exceeded my expectations with their efficiency and expert guidance throughout the entire process.",
    name: "Dr. Raymond",
    image: "/ellipse-2-8.png",
  },
  {
    id: 4,
    text: "The team at Tonyluxe Global went above and beyond to help me find the perfect car for my family. Their knowledge of the market and negotiation skills saved me both time and money. I couldn't be happier with my purchase.",
    name: "Chief Oluwaseun Adebayo",
    image: "/ellipse-2-3.png",
  },
  {
    id: 5,
    text: "I was impressed by how Tonyluxe Global handled the sale of my property. Their marketing strategy attracted multiple offers, and I ended up selling for well above my asking price. Truly outstanding service!",
    name: "Mrs. Folake Ogunleye",
    image: "/ellipse-2-4.png",
  },
  {
    id: 6,
    text: "After searching for months on my own, I contacted Tonyluxe Global and within two weeks they found me the perfect short-let apartment. Their local knowledge and connections in the industry are unmatched. I highly recommend their services.",
    name: "Mr. Babatunde Oluwatoyin",
    image: "/ellipse-2-5.png",
  },
];

// Feature data for mapping
const features = [
  {
    id: 1,
    icon: "/icon.svg",
    title:
      "Curated Listings:\nOnly the best properties\nand cars make it to our platform.",
    description:
      "We handpick every listing to ensure it meets our high standards. From homes to cars, we focus on quality and value so you can feel confident in every choice you make. Only the best make it here, just for you.",
  },
  {
    id: 2,
    icon: "/way.svg",
    title: "Seamless Experience:\nUser-friendly for buyers\nand sellers alike.",
    description:
      "Our platform is designed to make your journey easy and hassle-free. Whether you're buying or selling, our intuitive tools guide you every step of the way. We focus on making the process smooth, so you can focus on what really matters.",
  },
  {
    id: 3,
    icon: "/padlock-with-check.svg",
    title: "Secure Transactions:\nWe prioritize your\nsafety and privacy.",
    description:
      "Your peace of mind is our top priority. With advanced security measures in place, we ensure your personal information and transactions are protected every step of the way.",
  },
  {
    id: 4,
    icon: "/handshake.svg",
    title: "Integrity First:\nWe do business with\ntransparency and honesty",
    description:
      "At Tonyluxe Global Limited, we believe in doing the right thing, even when no one's looking. You can trust us to always be straightforward and keep your best interests at heart.",
  },
];

// Showcase images
const showcaseImages = [
  { 
    id: 1, 
    src: "/image.png", 
    alt: "Image",
    title: "Homes for Every Need",
    description: "Whether you are looking to buy your dream home or find the perfect place to stay, we've got you covered.",
    buttonText: "Find your dream home",
    link: "/properties"
  },
  {
    id: 2,
    src: "/lorenzo-hamers-jvvwj9ubnyw-unsplash.png",
    alt: "Lorenzo hamers",
    title: "Premium Vehicles",
    description: "Explore our collection of luxury and reliable vehicles for sale or rent.",
    buttonText: "Browse vehicles",
    link: "/cars"
  },
  {
    id: 3,
    src: "/francesca-tosolini-thkjamco3qe-unsplash.png",
    alt: "Francesca tosolini",
    title: "Vacation Rentals",
    description: "Discover beautiful properties for your next getaway or business trip.",
    buttonText: "View rentals",
    link: "/properties"
  },
];

function MainContentSection(){
  return (
    <section className="flex flex-col w-full items-center gap-20 py-20 px-3">
      {/* Top section with heading and showcase images */}
      <div className="flex flex-col w-full max-w-[1200px] mx-auto items-center gap-12">
        <h2 className="font-heading-2 font-bold text-black text-[2rem] sm:text-4xl text-center tracking-tight leading-tight">
          Offering top-notch <span className="text-brand-primary">solutions</span>
          <br />
          we know will benefit you
        </h2>

        <div className="flex flex-col items-center gap-16 w-full">
          {showcaseImages.map((image) => (
            <div
              key={image.id}
              className="w-full h-[300px] sm:h-[450px] md:h-[610px]  rounded-lg overflow-hidden shadow-md relative group"
            >
              <img
                className="w-full rounded-lg h-[110%]"
                alt={image.alt}
                src={image.src}
                style={{ objectFit: 'fill' }}
              />
              
              {/* Mobile overlay - always visible on mobile, hidden on larger screens */}
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6 sm:hidden">
                <h3 className="text-white text-xl font-bold mb-2">{image.title}</h3>
                <p className="text-white text-sm mb-4 max-w-md">
                  {image.description}
                </p>
                <Link href={image.link}>
                  <Button className="bg-brand-light text-black hover:bg-white rounded-md flex items-center gap-2 w-full justify-center sm:w-auto">
                    <span>{image.buttonText}</span>
                    <ArrowUpRightIcon className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              
              {/* Desktop title - always visible on larger screens */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/40 to-transparent hidden sm:block group-hover:hidden">
                <h3 className="text-white text-2xl sm:text-3xl font-bold">{image.title}</h3>
              </div>
              
              {/* Desktop overlay - only visible on hover for larger screens */}
              <div className="absolute inset-0 bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100 flex-col justify-end p-8 hidden sm:flex">
                {/* Content container - slides up on hover */}
                <div className="transform translate-y-8 transition-transform duration-300 ease-in-out group-hover:translate-y-0">
                  <h3 className="text-white text-2xl sm:text-3xl font-bold mb-2">{image.title}</h3>
                  <p className="text-white text-sm sm:text-base mb-4 max-w-md">
                    {image.description}
                  </p>
                  <Link href={image.link}>
                    <Button className="bg-brand-light text-black hover:bg-white rounded-md flex items-center gap-2">
                      <span>{image.buttonText}</span>
                      <ArrowUpRightIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials section with dark background */}
      <div className="w-full bg-[#10130d] overflow-hidden relative">
        <div className="py-24 px-4 relative">
          {/* Decorative circles */}
          <div className="absolute top-[-92px] left-[-117px] w-[659px] h-[659px] rounded-[329.5px] border-[60px] border-solid border-[#67b6841a]">
            <div className="relative w-[395px] h-[395px] top-[72px] left-[72px] rounded-[197.35px] border-[60px] border-solid border-[#67b684] opacity-10" />
          </div>

          <div className="absolute top-[797px] left-[871px] w-[659px] h-[659px] rounded-[329.5px] border-[60px] border-solid border-[#67b6841a]">
            <div className="relative w-[395px] h-[395px] top-[72px] left-[72px] rounded-[197.35px] border-[60px] border-solid border-[#67b684] opacity-10" />
          </div>

          {/* Content container */}
          <div className="w-full relative z-10">
            <h2 className="font-heading-2 font-[number:var(--heading-2-font-weight)] text-bgmain text-[2rem] sm:text-[length:var(--heading-2-font-size)] text-center tracking-[var(--heading-2-letter-spacing)] leading-[1.2] sm:leading-[var(--heading-2-line-height)] [font-style:var(--heading-2-font-style)] mb-16">
              Our services don&apos;t lie <br />
              and our clients prove just that
            </h2>

            {/* Testimonials grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="bg-bgsecondary rounded-2xl border border-solid border-neutral-300 shadow-[0px_5px_10px_#006b170d]"
                >
                  <CardContent className="p-6 flex flex-col gap-4">
                    <p className="font-body-text font-[number:var(--body-text-font-weight)] text-contentstrong text-[length:var(--body-text-font-size)] tracking-[var(--body-text-letter-spacing)] leading-[var(--body-text-line-height)] [font-style:var(--body-text-font-style)]">
                      {testimonial.text}
                    </p>
                    <div className="flex items-center gap-[7px]">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={testimonial.image}
                          alt={testimonial.name}
                        />
                        <AvatarFallback>
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-heading-6 font-[number:var(--heading-6-font-weight)] text-contentstrong text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] whitespace-nowrap [font-style:var(--heading-6-font-style)]">
                        {testimonial.name}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="flex flex-col w-full max-w-[954px] items-center gap-[88px]">
        <div className="flex flex-col items-center gap-6">
          <h3 className="font-heading-3 font-[number:var(--heading-3-font-weight)] text-contentstrong text-[1.75rem] sm:text-[length:var(--heading-3-font-size)] text-center tracking-[var(--heading-3-letter-spacing)] leading-[1.2] sm:leading-[var(--heading-3-line-height)] [font-style:var(--heading-3-font-style)]">
            Reasons why you will love 
            {/* ❤  */}
            <br />
            to work with us
          </h3>
          <p className="max-w-[708px] font-body-text font-[number:var(--body-text-font-weight)] text-contentstrong text-[length:var(--body-text-font-size)] text-center tracking-[var(--body-text-letter-spacing)] leading-[var(--body-text-line-height)] [font-style:var(--body-text-font-style)]">
            We know you have options and that is why we are all about creating
            experiences that feel right for you because at the end of the day,
            your satisfaction is what drives us.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 w-full">
          {features.map((feature, index) => (
            <React.Fragment key={feature.id}>
              <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
                <div className="flex flex-col items-start gap-8">
                  <img
                    className="w-8 h-8"
                    alt={`Feature icon ${index + 1}`}
                    src={feature.icon}
                  />
                  <h5 className="font-heading-5 font-bold text-contentstrong text-[length:var(--heading-5-font-size)] tracking-[var(--heading-5-letter-spacing)] leading-[var(--heading-5-line-height)] [font-style:var(--heading-5-font-style)] whitespace-pre-line">
                    {feature.title}
                  </h5>
                </div>
                <p className="md:max-w-[520px] font-body-text font-[number:var(--body-text-font-weight)] text-contentstrong text-[length:var(--body-text-font-size)] tracking-[var(--body-text-letter-spacing)] leading-[var(--body-text-line-height)] [font-style:var(--body-text-font-style)]">
                  {feature.description}
                </p>
              </div>
              <hr className="w-full text-border-light" />
              {index < features.length - 1 && <Separator.Root className="w-full" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MainContentSection;
