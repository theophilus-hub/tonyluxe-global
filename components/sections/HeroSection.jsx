'use client'

import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[100vh] max-h-[1080px] w-full px-4 py-12">
      <div className="flex flex-col items-center gap-10 md:gap-12 w-full max-w-[607px] mx-auto">
        <div className="flex flex-col items-center gap-4 md:gap-5 w-full">
          <h1 className="font-heading-1 text-bgmain text-[2.5rem] sm:text-[length:var(--heading-1-font-size)] text-center tracking-[var(--heading-1-letter-spacing)] leading-[1.2] sm:leading-[var(--heading-1-line-height)] [font-style:var(--heading-1-font-style)]">
            Luxury and comfort curated just for you
          </h1>

          <p className="font-body-text text-bgmain text-[1rem] sm:text-[length:var(--body-text-font-size)] text-center tracking-[var(--body-text-letter-spacing)] leading-[var(--body-text-line-height)] [font-style:var(--body-text-font-style)]">
            Explore exceptional properties, quality vehicles, and premium Airbnb
            listings—all designed to enhance your everyday life.
          </p>
        </div>

        <Link href="/list">
          <Button className="relative flex items-center justify-center gap-2 px-6 py-3 bg-brandbg text-brandcontent rounded-xl overflow-hidden shadow-[0px_4px_10px_#0a0a0a0f,inset_0px_4px_10px_#ffffff1a] w-full sm:w-auto">
            <div className="absolute w-[13px] h-[13px] top-[49px] -left-5 bg-brandcontent rounded-[6.5px]" />
            <span className="font-heading-6 text-contentstrong text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] whitespace-nowrap [font-style:var(--heading-6-font-style)]">
              Explore our listings
            </span>
            <ArrowUpRightIcon className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};
