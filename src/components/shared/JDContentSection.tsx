import { Skeleton } from "@/components/ui/skeleton";

export function JDContentSection({
  loading,
  content,
  fallbackText,
}: {
  loading: boolean;
  content: string;
  fallbackText: string;
}) {
  return (
    <div className="prose max-w-none p-2.5 bg-card rounded text-sm">
      {loading ? (
        <div className="flex flex-col gap-6 w-full">
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-6 w-full rounded" />
            <Skeleton className="h-6 w-5/6 rounded" />
            <Skeleton className="h-6 w-2/3 rounded" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-6 w-full rounded" />
            <Skeleton className="h-6 w-5/6 rounded" />
            <Skeleton className="h-6 w-2/3 rounded" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-6 w-full rounded" />
            <Skeleton className="h-6 w-5/6 rounded" />
            <Skeleton className="h-6 w-2/3 rounded" />
          </div>
        </div>
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: content || fallbackText,
          }}
        />
      )}
    </div>
  );
}
 