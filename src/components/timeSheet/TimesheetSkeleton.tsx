// components/timeSheet/TimesheetSkeleton.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

const TimesheetSkeleton = () => {
  const renderSkeletonRow = (cols = 6) => (
    <tr>
      {Array.from({ length: cols }).map((_, idx) => (
        <td key={idx} className="px-4 py-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        </td>
      ))}
    </tr>
  );

  return (
    <div className="w-full h-full space-y-4">
      {/* Top controls skeleton */}
      <div className="flex justify-between gap-3">
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-10 w-24 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Filter / action skeleton */}
      {/* <div className="flex justify-end gap-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="h-8 w-20 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div> */}

      {/* Table skeleton */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-gradient-to-r from-white to-gray-100">
          <thead>
            <tr>
              {Array.from({ length: 6 }).map((_, idx) => (
                <th
                  key={idx}
                  className="px-4 py-2 bg-gray-100 border-b border-gray-300"
                >
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 20 }).map((_, idx) => (
              <React.Fragment key={idx}>{renderSkeletonRow()}</React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimesheetSkeleton;
