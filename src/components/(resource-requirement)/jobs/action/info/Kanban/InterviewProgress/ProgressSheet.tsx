"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/forms/CustomCard";
import { SelectItem } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/forms/CustomSheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CusSelect } from "@/components/forms/CusSelect";
import CusChipInput from "@/components/forms/CusChipInput";
import {
  InterviewFormData,
  InterviewMode,
  InterviewType,
  candidate,
} from "@/types/jobs/Info/kanban/progress";
import { KanbanFeature } from "@/types/jobs/Info/kanban.type";
import { InterviewSchedule } from "@/types/jobs/Info/kanban/interview-schedule-type";
import SlotTable from "../SlotTable";
import { getCurrentDate, getCurrentTime } from "@/lib/utils";
import {
  InterviewerType,
  InterviewSlot,
} from "@/types/jobs/Info/kanban/interview-feedback";
import { toast } from "sonner";
import { ScheduleInterview } from "./ScheduleInterview";
import { useSearchParams } from "next/navigation";

type InterviewDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Add these props for profile data
  profileData?: KanbanFeature | null;
  type: 0 | 1;
  handleRefresh?: () => void;
};

const emptySlot = (index: number): InterviewSlot => ({
  name: `Slot ${index + 1}`,
  date: getCurrentDate().toISOString().split("T")[0],
  time: getCurrentTime(),
  timezone: "IST (UTC+05:30)",
  status: "Proposed",
});

export function ScheduleInterviewForm({
  open,
  onOpenChange,
  profileData,
  type,
  handleRefresh,
}: InterviewDrawerProps) {
  const search = useSearchParams();
  const jobID = search.get("d");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<InterviewFormData>({
    candidate: {
      id: "",
      name: "",
      image: "",
    } as candidate,
    interview_type: "Technical",
    interview_mode: "Virtual Meeting",
    interviewer: [] as InterviewerType[],
    slots: [
      {
        name: `Slot 1`,
        date: getCurrentDate().toISOString().split("T")[0],
        time: getCurrentTime(),
        timezone: "IST (UTC+05:30)",
        status: "Proposed",
      },
    ],
  });

  console.log(profileData, "profileData");

  const canSubmit = useMemo(() => {
    const baseValid =
      !!form.interview_type &&
      !!form.interview_mode &&
      form.slots.length > 0 &&
      form.slots.every((s) => s.date && s.time);
    return baseValid;
  }, [form]);

  function setSlotValue(slotId: string, patch: Partial<InterviewSlot>) {
    setForm((prev) => ({
      ...prev,
      slots: prev.slots.map((s) =>
        s.name === slotId ? { ...s, ...patch } : s
      ),
    }));
  }

  function addSlot() {
    setForm((prev) => {
      const newSlots = [...prev.slots, emptySlot(prev.slots.length)];
      const renamed = newSlots.map((s, i) => ({ ...s, name: `Slot ${i + 1}` }));
      return { ...prev, slots: renamed };
    });
  }

  function removeSlot(slotId: string) {
    setForm((prev) => {
      const remain = prev.slots.filter((s) => s.name !== slotId);
      const renamed = remain.map((s, i) => ({ ...s, name: `Slot ${i + 1}` }));
      return { ...prev, slots: renamed };
    });
  }

  function clearSlot(slotId: string) {
    setForm((prev) => ({
      ...prev,
      slots: prev.slots.map((s) =>
        s.name === slotId
          ? {
              ...s,
              name: "Slot 1",
              date: getCurrentDate().toISOString().split("T")[0],
              time: getCurrentTime(),
              timezone: "IST (UTC+05:30)",
              status: "Proposed",
            }
          : s
      ),
    }));
  }

  function resetForm() {
    setForm({
      candidate: {
        id: "",
        name: "",
        image: "",
        job_title: "",
      },
      interview_type: "Technical" as InterviewType,
      interview_mode: "Virtual Meeting" as InterviewMode,
      interviewer: [],
      slots: [emptySlot(0)],
    });
  }

  const toggleDrawer = () => {
    onOpenChange(false);
    resetForm();
  };

  const [data, setData] = useState<InterviewSchedule | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInterviewSchedule = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/rr/info/kanban/interview/schedule?job_id=${jobID}&candidate_id=${profileData?.id}`,
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
      // Use it like this
      if (!details) return;
      const formattedData: InterviewFormData = {
        candidate: {
          id: details?.profile?.name || "",
          name: details?.profile?.full_name || "",
          image: details?.profile?.profile_image || "",
          job_title: details?.profile_version?.professional_title || "",
        },
        interview_type:
          (details?.interview_type as InterviewType) || "Technical",
        interview_mode:
          (details?.interview_mode as InterviewMode) || "Virtual Meeting",
        interviewer:
          details?.interviewer?.map(
            (item: any): InterviewerType => ({
              name: item.user || "",
              email: item.email || "",
              type: item.type || "",
              user: item.user || "",
              label: item.label || "",
            })
          ) || [],
        slots: details?.slots?.map(
          (slot: any, index: number): InterviewSlot => ({
            name: `Slot ${index + 1}`,
            date: slot.slot_date || "",
            time: slot.slot_time || "",
            timezone: "IST (UTC+05:30)",
            status: slot.slot_status || "",
          })
        ) || [emptySlot(0)],
      };
      setForm(formattedData);
      setData(data?.data || null);
    } catch (err) {
      console.error("Failed to fetch count:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!profileData) {
      return;
    }
    fetchInterviewSchedule();
  }, [profileData, jobID, open]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Form validation failed. Missing required fields.");
      return;
    }
    setSubmitting(true);
    const payload = {
      rrcandidate_name: profileData?.id,
      job_id: jobID,
      interview_type: form.interview_type,
      interview_mode: form.interview_mode,
      interviewer: form.interviewer,
      slots: form.slots,
    };

    try {
      const res = await fetch(`/api/rr/post/kanban/interview/schedule`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result?.error || `Failed: ${res.status} ${res.statusText}`);
        throw new Error(result?.error || "Unknown server error");
      }

      if (result?.status === "success") {
        resetForm();
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
    } catch (err: any) {
      console.error("❌ Error saving interview:", err?.message || err);
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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

  return (
    <Sheet open={open} onOpenChange={toggleDrawer}>
      <SheetContent
        side="right"
        className={
          "w-full max-w-none min-w-[600px] md:min-w-[580px] p-0 gap-0 bg-card flex flex-col h-full"
        }
      >
        {/* Header */}
        <SheetHeader className="p-2 border-b pb-2">
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
        </SheetHeader>

        {/* Profile row */}
        <div className="px-5 pt-2.5 pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                alt="John"
                src={`${process.env.NEXT_PUBLIC_API_FRAPPE_URL}${form?.candidate?.image}`}
              />
              <AvatarFallback>
                {profileData?.candidate?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
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
        <div className="flex-1 flex flex-col px-4 min-h-0">
          <ScheduleInterview
            mode={type}
            form={form}
            handleSave={handleSave}
            submitting={submitting}
            onOpenChange={onOpenChange}
            setForm={setForm}
            addSlot={addSlot}
            removeSlot={removeSlot}
            clearSlot={clearSlot}
            setSlotValue={setSlotValue}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
