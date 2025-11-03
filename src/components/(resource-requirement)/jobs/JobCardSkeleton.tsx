"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function JobCardSkeleton() {
  return (
    <Card className="w-full md:max-w-md lg:max-w-lg bg-card shadow-none border border-gray-200">
      <CardHeader className="pb-1 px-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16 rounded" /> {/* jobId */}
            <Skeleton className="h-5 w-14 rounded-sm" /> {/* status badge */}
          </div>
          <Skeleton className="h-6 w-16 rounded" /> {/* button group */}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-3">
        <div>
          <Skeleton className="h-5 w-2/3 mb-2" /> {/* title */}

          <div className="space-y-2 text-sm">
            <Skeleton className="h-4 w-40" /> {/* Bill Rate */}
            <Skeleton className="h-4 w-48" /> {/* Position Start Date */}
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4 rounded-full" /> {/* map icon */}
              <Skeleton className="h-4 w-32" /> {/* location */}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-1">
              <Skeleton className="h-4 w-4 rounded-full" /> {/* stat icon */}
              <Skeleton className="h-4 w-6" /> {/* stat number */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
