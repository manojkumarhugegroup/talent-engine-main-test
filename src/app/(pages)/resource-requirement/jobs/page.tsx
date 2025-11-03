"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateButton } from "@/components/buttons/CreateButton";
import JobListing from "@/components/(resource-requirement)/jobs/JobListing";
import { SearchComp } from "@/components/shared/SearchComp";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ListFilter, ChevronDown, FilterX, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { CusDateRangePicker } from "@/components/forms/CusDateRangePicker";
import Image from "next/image";

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<number>(0);
  const [showExtraButtons, setShowExtraButtons] = useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState("open");
  const { control, handleSubmit } = useForm();

  const handleFilterClick = () => {
    setShowExtraButtons((prev) => !prev);
  };
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };
    const handleRefresh = () => {
    setShowExtraButtons(false);
    setSelectedStatus("open");
    setSelectedType(0);
    setSearchTerm("");
  };

  const status = [
    { value: "open", label: "Open" },
    { value: "draft", label: "Draft" },
    { value: "closed", label: "Closed" },
  ];

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam) {
      const typeValue = parseInt(typeParam, 10);
      if (!isNaN(typeValue) && (typeValue === 0 || typeValue === 1)) {
        setSelectedType(typeValue);
      }
    }
  }, [searchParams]);

  const handleTypeChange = (type: number) => {
    setSelectedType(type);
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const typeOptions = [
    { value: 0, label: "My Jobs" },
    { value: 1, label: "Created by Me" },
  ];

  return (
    <div className="w-full h-full">
      <div className="flex justify-between pb-2">
        <CreateButton
          label="Jobs"
          createPrivilege={true}
          path="/resource-requirement/jobs/action/ai"
        />

        <div className="flex gap-2">
          <Button
            title="refresh"
            variant="outline"
            className="cursor-pointer flex items-center bg-card"
            onClick={handleRefresh}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <SearchComp
            onSearch={setSearchTerm}
            placeholder="Type to search..."
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="focus-visible:border-gray-400 focus-visible:ring-[0px] bg-card"
            >
              <Button variant="outline" className="flex items-center gap-2">
                {typeOptions.find((opt) => opt.value === selectedType)?.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {typeOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleTypeChange(option.value)}
                  className={selectedType === option.value ? "bg-accent" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            title={
              showExtraButtons
                ? "hide remaining filters"
                : "show remaining filters"
            }
            className="cursor-pointer flex items-center bg-card"
            onClick={handleFilterClick}
          >
            {showExtraButtons ? (
              <Image
                src="/assets/icons/time sheet/disabled-filter.png"
                alt="disabled-filter"
                className="mr-1"
                width={12}
                height={12}
              />
            ) : (
              <ListFilter className="mr-2 h-4 w-4" />
            )}
            Filter
          </Button>
        </div>
      </div>

      {/* Expandable options container */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          showExtraButtons
            ? "max-h-[200px] opacity-100 py-2" // increased max-h
            : "max-h-0 opacity-0 py-0"
        )}
      >
        <div className="flex justify-end items-center gap-3">
          <Controller
            name="date_range"
            control={control}
            rules={{
              required: "Date range is required",
              validate: (val) =>
                val?.from && val?.to
                  ? val.from <= val.to || "Start date cannot be after end date"
                  : "Both dates must be selected",
            }}
            render={({ field, fieldState }) => (
              <CusDateRangePicker
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                placeholder="Date Range"
                className="flex items-center bg-card rounded-lg"
              />
            )}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-card border-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
              >
                <ListFilter className="mr-2 h-4 w-4" />
                {status.find((opt) => opt.value === selectedStatus)?.label ||
                  "Select status"}
                {/* Uncomment if you want the arrow icon */}
                {/* <ChevronDown className="h-4 w-4 text-[#243BB1]" /> */}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              {status.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className="h-max-auto"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* <Button variant="secondary" className="flex items-center bg-card">
            Option 3
          </Button> */}
        </div>
      </div>

      <JobListing
        type={selectedType}
        search={searchTerm}
        status={selectedStatus}
      />
    </div>
  );
}
