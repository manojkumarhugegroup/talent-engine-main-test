"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TextPopoverProps {
  text?: string;
  heading?: string;
  caseStyle?: "uppercase" | "lowercase" | "capitalize" | "none";
  fontSize?: string;
  fontWeight?: string | number;
}

export function TextPopover({
  text = "",
  heading,
  caseStyle = "none",
  fontSize = "text-sm",
  fontWeight,
}: TextPopoverProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [open, setOpen] = React.useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: event.clientX + 10, y: event.clientY + 10 });
  };

  return (
    <div className="flex items-center gap-1">
      {heading && (
        <span className="text-[13px] font-normal text-muted-foreground whitespace-nowrap">
          {heading}
        </span>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <span
            className={cn(
              "max-w-[200px] truncate whitespace-nowrap cursor-default",
              caseStyle !== "none" && caseStyle,
              fontSize,
              heading ? "font-semibold" : fontWeight ? `font-[${fontWeight}]` : "font-medium"
            )}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onMouseMove={handleMouseMove}
          >
            {text || "---"}
          </span>
        </PopoverTrigger>
        {text && (
          <PopoverContent
            align="start"
            side="right"
            sideOffset={5}
            className="rounded-md border border-gray-200 bg-card px-2 py-1 shadow-md text-sm max-w-[300px]"
            style={{
              position: "fixed",
              top: mousePosition.y,
              left: mousePosition.x,
            }}
          >
            <span className={cn(caseStyle !== "none" && caseStyle)}>{text}</span>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
