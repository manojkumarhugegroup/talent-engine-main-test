"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eraser } from "lucide-react";
import { getCurrentDate, getTodayMinDate } from "@/lib/utils";
import { CusDatePicker } from "@/components/forms/CusDatePicker";
import { TimePicker } from "@/components/forms/CusTimePicker";
import { InterviewSlot } from "@/types/jobs/Info/kanban/interview-feedback";

interface SlotTableProps {
  slots: InterviewSlot[];
  addSlot: () => void;
  removeSlot: (id: string) => void;
  clearSlot?: (id: string) => void;
  setSlotValue: (id: string, value: Partial<InterviewSlot>) => void;
}

export default function SlotTable({
  slots,
  addSlot,
  removeSlot,
  clearSlot,
  setSlotValue,
}: SlotTableProps) {
  return (
    <div className="space-y-1.5">
      <p className="block text-xs font-medium mb-1">Slot Details</p>

      <div className="overflow-hidden rounded-md border flex-1 flex flex-col min-h-0">
        <div
          className="overflow-y-auto flex-1 min-h-0"
          style={{ maxHeight: 260 }}
        >
          <Table>
            <TableHeader className="bg-[#EEEEEE]">
              <TableRow>
                <TableHead className="w-[100px]">#Slot</TableHead>
                <TableHead>
                  Interview Date<span className="text-red-500"> *</span>
                </TableHead>
                <TableHead>
                  Interview Time<span className="text-red-500"> *</span>
                </TableHead>
                <TableHead className="w-[100px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slots.map((slot, i) => (
                <TableRow key={i}>
                  <TableCell>{slot.name}</TableCell>
                  <TableCell>
                    <CusDatePicker
                      value={slot.date ? new Date(slot.date) : getCurrentDate()}
                      onChange={(date) => {
                        const dateString = date
                          ? date.toLocaleDateString("en-CA")
                          : "";
                        setSlotValue(slot.name, { date: dateString });
                      }}
                      required
                      minDate={getTodayMinDate()}
                    />
                  </TableCell>
                  <TableCell>
                    <TimePicker
                      type={1}
                      value={slot.time + " " + (slot.timezone || "IST")}
                      onChange={({ time, timezone }) =>
                        setSlotValue(slot.name, { time, timezone })
                      }
                      className="w-auto"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    {slots.length === 1 && clearSlot ? (
                      <Button
                        type="button"
                        variant="ghost"
                        aria-label={`Clear slot ${slot.name}`}
                        onClick={() => clearSlot(slot.name)}
                        className="h-8 px-2"
                        title="Clear slot"
                      >
                        <Eraser className="h-4 w-4 text-primary" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        aria-label={`Remove slot ${slot.name}`}
                        onClick={() => removeSlot(slot.name)}
                        className="h-8 px-2"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between p-3">
          <div />
          <Button
            type="button"
            onClick={addSlot}
            className="h-9 gap-2 bg-[#F3F3F3] text-label hover:bg-[#F3F3F3] hover:text-label"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
