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
  const customContainerHeight = {
    height: height ? `${height}px` : undefined,
  };
  const customImageWidth = {
    maxWidth: maxWidth ? `${maxWidth}px` : undefined,
    minWidth: minWidth ? `${minWidth}px` : undefined,
    width: width ? `${width}px` : undefined,
  };
  return (
    <div
      className={`h-auto w-full flex justify-center${className ? " " + className : ""}`}
      style={customContainerHeight}
    >
      <div
        aria-label={label}
        className={`bg-contain bg-center bg-no-repeat w-full h-full dark:bg-neutral-300 dark:rounded-lg dark:shadow-lg${imageClassName ? " " + imageClassName : ""} rounded-lg`}
        style={{ backgroundImage: `url(${src})`, ...customImageWidth }}
      />
    </div>
  );
}

export default BackgroundImage;
