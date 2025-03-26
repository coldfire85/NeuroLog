"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
  barClassName?: string;
}

export function ProgressBar({
  progress,
  className,
  barClassName,
}: ProgressBarProps) {
  // Ensure progress is between 0 and 100
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <div
      className={cn(
        "w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700",
        className
      )}
    >
      <div
        className={cn(
          "bg-primary h-1.5 rounded-full transition-all duration-300",
          barClassName
        )}
        style={{ width: `${safeProgress}%` }}
        role="progressbar"
        aria-valuenow={safeProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      ></div>
    </div>
  );
}
