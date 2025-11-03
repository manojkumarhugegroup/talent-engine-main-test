import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/forms/CustomSheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ChevronLeft, Plus, X } from "lucide-react";
import {
  AdvertisedPositionType,
  JobDescription,
} from "@/types/jobs/Info/jd.types";
import { useDataContext } from "@/context/DataProvider";
import { CusTextarea } from "@/components/forms/CusTextarea";

interface JDEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
}

export function JDEditDrawer({
  isOpen,
  onClose,
  activeTab,
}: JDEditDrawerProps) {
  const {
    adposition,
    jobDescription: jdData,
    fetchAdPosition,
    fetchJdData,
  } = useDataContext();

  // Local state for editing
  const [editAdPosition, setEditAdPosition] =
    useState<AdvertisedPositionType | null>(null);
  const [editJobDescription, setEditJobDescription] =
    useState<JobDescription | null>(null);

  const formatFieldLabel = (fieldName: string): string => {
    const labelMap: Record<string, string> = {
      nowHiring: "Now Hiring",
      location: "Location",
      employementType: "Employment Type",
      startDate: "Start Date",
      overview: "Overview",
      responsibilties: "What You'll Do",
      requirements: "What You Bring",
      jobTitle: "Job Title",
      compensation: "Compensation",
      workingdays: "Working Days / Week",
      workinghours: "Working Hours / Day",
      rotation: "Rotation Cycle",
      resorurces: "No of Resources",
      scope: "Scope of Work",
      visa: "Visa Requirement",
      projectduration: "Project Duration",
      qualification: "Preferred Qualifications",
      position_start_date: "Postion Start Date",
      position_est_end_date: "Postion Est.End Date",
      repsone: "Key Responsibilites",
      require: "Requirements",
    };
    return (
      labelMap[fieldName] ||
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    );
  };

  useEffect(() => {
    fetchAdPosition();
    fetchJdData();
  }, []);

  useEffect(() => {
    if (adposition) {
      setEditAdPosition(adposition);
    }
  }, [adposition]);

  useEffect(() => {
    if (jdData) {
      setEditJobDescription(jdData);
    }
  }, [jdData]);

  const handleSave = () => {
    // Here you would typically save to your API
    console.log("Saving data...");
    if (activeTab === "0") {
      console.log("Advertised Position Data:", editAdPosition);
    } else {
      console.log("Job Description Data:", editJobDescription);
    }
    onClose();
  };

  const handleCancel = () => {
    // Reset to original data
    if (activeTab === "0" && adposition) {
      setEditAdPosition(adposition);
    } else if (activeTab === "1" && jdData) {
      setEditJobDescription(jdData);
    }
    onClose();
  };

  const addNewItem = (
    type: "responsibilities" | "requirements" | "qualification",
    isAdPosition: boolean = false
  ) => {
    if (isAdPosition && editAdPosition) {
      const updated = { ...editAdPosition };
      if (type === "responsibilities") {
        updated.responsibilties = [...updated.responsibilties, ""];
      } else {
        updated.requirements = [...updated.requirements, ""];
      }
      setEditAdPosition(updated);
    } else if (!isAdPosition && editJobDescription) {
      const updated = { ...editJobDescription };
      if (type === "responsibilities") {
        updated.responsibilties = [...updated.responsibilties, ""];
      } else if (type === "requirements") {
        updated.requirements = [...updated.requirements, ""];
      } else if (type === "qualification") {
        updated.qualification = [...updated.qualification, ""];
      }
      setEditJobDescription(updated);
    }
  };

  const removeItem = (
    index: number,
    type: "responsibilities" | "requirements" | "qualification",
    isAdPosition: boolean = false
  ) => {
    if (isAdPosition && editAdPosition) {
      const updated = { ...editAdPosition };
      if (type === "responsibilities") {
        updated.responsibilties = updated.responsibilties.filter(
          (_, i) => i !== index
        );
      } else {
        updated.requirements = updated.requirements.filter(
          (_, i) => i !== index
        );
      }
      setEditAdPosition(updated);
    } else if (!isAdPosition && editJobDescription) {
      const updated = { ...editJobDescription };
      if (type === "responsibilities") {
        updated.responsibilties = updated.responsibilties.filter(
          (_, i) => i !== index
        );
      } else if (type === "requirements") {
        updated.requirements = updated.requirements.filter(
          (_, i) => i !== index
        );
      } else if (type === "qualification") {
        updated.qualification = updated.qualification.filter(
          (_, i) => i !== index
        );
      }
      setEditJobDescription(updated);
    }
  };

  const updateItem = (
    index: number,
    value: string,
    type: "responsibilities" | "requirements" | "qualification",
    isAdPosition: boolean = false
  ) => {
    if (isAdPosition && editAdPosition) {
      const updated = { ...editAdPosition };
      if (type === "responsibilities") {
        updated.responsibilties[index] = value;
      } else {
        updated.requirements[index] = value;
      }
      setEditAdPosition(updated);
    } else if (!isAdPosition && editJobDescription) {
      const updated = { ...editJobDescription };
      if (type === "responsibilities") {
        updated.responsibilties[index] = value;
      } else if (type === "requirements") {
        updated.requirements[index] = value;
      } else if (type === "qualification") {
        updated.qualification[index] = value;
      }
      setEditJobDescription(updated);
    }
  };

  const arrayToTextarea = (arr: string[]): string => {
    return arr.join("\n"); // keep as plain text for editing
  };

  const textareaToArray = (text: string): string[] => {
    return text
      .split("\n")
      .map((line) => line.trim()) // keep empty lines as empty strings
      .filter((line) => line !== ""); // remove only if completely blank
  };

  const handleTextareaChange = (
    value: string,
    type: "responsibilities" | "requirements" | "qualification",
    isAdPosition: boolean = false
  ) => {
    const newArray = textareaToArray(value);

    if (isAdPosition && editAdPosition) {
      const updated = { ...editAdPosition };
      if (type === "responsibilities") {
        updated.responsibilties = newArray;
      } else {
        updated.requirements = newArray;
      }
      setEditAdPosition(updated);
    } else if (!isAdPosition && editJobDescription) {
      const updated = { ...editJobDescription };
      if (type === "responsibilities") {
        updated.responsibilties = newArray;
      } else if (type === "requirements") {
        updated.requirements = newArray;
      } else if (type === "qualification") {
        updated.qualification = newArray;
      }
      setEditJobDescription(updated);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full max-w-none min-w-[900px] p-0 gap-0.5 bg-card overflow-auto scroll-container"
      >
        <SheetHeader className="p-2 border-b">
          <div className="flex justify-between">
            <div className="flex items-center ">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <SheetTitle className="text-lg font-medium">
                {activeTab === "0" ? "Advertised Position" : "Job Description"}
              </SheetTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-(--interview) rounded-sm px-4 h-8 text-(--interview) hover:bg-transparent bg-transparent hover:text-(--interview)"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-(--interview) hover:bg-(--interview) rounded-sm px-4 h-8"
              >
                Update
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="px-6 py-2 space-y-6">
          {/* Advertised Position Form */}
          {activeTab === "0" && editAdPosition && (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex gap-1 text-xs">
                  <p className=" font-semibold text-label">
                    {formatFieldLabel("nowHiring")}:
                  </p>
                  <p className=" text-label">{editAdPosition.nowHiring}</p>
                </div>
                <div className="flex gap-1 text-xs">
                  <p className=" font-semibold text-label">
                    {formatFieldLabel("location")}:
                  </p>
                  <p className=" text-label">{editAdPosition.location}</p>
                </div>
                <div className="flex gap-1 text-xs">
                  <p className=" text-label">
                    {editAdPosition.employementType}
                  </p>
                  <p className=" font-semibold text-label">
                    {formatFieldLabel("startdate")}:
                  </p>
                  <p className=" text-label">{editAdPosition.startDate}</p>
                </div>
              </div>

              <div>
                <CusTextarea
                  value={editAdPosition.overview}
                  onChange={(e) =>
                    setEditAdPosition({
                      ...editAdPosition,
                      overview: e.target.value,
                    })
                  }
                  className="min-h-[100px] border-gray-300 text-xs"
                  placeholder="Enter job overview..."
                />
              </div>

              <div>
                <Label className="text-sm font-bold text-label mb-2 block">
                  {formatFieldLabel("responsibilties")}
                </Label>
                <CusTextarea
                  value={editAdPosition.responsibilties.join("\n")}
                  // onChange={(e) =>
                  //     handleTextareaChange(e.target.value, "responsibilities", true)
                  // }
                  onChange={(e) =>
                    setEditAdPosition({
                      ...editAdPosition,
                      responsibilties: e.target.value.split("\n"),
                    })
                  }
                  className="min-h-[120px] border-gray-300"
                  placeholder="Enter each responsibility on a new line..."
                />
              </div>

              <div>
                <Label className="text-sm font-bold text-label mb-2 block">
                  {formatFieldLabel("requirements")}
                </Label>
                <CusTextarea
                  value={editAdPosition.requirements.join("\n")}
                  // value={arrayToTextarea(editAdPosition.requirements)}
                  onChange={(e) =>
                    handleTextareaChange(e.target.value, "requirements", true)
                  }
                  className="min-h-[120px] border-gray-300"
                  placeholder="Enter each requirements on a new line..."
                />
              </div>
            </div>
          )}

          {/* Job Description Form */}
          {activeTab === "1" && editJobDescription && (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex gap-1 text-xs">
                  <p className=" font-semibold text-label">
                    {formatFieldLabel("position_start_date")}:
                  </p>
                  <p className=" text-label">
                    {editJobDescription.position_start_date}
                  </p>
                </div>
                <div className="flex gap-1 text-xs">
                  <p className=" font-semibold text-label">
                    {formatFieldLabel("location")}:
                  </p>
                  <p className=" text-label">{editJobDescription.location}</p>
                </div>
                <div className="flex gap-1 text-xs">
                  <p className=" font-semibold text-label">
                    {formatFieldLabel("position_est_end_date")}:
                  </p>
                  <p className=" text-label">
                    {editJobDescription.position_est_end_date}
                  </p>
                </div>
                <div className="flex gap-1 text-xs">
                  <p className=" font-semibold text-label">
                    {formatFieldLabel("compensation")}:
                  </p>
                  <p className=" text-label">
                    {editJobDescription.compensation}
                  </p>
                </div>
                <div className="flex gap-1 text-xs">
                  <p className=" font-semibold text-label">
                    {formatFieldLabel("workingdays")}:
                  </p>
                  <p className=" text-label">
                    {editJobDescription.workingdays}
                  </p>
                </div>
                <div className="flex gap-1 text-xs">
                  <p className=" font-semibold text-label">
                    {formatFieldLabel("workinghours")}:
                  </p>
                  <p className=" text-label">
                    {editJobDescription.workinghours}
                  </p>
                </div>
                <div className="flex gap-1 text-xs">
                  <p className=" font-semibold text-label">
                    {formatFieldLabel("rotation")}:
                  </p>
                  <p className=" text-label">{editJobDescription.rotation}</p>
                </div>
                <div className="flex gap-1 text-xs">
                  <p className=" font-semibold text-label">
                    {formatFieldLabel("resorurces")}:
                  </p>
                  <p className=" text-label">{editJobDescription.resorurces}</p>
                </div>
                {/* <div className="flex gap-1 text-xs">
                  <p className=" font-semibold text-label">
                    {formatFieldLabel("scope")}:
                  </p>
                  <p className=" text-label">
                    {editJobDescription.scope_of_work}
                  </p>
                </div> */}
              </div>

              <div>
                <Label className="text-sm font-medium text-label">
                  {formatFieldLabel("overview")}
                </Label>
                <CusTextarea
                  value={editJobDescription.overview}
                  onChange={(e) =>
                    setEditJobDescription({
                      ...editJobDescription,
                      overview: e.target.value,
                    })
                  }
                  className="mt-1 min-h-[80px]"
                />
              </div>

              <div>
                <Label className="text-sm font-bold text-label mb-2 block">
                  {formatFieldLabel("repsone")}
                </Label>
                <CusTextarea
                  value={editJobDescription.responsibilties.join("\n")}
                  onChange={(e) =>
                    setEditJobDescription({
                      ...editJobDescription,
                      responsibilties: e.target.value.split("\n"),
                    })
                  }
                  className="min-h-[120px] border-gray-300"
                  placeholder="Enter each responsibility on a new line..."
                />
              </div>

              <div>
                <Label className="text-sm font-bold text-label mb-2 block">
                  {formatFieldLabel("require")}
                </Label>
                <CusTextarea
                  value={editJobDescription.requirements.join("\n")}
                  onChange={(e) =>
                    setEditJobDescription({
                      ...editJobDescription,
                      requirements: e.target.value.split("\n"),
                    })
                  }
                  className="min-h-[120px] border-gray-300"
                  placeholder="Enter each requirements on a new line..."
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-label">
                  {formatFieldLabel("qualification")}
                </Label>
                <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-label">
                  {editJobDescription.qualification.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer with action buttons */}
      </SheetContent>
    </Sheet>
  );
}
