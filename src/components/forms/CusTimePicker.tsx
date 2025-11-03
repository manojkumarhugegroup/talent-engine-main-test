"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimePickerProps {
  value?: string;
  onChange?: (data: { time: string; timezone: string }) => void;
  className?: string;
  type?: 0 | 1; // 0 = 12-hour, 1 = 24-hour
}
const timeZones = [
  { code: "UTC", label: "UTC (UTC±00:00)" },
  { code: "GMT", label: "GMT (UTC±00:00)" },
  { code: "WET", label: "WET (UTC+00:00)" },
  { code: "CET", label: "CET (UTC+01:00)" },
  { code: "EET", label: "EET (UTC+02:00)" },
  { code: "MSK", label: "MSK (UTC+03:00)" },
  { code: "GST", label: "GST (UTC+04:00)" },
  { code: "PKT", label: "PKT (UTC+05:00)" },
  { code: "IST", label: "IST (UTC+05:30)" },
  { code: "NPT", label: "NPT (UTC+05:45)" },
  { code: "BST", label: "BST (UTC+06:00)" },
  { code: "ICT", label: "ICT (UTC+07:00)" },
  { code: "CST", label: "CST (UTC+08:00)" },
  { code: "AWST", label: "AWST (UTC+08:00)" },
  { code: "JST", label: "JST (UTC+09:00)" },
  { code: "KST", label: "KST (UTC+09:00)" },
  { code: "ACST", label: "ACST (UTC+09:30)" },
  { code: "AEST", label: "AEST (UTC+10:00)" },
  { code: "AEDT", label: "AEDT (UTC+11:00)" },
  { code: "NZST", label: "NZST (UTC+12:00)" },
  { code: "NST", label: "NST (UTC-03:30)" },
  { code: "ART", label: "ART (UTC-03:00)" },
  { code: "BRT", label: "BRT (UTC-03:00)" },
  { code: "AST", label: "AST (UTC-04:00)" },
  { code: "EST", label: "EST (UTC-05:00)" },
  { code: "MST", label: "MST (UTC-07:00)" },
  { code: "PST", label: "PST (UTC-08:00)" },
  { code: "AKST", label: "AKST (UTC-09:00)" },
  { code: "HST", label: "HST (UTC-10:00)" },
  { code: "SST", label: "SST (UTC-11:00)" },
  { code: "BIT", label: "BIT (UTC-12:00)" }
];


export function TimePicker({
  value = "",
  onChange,
  className,
  type = 0,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");
  const [selectedZone, setSelectedZone] = useState("IST");
  const [tempZone, setTempZone] = useState(selectedZone);

  const hours =
    type === 0
      ? Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"))
      : Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
  const periods: ("AM" | "PM")[] = ["AM", "PM"];

  // computed display string
  const formattedValue =
    type === 0
      ? `${selectedHour}:${selectedMinute} ${selectedPeriod} ${selectedZone}`
      : `${selectedHour}:${selectedMinute} ${selectedZone}`;

  const handleOk = () => {
    setSelectedZone(tempZone);

    const time =
      type === 0
        ? `${selectedHour}:${selectedMinute} ${selectedPeriod}`
        : `${selectedHour}:${selectedMinute}`;

    onChange?.({ time, timezone: tempZone });
    setOpen(false);
  };

  const handleNow = () => {
    const now = new Date();
    let hour = now.getHours();
    const minute = now.getMinutes();
    const period = hour >= 12 ? "PM" : "AM";

    if (type === 0) {
      hour = hour % 12 || 12;
    }
    setSelectedHour(hour.toString().padStart(2, "0"));
    setSelectedMinute(minute.toString().padStart(2, "0"));
    if (type === 0) setSelectedPeriod(period);

    const time =
      type === 0
        ? `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${period}`
        : `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

    onChange?.({ time, timezone: selectedZone });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative w-56", className)}>
          <Input
            readOnly
            value={value || formattedValue}
            placeholder={type === 0 ? "hh:mm aa TZ" : "HH:mm TZ"}
            className="cursor-pointer pr-10"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute inset-y-0 right-1 my-auto h-7 w-7 text-gray-500 hover:bg-gray-100"
          >
            <Clock className="size-4" />
          </Button>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex justify-between gap-2">
          {/* Hour */}
          <div className="flex flex-col w-full">
            <label className="text-xs font-medium mb-1 text-gray-600">Hour</label>
            <Select value={selectedHour} onValueChange={(val) => setSelectedHour(val)}>
              <SelectTrigger className="text-sm focus:ring-blue-500 focus:ring-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-40">
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {/* Minute */}
          <div className="flex flex-col w-full">
            <label className="text-xs font-medium mb-1 text-gray-600">Minute</label>
            <Select value={selectedMinute} onValueChange={(val) => setSelectedMinute(val)}>
              <SelectTrigger className="text-sm focus:ring-blue-500 focus:ring-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-40">
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {/* Period — only for 12-hour mode */}
          {type === 0 && (
            <div className="flex flex-col w-full">
              <label className="text-xs font-medium mb-1 text-gray-600">Period</label>
              <Select
                value={selectedPeriod}
                onValueChange={(val) => setSelectedPeriod(val as "AM" | "PM")}
              >
                <SelectTrigger className="text-sm focus:ring-blue-500 focus:ring-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Time Zone */}
          <div className="flex flex-col w-full">
            <label className="text-xs font-medium mb-1 text-gray-600">Zone</label>
            <Select value={tempZone} onValueChange={(val) => setTempZone(val)}>
              <SelectTrigger className="text-sm focus:ring-blue-500 focus:ring-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-32">
                  {timeZones.map((zone) => (
                    <SelectItem key={zone.code} value={zone.label}>
                      {zone.code}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-2 border-t border-gray-200 flex justify-between items-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700"
            onClick={handleNow}
          >
            Now
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleOk}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
