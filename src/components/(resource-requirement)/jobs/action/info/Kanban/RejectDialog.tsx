"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CusSelect } from "@/components/forms/CusSelect";
import { SelectItem } from "@/components/ui/select";
import { useDataContext } from "@/context/DataProvider";
import { ReasonType } from "@/types/masters/masters.type";
import { KanbanFeature } from "@/types/jobs/Info/kanban.type";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CandidateInterviewType } from "@/types/jobs/Info/kanban/interview-feedback-type";

interface RejectForm {
  reason: string;
  remarks: string;
}

interface RejectDialogProps {
  showRejectPopup: boolean;
  setShowRejectPopup: (show: boolean) => void;
  rejectFeature: KanbanFeature;
  handleRefresh?: () => void;
  type: 0 | 1;
}

function RejectDialog({
  showRejectPopup,
  setShowRejectPopup,
  rejectFeature,
  handleRefresh,
  type,
}: RejectDialogProps) {
  const search = useSearchParams();
  const jobID = search.get("d");
  const { rejectReason, fetchRejectReason } = useDataContext();
  console.log(rejectFeature, "rejectsdfFeature");

  const [details, setDetails] = useState<CandidateInterviewType | null>(null);
  const [loading, setLoading] = useState(false);

  console.log(details, "detailsdetails");

  const fetchInterviewDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/rr/info/kanban/interview?job_id=${jobID ?? ""}&candidate_id=${
          rejectFeature?.id ?? ""
        }&latest_only=True`,
        {
          cache: "no-store",
        }
      );
      if (!res.ok) {
        if (res.status === 404) {
          const data = await res.json();
          const errorMessage =
            data?.message?.error ||
            `Interview '${jobID}/${rejectFeature?.id}' not found`;
          // Show error toast
          toast.error(errorMessage);
        } else {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
      }
      const data = await res.json();
      const details = data?.data;
      const candidateDetails: CandidateInterviewType | undefined = data?.data;

      console.log(data,'candidateDetails');
      

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
    if (!rejectFeature) {
      setDetails(null);
      return;
    }
    fetchInterviewDetails();
  }, [rejectFeature, jobID]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectForm>({
    defaultValues: {
      reason: "",
      remarks: "",
    },
  });

  useEffect(() => {
    fetchRejectReason();
    reset();
  }, [rejectFeature]);

  console.log(rejectFeature,'type');
  

  const onSubmit = async (data: RejectForm) => {
    const payload = {
      reason: data.reason,
      remarks: data.remarks,
      interview_name: type === 0 ? "" : details?.interview_schedule[0].name,
      rrcandidate_name: type === 1 ? "" : rejectFeature?.id,
    };

    const endpoint = type === 0 ? `reject-shortlist` : `reject`;

    try {
      const res = await fetch(`/api/rr/post/kanban/interview/${endpoint}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        // Handle API-level error response
        toast.error(result?.error || `Failed: ${res.status} ${res.statusText}`);
        throw new Error(result?.error || "Unknown server error");
      }
      console.log(result, "ffw3w");
      if (result?.status === "success") {
        setShowRejectPopup(false);
        reset();
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
      // toast.error(err?.message || "An unexpected error occurred.");
    }
  };

  return (
    <Dialog open={showRejectPopup} onOpenChange={setShowRejectPopup}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>Reject Candidate</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <p>
            Are you sure you want to reject{" "}
            <span className="font-bold text-label">
              {rejectFeature?.candidate?.name || "this candidate"}
            </span>
            ?
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-3">
            {/* Reason Type Select */}
            <Controller
              name="reason"
              control={control}
              rules={{ required: "Reason is required" }}
              render={({ field }) => (
                <CusSelect
                  label="Reason"
                  required
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.reason?.message}
                  className="text-black"
                >
                  {rejectReason?.map((item: ReasonType) => (
                    <SelectItem key={item.name} value={item.reason_name}>
                      {item.label}
                    </SelectItem>
                  ))}
                </CusSelect>
              )}
            />

            {/* Reason Textarea */}
            <div className="grid gap-2">
              <label className="text-xs font-medium text-label">Remarks</label>
              <Textarea
                {...register("remarks", { required: "remarks is required" })}
                placeholder="Write a remarks for rejection..."
                className="min-h-[80px] max-h-[120px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-300 focus-visible:border-gray-500 text-black"
              />
              {errors.remarks && (
                <span className="text-xs text-red-500">
                  {errors.remarks.message}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowRejectPopup(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Reject
              </Button>
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default RejectDialog;
