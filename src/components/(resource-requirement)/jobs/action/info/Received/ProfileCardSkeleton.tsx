import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export function ProfileCardSkeleton() {
  return (
    <Card className="rounded-md justify-between w-full max-w-sm lg:max-w-none mx-auto shadow-sm overflow-hidden p-0 border gap-0">
      <CardContent className="p-4 relative">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <Skeleton className="h-11 w-11 rounded-full" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          {/* Match Score (Circular progress placeholder) */}
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-0 flex items-center w-full">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 bg-muted rounded-none cursor-not-allowed"
          disabled
        >
          <Skeleton className="h-4 w-4 mr-2" />
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-muted text-white rounded-none cursor-not-allowed"
          disabled
        >
          <Skeleton className="h-4 w-4 mr-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
