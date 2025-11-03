"use client";

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatDate2Word } from "@/lib/utils";
import { InterviewSlot } from "@/types/jobs/Info/kanban/interview-feedback";
import { Clock } from "lucide-react";

interface SlotViewTableProps {
  slots: InterviewSlot[];
}

export default function SlotViewTable({ slots }: SlotViewTableProps) {
  return (
    <div className="space-y-1.5"> 
      <p className="block text-xs font-medium mb-1">Slot Details</p>

      <div className="overflow-hidden rounded-md border flex-1 flex flex-col min-h-0">
        <div className="overflow-y-auto flex-1 min-h-0" style={{ maxHeight: 260 }}>
          <Table>
            <TableHeader className="bg-[#EEEEEE]">
              <TableRow>
                <TableHead className="w-[100px]">#Slot</TableHead>
                <TableHead>Interview Date</TableHead>
                <TableHead>Interview Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slots.length > 0 ? (
                slots.map((slot, i) => (
                  <TableRow key={i}>
                    <TableCell>{slot.name}</TableCell>
                    <TableCell>
                      {slot.date ? (
                        formatDate2Word(slot.date)
                      ) : (
                        <span className="text-gray-400 italic">Not set</span>
                      )}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {slot.time
                        ? `${slot.time} ${slot.timezone || "IST"}`
                        : "Not set"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500 italic">
                    No slots available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
