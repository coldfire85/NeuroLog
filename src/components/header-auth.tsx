"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileMenu } from "@/components/profile-menu";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/procedures", label: "Procedures" },
  { href: "/templates", label: "Templates" },
  { href: "/export", label: "Export" },
  { href: "/articles", label: "Articles" },
  { href: "/public-feed", label: "Network" },
  { href: "/cloud-storage", label: "Cloud Storage" }, // Added Cloud Storage link
  { href: "/dicom-viewer-demo", label: "DICOM Viewer" },
];

export default function HeaderNav() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Check if we're on login page (simplified version for demo)
  const isLoginOrRegisterPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password";

  // Effect to handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until mounted to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  // Only show navigation if not on login/register pages
  if (isLoginOrRegisterPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-gray-800">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="font-bold text-xl mr-6 text-blue-600 dark:text-blue-400">
            NeuroLog
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  pathname === link.href
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          {/* Theme toggle - using our new component */}
          <ThemeToggle />

          {/* User menu - replace with our new ProfileMenu component */}
          <ProfileMenu />

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="dark:bg-gray-900">
              <nav className="flex flex-col space-y-6 mt-8">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-base font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                      pathname === link.href
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
