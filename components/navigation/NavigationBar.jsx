'use client'

import React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";

export default function NavigationBar() {
  // Navigation menu items with updated links
  const navItems = [
    { label: "About us", href: "/about" },
    { label: "Cars", href: "#" },
    { label: "Properties", href: "/list" },
    { label: "Contact", href: "/contact" },
  ];

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="flex justify-center w-full py-4">
      {/* Mobile navigation bar - only visible on small screens */}
      <nav className="sm:hidden fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between gap-4 px-4 py-3 bg-border-medium/40 rounded-xl backdrop-blur-sm backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(50px)_brightness(100%)] w-[85%] min-w-[280px]">
        <Link href="/">
          <img
            className="h-6"
            alt="Logo"
            src="/tony.png"
          />
        </Link>
        
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-gray-800"
          aria-label="Toggle menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Tablet and Desktop navigation */}
      <nav className="hidden sm:flex gap-4 sm:gap-10 pr-12 sm:px-10 py-3 sm:py-6 bg-border-medium/40 backdrop-blur-sm rounded-full items-center">
        <div className="inline-flex flex-col items-start pl-4 pr-4 md:pr-10 py-0 relative flex-[0_0_auto]">
          <Link href="/">
            <img
              className="relative h-6"
              alt="Logo"
              src="/tony.png"
            />
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:gap-10 px-2 lg:px-4">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="justify-center relative flex-[0_0_auto] inline-flex items-center px-1 lg:px-2"
            >
              <Link href={item.href}>
                <div className="relative w-fit text-sm lg:text-base font-heading-6 font-semibold text-content-black tracking-normal leading-normal whitespace-nowrap">
                  {item.label}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile navigation - full screen overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center sm:hidden">
          <div className="flex flex-col items-center gap-8">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <img
                className="h-8 mb-8"
                alt="Logo"
                src="/tony.png"
              />
            </Link>
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-xl font-semibold text-content-dark py-2"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
