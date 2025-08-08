import React from "react";
import Image from "next/image";

interface LogoProps {
  height?: number;
  width?: number;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({
  height = 120,
  width = 120, // Default width same as height for square aspect
  priority = false,
  className,
  style,
}: LogoProps) {
  return (
    <Image
      alt="Suburban Gardener Logo"
      src="https://res.cloudinary.com/dtweazqf2/image/upload/c_fill/v1754668830/SuburbanGardener/suburban_gardener_mvpaj0.png"
      height={height}
      width={width}
      priority={priority}
      className={className}
      style={style}
    />
  );
}
