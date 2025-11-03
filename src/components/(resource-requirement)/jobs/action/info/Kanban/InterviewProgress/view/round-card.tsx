"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/forms/CustomCard";
import { Calendar, Clock, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { InterviewRound } from "@/types/jobs/Info/kanban/interview-view";
import { InterviewScheduleItem } from "./page";
import React from "react";

function statusStyles(status: InterviewRound["status"]) {
  switch (status) {
    case "Cleared":
      return "bg-[#E7FFF7] text-(--onboarded) ring-1 ring-(--onboarded)";
    case "Rescheduled":
      return "bg-[#E9E9E9] text-label ring-1 ring-[#1F2937]";
    case "Rejected":
      return "bg-rose-50 text-(--failure) ring-1 ring-(--failure)";
    default:
      return "bg-slate-50 text-label ring-1 ring-slate-200";
  }
}

export function RoundCard({ round }: { round: InterviewScheduleItem }) {
  console.log(round.interviewers, "asdasdasdsfdf");
  return (
    <Card className={`rounded-xl border border-label shadow-sm mb-2`}>
      <CardContent className="px-3 pt-1  space-y-1.5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-sm font-semibold text-label">
              {"Round "}
              {round.round} <span className="text-primary">(</span>
              <span className="text-(--interview) font-bold">
                {round.interview_type}
              </span>
              <span className="text-(--interview) font-bold">)</span>
            </h3>
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium"
              )}
            >
              {round.name}
            </span>
          </div>
          <p className="text-xs text-label text-right w-2/3">
            Interviewer:{" "}
            <span className="font-bold text-right w-full">
              {round.interviewers?.length
                ? round.interviewers
                    .filter((i) => i.email)
                    .map((i, idx) => (
                      <React.Fragment key={idx}>
                        {i.email}
                        <br />
                      </React.Fragment>
                    ))
                : "No interviewers listed"}
            </span>
          </p>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="gap-1 bg-(--badge-bg) text-label py-1 rounded-full text-xs"
          >
            <Calendar className="h-3.5 w-3.5" />
            {round.agreed_interview_date}
          </Badge>
          <Badge
            variant="secondary"
            className="gap-1 bg-(--badge-bg) text-label py-1 rounded-full text-xs"
          >
            <Clock className="h-3.5 w-3.5" />
            {round.agreed_interview_time}
            {round.agreed_interview_timezone}
          </Badge>
          <Badge className="gap-1 bg-(--history-mode-light) text-(--interview) py-1 rounded-full text-xs">
            <Video className="h-3.5 w-3.5" />
            {round.interview_mode}
          </Badge>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="flex flex-col gap-1">
            <p className="text-label font-bold text-sm">
              Meeting Invite Content
            </p>
            <div className="text-xs text-label whitespace-pre-wrap leading-relaxed">
              <div
                dangerouslySetInnerHTML={{
                  __html: round.meeting_invite_content || "Meeting Content",
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
