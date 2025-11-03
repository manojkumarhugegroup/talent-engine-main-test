"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateButton } from "@/components/buttons/CreateButton";
import { SearchComp } from "@/components/shared/SearchComp";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ListFilter, ChevronDown, RotateCcw, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import excel from "../../../../public/assets/icons/time sheet/excel.png";
import TimesheetTable from "@/components/timeSheet/TimesheetTable";
import disabled_filter from "../../../../public/assets/icons/time sheet/disabled-filter.png";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRef, useMemo } from "react";
import { format, startOfWeek, addDays, subWeeks } from "date-fns";
import { cn } from "@/lib/utils";
import TimesheetSkeleton from "@/components/timeSheet/TimesheetSkeleton";
import { ConfirmActionDialog } from "@/components/timeSheet/ConfirmActionDialog";


type ActionType = "approve" | "reject"
type Status = "pending" | "approved" | "declined"
const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResource, setSearchResource] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedType, setSelectedType] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<number>(0);
  const [selectedWeeks, setSelectedWeeks] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<number>(0);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [isopen, setIsOpen] = useState(false);
  const [filterActive, setFilterActive] = useState(true);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [savedTitle, setSavedTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true)


  const tableRef = useRef<{ exportToExcel: () => void }>(null);
  
  const [dialogOpen, setDialogOpen] = useState(false)  
  const [actionType, setActionType] = useState<ActionType>("approve")
  const [statusMap, setStatusMap] = useState<Record<number, Status>>({})

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam) {
      const typeValue = Number.parseInt(typeParam, 10);
      if (!isNaN(typeValue) && (typeValue === 0 || typeValue === 1)) {
        setSelectedType(typeValue);
      }
    }

    // Simulate 1 second loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchParams]);


  useEffect(() => {
    console.log("Selected rows in page component:", selectedRows);
  }, [selectedRows]);

  const resources = [
    "Aisha Al-Mutairi",
    "David Miller",
    "Elena Petrova",
    "Fatima Noor",
    "Mohammed Faisal",
  ];

  const titles = ["Engineer", "Manager", "Technician", "Analyst", "Consultant"];


    const handleActionClick = (type: ActionType) => {
    setActionType(type)
    setDialogOpen(true)
  }

  // Handle confirm from dialog

const handleConfirm = () => {
  const updated = { ...statusMap }
  selectedRows.forEach((row) => {
    updated[row.id] = actionType === "approve" ? "approved" : "declined"
  })

  setStatusMap(updated)
  setDialogOpen(false)
}


  const filteredResources = useMemo(() => {
    if (!searchResource) return resources;
    return resources.filter((res) =>
      res.toLowerCase().includes(searchResource.toLowerCase())
    );
  }, [searchResource]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setSearchResource("");
  };

  const handleOpenTitleChange = (isopen: boolean) => {
    setIsOpen(isopen);
    if (!isopen) setSearchTitle("");
  };

  const filteredTitles = useMemo(() => {
    if (!searchTitle) return titles;
    return titles.filter((title) =>
      title.toLowerCase().includes(searchTitle.toLowerCase())
    );
  }, [searchTitle]);

  // Toggle selected title
  const toggleTitle = (title: string) => {
    setSelectedTitles((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const toggleResource = (resource: string) => {
    setSelectedResources((prev) =>
      prev.includes(resource)
        ? prev.filter((r) => r !== resource)
        : [...prev, resource]
    );
  };

  const toggleFilter = () => {
    setFilterActive((prev) => !prev);
  };

  const handleTypeChange = (type: number) => {
    setSelectedType(type);
    // Update URL without page refresh
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleProjectChange = (type: number) => {
    setSelectedProject(type);
  };

  const handleWeeksChange = (type: number) => {
    setSelectedWeeks(type);
  };

  const handleYearChange = (type: number) => {
    setSelectedYear(type);
  };

  const handleStatusChange = (type: number) => {
    setSelectedStatus(type);
  };

  const typeOptions = [
    { value: 0, label: "My Jobs" },
    { value: 1, label: "Created by Me" },
  ];

  const projectList = [
    { value: 0, label: "FDN Optimization Project" },
    { value: 1, label: "Sample project" },
  ];

  const generatePastWeeks = (numWeeks = 5) => {
    const weeks = [];

    const today = new Date();

    for (let i = 0; i < numWeeks; i++) {
      // Get the start of the week, assuming week starts on Sunday
      const start = startOfWeek(subWeeks(today, i), { weekStartsOn: 0 });
      const end = addDays(start, 6);

      const label = `Week ${i + 1} (${format(start, "MMM dd")} to ${format(
        end,
        "MMM dd"
      )})`;

      weeks.push({
        value: i,
        label,
      });
    }

    return weeks;
  };

  const weeks = generatePastWeeks(10);

  const generatePastYears = (numYears = 5) => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = 0; i < numYears; i++) {
      years.push({
        value: i,
        label: (currentYear - i).toString(),
      });
    }

    return years;
  };

  const year = generatePastYears(5);

  const status = [
    { value: 0, label: "All" },
    { value: 1, label: "Unapproved" },
    { value: 2, label: "Approved" },
  ];

  const handleExportClick = () => {
    // console.log("somthing happening");

    tableRef.current?.exportToExcel();
  };

  const handleSave = (type: "resource" | "title") => {
    if (type === "resource") {
      setSavedResources(selectedResources);
      console.log("Saved resources:", selectedResources);
      setOpen(false); // close resource popover
    } else if (type === "title") {
      setSavedTitles(selectedTitles);
      console.log("Saved titles:", selectedTitles);
      setIsOpen(false);
    }
  };


  if (loading) {
    return <TimesheetSkeleton />
  }

  return (
    <div className="w-full h-full">
      <div className="flex justify-between pb-1">
        <div className="flex justify-between pb-1 gap-3">
          <CreateButton
            label="Time Sheet"
            //   createPrivilege={true}
            path="/resource-requirement/jobs/action/ai"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-card border-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
              >
                {
                  projectList.find((opt) => opt.value === selectedProject)
                    ?.label
                }
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              {projectList.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleProjectChange(option.value)}
                  className={`${" h-max-auto"}`}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-card border-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
              >
                {weeks.find((opt) => opt.value === selectedWeeks)?.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="max-h-60 overflow-y-auto w-60" // ✅ Set height and width
            >
              {weeks.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleWeeksChange(option.value)}
                  className="h-max-auto"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-card border-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
              >
                {year.find((opt) => opt.value === selectedYear)?.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              {year.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleYearChange(option.value)}
                  className={`${" h-max-auto"}`}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
          <SearchComp
            onSearch={setSearchTerm}
            placeholder="Type to search..."
          />
          <Button
            variant="outline"
            className="cursor-pointer flex items-center bg-card"
            onClick={toggleFilter}
          >
            {filterActive ? (
              <ListFilter className="mr-2 h-4 w-4" />
            ) : (
              <Image
                src={disabled_filter || "/placeholder.svg"}
                alt="disabled-filter"
                className="mr-2 h-4 w-4"
              />
            )}
            Filter
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer p-2 flex items-center justify-center bg-card"
            onClick={handleExportClick}
          >
            <Image
              src={excel || "/placeholder.svg"}
              alt="excel-icon"
              className="max-w-[20px] max-h-[20px] object-contain"
            />
            Export
          </Button>
        </div>
      </div>

      {selectedRows.length > 0 ? (
        <>
         <div className="flex justify-end items-center gap-3 py-2">
        <Button variant="outline" className="bg-card" onClick={() => {setSelectedRows([])}}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={() => handleActionClick("reject")}>
          Decline
        </Button>
        <Button
          className="bg-[#243BB1] text-white hover:bg-[#1e2f8f]"
          onClick={() => handleActionClick("approve")}
        >
          Approve
        </Button>
      </div>
         <ConfirmActionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        type={actionType}
        onConfirm={handleConfirm}
      />
      </>
      ) : (
        <div
          className={cn(
            "flex justify-end items-center gap-3 transition-all duration-300 overflow-hidden",
            !filterActive && selectedRows.length === 0
              ? "max-h-40 opacity-100 py-2"
              : "max-h-0 opacity-0 py-0"
          )}
        >
          {(!filterActive && selectedRows.length === 0) && (
            <div className="flex justify-end items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-card border-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
                  >
                    <ListFilter className="mr-2 h-4 w-4" />
                    {status.find((opt) => opt.value === selectedStatus)?.label}
                    {/* <ChevronDown className="h-4 w-4 text-[#243BB1]" /> */}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start">
                  {status.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleStatusChange(option.value)}
                      className={`${" h-max-auto"}`}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Popover open={open} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-card"
                  >
                    <ListFilter className="mr-2 h-4 w-4" />
                    Resource
                    {selectedResources.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        ({selectedResources.length})
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-60 p-2">
                  <div className="flex justify-between mt-2 gap-2">
                    <div className="font-medium mb-2">Resource</div>

                    <RotateCcw
                      onClick={() => setSelectedResources([])}
                      className="h-5 w-5"
                    />
                  </div>

                  {/* Simple search input */}
                  <div className="relative w-full mb-2">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Type to search..."
                      value={searchResource}
                      onChange={(e) => {
                        setSearchResource(e.target.value);
                        console.log("search", e.target.value);
                      }}
                      className="w-full pl-8 p-1 border rounded placeholder:text-sm h-8"
                    />
                  </div>

                  <ScrollArea className="h-40">
                    {filteredResources.length > 0 ? (
                      filteredResources.map((resource) => (
                        <div
                          key={resource}
                          className="flex items-center space-x-2 py-1"
                        >
                          <Checkbox
                            id={resource}
                            checked={selectedResources.includes(resource)}
                            onCheckedChange={() => toggleResource(resource)}
                            className="cursor-pointer"
                          />
                          <label
                            htmlFor={resource}
                            className="text-sm cursor-pointer"
                          >
                            {resource}
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground px-2 py-1">
                        No results found.
                      </div>
                    )}
                  </ScrollArea>
                  {/* <div className="flex justify-between mt-2 gap-2">
    <Button
      variant="outline"
      onClick={() => setSelectedResources(filteredResources)}
    >
      Select All
    </Button>

    <Button variant="outline" onClick={() => handleSave("resource")}>
      Save
    </Button>
  </div> */}
                </PopoverContent>
              </Popover>
              <Popover open={isopen} onOpenChange={handleOpenTitleChange}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-card"
                  >
                    <ListFilter className="mr-2 h-4 w-4" />
                    Title
                    {selectedTitles.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        ({selectedTitles.length})
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-60 p-2">
                  <div className="flex justify-between mt-2 gap-2">
                    <div className="font-medium mb-2">Title</div>

                    <RotateCcw
                      onClick={() => setSelectedTitles([])}
                      className="h-5 w-5"
                    />
                  </div>

                  <div className="relative w-full mb-2">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Type to search..."
                      value={searchTitle}
                      onChange={(e) => {
                        setSearchTitle(e.target.value);
                        console.log("search", e.target.value); // logs every keystroke
                      }}
                      className="w-full pl-8 p-1 border rounded text-md h-8 placeholder:text-sm"
                    />
                  </div>

                  <ScrollArea className="h-40">
                    {filteredTitles.length > 0 ? (
                      filteredTitles.map((title) => (
                        <div
                          key={title}
                          className="flex items-center space-x-2 py-1"
                        >
                          <Checkbox
                            id={title}
                            checked={selectedTitles.includes(title)}
                            onCheckedChange={() => toggleTitle(title)}
                            className="cursor-pointer"
                          />
                          <label
                            htmlFor={title}
                            className="text-sm cursor-pointer"
                          >
                            {title}
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground px-2 py-1">
                        No results found.
                      </div>
                    )}
                  </ScrollArea>

                  {/* <div className="flex justify-between mt-2 gap-2">
    <Button
      variant="outline"
      onClick={() => setSelectedTitles(filteredTitles)}
    >
      Select All
    </Button>

    <Button variant="outline" onClick={() => handleSave("title")}>
      Save
    </Button>
  </div> */}
                </PopoverContent>
              </Popover>
              <RotateCcw className="mr-2 w- text-center" />
            </div>
          )}
        </div>
      )}

      <TimesheetTable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        tableRef={tableRef}
          bulkUpdates={statusMap} 
      />
    </div>
  );
};

export default page;
