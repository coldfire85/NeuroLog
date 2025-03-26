"use client";

import { useEffect, useState, useCallback } from "react";

// Theme type definition
type Theme = "light" | "dark" | "system";

// Add type declaration for the window object
declare global {
  interface Window {
    setTheme: (theme: Theme) => void;
  }
}

export default function ClientBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [hasMounted, setHasMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");

  // Get system preference for dark mode
  const getSystemTheme = useCallback((): "light" | "dark" => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light"; // Default to light if no window object
  }, []);

  // Apply theme to document
  const applyTheme = useCallback((newTheme: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (newTheme === "system") {
      const systemTheme = getSystemTheme();
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
  }, [getSystemTheme]);

  // Set theme and persist to localStorage
  const setThemeAndPersist = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("neurolog-theme", newTheme);
    }
    applyTheme(newTheme);
  }, [applyTheme]);

  // Handle hydration mismatch by only rendering after component has mounted
  useEffect(() => {
    // Get theme from localStorage or default to system
    const savedTheme = localStorage.getItem("neurolog-theme") as Theme | null;
    const initialTheme = savedTheme || "system";
    setTheme(initialTheme);
    applyTheme(initialTheme);

    setHasMounted(true);

    // Remove any extension-added classes during hydration
    const originalClassName = className || "antialiased";
    document.body.className = originalClassName;

    // Clean up any shadow DOM elements that might be causing hydration issues
    const shadowElements = document.querySelectorAll('[id^="shadowLL"]');
    shadowElements.forEach(el => el.remove());

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, [className, theme, applyTheme]);

  // Expose theme context to make it available throughout the app
  useEffect(() => {
    window.setTheme = setThemeAndPersist;
  }, [setThemeAndPersist]);

  return (
    <>
      {hasMounted ? children : null}
    </>
  );
}
