"use client";

import React from "react";
import Link from "next/link";
import BackgroundImage from "./BackgroundImage";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/auth-nextauth";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

const navigation: NavItem[] = [
  {
    name: "Home",
    href: "/",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    requiresAuth: true,
  },
  {
    name: "Tutorials",
    href: "/tutorials",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    name: "Articles",
    href: "/articles",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
    ),
  },
  {
    name: "Tools",
    href: "/tools",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    name: "Store",
    href: "/store",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const filteredNavigation = navigation.filter(item => {
    if (item.requiresAuth && !isAuthenticated) {
      return false;
    }
    return true;
  });

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop/Tablet Sidebar - Left side for lg+ screens */}
      <nav className="hidden sm:fixed sm:inset-y-0 sm:left-0 sm:flex sm:flex-col sm:w-20 lg:w-32">
        <div className="flex flex-col flex-grow pt-6 bg-slate-100 dark:bg-slate-800 border-r border-slate-300 dark:border-slate-600 overflow-y-auto">
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-3 space-y-1">
              {filteredNavigation.map(item => {
                const active = isActive(item.href);
                return (
                  <div className="relative group" key={item.name}>
                    {item.name === "Home" ? (
                      <Link
                        title={item.name}
                        className={`${
                          active
                            ? "bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100"
                        } group flex items-center md:px-1 md:py-px lg:px-3 lg:py-2 font-medium rounded-md transition-colors`}
                        href={item.href}
                      >
                        <span className="md:h-8 lg:h-16 w-full flex">
                          <BackgroundImage
                            className="flex-shrink-0 dark:bg-neutral-200"
                            key="home-logo"
                            label="Suburban Gardener Logo"
                            src="https://res.cloudinary.com/dtweazqf2/image/upload/c_fill,q_auto,f_auto/v1755011510/SuburbanGardener/suburban_gardener_s4c8gy.png"
                          />
                        </span>
                      </Link>
                    ) : (
                      <Link
                        title={item.name}
                        className={`${
                          active
                            ? "bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100"
                        } group flex justify-center items-center px-3 py-2 font-medium rounded-md transition-colors`}
                        href={item.href}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="hidden lg:ml-2 lg:block">
                          {item.name}
                        </span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom horizontal bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 z-50">
        <div className="flex justify-around items-center py-2">
          {filteredNavigation.map(item => {
            const active = isActive(item.href);

            if (item.name === "Home") {
              return (
                <Link
                  key={item.name}
                  title={item.name}
                  className={`${
                    active
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  } group flex items-center transition-colors py-2 px-2`}
                  href={item.href}
                >
                  <span className="h-8 w-12 flex">
                    <BackgroundImage
                      className="flex-shrink-0 dark:bg-neutral-200"
                      label="Suburban Gardener Logo"
                      src="https://res.cloudinary.com/dtweazqf2/image/upload/c_fill,q_auto,f_auto/v1755011510/SuburbanGardener/suburban_gardener_s4c8gy.png"
                    />
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  active
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-neutral-500 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
                } flex flex-col items-center justify-center min-w-0 py-2 transition-colors`}
              >
                <span className="flex-shrink-0 mb-1">{item.icon}</span>
                <span className="text-xs font-medium truncate">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
