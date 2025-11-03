"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/forms/CustomCard";
import { useState, useEffect } from "react";
import { SelectItem } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { CusSelect } from "@/components/forms/CusSelect";
import { getCurrentDate, getCurrentTime } from "@/lib/utils";
import SlotTable from "../../SlotTable";
import { useDataContext } from "@/context/DataProvider";
import {
  InterviewSlot,
  InterviewerType,
} from "@/types/jobs/Info/kanban/interview-feedback";
import { CusInterviewerSelect } from "@/components/forms/InterviwerChip";

const INTERVIEW_TYPES = ["HR", "Technical"] as const;
const INTERVIEW_MODES = ["Virtual Meeting", "In-Person", "Phone Call"] as const;

export function DateStringCard({
  roundNum,
  onRemove,
  interviewType,
  setInterviewType,
  interviewMode,
  setInterviewMode,
  interviewers,
  setInterviewers,
  slots,
  setSlots,
}: {
  roundNum: number;
  onRemove?: () => void;
  interviewType: string;
  setInterviewType: React.Dispatch<React.SetStateAction<string>>;
  interviewMode: string;
  setInterviewMode: React.Dispatch<React.SetStateAction<string>>;
  interviewers: InterviewerType[];
  setInterviewers: React.Dispatch<React.SetStateAction<InterviewerType[]>>;
  slots: InterviewSlot[];
  setSlots: React.Dispatch<React.SetStateAction<InterviewSlot[]>>;
}) {
  const [options, setOptions] = useState<InterviewerType[]>([]);
  const [searchInput, setSearchInput] = useState("");

  const { interviewer, fetchInterviewer } = useDataContext();

  // Fetch interviewer list based on search
  useEffect(() => {
    fetchInterviewer(searchInput);
  }, [searchInput]);

  // Transform interviewer list into options
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

  const addSlot = () => {
    setSlots((prev) => [
      ...prev,
      {
        name: `Slot ${prev.length + 1}`,
        date: getCurrentDate().toISOString().split("T")[0],
        time: getCurrentTime(),
        timezone: "IST (UTC+05:30)",
        status: "Proposed",
      },
    ]);
  };

  const removeSlot = (id: string) => {
    setSlots((prev) =>
      prev.filter((s) => s.name !== id).map((s, i) => ({ ...s, index: i + 1 }))
    );
  };

  const clearSlot = (id: string) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.name === id
          ? {
              ...s,
              date: getCurrentDate().toISOString().split("T")[0],
              time: getCurrentTime(),
            }
          : s
      )
    );
  };

  const setSlotValue = (id: string, patch: Partial<InterviewSlot>) => {
    setSlots((prev) =>
      prev.map((s) => (s.name === id ? { ...s, ...patch } : s))
    );
  };

  return (
    <Card className="rounded-lg">
      <CardHeader className="px-3 py-0.5 flex items-center justify-between">
        <CardTitle className="text-base font-semibold text-foreground">
          Interview (Round {roundNum})
        </CardTitle>
        {onRemove && (
          <button onClick={onRemove} className="p-1 cursor-pointer">
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        )}
      </CardHeader>

      <CardContent className="px-3 pt-0 pb-5 space-y-2">
        {/* Selects */}
        <div className="grid gap-2 md:grid-cols-2">
          <div className="col-span-2 md:col-span-1">
            <CusSelect
              label="Interview Type"
              value={interviewType}
              onValueChange={(val) => setInterviewType(val as string)}
              required
            >
              {INTERVIEW_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </CusSelect>
          </div>
          <div className="col-span-2 md:col-span-1">
            <CusSelect
              label="Interview Mode"
              value={interviewMode}
              onValueChange={(val) => setInterviewMode(val as string)}
              required
            >
              {INTERVIEW_MODES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </CusSelect>
          </div>
        </div>

        {/* Interviewers chips */}
        <div className="mb-2.5">
          <CusInterviewerSelect
            label="Interviewers"
            value={interviewers}
            options={options}
            setSearchInput={setSearchInput}
            onValueChange={(vals) => setInterviewers(vals)}
          />
        </div>

        <SlotTable
          slots={slots}
          addSlot={addSlot}
          removeSlot={removeSlot}
          clearSlot={clearSlot}
          setSlotValue={setSlotValue}
        />
      </CardContent>
    </Card>
  );
}
