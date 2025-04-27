'use client'

import {
  BookmarkIcon,
  DollarSignIcon,
  HomeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import Link from "next/link";
import NavigationBar from "./navigation/NavigationBar";

export default function ProductPage() {

  // Property details
  const propertyDetails = [
    {
      icon: <DollarSignIcon className="w-4 h-4" />,
      label: "Price:",
      value: "₦2.3 Million/yr",
    },
    {
      icon: <MapPinIcon className="w-4 h-4" />,
      label: "Location:",
      value: "Jabi, Abuja",
    },
    {
      icon: <HomeIcon className="w-4 h-4" />,
      label: "Bedrooms/bathrooms:",
      value: "1/2",
    },
    {
      icon: <BookmarkIcon className="w-4 h-4" />,
      label: "Listing status:",
      value: "For sale",
    },
  ];

  // Agent details
  const agentDetails = [
    {
      icon: <PhoneIcon className="w-4 h-4" />,
      label: "Phone number:",
      value: "+234 814 096 6769",
    },
    {
      icon: <MapPinIcon className="w-4 h-4" />,
      label: "WhatsApp:",
      value: "+234 912 073 9354",
    },
    {
      icon: <MailIcon className="w-4 h-4" />,
      label: "Email:",
      value: "Info@tonyluxeglobal.org",
    },
  ];

  // Footer links with updated hrefs
  const footerLinks = {
    company: [
      { label: "Home", href: "/" },
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    sales: [
      { label: "Cars", href: "#" },
      { label: "Real estate", href: "/list" },
    ],
    legal: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
    ],
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1440px] relative">
        {/* Navigation */}
       <NavigationBar />

        <main className="px-[120px]">
          {/* Property Gallery */}
          <section className="flex items-start gap-6 mb-10">
            <div className="relative w-[950px] h-[500px] bg-contentstrong rounded-2xl overflow-hidden">
              <div className="h-[500px] bg-[url(/image.png)] bg-cover bg-[50%_50%]" />
            </div>

            <div className="flex flex-col w-[221px] items-center gap-5">
              {[1, 2, 3].map((index) => (
                <img
                  key={index}
                  className="w-full h-[130px] object-cover rounded-md"
                  alt={`Property view ${index}`}
                  src={
                    index === 3 ? "/rectangle-4936.png" : "/rectangle-4935.png"
                  }
                />
              ))}

              <Button
                variant="outline"
                className="w-full py-3.5 text-contentmuted border-[#3a4050] shadow-[0px_4px_10px_#0a0a0a1a,inset_0px_4px_10px_#ffffff21]"
              >
                See all photos
              </Button>
            </div>
          </section>

          {/* Property Content */}
          <section className="flex gap-8">
            {/* Left Column - Property Details */}
            <div className="flex flex-col w-[614px] gap-8">
              <h1 className="font-heading-5 font-[number:var(--heading-5-font-weight)] text-black text-[length:var(--heading-5-font-size)] tracking-[var(--heading-5-letter-spacing)] leading-[var(--heading-5-line-height)] [font-style:var(--heading-5-font-style)]">
                Modern 3-Bedroom Villa in Lekki, Lagos
              </h1>

              <div className="flex flex-col gap-10">
                {/* Description */}
                <div className="flex flex-col gap-2">
                  <h2 className="font-heading-6 font-[number:var(--heading-6-font-weight)] text-contentmuted text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] [font-style:var(--heading-6-font-style)]">
                    Description:
                  </h2>
                  <p className="font-body-text font-[number:var(--body-text-font-weight)] text-contentstrong text-[length:var(--body-text-font-size)] tracking-[var(--body-text-letter-spacing)] leading-[var(--body-text-line-height)] [font-style:var(--body-text-font-style)]">
                    Welcome to this stunning 3-bedroom villa located in the
                    heart of Lekki, Lagos. This beautifully designed property
                    offers the perfect blend of modern elegance and comfortable
                    living. Step inside to discover an open-concept living area
                    flooded with natural light, a state-of-the-art kitchen with
                    high-end appliances, and spacious bedrooms with en-suite
                    bathrooms.
                    <br />
                    <br />
                    The master suite features a walk-in closet and a private
                    balcony overlooking the lush garden. Outside, you&apos;ll find a
                    fully landscaped yard, a sparkling swimming pool, and a
                    covered patio perfect for entertaining. Additional features
                    include a secure gated community, 24/7 security, and ample
                    parking space. Whether you&apos;re looking for a family home or a
                    luxurious retreat, this villa has it all. Schedule a viewing
                    today and experience the lifestyle you deserve.
                  </p>
                </div>

                <Separator className="w-full" />

                {/* Amenities */}
                <div className="flex flex-col gap-2">
                  <h2 className="font-heading-6 font-[number:var(--heading-6-font-weight)] text-contentmuted text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] [font-style:var(--heading-6-font-style)]">
                    Amenities
                  </h2>
                  <div className="font-body-text font-[number:var(--body-text-font-weight)] text-contentstrong text-[length:var(--body-text-font-size)] tracking-[var(--body-text-letter-spacing)] leading-[var(--body-text-line-height)] [font-style:var(--body-text-font-style)]">
                    Interior Features:
                    <br />
                    Open-concept living area
                    <br />
                    Modern kitchen with high-end appliances
                    <br />
                    Spacious bedrooms with en-suite bathrooms
                    <br />
                    Walk-in closet in the master suite
                    <br />
                    Private balcony
                    <br />
                    Exterior Features:
                    <br />
                    Landscaped garden
                    <br />
                    Swimming pool
                    <br />
                    Covered patio
                    <br />
                    Secure gated community
                    <br />
                    24/7 security
                    <br />
                    Ample parking space
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Price and Contact */}
            <Card className="w-[350px] h-fit mt-[68px]">
              <CardContent className="flex flex-col gap-[18px] p-6">
                <h2 className="font-heading-4 font-[number:var(--heading-4-font-weight)] text-contentmuted text-[length:var(--heading-4-font-size)] tracking-[var(--heading-4-letter-spacing)] leading-[var(--heading-4-line-height)] [font-style:var(--heading-4-font-style)]">
                  ₦2.3 million/yr
                </h2>

                <Separator className="w-full" />

                {/* Key Details */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading-5 font-[number:var(--heading-5-font-weight)] text-contentnormal text-[length:var(--heading-5-font-size)] tracking-[var(--heading-5-letter-spacing)] leading-[var(--heading-5-line-height)] [font-style:var(--heading-5-font-style)]">
                    Key Details
                  </h3>

                  <div className="flex flex-col gap-1">
                    {propertyDetails.map((detail, index) => (
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
                  <Button className="w-full py-3 bg-brandbg text-contentstrong rounded-xl relative overflow-hidden shadow-[0px_4px_10px_#0a0a0a0f,inset_0px_4px_10px_#ffffff1a]">
                    <div className="absolute w-[13px] h-[13px] top-[49px] -left-5 bg-brandcontent rounded-[6.5px]" />
                    <span className="font-heading-6 font-[number:var(--heading-6-font-weight)] text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] [font-style:var(--heading-6-font-style)]">
                      Contact Tony
                    </span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>

          {/* Map Section */}
          <section className="mt-10">
            <Separator className="w-full my-10" />
            <div className="w-full h-[523px] bg-[url(/---map-maker--lekki-phase-1--lagos--lagos--nigeria--standard-.png)] bg-cover bg-[50%_50%] relative rounded-xl">
              <div className="inline-flex items-center gap-2.5 p-[30px] absolute top-[202px] left-[539px] bg-strong-20 rounded-[80px]">
                <div className="inline-flex items-center gap-2.5 p-2.5 relative flex-[0_0_auto] bg-bgmain rounded-[40px] shadow-[0px_4px_12px_#00000033]">
                  <img
                    className="w-10 h-10"
                    alt="Property location"
                    src="/heroicons-solid-home.svg"
                  />
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full mt-20 bg-[#10130d] text-white">
          <div className="max-w-[1196px] mx-auto py-20 px-4">
            <div className="flex flex-wrap justify-between gap-8 mb-12">
              {/* Company Info */}
              <div className="flex flex-col gap-8 max-w-[343px]">
                <div className="flex items-end gap-2">
                  <Link href="/">
                    <img className="w-[42.67px] h-6" alt="Logo" src="/logo.svg" />
                  </Link>
                  <span className="font-heading-6 font-[number:var(--heading-6-font-weight)] text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] [font-style:var(--heading-6-font-style)]">
                    Tonyluxe Global Limited
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="py-[3px]">
                    <img
                      className="w-5 h-5"
                      alt="Location"
                      src="/heroicons-solid-map-pin.svg"
                    />
                  </div>
                  <p className="font-body-text-2 font-[number:var(--body-text-2-font-weight)] text-[length:var(--body-text-2-font-size)] tracking-[var(--body-text-2-letter-spacing)] leading-[var(--body-text-2-line-height)] [font-style:var(--body-text-2-font-style)]">
                    Plot 28, Block 78 Emma Abimbola Cole street,
                    <br />
                    Lekki phase 1, Lagos, nigeria
                  </p>
                </div>

                <div className="flex gap-4">
                  <img className="w-6 h-6" alt="Social" src="/vector.svg" />
                  <img className="w-6 h-6" alt="Social" src="/vector-1.svg" />
                  <img className="w-6 h-6" alt="Social" src="/x.png" />
                </div>
              </div>

              {/* Footer Links */}
              <div className="flex flex-wrap gap-[104px]">
                {/* Company Links */}
                <div className="flex flex-col gap-6">
                  <h3 className="font-body-text-2 font-[number:var(--body-text-2-font-weight)] text-contentnormal text-[length:var(--body-text-2-font-size)] tracking-[var(--body-text-2-letter-spacing)] leading-[var(--body-text-2-line-height)] [font-style:var(--body-text-2-font-style)]">
                    Company
                  </h3>
                  <div className="flex flex-col gap-4">
                    {footerLinks.company.map((link) => (
                      <div key={link.label} className="flex items-center">
                        <Link href={link.href}>
                          <span className="font-body-text-2 font-[number:var(--body-text-2-font-weight)] text-bgmain text-[length:var(--body-text-2-font-size)] tracking-[var(--body-text-2-letter-spacing)] leading-[var(--body-text-2-line-height)] [font-style:var(--body-text-2-font-style)]">
                            {link.label}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sales Links */}
                <div className="flex flex-col gap-6">
                  <h3 className="font-body-text-2 font-[number:var(--body-text-2-font-weight)] text-contentnormal text-[length:var(--body-text-2-font-size)] tracking-[var(--body-text-2-letter-spacing)] leading-[var(--body-text-2-line-height)] [font-style:var(--body-text-2-font-style)]">
                    Sales
                  </h3>
                  <div className="flex flex-col gap-4">
                    {footerLinks.sales.map((link) => (
                      <div key={link.label} className="flex items-center">
                        <Link href={link.href}>
                          <span className="font-body-text-2 font-[number:var(--body-text-2-font-weight)] text-bgmain text-[length:var(--body-text-2-font-size)] tracking-[var(--body-text-2-letter-spacing)] leading-[var(--body-text-2-line-height)] [font-style:var(--body-text-2-font-style)]">
                            {link.label}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legal Links */}
                <div className="flex flex-col gap-6">
                  <h3 className="font-body-text-2 font-[number:var(--body-text-2-font-weight)] text-contentnormal text-[length:var(--body-text-2-font-size)] tracking-[var(--body-text-2-letter-spacing)] leading-[var(--body-text-2-line-height)] [font-style:var(--body-text-2-font-style)]">
                    Legal
                  </h3>
                  <div className="flex flex-col gap-4">
                    {footerLinks.legal.map((link) => (
                      <div key={link.label} className="flex items-center">
                        <Link href={link.href}>
                          <span className="font-body-text-2 font-[number:var(--body-text-2-font-weight)] text-bgmain text-[length:var(--body-text-2-font-size)] tracking-[var(--body-text-2-letter-spacing)] leading-[var(--body-text-2-line-height)] [font-style:var(--body-text-2-font-style)]">
                            {link.label}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-contentnormal mb-12" />

            <p className="font-small-text font-[number:var(--small-text-font-weight)] text-contentnormal text-[length:var(--small-text-font-size)] tracking-[var(--small-text-letter-spacing)] leading-[var(--small-text-line-height)] [font-style:var(--small-text-font-style)]">
              Copyright © Tonyluxe Global Limited 2025. All rights reserved
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
