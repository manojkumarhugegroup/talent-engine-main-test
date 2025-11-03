"use client";

import * as React from "react";
import { XCircle, Check } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { commonType } from "@/types/masters/masters.type";

interface ScopeOption {
  id: string;
  name: string;
}

interface MultiSelectProps {
  name: string;
  options: commonType[];
  error?: string;
  placeholder?: string;
  label?: string;
  popoverWidth?: string;
}

export function MultiSelectWithChips({
  name,
  options,
  error,
  placeholder = "Select...",
  label,
  popoverWidth = "w-[300px]",
}: MultiSelectProps) {
  const { setValue, watch } = useFormContext();
  const selected: string[] = watch(name) || [];
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!selected) setValue(name, []);
  }, []);

  const isSelected = (value: string) => selected?.includes(value);

  const handleSelect = (value: string) => {
    if (!isSelected(value)) {
      setValue(name, [...selected, value]); // add string
    } else {
      setValue(
        name,
        selected.filter((item) => item !== value) // remove string
      );
    }
  };

  const handleRemove = (value: string) => {
    setValue(
      name,
      selected.filter((item) => item !== value)
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between bg-card",
              error && "border-red-500"
            )}
          >
              <span className="text-muted-foreground">{placeholder}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          align="start"
          className={cn("p-0", popoverWidth)}
        >
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((opt,i) => {
                  const active = isSelected(opt.name);
                  return (
                    <CommandItem
                      key={i}
                      onSelect={() => handleSelect(opt.name)}
                      className="flex items-center justify-between"
                    >
                      <span>{opt.name}</span>
                      {active && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Chips */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selected.map((value) => (
          <Badge
            variant="secondary"
            key={value}
            className="rounded-sm bg-accent px-2 py-0.5 text-xs h-7"
          >
            {value}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="bg-muted ml-1 p-0.5 h-4 w-4 cursor-pointer"
              onClick={() => handleRemove(value)}
            >
              <XCircle className="h-3 w-3 text-red-500" />
            </Button>
          </Badge>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
