import React from "react";
import BackgroundImage from "./BackgroundImage";

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = "" }: HeroSectionProps) {
  return (
    <header
      className={`relative flex flex-col items-center text-center overflow-hidden rounded-lg min-h-[400px] ${className}`}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1754661544/SuburbanGardener/IMG_7791_nl7dzw.jpg"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://res.cloudinary.com/dtweazqf2/video/upload/f_auto,q_auto/v1754668830/SuburbanGardener/bannerboomerang_ebv27k.webm"
          type="video/webm"
        />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 z-10 w-full flex flex-col items-center justify-center">
        <div className="h-[125px] sm:h-[225px] w-full flex">
          <BackgroundImage
            key="landing-logo"
            label="Suburban Gardener Logo"
            src="https://res.cloudinary.com/dtweazqf2/image/upload/c_fill,t_transparent-white-alpha-dim,q_auto,f_auto/v1755011510/SuburbanGardener/suburban_gardener_s4c8gy.png"
          />
        </div>
      </div>
    </header>
  );
}
