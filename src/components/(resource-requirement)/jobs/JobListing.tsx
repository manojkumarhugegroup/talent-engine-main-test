"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Job } from "@/types/jobs/jobs.types";
import { JobPostingCard } from "./JobCard";
import { JobCardSkeleton } from "./JobCardSkeleton";
import { EmptyJobPostingCard } from "./EmptyJobPostingCard";

type JobListingProps = {
  type?: number;
  search?: string;
  status?: string;
};

export default function JobListing({
  type = 0,
  search = "",
  status = "",
}: JobListingProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const isInitialLoad = useRef(true);

  const fetchJobs = useCallback(
    async (type: Number, search: string, status: string, page: number) => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/rr?type=${type}&page=${page}&limit=12&search=${search}&state=${status}`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const responseData = await res.json();

        console.log(responseData, "reettrr45t");
        if (responseData?.message?.status === "success") {
          const data = responseData?.message.data ?? [];
          const pagination = responseData?.message.pagination ?? {};
          console.log(data, pagination, "ttrr45t");
          // Append or reset
          setTotalPageCount(pagination.total_pages ?? 1);
          setHasMore(page < (pagination.total_pages ?? 1));
          setJobs((prev) => {
            const newJobs = page === 1 ? data : [...prev, ...data];

            // collect all job names (old + new)
            const allJobNames = newJobs.map((job: any) => job.name);

            if (allJobNames.length > 0) {
              fetchNotification({ jobName: allJobNames });
              fetchApplication({ jobName: allJobNames });
            }

            return newJobs;
          });

          setTotalPageCount(pagination.total_pages ?? 1);
          setHasMore(page < (pagination.total_pages ?? 1));
        } else {
          if (page === 1) setJobs([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchNotification = async ({ jobName }: { jobName: string[] }) => {
    try {
      const res = await fetch(`/api/rr/notification?rr_name=${jobName}`);
      const responseData = await res.json();
      setNotifications(responseData?.message?.data ?? []);
    } catch {
      setNotifications([]);
    }
  };

  const fetchApplication = async ({ jobName }: { jobName: string[] }) => {
    try {
      const res = await fetch(`/api/rr/application?rr_name=${jobName}`);
      const responseData = await res.json();
      setApplications(responseData?.message?.data ?? []);
    } catch {
      setApplications([]);
    }
  };

  // Initial load or search/type/status change
  useEffect(() => {
    isInitialLoad.current = true;
    setJobs([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchJobs(type, search, status, 1);
  }, [type, search, status, fetchJobs]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px", threshold: 0 }
    );

    const current = observerRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, loading]);

  // Fetch next page when currentPage increments
  useEffect(() => {
    if (!isInitialLoad.current && currentPage > 1) {
      fetchJobs(type, search, status, currentPage);
    }
    isInitialLoad.current = false;
  }, [currentPage, type, search, status, fetchJobs]);

  const mergedJobs = jobs.map((job) => {
    const jobNotifications =
      notifications?.find((n) => n.job_id === job.name)?.notifications || [];
    const jobApplications =
      applications?.find((a) => a.rr_id === job.name)?.applications || {};
    return {
      ...job,
      notifications: jobNotifications,
      applications: jobApplications,
    };
  });

  return (
    <main className="h-full flex-col justify-between">
      {mergedJobs.length === 0 && !loading ? (
        <div className="flex items-center justify-center h-[70vh]">
          <EmptyJobPostingCard
            action={{
              label: "Refresh",
              onClick: () => fetchJobs(type, '', '', 1),
            }}
          />
        </div>
      ) : (
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-1">
          {mergedJobs.map((job: any, i: number) => (
            <JobPostingCard key={i} {...job} />
          ))}
        </div>
      )}

      {loading && (
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      )}

      <div ref={observerRef} className="h-10" />
    </main>
  );
}
