"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarDays, ListFilter } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
export interface CusDateRangePickerProps {
  label?: string;
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const CusDateRangePicker = React.forwardRef<HTMLButtonElement, CusDateRangePickerProps>(
  (
    {
      label,
      value,
      onChange,
      error,
      placeholder = "Select date range",
      className,
      disabled = false,
    },
    ref
  ) => {
    // Controlled open state for popover
    const [open, setOpen] = React.useState(false);
    // Temporary internal selection state while user picks dates
    const [tempRange, setTempRange] = React.useState<DateRange | undefined>(value);
    const isDateRangeSelected = value?.from && value?.to;


    // Sync tempRange when value changes externally
    React.useEffect(() => {
      setTempRange(value);
    }, [value]);

    // Format the date range or placeholder
    const formatDateRange = (range: DateRange | undefined) => {
      if (!range?.from) return placeholder;
      if (range.to) {
        return `${format(range.from, "MMM dd, yyyy")} - ${format(range.to, "MMM dd, yyyy")}`;
      }
      return format(range.from, "MMM dd, yyyy");
    };

    // Handle confirming the picked range, call onChange prop and close popover
    const handleConfirm = () => {
      if (tempRange?.from && tempRange?.to) {
        onChange?.(tempRange);
        setOpen(false);
      }
    };

    // Handle button click:
    // If date range selected, clear it on first click.
    // If no date range, open the calendar popover.
const handleButtonClick = () => {
  setOpen(true); // ✅ Always open the popover
};


    return (
      <div className={cn("w-fit  flex flex-col justify-between", className)}>
        {label && (
          <label
            className={cn(
              "block text-xs font-medium whitespace-nowrap",
              error ? "text-red-500 dark:text-red-200" : "text-label dark:text-gray-200"
            )}
          >
            {label}
          </label>
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
  <Button
    ref={ref}
    type="button"
    variant="outline"
    onClick={handleButtonClick}
    className={cn(
      "flex items-center gap-2 bg-card",
      isDateRangeSelected && "bg-accent", // <-- highlight when selected
      error && "border-red-500 ring-1 ring-red-300",
      disabled && "opacity-50 cursor-not-allowed"
    )}
  >
    <CalendarDays className="h-4 w-4" />
    {formatDateRange(value) || "Date range"}
  </Button>
</PopoverTrigger>


          <PopoverContent
            className="w-auto p-4 space-y-4"
            align="start"
            side="bottom"
            sideOffset={8}
          >
            <Calendar
              mode="range"
              selected={tempRange}
              onSelect={setTempRange}
              numberOfMonths={2}
              defaultMonth={tempRange?.from || new Date()}
              initialFocus
              className="rounded-lg border-0 shadow-sm"
            />

            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
    setTempRange(undefined);     // Clear local state
    onChange?.(undefined);       // Clear form value
    setOpen(false);              // Optionally close popover
  }}
              >
                Reset
              </Button>

              <Button
                variant="default"
                className="flex-1"
                onClick={handleConfirm}
                disabled={!tempRange?.from || !tempRange?.to}
              >
                Select
              </Button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

CusDateRangePicker.displayName = "CusDateRangePicker";

export { CusDateRangePicker };
