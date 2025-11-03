"use client";

import type * as React from "react";
import { useState, useEffect } from "react";
import { CheckCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/forms/CustomSheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DateStringCard } from "./date-string";
import { InterviewSlot } from "@/types/jobs/Info/kanban/interview-feedback";
import { RoundCard } from "./round-card";
import { KanbanFeature } from "@/types/jobs/Info/kanban.type";
import { useSearchParams } from "next/navigation";
import { getCurrentDate, getCurrentTime } from "@/lib/utils";
import { useDataContext } from "@/context/DataProvider";
import { toast } from "sonner";
import { InterviewerType } from "@/types/jobs/Info/kanban/interview-feedback";

type InterviewDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData?: KanbanFeature | null;
  handleRefresh?: () => void;
};

export interface InterviewScheduleItem {
  name: string;
  round: number;
  interview_type: string;
  interview_mode: string;
  interviewers: Interviewer[];
  agreed_interview_date: string;
  agreed_interview_time: string;
  agreed_interview_timezone: string;
  meeting_invite_content: string;
  profile: Profile;
  profile_version: Record<string, any>;
}

export interface Interviewer {
  name: string;
  type: string;
  user: string | null;
  email: string;
}

export interface Profile {
  name: string;
  full_name: string;
  profile_image: string | null;
  email: string;
  date_of_birth: string;
  gender: string;
  contact_no: string;
  current_location: string;
  current_profile_version: string;
  state: string;
  history: any[];
}

interface InterviewMeetingRound {
  name: string;
  round: number;
  interview_type: string;
  interview_mode: string;
  interviewers: Interviewer[];
  agreed_interview_date: string;
  agreed_interview_time: string;
  agreed_interview_timezone: string;
  meeting_invite_content: string;
  profile: Profile;
  profile_version: Record<string, any>;
  interview_schedule: InterviewScheduleItem[];
}

export function InterviewMeetingView({
  open,
  onOpenChange,
  profileData,
  handleRefresh,
}: InterviewDrawerProps) {
  const search = useSearchParams();
  const jobID = search.get("d");

  const [roundForms, setRoundForms] = useState<number[]>([]);
  const [createNewOneState, setcreateNewOneState] = useState(false);

  const [data, setData] = useState<InterviewMeetingRound | null>(null);

  const rounds = Array.isArray(data?.interview_schedule)
    ? data.interview_schedule
    : [];

  const fetchInterviewDetails = async () => {
    try {
      const res = await fetch(
        `/api/rr/info/kanban/interview?job_id=${jobID}&candidate_id=${profileData?.id}`,
        {
          cache: "no-store",
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setData(data?.data || null);
    } catch (err) {
      console.error("Failed to fetch count:", err);
      setData(null);
    } finally {
    }
  };

  useEffect(() => {
    if (!profileData) {
      return;
    }
    fetchInterviewDetails();
  }, [profileData]);

  const resetForm = () => {
    setRoundForms([]);
    setcreateNewOneState(false);
  };

  const toggleDrawer = () => {
    onOpenChange(false);
    resetForm();
  };

  const [interviewType, setInterviewType] = useState<string>("HR");
  const [interviewMode, setInterviewMode] = useState<string>("Virtual Meeting");
  const [interviewers, setInterviewers] = useState<InterviewerType[]>([]);
  const [slots, setSlots] = useState<InterviewSlot[]>([
    {
      name: "Slot 1",
      date: getCurrentDate().toISOString().split("T")[0],
      time: getCurrentTime(),
      timezone: "IST (UTC+05:30)",
      status: "Proposed",
    },
  ]);

  const [submitButtonLoading, setsubmitButtonLoading] = useState(false);

  const onSubmit = async (): Promise<void> => {
    setsubmitButtonLoading(true);
    const payload = {
      rrcandidate_name: profileData?.id,
      job_id: jobID,
      interview_type: interviewType,
      interview_mode: interviewMode,
      interviewer: interviewers,
      slots: slots,
    };
    
    try {
      const endpoint = `/api/rr/post/kanban/interview/schedule`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Failed: ${res.status} ${res.statusText}`);
      }
      const result = await res.json();
      console.log("✅ Form submitted:", result);
      if (result?.status === "success") {
        resetForm();
        onOpenChange(false);
        setcreateNewOneState(false);
        toast.success(
          result?.data?.message || "Interview scheduled successfully."
        );
        handleRefresh!();
      } else if (result?.status === "error") {
        toast.error(result?.error || "Something went wrong while scheduling.");
      } else {
        toast.error("Unexpected response from server.");
      }
      setsubmitButtonLoading(false);
    } catch (err) {
      console.error("❌ API error:", err);
    } finally {
      setsubmitButtonLoading(false);
    }
  };
  

  const [selectButtonLoading, setselectButtonLoading] = useState(false);
  const onSubmitSelect = async (): Promise<void> => {
    setselectButtonLoading(true);
    const payload = {
      interview_name: data?.interview_schedule?.[0]?.name,
    };
    try {
      const endpoint = `/api/rr/post/kanban/interview/selected`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Failed: ${res.status} ${res.statusText}`);
      }
      const result = await res.json();
      console.log("✅ Form submitted:", result);
      if (result?.status === "success") {
        resetForm();
        onOpenChange(false);
        setcreateNewOneState(false);
        toast.success(
          result?.data?.message || "Interview scheduled successfully."
        );
        handleRefresh!();
      } else if (result?.status === "error") {
        toast.error(result?.error || "Something went wrong while scheduling.");
      } else {
        toast.error("Unexpected response from server.");
      }
      setselectButtonLoading(false);
    } catch (err) {
      console.error("❌ API error:", err);
    } finally {
      setselectButtonLoading(false);
    }
  };

  // Combined API service function

  if (!data) {
    return (
      <Sheet open={open} onOpenChange={toggleDrawer}>
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

  return (
    <Sheet open={open} onOpenChange={toggleDrawer}>
      <SheetContent
        side="right"
        className={
          "w-full max-w-none min-w-[600px] md:min-w-[580px] p-0 gap-0 bg-card overflow-y-auto  scroll-container"
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
            <div className="flex flex-row gap-2">
              {createNewOneState === false && (
                <Button
                  type="button"
                  className="bg-(--all-candidate) rounded-sm hover:bg-(--all-candidate) w-20 h-8"
                  onClick={onSubmitSelect}
                  disabled={selectButtonLoading}
                >
                  <CheckCircle className="w-3 h-3" /> Select
                </Button>
              )}

              {createNewOneState === false && (
                <Button
                  className="bg-(--interview) rounded-sm hover:bg-(--interview) w-20 h-8"
                  onClick={() => {
                    const nextRoundNum = rounds?.length + 1;
                    setRoundForms([nextRoundNum, ...roundForms]);
                    setcreateNewOneState(true);
                  }}
                >
                  + Round
                </Button>
              )}

              {createNewOneState === true && (
                <Button
                  type="button"
                  className="h-9 bg-primary hover:bg-primary"
                  variant="default"
                  onClick={onSubmit}
                  disabled={submitButtonLoading}
                >
                  Save
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        {/* Profile row */}
        <div className="px-5 pt-2.5 mb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                alt={profileData?.candidate.name}
                src={
                  profileData?.candidate.image ||
                  "/assets/images/candidate-profile.jpg"
                }
              />
              <AvatarFallback>
                {profileData?.candidate.name.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-xs font-semibold leading-none text-label">
                {profileData?.candidate.name}
              </p>
              <p className="mt-1 text-xs text-[#4B5563]">
                {profileData?.job_title}
              </p>
            </div>
          </div>
        </div>
        {roundForms.map((roundNum, idx) => (
          <div key={idx} className="px-4 mb-2">
            <DateStringCard
              roundNum={roundNum}
              onRemove={() => {
                setRoundForms((prev) => prev.filter((_, i) => i !== idx));
                setcreateNewOneState(false);
              }}
              interviewType={interviewType}
              setInterviewType={setInterviewType}
              interviewMode={interviewMode}
              setInterviewMode={setInterviewMode}
              interviewers={interviewers}
              setInterviewers={setInterviewers}
              slots={slots}
              setSlots={setSlots}
            />
          </div>
        ))}
        {/* Card */}
        <section className="space-y-4 px-4">
          {Array.isArray(data?.interview_schedule) ? (
            data.interview_schedule.map((item, idx) => (
              <RoundCard key={idx} round={item} />
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No interview data available
            </p>
          )}
        </section>
      </SheetContent>
    </Sheet>
  );
}
