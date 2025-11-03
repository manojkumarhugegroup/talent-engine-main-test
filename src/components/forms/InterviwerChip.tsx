"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDown, Check, Plus, XCircle } from "lucide-react";
import { InterviewerType } from "@/types/jobs/Info/kanban/interview-feedback";

interface CusInterviewerSelectProps {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value: InterviewerType[];
  options: InterviewerType[];
  onValueChange: (val: InterviewerType[]) => void;
  placeholder?: string;
  className?: string;
  setSearchInput?: (input: string) => void;
}

export function CusInterviewerSelect({
  label,
  required,
  disabled,
  error,
  value,
  options,
  onValueChange,
  setSearchInput,
  placeholder = "Select interviewer...",
  className,
}: CusInterviewerSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [inputError, setInputError] = React.useState<string | null>(null);

  // Sync search term to parent
  React.useEffect(() => {
    setSearchInput?.(search);
  }, [search]);

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  // Filter options to exclude already selected
  const filteredOptions = React.useMemo(() => {
    const selectedEmails = new Set(value.map((v) => v.email));
    return options.filter((opt) => !selectedEmails.has(opt.email));
  }, [options, value]);

  // Filter options by search text
  const matchingOptions = React.useMemo(() => {
    const lower = search.toLowerCase().trim();
    if (!lower) return filteredOptions;

    return filteredOptions.filter((opt) => {
      const email = opt.email?.toLowerCase() || "";
      const fullName = opt.full_name?.toLowerCase() || "";
      return email.includes(lower) || fullName.includes(lower);
    });
  }, [filteredOptions, search]);

  const handleSelect = (option: InterviewerType) => {
    const newVal: InterviewerType = {
      type: "User",
      full_name: option.full_name,
      email: option.email,
      name: option.name,
      label: option.full_name ?? option.name,
    };
    onValueChange([...value, newVal]);
    setSearch("");
    setInputError(null);
    setOpen(false);
  };

  const handleRemove = (item: InterviewerType) => {
    onValueChange(value.filter((v) => v.email !== item.email));
  };

  const handleAdd = () => {
    const trimmed = search.trim();
    if (!trimmed) return;

    if (!emailRegex.test(trimmed)) {
      setInputError("Invalid email format");
      return;
    }

    const alreadyExists = value.some((v) => v.email === trimmed);
    if (alreadyExists) {
      setInputError("This email is already added");
      return;
    }

    const newEmail: InterviewerType = {
      type: "Email",
      email: trimmed,
      full_name: trimmed,
    };

    onValueChange([...value, newEmail]);
    setSearch("");
    setInputError(null);
    setOpen(false);
  };

  return (
    <div className="w-full space-y-1 pb-2">
      {label && (
        <label
          className={cn(
            "block text-xs font-medium mb-1",
            error ? "text-red-500" : "text-label dark:text-gray-200"
          )}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            role="combobox"
            className={cn(
              "w-full justify-between border-input h-9 rounded-md px-3 text-sm shadow-xs transition-colors",
              "bg-transparent focus-visible:ring-0",
              error && "border-red-500 ring-1 ring-red-300",
              className
            )}
          >
            <span className="text-muted-foreground">{placeholder}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>

        {/* Selected badges */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 mt-1">
            {value.map((item, i) => (
              <Badge
                key={i}
                variant="outline"
                className="rounded-md flex gap-1 items-center border border-slate-300 py-0.5 px-2 text-sm shadow-sm"
              >
                {item.full_name || item.email || item.user}
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemove(item)}
                  className="h-auto w-auto p-0"
                >
                  <XCircle className="w-3.5 h-3.5 cursor-pointer text-red-500 hover:text-foreground" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        <PopoverContent className="w-full p-0">
          <Command className="w-full">
            <CommandInput
              placeholder="Search or enter email..."
              value={search}
              onValueChange={(val) => {
                setSearch(val);
                setInputError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const trimmed = search.trim();
                  if (!matchingOptions.length && trimmed) handleAdd();
                }
              }}
            />

            <CommandList>
              {matchingOptions.length > 0 ? (
                <CommandGroup>
                  {matchingOptions.map((opt) => {
                    const selected = value.some(
                      (v) => v.email === opt.email
                    );
                    return (
                      <CommandItem
                        key={opt.email ?? opt.name}
                        onSelect={() => handleSelect(opt)}
                        className="cursor-pointer"
                      >
                        <div className="flex justify-between w-full">
                          <div>
                            <p className="text-sm font-medium">
                              {opt.full_name ?? opt.name}
                            </p>
                          </div>
                          {selected && <Check className="h-4 w-4" />}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : (
                <div className="p-2 flex flex-col items-start">
                  {search.trim() ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleAdd}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add “{search.trim()}”
                      </Button>
                      {inputError && (
                        <p className="text-xs text-red-500 mt-1">
                          {inputError}
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground px-2">
                      No results.
                    </span>
                  )}
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
