"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { CalendarDays, ChevronLeft, Clock, MicIcon, Video } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { useDataContext } from "@/context/DataProvider";
import { InterviewDataType } from "@/types/jobs/Info/kanban/interview-meeting";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CusSelect } from "@/components/forms/CusSelect";
import { SelectItem } from "@/components/ui/select";
import {
  FeedbackFormData,
  FeedbackType,
  InterviewerType,
  InterviewSlot,
} from "@/types/jobs/Info/kanban/interview-feedback";
import SlotTable from "../../SlotTable";
import { getCurrentDate, getCurrentTime } from "@/lib/utils";
import { InterviewFormData } from "@/types/jobs/Info/kanban/progress";
import { KanbanFeature } from "@/types/jobs/Info/kanban.type";
import { useSearchParams } from "next/navigation";
import { CandidateInterviewType } from "@/types/jobs/Info/kanban/interview-feedback-type";
import {
  INTERVIEW_MODES,
  INTERVIEW_TYPES,
} from "@/data/Info/kanban/interviewData";
import { CusInterviewerSelect } from "@/components/forms/CusSelectInterviewer";

interface Interviewer {
  email: string;
  full_name: string;
  type: string;
  user: string;
}

type InterviewDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData?: KanbanFeature | null;
  handleRefresh?: () => void;
};

const emptySlot = (index: number): InterviewSlot => ({
  name: `Slot ${index + 1}`,
  date: getCurrentDate().toISOString().split("T")[0],
  time: getCurrentTime(),
  timezone: "IST (UTC+05:30)",
  status: "Proposed",
});

export function InterviewMeetingEdit({
  open,
  onOpenChange,
  profileData,
  handleRefresh,
}: InterviewDrawerProps) {
  const search = useSearchParams();
  const jobID = search.get("d");
  const [submitting, setSubmitting] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [feedback, setFeedback] = useState<FeedbackFormData>({
    feedbackType: "cleared",
    remarks: "",
    rejectionReason: "",
    cancellationReason: "",
    rescheduleReason: "",
    interview_type: "",
    interview_mode: "",
    interviewer: [],
    slots: [emptySlot(0)],
  });

  const {
    rejectReason,
    fetchRejectReason,
    cancelReason,
    fetchCancelReason,
    interviewer,
    fetchInterviewer,
  } = useDataContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<InterviewerType[]>([]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      fetchInterviewDetails();
      fetchRejectReason();
      fetchCancelReason();
    }
  }, [open]);

  useEffect(() => {
    fetchInterviewer(searchInput);
  }, [searchInput]);

  useEffect(() => {
    if (Array.isArray(interviewer)) {
      setOptions(
        interviewer.map((i: any) => ({
          name: i.name,
          type: i.type ?? (i.email ? "Email" : "User"),
          user: i.user ?? null,
          email: i.email ?? null,
          label: i.label ?? i.name,
          full_name: i.full_name,
        }))
      );
    }
  }, [interviewer]);

  console.log(interviewer, "asdfinterviewerasdffff");

  // Reschedule slot management functions
  const addSlot = () => {
    setFeedback((prev) => {
      const slots = prev.slots ?? []; // fallback to empty array
      const newSlots = [...slots, emptySlot(slots.length)];
      // const newSlots = [...prev.slots, emptySlot(prev.slots.length)];
      const renamed = newSlots.map((s, i) => ({ ...s, name: `Slot ${i + 1}` }));
      return { ...prev, slots: renamed };
    });
  };

  const removeSlot = (slotId: string) => {
    setFeedback((prev) => {
      const slots = prev.slots ?? [];
      const remain = slots.filter((s) => s.name !== slotId);
      const renamed = remain.map((s, i) => ({ ...s, name: `Slot ${i + 1}` }));
      return { ...prev, slots: renamed };
    });
  };

  const clearSlot = (slotId: string) => {
    setFeedback((prev) => {
      const slots = prev.slots ?? []; // fallback
      return {
        ...prev,
        slots: slots.map((s) =>
          s.name === slotId
            ? {
                ...s,
                date: getCurrentDate().toISOString().split("T")[0],
                time: getCurrentTime(),
                timezone: "IST (UTC+05:30)",
                status: "Proposed",
              }
            : s
        ),
      };
    });
  };

  const setSlotValue = (
    slotId: string,
    updates: Partial<Pick<InterviewSlot, "date" | "time">>
  ) => {
    setFeedback((prev) => ({
      ...prev,
      slots: (prev.slots ?? []).map((slot) =>
        slot.name === slotId ? { ...slot, ...updates } : slot
      ),
    }));
  };

  const [details, setDetails] = useState<CandidateInterviewType | null>(null);

  const fetchInterviewDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/rr/info/kanban/interview?job_id=${jobID}&candidate_id=${profileData?.id}&latest_only=True`,
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

      console.log(data, "asdfffsadf", candidateDetails);

      if (candidateDetails) {
        setDetails(candidateDetails);
      }
      console.log(data, "asdfffsadf", details);
    } catch (err) {
      console.error("Failed to fetch count:", err);
      // setData(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!profileData) {
      return;
    }
    fetchInterviewDetails();
  }, [profileData, jobID]);

  // Handle feedback type change
  const handleFeedbackChange = (value: FeedbackType) => {
    if (value === "reschedule") {
      const interviwer_list =
        details?.interview_schedule?.[0]?.interviewers ?? [];

      const formattedInterviewers: Interviewer[] = interviwer_list.map(
        (item: any) => ({
          email: item?.email ?? "",
          full_name:
            item?.user && typeof item?.user === "string"
              ? item.user
              : item?.email ?? "",
          type: item?.type ?? "User",
          user: item?.type !== "Email" ? item?.email : "",
        })
      );
      setFeedback((prev: FeedbackFormData) => ({
        ...prev,
        feedbackType: value,
        rejectionReason: "",
        rescheduleReason: "",
        remarks: "",
        slots: [emptySlot(0)],
        interviewer: formattedInterviewers ?? [],
        interview_mode: details?.interview_schedule?.[0]?.interview_mode ?? "",
        interview_type: details?.interview_schedule?.[0]?.interview_type ?? "",
      }));
    } else {
      setFeedback((prev: FeedbackFormData) => ({
        ...prev,
        feedbackType: value,
        rejectionReason: "",
        rescheduleReason: "",
        remarks: "",
        slots: [],
        interviewer: [],
        interview_mode: "",
        interview_type: "",
      }));
    }
  };

  const handleSubmit = async () => {
    if (!details) {
      toast.error("No candidate data available");
      return;
    }

    setSubmitting(true);
    const payload = {
      interview_name: details?.interview_schedule[0].name,
      remarks: feedback.remarks,
      reason:
        feedback.feedbackType === "rejected" ? feedback.rejectionReason : "",
      slots: feedback.slots ?? [],
      interviewer: feedback.interviewer ?? [],
      interview_mode: feedback.interview_mode,
      interview_type: feedback.interview_type,
      rrcandidate_name: profileData?.id,
      job_id: jobID,
      cancellation_reason:
        feedback.feedbackType === "reschedule"
          ? feedback.rescheduleReason
          : feedback.cancellationReason,
    };

    try {
      console.log("Submitting interview data:", feedback);
      const endpoint =
        feedback.feedbackType === "rejected"
          ? `reject`
          : feedback.feedbackType === "cleared"
          ? `clear`
          : `reschedule`;

      const res = await fetch(`/api/rr/post/kanban/interview/${endpoint}`, {
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log(res);

      const result = await res.json();

      if (!res.ok) {
        // Handle API-level error response
        toast.error(result?.error || `Failed: ${res.status} ${res.statusText}`);
        throw new Error(result?.error || "Unknown server error");
      }

      if (result?.status === "success") {
        onOpenChange(false);
        toast.success(
          result?.data?.message || "Interview scheduled successfully."
        );
        handleRefresh!();
      } else if (result?.status === "error") {
        toast.error(result?.error || "Something went wrong while scheduling.");
      } else {
        toast.error("Unexpected response from server.");
      }

      if (feedback.feedbackType === "rejected") {
        console.log("feee rej:", feedback.rejectionReason);
      } else if (feedback.feedbackType === "reschedule") {
        console.log("feee resche:", feedback.rescheduleReason);
      } else if (feedback.feedbackType === "cleared") {
        console.log("feee clea:", feedback.slots);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };
  console.log(feedback, "feedbackfeedback");
  if (!details) {
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

  const toggleDrawer = () => {
    onOpenChange(false);
  };
  console.log(details, "detaisdtails", profileData);
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
            <Avatar className="h-10 w-10">
              <AvatarImage
                alt={profileData?.candidate.name}
                src={profileData?.candidate.image}
              />
              <AvatarFallback>
                {profileData?.candidate.name?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-sm font-semibold leading-none text-label">
                {profileData?.candidate.name || "Name"}
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
            <CardHeader className="px-3 ">
              <div className="flex items-center justify-between">
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
                      : "-"}
                  </span>
                </p>
              </div>
            </CardHeader>
            <CardContent className="px-3 pt-0 space-y-2.5">
              {/* Two-column grid */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <Badge className="flex items-center gap-1 bg-(--badge-bg) text-label py-1 rounded-full">
                  <MicIcon className="h-3.5 w-3.5" />
                  {details?.interview_schedule?.[0]?.name || "-"}
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
              <div className="flex flex-col gap-1">
                <p className="text-label font-bold text-sm">
                  Meeting Invite Content
                </p>
                <div className="text-xs text-label whitespace-pre-wrap leading-relaxed">
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        details?.interview_schedule?.[0]
                          ?.meeting_invite_content || "Meeting Content",
                    }}
                  />
                </div>
              </div>

              <div>
                <p className="text-label font-bold text-sm">Feedback</p>
                <RadioGroup
                  defaultValue="cleared"
                  className="flex gap-6 mt-2"
                  value={feedback.feedbackType}
                  onValueChange={(value) =>
                    handleFeedbackChange(value as FeedbackType)
                  }
                >
                  {/* Cleared (Green dot) */}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="cleared"
                      id="r1"
                      className=" cursor-pointer border-(--radio-clear) data-[state=checked]:border-(--radio-clear)  data-[state=checked]:accent-(--radio-clear) data-[state=checked]:text-(--radio-clear)"
                    />
                    <Label
                      htmlFor="r1"
                      className="text-xs text-(--radio-clear) font-bold"
                    >
                      Cleared
                    </Label>
                  </div>

                  {/* Rejected (Red dot) */}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="rejected"
                      id="r2"
                      className="  cursor-pointer border-(--failure) data-[state=checked]:border-(--failure) data-[state=checked]:text-(--failure)"
                    />
                    <Label
                      htmlFor="r2"
                      className="text-xs text-(--failure) font-bold"
                    >
                      Rejected
                    </Label>
                  </div>

                  {/* Reschedule (Black dot) */}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="reschedule"
                      id="r3"
                      className="  cursor-pointer border-(--label) data-[state=checked]:border-(--label) data-[state=checked]:text-(--label)"
                    />
                    <Label
                      htmlFor="r3"
                      className="text-xs text-label font-bold"
                    >
                      Reschedule
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {feedback.feedbackType === "cleared" && (
                <div className="space-y-3 pt-1">
                  <div>
                    <Label
                      htmlFor="cleared-remarks"
                      className="text-sm font-medium text-label"
                    >
                      Remarks
                    </Label>
                    <Textarea
                      id="cleared-remarks"
                      placeholder="Add your feedback and remarks here..."
                      value={feedback.remarks}
                      onChange={(e) =>
                        setFeedback((prev) => ({
                          ...prev,
                          remarks: e.target.value,
                        }))
                      }
                      className="mt-1 min-h-[80px] resize-none"
                    />
                  </div>
                </div>
              )}

              {feedback.feedbackType === "rejected" && (
                <div className="space-y-1.5 pt-2">
                  <div>
                    {/* <Label
                      htmlFor="rejection-reason"
                      className="text-sm font-medium text-label"
                    >
                       Reason for Rejection{" "} 
                      <span className="text-red-500">*</span>
                    </Label>*/}
                    <CusSelect
                      label="Reason for Rejection"
                      required
                      value={feedback.rejectionReason}
                      onValueChange={(value) =>
                        setFeedback((prev) => ({
                          ...prev,
                          rejectionReason: value.toString(),
                        }))
                      }
                    >
                      {rejectReason.map((reason) => (
                        <SelectItem
                          key={reason.reason_name}
                          value={reason.reason_name}
                        >
                          {reason.name}
                        </SelectItem>
                      ))}
                    </CusSelect>
                  </div>
                  <div>
                    <Label
                      htmlFor="rejected-remarks"
                      className="text-sm font-medium text-label"
                    >
                      Remarks
                    </Label>
                    <Textarea
                      id="rejected-remarks"
                      placeholder="Provide detailed feedback for the candidate..."
                      value={feedback.remarks}
                      onChange={(e) =>
                        setFeedback((prev) => ({
                          ...prev,
                          remarks: e.target.value,
                        }))
                      }
                      className="mt-1 min-h-[80px] resize-none"
                    />
                  </div>
                </div>
              )}

              {feedback.feedbackType === "reschedule" && (
                <>
                  {/* Reschedule Reason and Remarks */}
                  <div className="rounded-lg">
                    <CardContent className="px-0.5 pt-0.5  space-y-1.5">
                      <div>
                        <Label
                          htmlFor="reschedule-reason"
                          className="text-sm font-medium text-label"
                        >
                          Reason for Reschedule{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <CusSelect
                          value={feedback.rescheduleReason}
                          onValueChange={(value) =>
                            setFeedback((prev) => ({
                              ...prev,
                              rescheduleReason: value.toString(),
                            }))
                          }
                          required
                        >
                          {cancelReason.map((reason) => (
                            <SelectItem
                              key={reason.reason_name}
                              value={reason.reason_name}
                            >
                              {reason.name}
                            </SelectItem>
                          ))}
                        </CusSelect>
                      </div>
                      <div>
                        <Label
                          htmlFor="reschedule-remarks"
                          className="text-sm font-medium text-label"
                        >
                          Remarks
                        </Label>
                        <Textarea
                          id="reschedule-remarks"
                          placeholder="Add any additional notes about the reschedule..."
                          value={feedback.remarks}
                          onChange={(e) =>
                            setFeedback((prev) => ({
                              ...prev,
                              remarks: e.target.value,
                            }))
                          }
                          className="mt-1 min-h-[60px] resize-none"
                        />
                      </div>
                    </CardContent>
                  </div>

                  <Card className="rounded-lg">
                    <CardHeader className="px-3 py-1">
                      <CardTitle className="text-base font-semibold text-label">
                        ReSchedule Interview (Round{" "}
                        {details?.interview_schedule?.length
                          ? details.interview_schedule.length + 1
                          : "1"}
                        )
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 pt-0 pb-5 space-y-1">
                      {/* Two-column grid */}
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="col-span-2 md:col-span-1">
                          <CusSelect
                            label="Interview Type"
                            value={feedback.interview_type}
                            onValueChange={(value) =>
                              setFeedback((prev) => ({
                                ...prev,
                                interview_type:
                                  value as typeof feedback.interview_type,
                              }))
                            }
                            required
                          >
                            {INTERVIEW_TYPES.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </CusSelect>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <CusSelect
                            label="Interview mode"
                            value={feedback.interview_mode}
                            onValueChange={(value) =>
                              setFeedback((prev) => ({
                                ...prev,
                                interview_mode:
                                  value as typeof feedback.interview_mode,
                              }))
                            }
                            required
                          >
                            {INTERVIEW_MODES.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </CusSelect>
                        </div>
                      </div>
                      <div className="col-span-full">
                        <CusInterviewerSelect
                          label="Interviewers"
                          value={feedback.interviewer}
                          options={options}
                          setSearchInput={setSearchInput}
                          onValueChange={(vals) =>
                            setFeedback?.((prev) => ({
                              ...prev,
                              interviewer: vals,
                            }))
                          }
                        />
                      </div>
                      <SlotTable
                        slots={feedback.slots ?? []}
                        addSlot={addSlot}
                        removeSlot={removeSlot}
                        clearSlot={clearSlot}
                        setSlotValue={setSlotValue}
                      />
                    </CardContent>
                  </Card>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
