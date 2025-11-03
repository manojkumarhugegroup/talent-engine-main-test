"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ListFilter,
  MessageCircleMore,
  MoreVertical,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import InfoTable, {
  ActionMenuItem,
  EnhancedColumnDef,
  SortableHeader,
} from "@/components/shared/InfoTable";
import { StatCard } from "@/components/shared/StatCard";
import { CandidateSummaryTypes } from "@/types/jobs/info.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CountType } from "@/types/jobs/Info/Summary.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CandidateCard } from "./CandidateCard";
import { Separator } from "@/components/ui/separator";
import { CircularProgress } from "@/components/shared/CircularProgress";
import { CusDateRangePicker } from "@/components/forms/CusDateRangePicker";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import debounce from "lodash.debounce";
import { useForm, Controller, useWatch } from "react-hook-form";
import Image from "next/image";
import HistoryDrawer from "@/components/(resource-requirement)/shared/HistoryDrawer";
import ProfileDrawer from "@/components/(resource-requirement)/shared/ProfileDrawer";
import { candidateStats } from "../../../utils";
import { useSearchParams } from "next/navigation";
import { SearchComp } from "@/components/shared/SearchComp";
import { formatDate2Word } from "@/lib/utils";
import { History } from "lucide-react";

interface RrInfoProps {
  setFullscreenSection?: (section: string | null) => void;
  isFull?: boolean;
}

type DateRange = {
  from: string | null;
  to: string | null;
};

export default function MainInfo({ isFull }: RrInfoProps) {
  const search = useSearchParams();
  const jobID = search.get("d");

  const [count, setCount] = useState<CountType | null>(null);
  const [data, setData] = useState([]);
  const [countLoading, setCountLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [orderType, setOrderType] = useState<"asc" | "desc" | null>("asc");
  const [orderField, setOrderField] = useState<string>("candidateInfo");
  const [searchInput, setSearchInput] = useState<string>("");
  const [openFilter, setOpenFilter] = useState(false);
  const defaultMatchScoreRange = [0, 100];
  const [matchScoreRange, setMatchScoreRange] = useState(
    defaultMatchScoreRange
  );
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const isRangeSelected =
    matchScoreRange[0] !== defaultMatchScoreRange[0] ||
    matchScoreRange[1] !== defaultMatchScoreRange[1];

  const isseletedStage = selectedStage !== null;

  const stageOptions = [
    { value: "Shortlisted", label: "Shortlisted" },
    { value: "Onboarded", label: "Onboarded" },
    { value: "Received", label: "Received" },
    { value: "selected", label: "selected" },

    // add more stages here
  ];

  const handleResetFilters = () => {
    setSelectedStage(null);
    setMatchScoreRange(defaultMatchScoreRange);
    setSearchInput("");
    setOpenFilter(false);
    setValue("date_range", undefined);
  };

  const onSelectStage = (val: string) => {
    setSelectedStage(val);
  };

  const { control, watch, handleSubmit, setValue } = useForm({
    defaultValues: {
      date_range: undefined, // or null, as you prefer
    },
  });

  // Then, to watch the date_range field:
  const selectedDateRange = useWatch({
    control,
    name: "date_range",
  });

  const handleSliderChange = useCallback(
    debounce((val: [number, number]) => {
      setMatchScoreRange(val);
    }, 30),
    []
  );

  const handlePaginationChange = (
    newPageIndex: number,
    newPageSize: number
  ) => {
    setPageNumber(newPageIndex);
    setPageSize(newPageSize);
  };

  const handleSortChange = (field: string, type: "asc" | "desc" | null) => {
    setOrderField(field);
    setOrderType(type);
  };

  const fetchCount = async () => {
    setCountLoading(true);
    try {
      const res = await fetch(`/api/rr/info/summary?job_id=${jobID}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setCount(data?.data?.candidate_count ?? null);
    } catch (err) {
      console.error("Failed to fetch count:", err);
      setCount(null);
    } finally {
      setCountLoading(false);
    }
  };

  const fetchData = async () => {
    setDataLoading(true);
    try {
      // &stage=${selectedStage}&from=${matchScoreRange[0]===0?null:matchScoreRange[0]}&to=${matchScoreRange[1]}
      const res = await fetch(
        `/api/rr/info/summary/list?job_id=${jobID}&search=${searchInput}&stage=${
          selectedStage === null ? "" : selectedStage
        }&limit=${pageSize}&status=`,
        {
          cache: "no-store",
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const dd = data?.data || [];
      setData(dd || []);
      // setTotalCount(data?.message.total_candidates);
    } catch (err) {
      console.error("Failed to fetch count:", err);
      setData([]);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (!jobID) {
      return;
    }
    fetchCount();
  }, [jobID]);

  useEffect(() => {
    fetchData();
  }, [
    pageNumber,
    pageSize,
    jobID,
    searchInput,
    selectedStage,
    matchScoreRange,
  ]);

  const filterComponents = useMemo(
    () => (
      <div className="flex items-center gap-2">
        {/* Search input with icon button */}
        <SearchComp onSearch={setSearchInput} placeholder="Type to search..." />

        {/* Toggle button that switches icons based on openFilter state */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenFilter((prev) => !prev)}
        >
          {openFilter ? (
            <Image
              src="/assets/icons/time sheet/disabled-filter.png"
              alt="disabled-filter"
              className=""
              width={13}
              height={13}
            />
          ) : (
            <ListFilter className="h-4 w-4" />
          )}
        </Button>
      </div>
    ),
    [searchInput, openFilter]
  );

  const expandedFilter = (
    <div
      className={`flex items-center justify-end gap-3 transition-all duration-300 overflow-hidden ${
        openFilter ? "max-h-40 opacity-100 pt-2" : "max-h-0 opacity-0"
      }`}
    >
      <Button variant="ghost" onClick={handleResetFilters} className="p-0">
        <RotateCcw className="w-5 h-5 text-gray-500 hover:text-gray-800" />
      </Button>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`flex items-center bg-card ${
              isRangeSelected ? "bg-accent" : ""
            }`}
          >
            <ListFilter className=" h-4 w-4" />
            Match Score
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[300px] bg-card space-y-4 border border-gray-300 rounded-md p-3 mt-1 z-900">
          <div className="space-y-2">
            <h1 className="font-bold text-base">Select the Range</h1>

            <Slider
              value={matchScoreRange}
              onValueChange={handleSliderChange}
              onValueCommit={(val) => {
                console.log("Committed:", val);
              }}
              min={0}
              max={100}
              step={1}
            />

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Min: {matchScoreRange[0]}</span>
              <span>Max: {matchScoreRange[1]}</span>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setMatchScoreRange(defaultMatchScoreRange)}
              >
                Reset
              </Button>

              <Button
                variant="default"
                onClick={() => {
                  console.log("Final Match Score Range:", matchScoreRange);
                  setIsPopoverOpen(false);
                }}
              >
                Select
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Controller
        name="date_range"
        control={control}
        rules={{
          required: "Date range is required",
          validate: (val: DateRange | undefined) =>
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
          />
        )}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`flex items-center bg-card ${
              isseletedStage ? "bg-accent" : ""
            }`}
          >
            <ListFilter className=" h-4 w-4" />
            {stageOptions.find((opt) => opt.value === selectedStage)?.label ||
              "Select Stage"}
            {/* Optional: add a chevron icon here */}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[200px] bg-card border border-gray-300 rounded-md p-1 mt-1">
          {stageOptions.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onSelect={() => onSelectStage(opt.value)}
              className={`cursor-pointer p-2 rounded ${
                selectedStage === opt.value ? "bg-blue-100 text-blue-700" : ""
              }`}
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const [candidateSingleData, setcandidateSingleData] =
    useState<CandidateSummaryTypes | null>(null);
  const [candidateSingle, setcandidateSingle] = useState(false);

  const handleOpenHistroy = (candidate: CandidateSummaryTypes) => {
    setcandidateSingle(true);
    setcandidateSingleData(candidate);
  };

  const handleCloseHistroy = (isOpen: boolean) => {
    setcandidateSingle(false);
    setcandidateSingleData(null);
  };

  const columns: EnhancedColumnDef<CandidateSummaryTypes>[] = [
    {
      accessorKey: "candidateInfo",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label="Candidate Info"
          field="candidateInfo"
        />
      ),
      field: "candidateInfo",
      minWidth: 200,
      maxWidth: 280,
      cell: ({ row }) => {
        const candidate = row.original;
        return (
          <div className="flex justify-between items-center gap-3 w-full">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage
                  src={candidate.avatar || "/assets/icons/placeholder.svg"}
                  alt={candidate.name}
                />
                <AvatarFallback>{candidate.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <ProfileDrawer candidateId={candidate?.candidate_id} />
                <div className="font-medium text-gray-900 max-w-40 truncate">
                  {candidate.name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-0 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="max-w-8 max-h-8  "
                      onClick={() =>
                        console.log("Message:", candidate.candidate_id)
                      }
                    >
                      <MessageCircleMore className="w-4 h-4 text-blue-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="max-w-8 max-h-8 focus-visible:ring-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => console.log("View:", candidate.candidate_id)}
                  >
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => console.log("Edit:", candidate.candidate_id)}
                  >
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      console.log("Delete:", candidate.candidate_id)
                    }
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "match_score",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label="Match Score"
          field="match_score"
        />
      ),
      field: "match_score",
      minWidth: 60,
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-medium text-center cursor-pointer py-0">
                <CircularProgress
                  value={row.getValue("match_score") || 0}
                  size={40}
                  strokeWidth={3}
                />

                {/* <span className="">{row.getValue("match_score")}%</span> */}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-transparent p-0 z-50"
              arrowClassName="bg-card shadow-r-lg shadow-b-lg border-r-2 border-b-2"
            >
              <CandidateCard
                description={row.original.summary}
                skills={
                  Array.isArray(row?.original?.keySkills)
                    ? row.original.keySkills.map((skill: any) => ({
                        name: skill ?? "",
                        value: skill?.type ?? 0,
                      }))
                    : []
                }
              />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "projects",
      header: ({ column }) => (
        <SortableHeader column={column} label="Projects" field="projects" />
      ),
      field: "projects",
      minWidth: 120,
      cell: ({ row }) => {
        return (
          <div className="text-label capitalize max-w-60 truncate px-2">
            {row.getValue("projects")}
          </div>
        );
      },
    },
    {
      accessorKey: "available_date",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label="Available Date"
          field="available_date"
        />
      ),
      field: "available_date",
      minWidth: 140,
      cell: ({ row }) => (
        <div className="text-label px-2">
          {formatDate2Word(row.getValue("available_date"))}
        </div>
      ),
    },
    {
      accessorKey: "processing_stage",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label="Processing Stage"
          field="processing_stage"
        />
      ),
      field: "processing_stage",
      minWidth: 120,
      cell: ({ row }) => {
        const status = row.original.processing_stage || "";
        return (
          <div className="px-2">
            <Badge
              style={{
                backgroundColor: `var(--${status}-light)`,
                color: `var(--${status})`,
                border: `1px solid var(--${status})`,
                textTransform: "capitalize",
              }}
              variant="outline"
            >
              {row.original.processing_stage}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "History",
      cell: ({ row }) => {
        const candidate = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenHistroy(candidate)}
          >
            <History className="text-muted-foreground hover:text-[#4C4E6D]" />
          </Button>
        );
      },
    },
  ];

  const actionMenuItems: ActionMenuItem<CandidateSummaryTypes>[] = [
    {
      label: "Copy user ID",
      onClick: (user: CandidateSummaryTypes) => {
        console.log("Copied ID:", user.candidate_id);
      },
    },
    {
      label: "View customer",

      onClick: (user: CandidateSummaryTypes) => {
        console.log("View customer for:", user);
      },
      separator: true,
    },
    {
      label: "View user details",
      onClick: (user: CandidateSummaryTypes) => {
        console.log("View details for:", user);
      },
    },
  ];

  const handleRowSelectionChange = (selectedRows: CandidateSummaryTypes[]) => {
    console.log("Selected rows:", selectedRows);
    console.log(
      "Selected IDs:",
      selectedRows.map((row) => row.candidate_id)
    );
  };

  return (
    <>
      <div className={`px-4`}>
        <div className={` flex justify-between items-center pt-1 mb-2`}>
          <h2 className="text-lg font-semibold">Candidate Summary</h2>
        </div>
        {isFull && <Separator className="my-2" />}
        <div className="grid grid-cols-7 gap-4">
          {candidateStats.map((stat, i) => (
            <StatCard
              key={i}
              textColor={stat.color}
              bgColor={stat.bgColor}
              icon={stat.icon}
              label={stat.label}
              value={count?.[stat.key] ?? 0}
              loading={countLoading}
            />
          ))}
        </div>

        <div className="">
          <InfoTable
            data={Array.isArray(data) ? data : [data]}
            columns={columns}
            enableRowSelection={false}
            enablePagination
            enableSorting
            enableFiltering
            onFilterInputChange={(value) => {
              console.log("Search input value:", value);
            }}
            actionMenuItems={actionMenuItems}
            onRowSelectionChange={handleRowSelectionChange}
            onSortChange={handleSortChange}
            orderType={orderType}
            orderField={orderField}
            pageSizeOptions={[25, 50, 100]}
            stickyStart={1}
            stickyEnd={0}
            showActionColumn={false}
            loading={dataLoading}
            title={"List"}
            onPaginationChange={handlePaginationChange}
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalCount={totalCount}
            tableHeight="calc(56vh - 40px)"
            filterComponents={filterComponents}
            expandatedFilter={expandedFilter}
          />
        </div>

        {candidateSingle && candidateSingleData && (
          <HistoryDrawer
            candidate={candidateSingleData}
            candidate_open={candidateSingle}
            candidate_action={handleCloseHistroy}
          />
        )}
      </div>
    </>
  );
}
