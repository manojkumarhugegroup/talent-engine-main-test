"use client";
import { Badge } from "@/components/ui/badge";
import { ButtonGroup } from "@/components/ui/buttonGroup";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  JobNotification,
  JobPostingCardProps,
  StatItem,
} from "@/types/jobs/jobs.types";
import { Bell, LucideBell, MapPin, MoreVertical } from "lucide-react";
import React, { useState } from "react";
import { getStatusColor } from "./utils";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency, formatDate2Word } from "@/lib/utils";
import { toast } from "sonner";

export function JobPostingCard({
  name,
  data_uniq_id,
  billing_frequency,
  state,
  job_title,
  position_start_date,
  location,
  applications,
  notifications,
  client_name,
  billing_currency,
  min_bill_rate,
  max_bill_rate,
}: JobPostingCardProps) {
  const router = useRouter();

  const statsConfig: StatItem[] = [
    {
      label: "received",
      value: applications.received,
      color: "text-primary",
      bgColor: "bg-primary",
      image: "/assets/icons/job-listing/received_o.svg",
    },
    {
      label: "shortlisted",
      value: applications.shortlisted,
      color: "text-[#17A2B8]",
      bgColor: "bg-[#17A2B8]",
      image: "/assets/icons/job-listing/shortlisted_o.svg",
    },
    {
      label: "interview",
      value: applications.interview,
      color: "text-[#5069E7]",
      bgColor: "bg-[#5069E7]",
      image: "/assets/icons/job-listing/interview.svg",
    },
    {
      label: "selected",
      value: applications.selected,
      color: "text-[#FF6200]",
      bgColor: "bg-[#FF6200]",
      image: "/assets/icons/job-listing/selected.svg",
    },
    {
      label: "onboarded",
      value: applications.onboarded,
      color: "text-[#10B981]",
      bgColor: "bg-[#10B981]",
      image: "/assets/icons/job-listing/work-order.svg",
    },
    {
      label: "rejected",
      value: applications.rejected,
      color: "text-[#EA5455]",
      bgColor: "bg-[#EA5455]",
      image: "/assets/icons/job-listing/rejected.svg",
    },
  ];

  const [openNoti, setOpenNoti] = useState(false);

  const handleClick = (buttonName: string) => {
    console.log(`${buttonName} clicked`);
    if (buttonName === "profile") {
      router.push(`/resource-requirement/jobs/action/info?d=${name}&type=1`);
    } else if (buttonName === "jd") {
      router.push(`/resource-requirement/jobs/action/info?d=${name}&type=6`);
    }
    // if (buttonName === 'Loading Example') {
    //     setLoading(true);
    //     setTimeout(() => setLoading(false), 2000);
    // }
  };

  const handleRoute = (type: number) => {
    if (type === 1) {
      router.push(`/resource-requirement/jobs/action/manual?d=${name}`);
    } else if (type === 2) {
      router.push(`/resource-requirement/jobs/action/info?d=${name}`);
    }
  };

  const buttonsWithIcons = [
    {
      onClick: (e: React.MouseEvent) => handleClick("profile"),
      icon: "/assets/icons/job-listing/candidate_summary.svg",
      label: "Candidate Summary",
      bgColor: "bg-[#FF9B10]",
    },
    {
      onClick: (e: React.MouseEvent) => handleClick("jd"),
      icon: "/assets/icons/job-info/jd.svg",
      label: "Job Description",
      bgColor: "bg-[#45B6FC]",
    },
    {
      // 🔔 Notification bell with dropdown
      customRender: (
        <DropdownMenu open={openNoti} onOpenChange={setOpenNoti}>
          <DropdownMenuTrigger asChild>
            <button
              className="relative flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer"
              aria-label="Notifications"
              type="button"
            >
              <LucideBell
                fill="#6C757D"
                className="h-5 w-5 stroke-[#6C757D]"
                aria-hidden="true"
              />
              {Array.isArray(notifications) && notifications.length > 0 && (
                <span
                  className="absolute -top-1 -right-0.5 flex items-center justify-center w-5 h-5 bg-red-600 text-white text-[10px] p-0.5 font-semibold rounded-full border-2 border-white"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {notifications.length > 9 ? "9+" : notifications.length}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-w-72">
            {Array.isArray(notifications) && notifications.length > 0 ? (
              notifications
                .slice(0, 5)
                .map((item: JobNotification, index: number) => {
                  const isLast =
                    index === Math.min(notifications.length, 5) - 1;
                  return (
                    <DropdownMenuItem
                      key={index}
                      onClick={(e) => {
                        toast("Notification", {
                          description: item.notification,
                          icon: <Bell className="text-blue-500 mr-2" />,
                          style: {
                            color: "#243bb1",
                            backgroundColor: "#eff6ff",
                          },
                        });
                        setOpenNoti(false);
                        e.stopPropagation();
                      }}
                      className={`${!isLast ? "border-b rounded-b-none" : ""}`}
                    >
                      <div className="flex flex-col text-sm">
                        <span className="font-semibold capitalize">
                          {item.notification}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.date}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  );
                })
            ) : (
              <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      customRender: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {state === "Draft" && (
              <DropdownMenuItem
                onClick={(e) => {
                  handleRoute(1);
                  e.stopPropagation();
                }}
                className="border-b rounded-b-none border-accent"
              >
                Edit RR
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={(e) => {
                handleRoute(2);
                e.stopPropagation();
              }}
            >
              View Info
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <Card
      className="w-full md:max-w-md lg:max-w-lg bg-card border border-gray-200 hover:border-gray-300 shadow-none hover:shadow-md duration-150 cursor-pointer gap-0.5 py-0"
      onClick={() => handleRoute(2)}
    >
      <CardHeader className="px-3 pt-3 gap-0">
        <div className="flex  flex-col md:flex-row items-start md:items-center md:justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-primary font-semibold uppercase">
              {name}
            </span>
            <Badge
              variant="secondary"
              className={`rounded-sm  ${getStatusColor(name ? state : "Open")}`}
            >
              <p className="text-xs capitalize max-w-40 overflow-hidden whitespace-nowrap text-ellipsis truncate">
                {name ? state : "Open"}
              </p>
            </Badge>
          </div>
          <div>
            <ButtonGroup
              variant="ghost"
              buttons={buttonsWithIcons}
              className="shadow-none hover:bg-transparent px-1 "
              size="sm"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-0 overflow-hidden flex flex-col justify-between h-full">
        <div className=" px-3">
          <h3 className="text-md font-bold text-primary mb-2 capitalize">
            {job_title}
          </h3>

          <div className="space-y-1 text-sm">
            {/* <p className="">
              Bill Rate:
              <span className="font-semibold pl-1 text-black">
                {min_bill_rate === max_bill_rate
                  ? `${billing_currency ?? ""}${min_bill_rate.toLocaleString(
                      "en-US"
                    )}`
                  : `${billing_currency ?? ""}${min_bill_rate.toLocaleString(
                      "en-US"
                    )} - ${
                      billing_currency ?? ""
                    }${max_bill_rate.toLocaleString("en-US")}`}
                <span className="text-(--muted-foreground) text-xs lowercase">
                  {billing_frequency ? ` / ${billing_frequency}` : ""}
                </span>
              </span>
            </p> */}
            <p className="">
              Bill Rate:
              <span className="font-semibold pl-1 text-black">
                {min_bill_rate === max_bill_rate
                  ? formatCurrency(min_bill_rate, billing_currency)
                  : `${formatCurrency(
                      min_bill_rate,
                      billing_currency
                    )} - ${formatCurrency(max_bill_rate, billing_currency)}`}
                <span className="text-(--muted-foreground) text-xs lowercase">
                  {billing_frequency ? ` / ${billing_frequency}` : ""}
                </span>
              </span>
            </p>
            <p className="">
              Position Start Date:
              <span className="font-semibold pl-1 text-black">
                {formatDate2Word(position_start_date)}
              </span>
            </p>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="font-normal  pl-1 text-black">{location}</span>
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between pt-2 border-t border-gray-100 pb-2 px-6 rounded-b-xl bg-accent
                "
        >
          {statsConfig.map((item, idx) => (
            <React.Fragment key={idx}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`flex items-center gap-1 ${item.color}`}>
                    <img src={item.image} alt="" className="h-3" />
                    <span className="text-sm font-bold">{item.value}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className={`${item.bgColor} text-white`}
                  arrowClassName={item.bgColor}
                >
                  <p className="font-bold text-sm capitalize">
                    {item.label || 0}
                  </p>
                </TooltipContent>
              </Tooltip>
              {idx !== statsConfig.length - 1 && (
                <div className="bg-gray-200 w-px h-6" /> // simple div as separator
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
