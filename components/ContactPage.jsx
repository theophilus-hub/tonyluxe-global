'use client'

import { MapPinIcon, MinusIcon, PlusIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import Link from "next/link";
import NavigationBar from "./navigation/NavigationBar";
import { FooterSection } from "./sections/FooterSection";

export default function ContactPage() {
  // Contact form data
  const contactFormFields = [
    { id: "fullName", placeholder: "Full name", type: "text" },
    { id: "email", placeholder: "Email", type: "email" },
  ];

  // Contact information data
  const contactInfo = [
    { label: "Phone", value: "+2348140966769" },
    { label: "Email", value: "Info@tonyluxeglobal.org" },
    {
      label: "Address",
      value: "plot 28, block 78 Emma Abimbola Cole street, Lekki phase 1",
    },
    { label: "Whatsapp", value: "+2349120739354" },
    { label: "Instagram", value: "@Tonyluxeglobal" },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-full relative">
        {/* Navigation */}
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
          <NavigationBar />
        </div>

        {/* Hero section with form */}
        <div className="relative w-full h-screen min-h-[600px] ">
          {/* Background image */}
          <img
            className="w-full h-full object-cover absolute inset-0"
            alt="Rectangle"
            src="/rectangle-1.svg"
          />
          
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Decorative circles - hidden on small screens */}
         {/* Decorative circles */}
         <div className="absolute -top-80 sm:-top-20 -left-80 sm:-left-20 w-[659px] h-[659px] rounded-[329.5px] border-[60px] border-solid border-[#67b6841a]">
            <div className="relative w-[395px] h-[395px] top-[72px] left-[72px] rounded-[197.35px] border-[60px] border-solid border-[#67b684] opacity-10" />
          </div>

          <div className="absolute -bottom-44 left-[50%] sm:-right-52 w-[659px] h-[659px] rounded-[329.5px] border-[60px] border-solid border-[#67b6841a]">
            <div className="relative w-[395px] h-[395px] top-[72px] left-[72px] rounded-[197.35px] border-[60px] border-solid border-[#67b684] opacity-10" />
          </div>

          {/* Main heading */}
          <div className="absolute top-1/5 left-1/2 -translate-x-1/2 text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-center z-10 px-4 w-full max-w-2xl">
            Let&apos;s connect.
            <br />
            We would love to hear from you
          </div>

          {/* Contact form */}
          <div className="absolute w-[90%] sm:w-[80%] max-w-[581px] top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/4 flex flex-col gap-4 sm:gap-6 z-10 px-4 sm:px-0">
            {contactFormFields.map((field) => (
              <Input
                key={field.id}
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                className="h-12 sm:h-14 md:h-16 bg-white/90 rounded-lg border border-solid border-neutral-300 px-4 sm:px-5 py-3 sm:py-4 text-gray-800"
              />
            ))}

            <Textarea
              id="message"
              placeholder="Write your message"
              className="h-24 sm:h-32 md:h-40 bg-white/90 rounded-lg border border-solid border-neutral-300 px-4 sm:px-5 py-3 sm:py-4 text-gray-800 resize-none"
            />

            <Button className="w-full sm:w-3/4 md:w-2/3 h-12 sm:h-14 mt-4 sm:mt-6 mx-auto bg-brand-light rounded-lg text-black font-semibold shadow-md hover:bg-brand-primary hover:text-white transition-colors">
              Send us a message
            </Button>
          </div>
        </div>
          
        {/* Get in touch section */}
        <div className="flex flex-col items-center gap-8 sm:gap-16 py-20 sm:py-24 px-4">
          <h2 className="font-bold text-gray-900 text-2xl sm:text-3xl md:text-4xl text-center tracking-tight leading-tight">
            Get in touch with Tony!
          </h2>

          <div className="flex flex-col lg:flex-row items-center gap-8 w-full max-w-[1200px] mx-auto">
            {/* Map image */}
            <div className="relative w-full lg:w-2/3 h-[300px] sm:h-[400px] md:h-[484px]">
              <img
                className="w-full h-full object-cover rounded-lg"
                alt="Map location"
                src="/mask-group.png"
              />

              {/* Map controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <Button
                  variant="default"
                  size="icon"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded shadow-md"
                >
                  <PlusIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded shadow-md"
                >
                  <MinusIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                </Button>
              </div>
            </div>

            {/* Contact information card */}
            <Card className="w-full lg:w-1/3 bg-brand-light border-0 rounded-lg shadow-sm">
              <CardContent className="flex flex-col gap-6 sm:gap-8 py-2 px-6 sm:p-8">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-gray-500 text-sm font-medium">
                      {item.label}
                    </span>
                    <span className="text-gray-900 text-base sm:text-lg font-semibold">
                      {item.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <FooterSection />
      </div>
    </div>
  );
}
