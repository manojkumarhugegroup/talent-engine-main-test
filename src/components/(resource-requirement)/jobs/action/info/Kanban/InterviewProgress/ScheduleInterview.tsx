import React, { useState, useEffect } from "react";
import { CusSelect } from "@/components/forms/CusSelect";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/forms/CustomCard";
import { SelectItem } from "@/components/ui/select";
import {
  InterviewerType,
  InterviewSlot,
} from "@/types/jobs/Info/kanban/interview-feedback";
import {
  InterviewFormData,
  InterviewMode,
  InterviewType,
} from "@/types/jobs/Info/kanban/progress";
import SlotTable from "../SlotTable";
import SlotViewTable from "../SlotViewTable";
import { Button } from "@/components/ui/button";
import { useDataContext } from "@/context/DataProvider";
import { CusInterviewerSelect } from "@/components/forms/CusSelectInterviewer";
import {
  INTERVIEW_MODES,
  INTERVIEW_TYPES,
} from "@/data/Info/kanban/interviewData";

type ScheduleCardProps = {
  mode: 0 | 1; // 0 = view, 1 = edit
  form: InterviewFormData;
  onOpenChange: (open: boolean) => void;
  handleSave?: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  submitting?: boolean;
  setForm?: React.Dispatch<React.SetStateAction<InterviewFormData>>;
  addSlot?: () => void;
  removeSlot?: (slotId: string) => void;
  clearSlot?: (slotId: string) => void;
  setSlotValue?: (slotId: string, patch: Partial<InterviewSlot>) => void;
  /** 👇 Optional extra fields injected from parent */
  children?: React.ReactNode;
};

export const ScheduleInterview: React.FC<ScheduleCardProps> = ({
  mode,
  form,
  handleSave,
  submitting,
  onOpenChange,
  setForm,
  addSlot,
  removeSlot,
  clearSlot,
  setSlotValue,
  children,
}) => {
  const { interviewer, fetchInterviewer } = useDataContext();
  const [options, setOptions] = useState<InterviewerType[]>([]);
  const [scheduleMode, setScheduleMode] = useState<0 | 1>(mode);
  const [searchInput, setSearchInput] = useState("");
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
  console.log(form, "asdfff23");

  const interviewTypes: { id: string; name: InterviewType }[] = [
    { id: "1", name: "Technical" },
    { id: "2", name: "HR" },
    { id: "3", name: "Managerial" },
    { id: "4", name: "Culture Fit" },
  ];

  const interviewModes: { id: string; name: InterviewMode }[] = [
    { id: "1", name: "Virtual Meeting" },
    { id: "2", name: "In-person" },
    { id: "3", name: "Phone" },
    { id: "4", name: "Face to Face Meeting" },
  ];

  console.log(form.interviewer, "fosrm");

  return (
    <Card className="rounded-lg">
      <CardHeader className="px-3 py-1">
        <CardTitle className="text-base font-semibold text-label">
          <div className="flex items-center justify-between">
            Schedule Interview (Round 1)
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-3 pt-0 pb-5 space-y-1">
        {scheduleMode === 1 ? (
          // EDIT MODE
          <form onSubmit={handleSave}>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="col-span-2 md:col-span-1">
                <CusSelect
                  label="Interview Type"
                  value={form.interview_type}
                  onValueChange={(value) =>
                    setForm?.((prev) => ({
                      ...prev,
                      interview_type: value as InterviewType,
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
                  label="Interview Mode"
                  value={form.interview_mode}
                  onValueChange={(value) =>
                    setForm?.((prev) => ({
                      ...prev,
                      interview_mode: value as InterviewMode,
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
              <div className="col-span-full">
                <CusInterviewerSelect
                  label="Interviewers"
                  value={form.interviewer}
                  options={options}
                  setSearchInput={setSearchInput}
                  onValueChange={(vals) =>
                    setForm?.((prev) => ({
                      ...prev,
                      interviewer: vals,
                    }))
                  }
                />
              </div>
            </div>

            {/* Slots */}
            <SlotTable
              slots={form.slots}
              addSlot={addSlot!}
              removeSlot={removeSlot!}
              clearSlot={clearSlot!}
              setSlotValue={setSlotValue!}
            />

            {/* 👇 Custom extra fields from parent */}
            {children}

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-9 border cursor-pointer border-(--interview) bg-transparent text-(--interview)"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                variant="default"
                className="h-9 bg-(--interview) cursor-pointer"
              >
                {submitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        ) : (
          // VIEW MODE
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Interview Type</p>
                <p className="font-medium">{form.interview_type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Interview Mode</p>
                <p className="font-medium">{form.interview_mode}</p>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground text-sm mb-1">
                Interviewer(s)
              </p>
              
              <ul className="list-disc ml-5">
                {form.interviewer.length > 0 ? (
                  form.interviewer.map((i, idx) => (
                    <li key={idx} className="text-sm">
                      {typeof i === "string" ? i : i.email}
                    </li>
                  ))
                ) : (
                  <li className="text-xs italic text-gray-500">
                    No interviewers listed
                  </li>
                )}
              </ul>
            </div>

            <div>
              <SlotViewTable slots={form.slots} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
