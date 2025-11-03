// FileuploadProress.tsx
import React from "react";

interface FileUploadProgressProps {
  progress: number; // 0 to 100
}

export const FileUploadProgress: React.FC<FileUploadProgressProps> = ({ progress }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  return (
    <div className="relative w-24 h-24 ">
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-slate-600"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-blue-500 transition-all duration-300"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-blue-600 font-semibold">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};
