'use client'

import * as Separator from "@radix-ui/react-separator";
import Link from "next/link";

export const FooterSection = () => {
  // Company links data
  const companyLinks = [
    { title: "Home", href: "/" },
    { title: "About us", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  // Sales links data
  const salesLinks = [
    { title: "Cars", href: "/cars" },
    { title: "Real estate", href: "/properties" },
  ];

  // Legal links data
  const legalLinks = [
    { title: "Privacy policy", href: "#" },
    { title: "Terms & Conditions", href: "#" },
  ];

  return (
    <footer className="w-full bg-[#10130d] py-20">
      <div className="max-w-[1196px] mx-auto flex flex-col items-start gap-12 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between w-full gap-8">
          {/* Company Info */}
          <div className="flex flex-col items-start gap-8 max-w-[343px]">
            {/* Logo and Company Name */}
            <div className="inline-flex items-end gap-2">
              <div className="inline-flex flex-col items-start">
                <Link href="/">
                  <img className=" h-6" alt="Logo" src="/tony.png" />
                </Link>
              </div>
              <div className="font-heading-6 font-[number:var(--heading-6-font-weight)] text-white text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] whitespace-nowrap [font-style:var(--heading-6-font-style)]">
                Tonyluxe Global Limited
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3 w-full">
              <div className="inline-flex items-center py-[3px]">
                <img
                  className="w-5 h-5"
                  alt="Location pin"
                  src="/heroicons-solid-map-pin.svg"
                />
              </div>
              <Link 
                href="https://maps.app.goo.gl/r5Jq9BPDWWEUdCXGA?g_st=iw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-body-text-2 font-[number:var(--body-text-2-font-weight)] text-white text-[length:var(--body-text-2-font-size)] tracking-[var(--body-text-2-letter-spacing)] leading-[var(--body-text-2-line-height)] [font-style:var(--body-text-2-font-style)] hover:underline"
              >
                Plot 28, Block 78 Emma Abimbola Cole street,
                <br />
                Lekki phase 1, Lagos, nigeria
              </Link>
            </div>

            {/* Social Media Icons */}
            <div className="inline-flex items-start gap-4">
              <Link href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <img
                  className="w-6 h-6 hover:opacity-80 transition-opacity"
                  alt="Facebook icon"
                  src="/vector.svg"
                />
              </Link>
              <Link 
                href="https://www.instagram.com/tonyluxe.global/" 
                aria-label="Instagram"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img
                  className="w-6 h-6 hover:opacity-80 transition-opacity"
                  alt="Instagram icon"
                  src="/vector-1.svg"
                />
              </Link>
              <Link href="#" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer">
                <img 
                  className="w-6 h-6 hover:opacity-80 transition-opacity" 
                  alt="X social media icon" 
                  src="/x.png" 
                />
              </Link>
              <Link 
                href="https://vm.tiktok.com/ZMBTwtkDb/" 
                aria-label="TikTok"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img 
                  className="w-6 h-6 hover:opacity-80 transition-opacity" 
                  alt="TikTok icon" 
                  src="/tiktok.svg" 
                />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="inline-flex flex-wrap items-start gap-8 md:gap-[104px]">
            {/* Company Links */}
            <div className="flex flex-col items-start gap-6">
              <div className="font-body-text-2 font-[number:var(--body-text-2-font-weight)] text-contentnormal text-[length:var(--body-text-2-font-size)] tracking-[var(--body-text-2-letter-spacing)] leading-[var(--body-text-2-line-height)] [font-style:var(--body-text-2-font-style)]">
                Company
              </div>
              <div className="flex flex-col items-start gap-4">
                {companyLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="inline-flex items-center justify-center gap-2.5"
                  >
                    <div className="font-body-text-2 font-[number:var(--body-text-2-font-weight)] text-bgmain text-[length:var(--body-text-2-font-size)] tracking-[var(--body-text-2-letter-spacing)] leading-[var(--body-text-2-line-height)] whitespace-nowrap [font-style:var(--body-text-2-font-style)]">
                      {link.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sales Links */}
            <div className="flex flex-col items-start gap-6">
              <div className="font-body-text-2 font-[number:var(--body-text-2-font-weight)] text-contentnormal text-[length:var(--body-text-2-font-size)] tracking-[var(--body-text-2-letter-spacing)] leading-[var(--body-text-2-line-height)] [font-style:var(--body-text-2-font-style)]">
                Sales
              </div>
              <div className="flex flex-col items-start gap-4">
                {salesLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="inline-flex items-center justify-center gap-2.5"
                  >
                    <div className="font-body-text-2 font-[number:var(--body-text-2-font-weight)] text-bgmain text-[length:var(--body-text-2-font-size)] tracking-[var(--body-text-2-letter-spacing)] leading-[var(--body-text-2-line-height)] whitespace-nowrap [font-style:var(--body-text-2-font-style)]">
                      {link.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col items-start gap-6">
              <div className="font-body-text-2 font-[number:var(--body-text-2-font-weight)] text-contentnormal text-[length:var(--body-text-2-font-size)] tracking-[var(--body-text-2-letter-spacing)] leading-[var(--body-text-2-line-height)] [font-style:var(--body-text-2-font-style)]">
                Legal
              </div>
              <div className="flex flex-col items-start gap-4">
                {legalLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="inline-flex items-center justify-center gap-2.5"
                  >
                    <div className="font-body-text-2 font-[number:var(--body-text-2-font-weight)] text-bgmain text-[length:var(--body-text-2-font-size)] tracking-[var(--body-text-2-letter-spacing)] leading-[var(--body-text-2-line-height)] whitespace-nowrap [font-style:var(--body-text-2-font-style)]">
                      {link.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <Separator.Root className="bg-white/10 h-px w-full" />

        {/* Copyright */}
        <div className="font-small-text font-[number:var(--small-text-font-weight)] text-contentnormal text-[length:var(--small-text-font-size)] tracking-[var(--small-text-letter-spacing)] leading-[var(--small-text-line-height)] [font-style:var(--small-text-font-style)]">
          Copyright © Tonyluxe Global Limited 2025. All rights reserved
        </div>
      </div>
    </footer>
  );
};
