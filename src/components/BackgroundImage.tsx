import React from "react";

export interface BackgroundImageProps {
  className?: string;
  imageClassName?: string;
  height?: number;
  label?: string;
  src: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}

export function BackgroundImage({
  className,
  height,
  imageClassName,
  label,
  maxWidth,
  minWidth,
  src,
  width,
}: BackgroundImageProps) {
  const containerStyle = {
    height: height ? `${height}px` : undefined,
  };
  const imageStyle = {
    maxWidth: maxWidth ? `${maxWidth}px` : undefined,
    minWidth: minWidth ? `${minWidth}px` : undefined,
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
    objectFit: "contain" as const,
  };

  return (
    <div
      className={`flex w-full justify-center${className ? " " + className : ""}`}
      style={containerStyle}
    >
      <img
        alt={label || "Decorative image"}
        aria-label={label}
        className={`h-auto w-full rounded-lg object-contain ${imageClassName ? " " + imageClassName : ""}`}
        src={src}
        style={imageStyle}
      />
    </div>
  );
}

export default BackgroundImage;
