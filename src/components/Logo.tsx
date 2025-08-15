import React from "react";
import BackgroundImage from "./BackgroundImage";
import type { BackgroundImageProps } from "./BackgroundImage";

export default function Logo({
  className,
  height,
  label = "Suburban Gardener Logo",
  width,
  minWidth,
  maxWidth,
  src,
}: BackgroundImageProps) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text -- alt text is provided via label prop
    <BackgroundImage
      className={className}
      height={height}
      label={label}
      maxWidth={maxWidth}
      minWidth={minWidth}
      src={src}
      width={width}
    />
  );
}
