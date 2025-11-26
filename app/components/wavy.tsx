
"use client";
import React from "react";
import { WavyBackground } from "@/app/components/ui/wavy-background";

export function Wavy() {
  return (
    <WavyBackground className="mx-auto pb-40">
      <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
        WAGWAN FAM
      </p>
      <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
        Nice to know you come to here
      </p>
    </WavyBackground>
  );
}
