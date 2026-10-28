import React from "react";
import BackgroundImage from "./BackgroundImage";
import { bannerStyles, cn } from "../lib/tailwind";

interface BannerSectionProps {
  className?: string;
}

export default function BannerSection({ className = "" }: BannerSectionProps) {
  return (
    <header className={cn(bannerStyles.header, className)}>
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1754661544/SuburbanGardener/IMG_7791_nl7dzw.jpg"
        className={bannerStyles.video}
      >
        <source
          src="https://res.cloudinary.com/dtweazqf2/video/upload/f_auto,q_auto/v1754668830/SuburbanGardener/bannerboomerang_ebv27k.webm"
          type="video/webm"
        />
        Your browser does not support the video tag.
      </video>

      <div className={bannerStyles.overlay}>
        <div className={bannerStyles.logoWrap}>
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
