"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { CircularProgress } from "@/components/shared/CircularProgress";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Slider } from "@/components/ui/slider";

interface MatchScoreDrawerProps {
  openDrawer: boolean;
  onOpenChange: (val: boolean) => void;
  row: any;
  score: number;
  tab: string;
}

// Utility to return color based on value thresholds
function getProgressColor(value: number, type?: string): string {
  if (type === "lora") {
    return "#969696"; // Override color for "lora"
  }
  if (value <= 50) {
    // Matching red for values below 50%
    return "#ef4444";
  } else if (value <= 80) {
    // Orange for values between 50% and 80%
    return "#ff6200";
  } else {
    // Green for values 80% and above
    return "#10b981";
  }
}

export function MatchScoreDrawer({
  openDrawer,
  onOpenChange,
  row,
  score,
}: MatchScoreDrawerProps) {
  const summary = row.original.summary;
  const keySkills = row.original.key_skills || [];
  const matchScoreChange = row.original.match_score_change;
  const recruiterScore = row.original.recruiter_score;

  const [value, setValue] = React.useState([score]);
  const [reason, setReason] = React.useState(summary);

  React.useEffect(() => {
    if (openDrawer) {
      setReason(row.original.summary);
      setValue([score]);
    }
  }, [openDrawer, row, score]);

  return (
    <Sheet open={openDrawer} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-3xl bg-card h-full min-h-screen text-black [&>button]:hidden"
      >
        <div className="flex flex-col h-full">
          <SheetHeader>
            <div className="flex items-start justify-between border-b pb-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <h1 className="text-lg font-semibold">Match Score</h1>
              </Button>

              {!matchScoreChange && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="default"
                    className="bg-transparent text-primary border-primary hover:text-primary"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="default"
                    className="bg-primary text-white"
                    onClick={() => {
                      console.log("Selected Value:", value[0]);
                      console.log("Reason:", reason);
                    }}
                  >
                   Accept
                  </Button>
                </div>
              )}
            </div>
          </SheetHeader>

          {/* Main Content */}
          <div className="flex-grow overflow-y-auto py-4 px-4">
            {/* Avatar and Info */}
            <div className="flex items-center gap-3 pb-4">
              <Avatar className="h-10 w-10 flex items-center justify-center border rounded-full border-primary">
                <AvatarImage
                  src={
                    row.original.avatar ||
                    "/placeholder.svg?height=40&width=40&query=employee%20avatar"
                  }
                  alt={`${row.original.name} avatar`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <AvatarFallback className="text-md">
                  {row.original.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-base">
                  {row.original.name}
                </SheetTitle>
                <SheetDescription className="text-xs">
                  {row.original.current_role}
                </SheetDescription>
              </div>
            </div>
            {!matchScoreChange && (
              <div className="px-2 rounded-lg border shadow-md  mx-auto border-gray-300 w-full py-10">
                {/* Match Score Slider */}
                <div
                  className="text-center text-5xl font-bold mb-4"
                  style={{ color: getProgressColor(value[0]) }}
                >
                  {value[0]}%
                </div>

                <Slider
                  value={value}
                  onValueChange={setValue}
                  max={100}
                  step={1}
                  className="custom-orange-slider mb-6 mt-6"
                />

                {/* Reason Input */}
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border rounded-md p-2 focus:outline-none"
                  placeholder="Enter your reason here..."
                />
              </div>
            )}
            {/* Recruiter Section */}
            {matchScoreChange && (
              <div className="bg-accent p-5 rounded-md mt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-md text-[#00434E] pb-2">
                      Recruitment
                    </p>
                    <h3 className="text-md font-medium mb-2">Reason</h3>
                  </div>
                  <CircularProgress
                    value={recruiterScore ?? 0}
                    size={35}
                    strokeWidth={3}
                  />
                </div>
                <div className="text-sm leading-relaxed">{summary}</div>
              </div>
            )}

            {/* Lora Section */}
            <div className="bg-accent p-5 rounded-md mt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="relative font-bold text-md text-[#00434E] pb-2 w-fit">
                    Lora
                    <Image
                      src="/assets/icons/job-info/loraAI_w.svg"
                      alt="loraAi"
                      width={12}
                      height={12}
                      className="absolute -top-1 -right-3 w-3 h-3"
                    />
                  </p>
                  <h3 className="text-md font-medium mb-2">Reason</h3>
                </div>
                <CircularProgress
                  value={score}
                  size={35}
                  strokeWidth={3}
                  {...(matchScoreChange ? { type: "lora" } : {})}
                />
              </div>
              <div className="text-sm leading-relaxed mt-1">{summary}</div>

              <hr className="my-6 border-gray-300" />

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Key Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {keySkills
                    .slice()
                    .sort(
                      (a: { type: number }, b: { type: number }) =>
                        b.type - a.type
                    )
                    .map((skill: any, index: number) => (
                      <Badge
                        key={index}
                        variant={skill.value === 0 ? "outline" : "default"}
                        className={`rounded-md px-3 py-1 text-xs font-medium ${
                          skill.type === 1
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                            : "bg-gray-100 text-gray-500 border border-gray-300"
                        }`}
                      >
                        {skill.name}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
