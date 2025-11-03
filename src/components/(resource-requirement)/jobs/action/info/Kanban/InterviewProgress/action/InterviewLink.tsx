"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  CalendarDays,
  ChevronLeft,
  Clock,
  Eraser,
  LinkIcon,
  MicIcon,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/forms/CustomCard";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/forms/CustomSheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Controller, useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { MinimalTiptap } from "@/components/ui/shadcn-io/minimal-tiptap";
import { useDataContext } from "@/context/DataProvider";
import { InterviewDataType } from "@/types/jobs/Info/kanban/interview-meeting";
import { toast } from "sonner"; // or your preferred toast library
import { KanbanFeature } from "@/types/jobs/Info/kanban.type";
import { useSearchParams } from "next/navigation";
import { fi } from "date-fns/locale";
import { CandidateInterviewType } from "@/types/jobs/Info/kanban/interview-feedback-type";

type InterviewDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData?: KanbanFeature | null;
  handleRefresh?: () => void;
};

// API Response interface
interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    submittedAt: string;
    candidate?: string;
    interviewType?: string;
    scheduledDate?: string;
    scheduledTime?: string;
  };
  error?: string;
}

export function ScheduleInterviewMeeting({
  open,
  onOpenChange,
  profileData,
  handleRefresh,
}: InterviewDrawerProps) {
  const search = useSearchParams();
  const jobID = search.get("d");
  const [submitting, setSubmitting] = useState(false);
  console.log(profileData, "asdfee");
  const { control, getValues, setValue, reset } = useForm({
    defaultValues: {
      inviteContent: "",
    },
  });
  const { interview, fetchInterview } = useDataContext();

  useEffect(() => {
    if (open && !interview) {
      fetchInterview();
    }
  }, [open, interview]);

  // Set initial content when interview data loads
  useEffect(() => {
    if (interview?.candidate?.meeting?.agenda) {
      setValue("inviteContent", interview.candidate.meeting.agenda);
    }
  }, [interview, setValue]);

  // const [data, setData] = useState<InterviewSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<CandidateInterviewType | null>(null);

  const fetchInterviewDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        // `/api/rr/info/kanban/interview?job_id=RR-25-00015&candidate_id=RR-0139`,
        `/api/rr/info/kanban/interview?job_id=${jobID}&candidate_id=${profileData?.id}`,
        {
          cache: "no-store",
        }
      );
      if (!res.ok) {
        if (res.status === 404) {
          const data = await res.json();
          const errorMessage =
            data?.message?.error ||
            `Interview '${jobID}/${profileData?.id}' not found`;
          // Show error toast
          toast.error(errorMessage);
        } else {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
      }
      const data = await res.json();
      const details = data?.data;
      const candidateDetails: CandidateInterviewType | undefined = data?.data;

      if (candidateDetails) {
        setDetails(candidateDetails);
      }
    } catch (err) {
      console.error("Failed to fetch count:", err);
      // setData(null);
    } finally {
      setLoading(false);
    }
  };

  console.log(details, "detailsdd");

  React.useEffect(() => {
    if (!profileData) {
      return;
    }
    fetchInterviewDetails();
  }, [profileData, jobID]);

  const resetFormToOriginal = () => {
    if (interview?.candidate?.meeting?.agenda) {
      // Reset to original agenda content
      setValue("inviteContent", interview.candidate.meeting.agenda);
      reset({
        inviteContent: interview.candidate.meeting.agenda,
      });
    } else {
      // Reset to empty if no original content
      reset({
        inviteContent: "",
      });
    }
  };

  const handleSubmit = async () => {
    if (!interview?.candidate) {
      toast.error("No candidate data available");
      return;
    }
    const payload = {
      // candidate_id: profileData?.id,
      // job_id: jobID,
      meeting_invite_content: getValues().inviteContent,
      interview_name: details?.interview_schedule[0].name,
    };
    setSubmitting(true);

    try {
      const res = await fetch(`/api/rr/post/kanban/interview/invite`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Prepare the complete InterviewDataType structure for API
      const result = await res.json();
      if (!res.ok) {
        // Handle API-level error response
        toast.error(result?.error || `Failed: ${res.status} ${res.statusText}`);
        throw new Error(result?.error || "Unknown server error");
      }
      console.log(result,'rewrsr')
      if (result?.status === "success") {
        reset();
        toast.success(
          result?.data?.message || "Interview scheduled successfully."
        );
        onOpenChange(false);
        handleRefresh!();
      } else if (result?.status === "error") {
        toast.error(result?.error || "Something went wrong while scheduling.");
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (err: any) {
      console.error("❌ Error saving interview:", err?.message || err);
      // toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDrawer = () => {
    onOpenChange(false);
    resetFormToOriginal();
  };

  if (!interview || !interview.candidate) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full max-w-none p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Loading Candidate Data</SheetTitle>
          </SheetHeader>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading candidate data...</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const candidate = interview.candidate;

  return (
    <Sheet open={open} onOpenChange={toggleDrawer}>
      <SheetContent
        side="right"
        className={
          "w-full max-w-none min-w-[600px] md:min-w-[580px] p-0 gap-0 bg-card"
        }
      >
        {/* Header */}
        <SheetHeader className="p-2 border-b pb-2">
          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={toggleDrawer}
                className="h-8 px-2 hover:bg-transparent"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
              <SheetTitle className="text-lg">Interview Progress</SheetTitle>
            </div>
            <Button
              className="bg-(--interview) rounded-sm hover:bg-(--interview)"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </SheetHeader>

        {/* Profile row */}
        <div className="px-5 pt-2.5 pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage alt={profileData?.candidate?.name} src={profileData?.candidate?.image} />
              <AvatarFallback>{profileData?.candidate?.name?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-sm font-semibold leading-none text-label">
                {profileData?.candidate?.name}
              </p>
              <p className="mt-1 text-xs text-[#4B5563]">
                {profileData?.job_title}
              </p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="px-4">
          <Card className="rounded-lg">
            <CardHeader className="flex items-center justify-between px-4">
              <CardTitle className="text-base font-semibold">
                <span>
                  Round {details?.interview_schedule?.[0]?.round || "-"}
                </span>
                <span className="text-(--interview) px-2">
                  ({details?.interview_schedule?.[0]?.interview_type || "-"})
                </span>
              </CardTitle>

              <p className="text-xs text-label text-right w-2/3 truncate line-clamp-2">
                Interviewer:{" "}
                
                <span className="font-bold line-clamp-2 truncate text-right w-full">
                  {details?.interview_schedule?.[0]?.interviewers?.length
                    ? details.interview_schedule[0].interviewers
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
            </CardHeader>
            <CardContent className="px-3 pt-0 space-y-4">
              {/* Two-column grid */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <Badge className="flex items-center gap-1 bg-(--badge-bg) text-label py-1 rounded-full">
                  <MicIcon className="h-3.5 w-3.5" />
                  {details?.interview_schedule?.[0]?.name ||
                    "-"}
                </Badge>
                <Badge className="flex items-center gap-1 bg-(--badge-bg) text-label py-1 rounded-full">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {details?.interview_schedule?.[0]?.agreed_interview_date ||
                    "-"}
                </Badge>
                <Badge className="flex items-center gap-1 bg-(--badge-bg) text-label py-1 rounded-full">
                  <Clock className="h-3.5 w-3.5" />
                  {details?.interview_schedule?.[0]?.agreed_interview_time}{" "}
                  {details?.interview_schedule?.[0]
                    ?.agreed_interview_timezone ?? ""}
                </Badge>
                <Badge className="flex items-center gap-1 bg-(--history-mode-light) text-(--interview) py-1 rounded-full">
                  <Video className="h-3.5 w-3.5" />
                  {details?.interview_schedule?.[0]?.interview_mode}
                </Badge>
              </div>

              <div className="space-y-2">
                <Controller
                  name="inviteContent"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <MinimalTiptap
                        label="Meeting Invite Content"
                        content={
                          field.value || candidate?.meeting?.agenda || ""
                        }
                        onChange={field.onChange}
                        showStrike={true}
                        showBold={true}
                        showItalic={true}
                        showHeadings={true}
                        showBulletList={true}
                        showOrderedList={true}
                        showHorizontalRule={true}
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
