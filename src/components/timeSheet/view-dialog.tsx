"use client";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { TimesheetRow, DayKey } from "./types";

// New imports from shadcn/ui
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import leave from "../../../public/assets/icons/time sheet/leave.png";
import holiday from "../../../public/assets/icons/time sheet/holiday.png";
import weekoff from "../../../public/assets/icons/time sheet/week-off.png";
import working from "../../../public/assets/icons/time sheet/working.png";
import Image from "next/image";
import { useEffect } from "react";
import { setDate } from "date-fns";

const dayOrder: DayKey[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
type StatusCode = "W" | "WO" | "PH" | "L";

function StatusBadge({ code }: { code: StatusCode }) {
  const map: Record<
    StatusCode,
    {
      label: string;
      className: string;
      icon: any;
    }
  > = {
    W: {
      label: "Working",
      className: "bg-sky-100 text-sky-700 border border-sky-200",
      icon: working,
    },
    WO: {
      label: "Week off",
      className: "bg-amber-100 text-amber-800 border border-amber-200",
      icon: weekoff,
    },
    PH: {
      label: "Public holiday",
      className: "bg-blue-100 text-blue-800 border border-blue-200",
      icon: holiday,
    },
    L: {
      label: "Leave",
      className: "bg-red-100 text-red-700 border border-red-200",
      icon: leave,
    },
  };

  const cfg = map[code];

  return (
    <Badge
      variant="secondary"
      className={`rounded-sm px-2 py-1 flex items-center gap-1 ${cfg.className}`}
    >
      <Image
        src={cfg.icon}
        alt={`${cfg.label.toLowerCase()}-icon`}
        className="w-4 h-4 object-contain"
      />
      {cfg.label}
    </Badge>
  );
}

// declare once, above your component or in a separate types file
type DateEntry = {
  day: string; // e.g. "Sunday"
  monthDay: string; // e.g. "Aug 31"
};

// function uses it
function getMonthDays(range: string): DateEntry[] {
  const [startStr, endStr] = range.split(" - ");
  const year = new Date().getFullYear();

  const start = new Date(`${startStr} ${year}`);

  let end: Date;
  if (/^\d+$/.test(endStr.trim())) {
    const month = start.toLocaleString("en-US", { month: "short" });
    end = new Date(`${month} ${endStr} ${year}`);
  } else {
    end = new Date(`${endStr} ${year}`);
  }

  const days: DateEntry[] = [];
  let current = new Date(start);

  while (current <= end) {
    days.push({
      day: current.toLocaleDateString("en-US", { weekday: "long" }),
      monthDay: current.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    });
    current.setDate(current.getDate() + 1);
  }

  return days;
}

export function ViewDialog({ row }: { row: TimesheetRow }) {
  // helper to compute per-day regular/OT/total like the main table
  const [open, setOpen] = useState(false);
  const [datesValue, setDatesValue] = useState<DateEntry[]>([]);

  useEffect(() => {
    const dates = getMonthDays("Aug 31 - Sep 06");
    setDatesValue(dates);
  }, []);

  const calc = (hours = 0) => {
    const regular = Math.min(8, Math.max(0, hours));
    const overtime = Math.max(0, hours - 8);
    return { regular, overtime, total: regular + overtime };
  };
  const router = useRouter();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* <div>
            <h1>
                 <Button type="button" variant="ghost" size="sm" onClick={() => router.back()}>
                        <ChevronLeft />
                        <p className="text-lg font-semibold">
                            Time Sheet Info
                        </p>
                    </Button>
            </h1>
        </div> */}
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="View details"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-5xl overflow-y-auto p-2 bg-card  [&>button]:hidden"
      >
        <div className="flex items-start justify-between mt-1 border-b pb-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            <ChevronLeft />
            <h1 className="text-lg font-semibold">Time Sheet Info</h1>
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#F05052] text-[#F05052] bg-[#FFF2F2] hover:text-[#F05052] flex items-center gap-1"
            >
              <X className="text-red-400" />
              Reject
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              Approve
            </Button>
          </div>
        </div>

        <SheetHeader className="sticky top-0 z-10  backdrop-blur  p-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-15 py-2 ">
              <div className=" flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={
                      row.avatar ||
                      "/placeholder.svg?height=40&width=40&query=employee%20avatar"
                    }
                    alt={`${row.name} avatar`}
                  />
                  <AvatarFallback>
                    {row.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <SheetTitle className="text-base text-md">
                    {row.name}
                  </SheetTitle>
                  <SheetDescription className="text-xs">
                    {row.title}
                  </SheetDescription>
                </div>
              </div>
              <div>
                <SheetDescription className="text-xs">Project</SheetDescription>
                <SheetTitle className="text-sm">
                  FND Oprimization Project
                </SheetTitle>
              </div>
            </div>
            <div className="float-end">
              <SheetTitle className="text-base text-end text-md">
                Week 33
              </SheetTitle>
              <SheetDescription className="text-md">
                {"(Aug 10 - Aug 16, 2025)"}
              </SheetDescription>
            </div>
            {/* <div className="flex gap-2">
              <Button variant="destructive" size="sm">
                Reject
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Approve
              </Button>
            </div> */}
          </div>
        </SheetHeader>

        <div
          className=" rounded-lg border bg-card 
        "
        >
          {/* <div className="px-4 py-3 border-b">
            <p className="text-sm text-muted-foreground">Week details</p>
          </div> */}

          <div className="">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[10%] text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="w-[10%] text-muted-foreground text-center">
                    Day Type
                  </TableHead>
                  <TableHead className="w-[10%] text-center text-muted-foreground">
                    Regular Hours
                  </TableHead>
                  <TableHead className="w-[10%] text-center text-muted-foreground">
                    Overtime Hours
                  </TableHead>
                  <TableHead className="w-[10%] text-center text-muted-foreground">
                    Total Hours
                  </TableHead>
                  <TableHead className="w-[10%] text-left text-muted-foreground">
                    Remarks
                  </TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {datesValue.map((dateEntry, index) => {
                  const d = dateEntry.day.slice(0, 3) as keyof typeof row.days; // e.g. "Sun", "Mon"
                  const entry = row.days[d];

                  const { regular, overtime, total } =
                    entry?.status === "W"
                      ? calc(entry.hours)
                      : { regular: 0, overtime: 0, total: 0 };

                  const isSunday = d === "Sun";
                  const zebra = isSunday
                    ? "bg-amber-50/40"
                    : index % 2 === 0
                    ? "bg-muted/50"
                    : "";

                  return (
                    <TableRow
                      key={dateEntry.monthDay}
                      className={`${zebra} h-15`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="text-foreground">
                            {dateEntry.day}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {dateEntry.monthDay}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="h-full">
                        <div className="flex justify-center items-center h-full">
                          <StatusBadge code={entry?.status || "W"} />
                        </div>
                      </TableCell>

                      <TableCell className="text-center text-lg">
                        {regular || "-"}
                      </TableCell>
                      <TableCell className="text-center text-lg">
                        {overtime || "-"}
                      </TableCell>
                      <TableCell className="text-center text-lg">
                        {total || "-"}
                      </TableCell>

                      <TableCell className="text-muted-foreground text-left">
                        {entry?.status === "L"
                          ? "On leave"
                          : entry?.status === "WO"
                          ? "Week off"
                          : entry?.status === "PH"
                          ? "Public holiday"
                          : "Worked as planned"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
               <div className="mt-4"></div>
              <TableFooter className="bg-[#F0F0F0] h-15 mt-30">
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground">
                    Planned Hours/Day
                  </TableCell>
                  <TableCell className="font-bold text-lg text-center ">
                    10
                  </TableCell>
                  <TableCell className="text-center font-bold text-lg">
                    {row.regularHours}
                  </TableCell>
                  <TableCell className="text-center font-bold text-lg">
                    {row.overtimeHours}
                  </TableCell>
                  <TableCell className="text-center font-bold text-lg text-[#5069E7]">
                    {row.totalHours}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
