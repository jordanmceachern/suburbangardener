import React, { ReactNode } from "react";
import type { Metadata } from "next";
import ErrorBoundary from "../components/ErrorBoundary";
import Navigation from "../components/Navigation";
import { AuthProvider } from "../lib/auth-nextauth";
import "./globals.css";

const title = "Suburban Gardener";
const description =
  "Your home gardening journey starts here. Come learn some great tips, use our free design tools, and shop for building materials with complete solutions to your backyard suburban garden.";

const faviconURL =
  "https://res.cloudinary.com/dtweazqf2/image/upload/t_ammafavicon/v1754668830/SuburbanGardener/suburban_gardener_mvpaj0.png";
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
  icons: {
    icon: faviconURL,
    shortcut: faviconURL,
    apple: faviconURL,
  },
  openGraph: {
    title,
    description,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ErrorBoundary>
            <div className="flex h-screen">
              <Navigation />
              <div className="flex-1 sm:ml-20 lg:ml-32">
                <div className="pb-20 sm:pb-0">{children}</div>
              </div>
            </div>
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
