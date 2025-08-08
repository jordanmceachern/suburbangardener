import React, { ImgHTMLAttributes } from "react";
import Image from "next/image";

interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function Logo({
  width = 120,
  height = 120,
  priority = false,
  ...rest
}: LogoProps) {
  return (
    <Image
      alt="Suburban Gardener Logo"
      src="https://res.cloudinary.com/dtweazqf2/image/upload/t_cropped/v1754658885/SuburbanGardener/suburban_gardener_mvpaj0.png"
      width={width}
      height={height}
      priority={priority}
      {...rest}
    />
  );
}
