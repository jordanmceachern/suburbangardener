import React, { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

const title = "Suburban Gardener";
const description =
  "Your home gardening journey starts here. Come learn some great tips, use our free design tools, and shop for building materials with complete solutions to your backyard suburban garden.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "build",
    "design",
    "garden",
    "gardening",
    "grow",
    "irrigation",
    "irrigate",
    "landscape",
    "landscaping",
    "order",
    "organic",
    "plant",
    "plants",
    "self-monitor",
    "self-monitoring",
    "shop",
    "suburb",
    "suburban",
    "sustainable",
    "store",
    "vegetable",
    "vegetables",
    "veggie",
    "veggies",
  ],
  authors: [{ name: "Jordan McEachern" }],
  openGraph: {
    title,
    description,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
