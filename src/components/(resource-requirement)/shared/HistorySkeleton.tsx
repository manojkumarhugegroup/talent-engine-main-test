"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

export default function HistorySkeleton() {
  return (
    <Card className="w-full max-h-50 overflow-hidden">
      <CardHeader className="p-2 border-b">
        <div className="flex items-center">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-24 ml-2" />
        </div>
      </CardHeader>

      <CardContent className="p-2 pt-2 space-y-6 overflow-y-auto max-h-[calc(100vh-100px)]">
        {/* Candidate Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <Skeleton className="h-10 w-10 rounded-full" />
            </Avatar>
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>

        {/* Timeline Items */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex gap-4 relative">
            {/* Timeline dot and connector */}
            <div className="flex flex-col items-center">
              <Skeleton className="w-5 h-5 rounded-full" />
              {/* {index !== 3 && <div className="w-[2px] h-12 bg-muted-foreground mt-1" />} */}
            </div>

            {/* Timeline content */}
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
              <div className="pl-2 border-l ml-2 space-y-2">
                {Array.from({ length: 2 }).map((_, subIdx) => (
                  <div key={subIdx} className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
