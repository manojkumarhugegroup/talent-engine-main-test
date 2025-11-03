"use client"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-8xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-card rounded-md shadow-sm flex">
              <div className="w-1 rounded-l-md bg-gray-300" />
              <div className="p-4 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>

        {/* My Jobs Table */}
       <div className="flex flex-row gap-6 border">
  {/* Left card */}
  <div className="flex-1 bg-card flex flex-col rounded-md p-4 space-y-4">
    <Skeleton className="h-6 w-48" />
    <div className="overflow-x-auto">
      <table className="w-full">
        <tbody>
          {Array.from({ length: 5 }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b border-gray-200">
              {Array.from({ length: 5 }).map((_, colIdx) => (
                <td key={colIdx} className="py-3 px-2">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Right card */}
  <div className="flex-1 bg-card flex flex-col rounded-md p-4 space-y-4">
    <Skeleton className="h-6 w-48" />
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, idx) => (
        <Skeleton key={idx} className={`h-4 w-${70 - idx * 10}`} />
      ))}
    </div>
  </div>
</div>


        {/* Interview Tracker */}
        <div className="bg-card rounded-md p-4">
          <Skeleton className="h-6 w-64 mb-4" />
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full border-collapse">
              <tbody>
                {Array.from({ length: 10 }).map((_, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-gray-100">
                    {Array.from({ length: 6 }).map((_, colIdx) => (
                      <td key={colIdx} className="py-3 px-2">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
