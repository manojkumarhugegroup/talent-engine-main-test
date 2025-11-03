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
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDown, Check, Plus, XCircle } from "lucide-react";
import { InterviewerType } from "@/types/jobs/Info/kanban/interview-feedback";
import { useDataContext } from "@/context/DataProvider";

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
}

export function CusInterviewerSelect({
  label,
  required,
  disabled,
  error,
  value,
  options,
  onValueChange,
  placeholder = "Select interviewer...",
  className,
}: CusInterviewerSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [inputError, setInputError] = React.useState<string | null>(null);

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  // Filter out already selected ones
  const filteredOptions = React.useMemo(() => {
    const selectedEmails = new Set(value.map((v) => v.email));
    const selectedUsers = new Set(value.map((v) => v.user));
    return options.filter(
      (opt) =>
        (!opt.email || !selectedEmails.has(opt.email)) &&
        (!opt.user || !selectedUsers.has(opt.user))
    );
  }, [options, value]);

  const handleSelect = (option: InterviewerType) => {
    const newVal ={
            type: "User",
            user: option.email!,
            // email: option.email,
            // name: option.name,
            // label: option.label,
          };
    // const newVal =
    //   option.email && !option.user
    //     ? {
    //         type: "Email",
    //         email: option.email,
    //         // name: option.name,
    //         // user: option.email,
    //         // label: option.label,
    //       }
    //     : {
    //         type: "User",
    //         user: option.user!,
    //         // email: option.email,
    //         // name: option.name,
    //         // label: option.label,
    //       };
    onValueChange([...value, newVal]);
    setSearch("");
    setInputError(null);
    setOpen(false);
  };

  const handleRemove = (item: InterviewerType) => {
    onValueChange(
      value.filter((v) => {
        const sameUser = v.user && item.user && v.user === item.user;
        const sameEmail = v.email && item.email && v.email === item.email;
        return !(sameUser || sameEmail);
      })
    );
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

    const newEmail = {
      type: "Email",
      email: trimmed,
      // user: "",
      // name: trimmed,
      // label: trimmed,
    };
    onValueChange([...value, newEmail]);
    setSearch("");
    setInputError(null);
    setOpen(false);
  };

  const matchingOptions = React.useMemo(() => {
    const lower = search.toLowerCase().trim();
    if (!lower) return filteredOptions;

    return filteredOptions.filter((opt) => {
      const email = opt.email?.toLowerCase() || "";
      const user = opt.user?.toLowerCase() || "";
      const name = opt.name?.toLowerCase() || "";

      // match on ANY field, including partials in email
      return (
        email.includes(lower) || user.includes(lower) || name.includes(lower)
      );
    });
  }, [filteredOptions, search]);

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

      {/* Popover Trigger */}
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
        {/* Selected Chips */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {value.map((item, i) => (
              <Badge
                key={i}
                variant="outline"
                className="rounded-md flex gap-1 items-center border border-slate-300 py-0.5 px-2 text-center text-sm transition-all shadow-sm mt-1"
                // className="flex items-center gap-1 text-sm px-2 py-1"
              >
                {item.user || item.email}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemove(item)}
                  className="h-auto w-auto"
                >
                  <XCircle className="w-3.5 h-3.5 cursor-pointer text-red-500 hover:text-foreground " />
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
                  const trimmed = search.trim();
                  const hasMatch = matchingOptions.length > 0;

                  // if user typed something not matching and Add button visible
                  if (trimmed && !hasMatch) {
                    e.preventDefault();
                    handleAdd();
                  }
                  // otherwise let Command handle selection naturally
                }
              }}
            />
            {/* <CommandList>
              <CommandEmpty className="py-0">
                {search.trim() ? (
                  <div className="p-2 flex flex-col items-start">
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
                      <p className="text-xs text-red-500 mt-1">{inputError}</p>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground px-2">
                    No results.
                  </span>
                )}
              </CommandEmpty>

              <CommandGroup>
                {matchingOptions.map((opt) => {
                  const selected = value.some((v) =>
                    opt.email ? v.email === opt.email : v.user === opt.user
                  );
                  return (
                    <CommandItem
                      key={opt.name}
                      onSelect={() => handleSelect(opt)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {opt.user || opt.email}
                        </span>
                        {(opt.email && opt.user) ? (
                          <span className="text-xs text-muted-foreground">
                            {opt.email}
                          </span>
                        ):
                        (
                          <span className="text-xs text-muted-foreground">
                            {opt.type}
                          </span>
                        )}
                      </div>
                        {selected && <Check className="h-4 w-4" />}
                     
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList> */}
            <CommandList>
              {matchingOptions.length > 0 ? (
                <CommandGroup>
                  {matchingOptions.map((opt) => {
                    const selected = value.some((v) =>
                      opt.email ? v.email === opt.email : v.user === opt.user
                    );

                    return (
                      <CommandItem
                        key={opt.name}
                        onSelect={() => handleSelect(opt)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <p className="text-sm font-medium">
                              {opt.user || opt.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {opt.email && opt.user ? opt.email : opt.type}
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
