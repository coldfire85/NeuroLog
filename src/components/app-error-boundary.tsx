"use client";

import React from "react";
import ErrorBoundary from "./error-boundary";

interface AppErrorBoundaryProps {
  children: React.ReactNode;
  section?: string; // Add a section name for better error context
}

export function AppErrorBoundary({ children, section = "app" }: AppErrorBoundaryProps) {
  // Reset callback could trigger a page reload or other recovery actions
  const handleReset = () => {
    // For specific sections, we can implement custom recovery logic
    console.log(`Error boundary reset for section: ${section}`);
  };

  return (
    <ErrorBoundary onReset={handleReset}>
      {children}
    </ErrorBoundary>
  );
}
