import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ListFilter, RotateCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import InfoTable, {
  EnhancedColumnDef,
  SortableHeader,
} from "@/components/shared/InfoTable";
import { CandidateSummaryTypes } from "@/types/jobs/info.types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useCallback, useMemo } from "react";
import { CountType } from "@/types/jobs/Info/Summary.type";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import Image from "next/image";
import { MatchScoreDrawer } from "./MatchscoreDrawer";
import CandidateSearchForm from "./CandidateSearchForm";
import { Slider } from "@/components/ui/slider";
import debounce from "lodash.debounce";
import { isAfter } from "date-fns";
import { CusDateRangePicker } from "@/components/forms/CusDateRangePicker";
import { useForm, Controller, useWatch } from "react-hook-form";
import { format } from "date-fns";
import MatchScoreCell from "./MatchScoreCell";
import PopupModel from "./PopupModel";
import ProfileDrawer from "../../../../shared/ProfileDrawer";

interface RrInfoProps {
  setFullscreenSection?: (section: string | null) => void;
  isFull?: boolean;
}

interface ActionComponentsProps {
  tab: string;
  selectedRows?: any[] | null;
  onRemoveSelected: () => void;
}

type DateRange = {
  from: Date | null;
  to: Date | null;
};

function Sourcing({ isFull, setFullscreenSection }: RrInfoProps) {
  const [count, setCount] = useState<CountType | null>(null);
  const [data, setData] = useState([]);
  const [countLoading, setCountLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [orderType, setOrderType] = useState<"asc" | "desc" | null>("asc");
  const [orderField, setOrderField] = useState<string>("candidateInfo");
  const [tab, setTab] = useState("suggested");
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = React.useState<any | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedRows, setSelectedRows] = useState<CandidateSummaryTypes[]>([]);
  const [selectedRowsId, setSelectedRowsId] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const defaultMatchScoreRange = [0, 100];
  const [matchScoreRange, setMatchScoreRange] = useState(
    defaultMatchScoreRange
  );
  const [openPopup, setOpenPopup] = React.useState(false)
const [selectedCount, setSelectedCount] = React.useState(0)

  // Fixed: Move popup state to component level and track which candidate
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<
    string | null
  >(null);
  const [requestedCandidates, setRequestedCandidates] = useState<string[]>([]);

  const isRangeSelected =
    matchScoreRange[0] !== defaultMatchScoreRange[0] ||
    matchScoreRange[1] !== defaultMatchScoreRange[1];
  console.log("range selected", isRangeSelected);

  const { control, watch, handleSubmit, setValue } = useForm({
    defaultValues: {
      date_range: undefined,
    },
  });

  const selectedDateRange = useWatch({
    control,
    name: "date_range",
  });

  console.log(selectedDateRange, "selectedDateRange");

  const [errors, setErrors] = useState<{ start?: string; end?: string }>({});

  const handleSearchSubmit = (formData: any) => {
    console.log("Form Data Received in Parent:", formData);
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "";
    if (range.to) {
      return `${format(range.from, "MMM dd, yyyy")} - ${format(
        range.to,
        "MMM dd, yyyy"
      )}`;
    }
    return format(range.from, "MMM dd, yyyy");
  };

  const validateDates = () => {
    let valid = true;
    const newErrors: typeof errors = {};

    if (!startDate) {
      newErrors.start = "Start date is required";
      valid = false;
    }

    if (!endDate) {
      newErrors.end = "End date is required";
      valid = false;
    }

    if (startDate && endDate && isAfter(startDate, endDate)) {
      newErrors.start = "Start date cannot be after end date";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSliderChange = useCallback(
    debounce((val: [number, number]) => {
      setMatchScoreRange(val);
    }, 30),
    []
  );

  const jobStatuses = [
    { jobId: "JOB-2025-025", status: "Interview" },
    { jobId: "JOB-2025-024", status: "Selected" },
  ];

  const handleTabChange = useCallback((value: string) => {
    console.log("Selected tab:", value);
    setTab(value);
    setSelectedRows([]);
    setSelectedRowsId([]);
  }, []);

  const handlePaginationChange = useCallback(
    (newPageIndex: number, newPageSize: number) => {
      setPageNumber(newPageIndex);
      setPageSize(newPageSize);
    },
    []
  );

  const handleSortChange = useCallback(
    (field: string, type: "asc" | "desc" | null) => {
      setOrderField(field);
      setOrderType(type);
    },
    []
  );

  const handleResetFilters = () => {
    setMatchScoreRange(defaultMatchScoreRange);
    setSearchInput("");
    setSearchFilter("");
    setOpenFilter(false);
    setValue("date_range", undefined);
  };

  // Fixed: Handlers for popup modal
  const handleRequestClick = useCallback((id: string) => {
    console.log("id", id);

      setRequestedCandidates((prev) => [...prev, id])


    setSelectedCandidateForModal(id);
    setShowModal(true);
  }, []);

  const handleModalSubmit = useCallback(
    (attachSummary: boolean) => {
      if (selectedCandidateForModal) {
        setRequestedCandidates((prev) => [...prev, selectedCandidateForModal]); // just push it

        console.log("Attach summary?", attachSummary);
        console.log("Requested for candidate:", selectedCandidateForModal);
      }

      setShowModal(false);
      setSelectedCandidateForModal(null);
    },
    [selectedCandidateForModal]
  );

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setSelectedCandidateForModal(null);
  }, []);

  const fetchCount = async () => {
    setCountLoading(true);
    try {
      const res = await fetch(`/api/rr/info/summary?jobId=123`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setCount(data?.candidate_count ?? null);
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
      const res = await fetch(`/api/rr/info/summary/list?jobId=123`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setData(data.data);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error("Failed to fetch count:", err);
      setData([]);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
    fetchData();
  }, [pageNumber, pageSize]);

  const handleRowSelectionChange = useCallback(
    (selectedRows: CandidateSummaryTypes[]) => {
      setSelectedRowsId(selectedRows.map((row) => row.candidate_id));
      setSelectedRows(selectedRows);
      console.log("Selected rows:", selectedRows);
      console.log(
        "Selected IDs:",
        selectedRows.map((row) => row.candidate_id)
      );
    },
    []
  );

  const handleSearch = useCallback(() => {
    setSearchFilter(searchInput);
  }, [searchInput]);

  const handleRemoveSelected = useCallback(() => {
    console.log("Remove button clicked. Remove these items:", selectedRows);
    setSelectedRows([]);
    setSelectedRowsId([]);
  }, [selectedRows]);

  const filterComponents = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <div className="relative">
          <Input
            placeholder="Search..."
            defaultValue={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="max-w-sm focus-visible:border-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400 pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 p-1.5"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenFilter((prev) => !prev)}
        >
          {openFilter ? (
            <Image
              src="/assets/icons/time sheet/disabled-filter.png"
              alt="disabled-filter"
              width={13}
              height={13}
            />
          ) : (
            <ListFilter className="h-4 w-4" />
          )}
        </Button>
      </div>
    ),
    [searchInput, handleSearch, openFilter]
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
      {tab !== "manual" ? (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`flex items-center bg-card ${
                isRangeSelected ? "bg-accent" : ""
              }`}
            >
              <ListFilter className="h-4 w-4" />
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
      ) : null}

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
    </div>
  );

  const ActionComponents = useMemo(() => {
    const Component: React.FC<ActionComponentsProps> = ({
      tab,
      selectedRows,
      onRemoveSelected,
    }) => {
      const count = Array.isArray(selectedRows) ? selectedRows.length : 0;

      if (tab === "manual") {
        if (count > 0) {
          return (
            <div className="flex items-center gap-2">
              <Button>Move to Sourced ({count})</Button>
            </div>
          );
        } else {
          return (
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowForm(true)}>
                Go to Search query
              </Button>
            </div>
          );
        }
      }

      if (tab === "suggested") {
        if (count > 0) {
          return (
            <div className="flex items-center gap-2">
              <Button>Move to Sourced ({count})</Button>
            </div>
          );
        }
        return null;
      }

      if (tab === "sourced") {
        if (count > 0) {
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="default"
                className="border-(--primary-active) text-(--primary-active) bg-transparent hover:text-(--primary-active) flex items-center gap-1"
                onClick={onRemoveSelected}
              >
                Cancel
              </Button>
              <Button onClick={() => setOpenPopup(true)}>
                Submit to Client ({count})
              </Button>
            </div>
          );
        }
        return null;
      }

      return null;
    };

    return Component;
  }, []);

  const columns: EnhancedColumnDef<CandidateSummaryTypes>[] = useMemo(
    () => [
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
              <div className="flex items-center gap-3 flex-1 min-w-0 ">
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
                        className="max-w-8 max-h-8 p-2 h-auto w-auto"
                        onClick={() =>
                          console.log("Message:", candidate.candidate_id)
                        }
                      >
                        <Image
                          src="/assets/icons/job-info/exclametry_icon.svg"
                          alt="job-info"
                          width={15}
                          height={15}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      className="bg-card p-0 m-0"
                      side="bottom"
                      align="start"
                      sideOffset={1}
                      arrowClassName="bg-hidden p-0 m-0"
                    >
                      <div className="space-y-2 bg-card">
                        <div className="p-2 w-[200px] rounded-md shadow-md bg-card border">
                          {jobStatuses.map((job) => (
                            <div
                              key={job.jobId}
                              className="flex items-center justify-between gap-2 px-2 py-1 rounded hover:bg-muted"
                            >
                              <span className="text-xs font-medium text-gray-700">
                                {job.jobId}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                                  job.status === "Interview"
                                    ? "text-blue-600 border-blue-600"
                                    : "text-emerald-600 border-emerald-600"
                                }`}
                              >
                                {job.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
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
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() =>
                        console.log("View:", candidate.candidate_id)
                      }
                    >
                      <Image
                        src="/assets/icons/job-info/call_icon.svg"
                        alt="call"
                        width={20}
                        height={20}
                      />
                      Call
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        console.log("Edit:", candidate.candidate_id)
                      }
                    >
                      <Image
                        src="/assets/icons/job-info/email_icon.svg"
                        alt="email"
                        width={20}
                        height={20}
                      />
                      Email
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        console.log("Delete:", candidate.candidate_id)
                      }
                    >
                      <Image
                        src="/assets/icons/job-info/message_icon.svg"
                        alt="message"
                        width={20}
                        height={20}
                      />
                      Message
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        },
      },
      ...(tab !== "manual"
        ? [
            {
              accessorKey: "match_score",
              header: ({ column }: { column: any }) => (
                <SortableHeader
                  column={column}
                  label="Match Score"
                  field="match_score"
                />
              ),
              field: "match_score",
              minWidth: 60,
              cell: ({ row }: { row: any }) => (
                <MatchScoreCell
                  row={row}
                  tab={tab}
                  onRowSelect={(r) => setSelectedRow(r)}
                  setOpen={(val) => setOpen(val)}
                />
              ),
            },
          ]
        : []),

      {
        accessorKey: "projects",
        header: ({ column }) => (
          <SortableHeader column={column} label="Projects" field="projects" />
        ),
        field: "projects",
        minWidth: 120,
        cell: ({ row }) => {
          const projects = row.getValue("projects") as { name: string }[];
          const firstProjectName = projects?.[0]?.name ?? "—";

          return (
            <div className="text-label capitalize max-w-60 truncate px-2">
              {firstProjectName}
            </div>
          );
        },
      },
       ...(tab == "sourced"
        ? [
      {
        accessorKey: "available_date",
        header: ({ column }:any) => (
          <SortableHeader
            column={column}
            label="Available Date"
            field="available_date"
          />
        ),
        field: "available_date",
        minWidth: 140,
        cell: ({ row }:any) => (
          <div className="text-label px-2">
            {row.getValue("available_date")}
          </div>
        ),
      }]:[]),
      ...(tab === "sourced"
        ? [
            {
              accessorKey: "expected_rate",
              header: "Expected Salary",
              width: 120,
              cell: ({ row }: any) => {
                const expectedSalary = row.original.expected_rate;
                return (
                  <div className="px-2">
                    <span>{expectedSalary}</span>
                  </div>
                );
              },
            },
          ]
        : []),
      {
        accessorKey: "current_company_info",
        header: "Current Company Info",
        width: 120,
        cell: ({ row }) => {
          const projectName = row.original.name;
          const currentRole = row.original.current_role;

          return (
            <div className="text-label  capitalize max-w-60 flex flex-col truncate px-2">
              <span className="font-semibold ">{projectName}</span>
              <span>{currentRole}</span>
            </div>
          );
        },
      },
      ...(tab === "sourced"
        ? [
            {
              accessorKey: "candidate_acceptance",
              header: ({ column }: { column: any }) => (
                <SortableHeader
                  column={column}
                  label="Candidate Acceptance"
                  field="candidate_acceptance"
                />
              ),
              field: "candidate_acceptance",
              minWidth: 200,
              cell: ({ row }: { row: any }) => {
                const id = row.original.id;
                const isRequested = requestedCandidates.includes(id);
                console.log(isRequested, "isRequested", requestedCandidates);

                return (
                  <div className="text-label px-2">
                    {isRequested ? (
                      <span className="text-[#E38E00] text-sm">
                        Awaiting candidate acceptance
                      </span>
                    ) : (
                      <Button size="sm" onClick={() => handleRequestClick(id)}>
                        Request
                      </Button>
                    )}
                  </div>
                );
              },
            },
          ]
        : []),
    ],
    [tab, selectedRow, requestedCandidates, handleRequestClick]
  );

  return (
    <div className="w-full space-y-4">
      {showForm ? (
        <CandidateSearchForm
          onCancel={() => setShowForm(false)}
          onSearch={handleSearchSubmit}
        />
      ) : (
        <>
          {tab === "sourced" && selectedRow && (
            <MatchScoreDrawer
              openDrawer={open}
              onOpenChange={(val) => setOpen(val)}
              row={selectedRow}
              score={selectedRow.getValue("match_score") || 0}
              tab={tab}
            />
          )}

          <div className="px-4">
            <InfoTable
              data={Array.isArray(data) ? data : [data]}
              columns={columns}
              enableRowSelection={true}
              enablePagination
              enableSorting
              enableFiltering
              onFilterInputChange={(value) => {
                console.log("Search input value:", value);
              }}
              onRowSelectionChange={handleRowSelectionChange}
              onSortChange={handleSortChange}
              orderType={orderType}
              orderField={orderField}
              pageSizeOptions={[25, 50, 100]}
              stickyStart={2}
              stickyEnd={0}
              showActionColumn={false}
              loading={dataLoading}
              selectedTab={tab}
              filterComponents={filterComponents}
              expandatedFilter={expandedFilter}
              actionComponents={
                <ActionComponents
                  tab={tab}
                  selectedRows={selectedRowsId}
                  onRemoveSelected={handleRemoveSelected}
                />
              }
              title={
                <Tabs
                  value={tab}
                  onValueChange={handleTabChange}
                  className="w-full"
                >
                  <div className="flex items-center justify-between px-2 w-full gap-4 flex-wrap py-1 rounded-lg bg-accent">
                    <TabsList className="bg-transparent p-0 space-x-2 ">
                      <TabsTrigger
                        value="suggested"
                        className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded px-4 py-2 text-sm font-medium border transition cursor-pointer"
                      >
                        Suggested{" "}
                        <span className="ml-1 text-muted-foreground">(13)</span>
                      </TabsTrigger>

                      <TabsTrigger
                        value="manual"
                        className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded px-4 py-2 text-sm font-medium border transition cursor-pointer"
                      >
                        Select Manually
                      </TabsTrigger>

                      <TabsTrigger
                        value="sourced"
                        className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded px-4 py-2 text-sm font-medium border transition flex items-center gap-1 cursor-pointer"
                      >
                        Sourced{" "}
                        <span className="text-muted-foreground">(15)</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </Tabs>
              }
              onPaginationChange={handlePaginationChange}
              pageNumber={pageNumber}
              pageSize={pageSize}
              totalCount={totalCount}
              tableHeight="calc(64vh - 16px)"
            />
          </div>
        </>
      )}

      {/* Fixed: Single PopupModel instance outside the table */}
      {/* <PopupModel
        open={showModal}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      /> */}
      <PopupModel
      open={openPopup}
      onClose={() => setOpenPopup(false)}
      onSubmit={(attachSummary) => {
        console.log("Confirmed submit:", { attachSummary, selectedCount })
        setOpenPopup(false) // close after submit
      }}
      count={Array.isArray(selectedRows) ? selectedRows.length : 0}
    />
    </div>
  );
}

export default Sourcing;
