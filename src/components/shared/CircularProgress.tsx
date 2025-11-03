import React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  type?: string
}

// Utility to return color based on value thresholds
function getProgressColor(value: number, type?: string): string {
  if (type === "lora") {
    return "#969696"; // Override color for "lora"
  }
  if (value <= 50) {
    // Matching red for values below 50%
    return '#ef4444';
  } else if (value <= 80) {
    // Orange for values between 50% and 80%
    return '#ff6200';
  } else {
    // Green for values 80% and above
    return '#10b981';
  }
}

export function CircularProgress({
  value,
  size = 60,
  strokeWidth = 4,
  className,
  type
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const strokeColor = getProgressColor(value, type);



  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted-foreground/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke 0.3s ease-in-out' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold" style={{ color: strokeColor }}>
          {value}%
        </span>
      </div>
    </div>
  );
}