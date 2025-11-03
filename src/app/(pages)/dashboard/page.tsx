"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Video, MapPin } from "lucide-react";

import processing from "../../../../public/assets/icons/job-info/processing.svg";
import interview from "../../../../public/assets/icons/job-info/Kanban/interview.svg";
import onboard from "../../../../public/assets/icons/job-info/onboard.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ButtonGroup } from "@/components/ui/buttonGroup";
import RecruitmentFunnel from "@/components/dashboard/Funnel";
import { useEffect, useState } from "react";
import NotificationBell from "@/components/dashboard/NotificationBellProps";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListFilter, RotateCcw, Search } from "lucide-react";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { kanbanData } from "@/data/Kanban";
import { CalendarDays, Clock, User } from "lucide-react";
import { useDataContext } from "@/context/DataProvider";
import { getStatusColor } from "@/components/(resource-requirement)/jobs/utils";
import ProfileDrawer from "@/components/(resource-requirement)/shared/ProfileDrawer";

type JobOption = {
  id: string;
  title: string;
};

// { notifications }: DashboardProps
export default function Dashboard() { 
  const [jobs, setJobsS] = useState<JobOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(10);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [data, setData] = useState([]);
  const [filterOptions, setFilterOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const filtered = kanbanData.filter((item) => item.stage === "interview");
  useEffect(() => {
    if (jobs.length > 0) {
      const options = Array.from(
        new Map(
          jobs.map((job) => [job.id, { label: job.title, value: job.id }])
        ).values()
      ).sort((a, b) => a.label.localeCompare(b.label));

      setFilterOptions(options);
    } else {
      setFilterOptions([]);
    }
  }, [jobs]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleFilter = (option: string) => {
    setSelectedFilters((prev) =>
      prev.includes(option)
        ? prev.filter((f) => f !== option)
        : [...prev, option]
    );
  };
  const router = useRouter();

  const handleClickProfile = (id: string) => {
    router.push(`/resource-requirement/jobs/action/info?d=${id}`);
  };

  const kpiData = [
    {
      title: "Total Candidates Received",
      value: "1,247",
      change: "-6%",
      trend: "up",
      icon: processing,
      color: "#009765",
    },
    {
      title: "In Processing",
      value: "89",
      change: "0%",
      trend: "up",
      icon: interview,
      color: "#5069E7",
    },
    {
      title: "Interviews Today",
      value: "12",
      change: "+6%",
      trend: "up",
      icon: onboard,
      color: "#009765",
    },
    {
      title: "Onboarded This Month",
      value: "34",
      change: "+8%",
      trend: "up",
      color: "#F05052",
    },
  ];

  const jobsData = [
    {
      id: "JOB-2025-005",
      title: "Fuel Operations Manager",
      status: "Draft",
      statusColor: "bg-gray-100 text-gray-800",
    },
    {
      id: "JOB-2025-004",
      title: "Logistics Engineer",
      status: "Open",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      id: "JOB-2025-003",
      title: "Pipeline Safety Officer",
      status: "Open",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      id: "JOB-2025-002",
      title: "Terminal Supervisor",
      status: "Open",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      id: "JOB-2025-001",
      title: "Fuel Quality Inspector",
      status: "Closed",
      statusColor: "bg-red-100 text-red-800",
    },
  ];

  const handleClick = (buttonName: string) => {
    if (buttonName === "profile") {
      router.push(
        `/resource-requirement/jobs/action/info?d=${"Asa23232"}&type=1`
      );
    } else if (buttonName === "jd") {
      router.push(
        `/resource-requirement/jobs/action/info?d=${"Asa23232"}&type=6`
      );
    } else if (buttonName === "view-more") {
      router.push(
        `/resource-requirement/jobs`
      );
    } else if (buttonName === "kanban") {
      router.push(
        `/resource-requirement/jobs/action/info?d=${"Asa23232"}&type=4`
      );
    }
  };

  const buttonsWithIcons = [
    {
      onClick: () => handleClick("profile"),
      icon: "/assets/icons/job-listing/candidate_summary.svg",
      label: "Candidate Summary",
      bgColor: "bg-[#FF9B10]",
    },
    {
      onClick: () => handleClick("jd"),
      icon: "/assets/icons/job-info/jd.svg",
      label: "Job Description",
      bgColor: "bg-[#45B6FC]",
    },
    {
      customRender: (
        <NotificationBell
          onNotifications={(data: JobOption[]) => {
            setJobsS(data);
          }}
        />
      ),
    },
  ];

  if (loading) return <DashboardSkeleton />;

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-8xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {kpiData.map((kpi, index) => {
              const Icon = kpi.icon;
              let changeColor = "text-gray-500"; // default for 0 or neutral
              if (kpi.change.startsWith("+")) changeColor = "text-green-600";
              else if (kpi.change.startsWith("-")) changeColor = "text-red-600";
              return (
                <Card
                  key={index}
                  className="bg-card py-0 rounded-md shadow-sm"
                >
                  <div className="flex">
                    {/* Colored left bar */}
                    <div
                      className={`w-2  rounded-l-md  bg-[#${kpi.color}]`}
                      style={{ backgroundColor: kpi.color }}
                    />

                    {/* Card content */}
                    <CardContent className="p-4 flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">{kpi.title}</p>
                        {kpi.icon && (
                          <Image
                            src={kpi.icon}
                            alt="icon"
                            className="h-5 w-5"
                          />
                        )}
                      </div>
                      <div className="space-y-1 mt-1">
                        <p className="text-xl font-bold text-gray-900">
                          {kpi.value}
                        </p>
                        {/* <p className={`text-xs ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                          {kpi.change}
                        </p> */}
                        <p className={`text-xs text-gray-500`}>
                          <span className={`text-xs ${changeColor}`}>
                            {kpi.change}
                          </span>{" "}
                          from last month
                        </p>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
            {/* My Jobs */}
            <div className="lg:col-span-2 flex flex-col">
              <Card className="bg-card flex-1 flex flex-col p-0">
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <CardTitle className="text-lg font-semibold">
                    My Jobs
                  </CardTitle>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => handleClick("view-more")}
                  >
                    View More
                  </Button>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-600"></th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                            Job ID
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                            Job Title
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                            Status
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobsData.map((job, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 px-2">{/* <Checkbox /> */}</td>
                            <td className="py-3 px-2">
                              <span
                                className="text-blue-600 hover:underline cursor-pointer text-sm"
                                onClick={() => handleClickProfile(job.id)}
                              >
                                {job.id}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-sm text-gray-900">
                              {job.title}
                            </td>
                            <td className="py-3 px-2">
                              <Badge
                                className={`rounded-sm  ${getStatusColor(
                                  job.status
                                )}`}
                                variant="secondary"
                              >
                                {" "}
                                <p className="text-xs capitalize max-w-40 overflow-hidden whitespace-nowrap text-ellipsis truncate">
                                  {job.status}
                                </p>
                              </Badge>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2">
                                <ButtonGroup
                                  variant="ghost"
                                  buttons={buttonsWithIcons}
                                  className="shadow-none hover:bg-transparent px-0 "
                                  size="sm"
                                />
                                {/* <NotificationBell notifications={notifications}/> */}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recruitment Pipeline */}
            <div className="lg:col-span-2 flex flex-col p-0">
              <Card className="bg-card flex-1 flex flex-col p-0 gap-2">
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <CardTitle className="text-lg font-semibold">
                    Recruitment Pipeline
                  </CardTitle>

                  <Popover open={openFilter} onOpenChange={setOpenFilter}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="cursor-pointer flex items-center bg-card"
                      >
                        <ListFilter className="mr-2 h-4 w-4" />
                        Filter
                        {selectedFilters.length > 0 && (
                          <span className="text-sm text-muted-foreground">
                            ({selectedFilters.length})
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-60 p-2">
                      <div className="flex justify-between mt-2 gap-2">
                        <div className="font-medium mb-2">Filter</div>
                        <RotateCcw
                          onClick={() => setSelectedFilters([])}
                          className="h-5 w-5 cursor-pointer"
                        />
                      </div>
                      <ScrollArea className="h-40">
                        {filterOptions.length > 0 ? (
                          filterOptions.map((option) => (
                            <div
                              key={option.value}
                              className="flex items-center space-x-2 py-1"
                            >
                              <Checkbox
                                id={option.value}
                                checked={selectedFilters.includes(option.value)}
                                onCheckedChange={() =>
                                  toggleFilter(option.value)
                                }
                              />
                              <label
                                htmlFor={option.value}
                                className="text-sm cursor-pointer"
                              >
                                {option.value}
                              </label>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground px-2 py-1">
                            No results found.
                          </div>
                        )}
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                </CardHeader>

                <CardContent className="flex-1 p-0">
                  <RecruitmentFunnel />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Interview Tracker */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Interview Tracker
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0  shadow-sm z-10 bg-card">
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Candidate Name
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Slot info
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Mode
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Interviewer
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Status
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          No items in interview stage
                        </td>
                      </tr>
                    ) : (
                      filtered.map((interview) => {
                        const candidateName =
                          interview.candidate?.name || "Unknown";
                        return (
                          <tr
                            key={interview.id}
                            className="border-b border-accent bg-card"
                          >
                            {/* Candidate Info */}
                            <td className="py-3 px-2 text-sm text-gray-900">
                              <div className="flex items-center gap-3 px-4">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={
                                      interview.candidate?.image
                                        ? interview.candidate.image
                                        : "/placeholder.svg?height=64&width=64&query=person%20avatar"
                                    }
                                    alt={`${candidateName} avatar`}
                                  />
                                  <AvatarFallback className="bg-muted flex items-center justify-center rounded-full">
                                    {candidateName.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex flex-col items-start">
                                  <ProfileDrawer candidateName={candidateName} />
                                    {/* <span className="underline font-medium cursor-pointer">
                                      {candidateName || "-"}
                                    </span> */}
                                    <span>{interview.job_title || "-"}</span>
                                  </div>
                                  {(interview as any).role ? (
                                    <h5 className="text-sm text-gray-500">
                                      {(interview as any).role}
                                    </h5>
                                  ) : (
                                    <>
                                    {/* <h5 className="text-sm text-gray-500">-</h5> */}
                                    </>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Round Info / Slot Info */}
                            <td className="py-3 px-2 text-sm text-gray-600 w-64 max-w-[25rem] break-words whitespace-normal">
                              {interview.round && interview.round.length > 0 ? (
                                (() => {
                                  // Check if all rounds have all fields empty
                                  const hasAnyData = interview.round.some(
                                    (r) =>
                                      r.round_no || r.date || r.time || r.slot
                                  );

                                  if (!hasAnyData) return <span>-</span>;

                                  return (
                                    <div className="flex flex-col gap-1">
                                      {interview.round.map((roundItem, idx) => {
                                        // Skip rounds where all fields are empty
                                        if (
                                          !roundItem.round_no &&
                                          !roundItem.date &&
                                          !roundItem.time &&
                                          !roundItem.slot
                                        )
                                          return null;

                                        return (
                                          <div
                                            key={idx}
                                            className="flex flex-wrap items-center gap-2 px-2 py-1 rounded"
                                          >
                                            {roundItem.round_no && (
                                              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-accent">
                                                Round {roundItem.round_no}
                                              </span>
                                            )}
                                            {roundItem.date && (
                                              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-accent">
                                                <CalendarDays className="h-4 w-4" />
                                                {roundItem.date}
                                              </span>
                                            )}
                                            {roundItem.time && (
                                              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-accent">
                                                <Clock className="h-4 w-4" />
                                                <span className="italic">
                                                  {roundItem.time}
                                                </span>
                                              </span>
                                            )}
                                            {roundItem.slot && (
                                              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-accent">
                                                Slot {roundItem.slot}
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })()
                              ) : (
                                <span>-</span>
                              )}
                            </td>

                            {/* Round Mode */}
                            <td className="py-3 px-2 text-sm text-gray-600 w-64 max-w-[25rem] break-words whitespace-normal">
                              {interview.round && interview.round.length > 0 ? (
                                (() => {
                                  // Filter only rounds that have round_mode
                                  const roundsWithMode = interview.round.filter(
                                    (r) => r.round_mode
                                  );
                                  if (roundsWithMode.length === 0) {
                                    return <span>-</span>;
                                  }

                                  return (
                                    <div className="flex flex-col gap-1">
                                      {roundsWithMode.map((roundItem, idx) => {
                                        const mode = roundItem.round_mode || "";
                                        const round_type =
                                          roundItem.round_type || "";
                                        const isVirtual = mode
                                          .toLowerCase()
                                          .includes("virtual");
                                        return (
                                          <div
                                            key={idx}
                                            className="flex flex-wrap items-center gap-2 px-2 py-1 rounded"
                                          >
                                            <span
                                              className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                                                mode
                                                  ? "bg-indigo-100 text-indigo-700"
                                                  : "bg-cyan-100 text-cyan-700"
                                              }`}
                                            >
                                              {/* Dynamic icon based on mode */}
                                              {mode
                                                .toLowerCase()
                                                .includes("virtual") && (
                                                <Video className="h-4 w-4" />
                                              )}
                                              {mode
                                                .toLowerCase()
                                                .includes("in-person") && (
                                                <MapPin className="h-4 w-4" />
                                              )}
                                              <p className="capitalize">
                                                {mode}
                                              </p>
                                            </span>

                                            {round_type && (
                                              <span
                                                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                                                  mode
                                                    .toLowerCase()
                                                    .includes("virtual")
                                                    ? "bg-[#D9F5FF] text-[#0F6E8E]"
                                                    : "bg-cyan-100 text-cyan-700"
                                                }`}
                                              >
                                                {round_type}
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })()
                              ) : (
                                <span>-</span>
                              )}
                            </td>

                            {/* Interviewer */}
                            <td className="py-3 px-2 text-sm text-gray-600">
                              {(interview.round &&
                                interview.round[0]?.interviewer) ||
                                "-"}
                            </td>

                            {/* Status */}
                            <td className="py-3 px-2">
                              {interview.status ? (
                                <span
                                  className={`text-sm font-medium ${
                                    interview.status === "Interview Cleared"
                                      ? "text-green-600"
                                      : interview.status === "Scheduled"
                                      ? "text-blue-600"
                                      : interview.status === "Accepted"
                                      ? "text-emerald-600"
                                      : interview.status ===
                                        "Awaiting Interviewer Feedback"
                                      ? "text-orange-600"
                                      : interview.status ===
                                        "Awaiting Candidate Acceptance"
                                      ? "text-yellow-600"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {interview.status}
                                </span>
                              ) : (
                                <span>-</span>
                              )}
                            </td>

                            {/* Action */}
                            <td className="py-3 px-2">
                              <Image
                                src="/assets/icons/job-info/Kanban/interview_b.svg"
                                alt="interview"
                                width={15}
                                height={15}
                                className="cursor-pointer"
                                onClick={() => handleClick("kanban")}
                              />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
