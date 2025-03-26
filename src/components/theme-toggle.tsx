"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Wait for component to mount to access localStorage and prevent hydration mismatch
    setMounted(true);
    const savedTheme = localStorage.getItem("neurolog-theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const setThemePreference = (newTheme: Theme) => {
    setTheme(newTheme);
    if (window.setTheme) {
      window.setTheme(newTheme);
    }
  };

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="w-9 h-9 opacity-0" />; // Invisible placeholder while loading
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border-gray-200 dark:border-gray-700">
        <DropdownMenuItem
          onClick={() => setThemePreference("light")}
          className={`flex items-center gap-2 cursor-pointer ${theme === "light" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === "light" && <span className="ml-auto text-xs text-blue-600 dark:text-blue-400">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setThemePreference("dark")}
          className={`flex items-center gap-2 cursor-pointer ${theme === "dark" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && <span className="ml-auto text-xs text-blue-600 dark:text-blue-400">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setThemePreference("system")}
          className={`flex items-center gap-2 cursor-pointer ${theme === "system" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {theme === "system" && <span className="ml-auto text-xs text-blue-600 dark:text-blue-400">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
