"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onView?: () => void;
  variant?: "confirm" | "regenerate";
}

const initialPreviousSkills = [
  "Distribution Planning",
  "Asset Management",
  "Real-time Analytics",
  "Maintenance Scheduling",
  "Fuel Efficiency",
];

const initialAddedSkills = [
  "Fuel Logistics",
  "Fuel Monitoring",
  "Supply Chain",
  "Fleet Management",
  "Route Optimization",
  "Inventory Control",
  "Logistics Coordination",
  "ERP Systems",
  "Compliance Management",
];
export function SubmitButtonWithPopup({
  isOpen,
  onClose,
  onConfirm,
  onView,
  variant = "confirm",
}: ConfirmationPopupProps) {
  const router = useRouter();

  const [step, setStep] = useState<"confirm" | "success">("confirm");

  const [previousSkills, setPreviousSkills] = useState<string[]>(
    initialPreviousSkills
  );
  const [addedSkills, setAddedSkills] = useState<string[]>(initialAddedSkills);

  const handleYesClick = () => {
    setStep("success");
    onConfirm?.();
  };

  const handleClose = () => {
    // Reset everything to initial state
    setPreviousSkills(initialPreviousSkills);
    setAddedSkills(initialAddedSkills);
    setStep("confirm");
    onClose();
  };

  const handleViewClick = () => {
    onView?.();
    handleClose();
    router.push("/resource-requirement/jobs");
  };

  const moveToAdded = (skill: string) => {
    setPreviousSkills((prev) => prev.filter((s) => s !== skill));
    setAddedSkills((prev) => [...prev, skill]);
  };

  const removeFromAdded = (skill: string) => {
    setAddedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleOkClick = () => {
    console.log({ addedSkills }); // log JSON of currently added skills
    if (variant === "confirm") {
      setStep("success");
    } else {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="!w-[800px] !max-w-none bg-white justify-center items-center">
        {/* {(variant === "regenerate" || variant === "confirm") && ( */}
        {(variant === "regenerate" ||
          (variant === "confirm" && step === "confirm")) && (
          <div className="flex flex-col space-y-6 p-6 w-full bg-white">
            <h2 className="text-lg font-semibold text-gray-900">
              {variant === "regenerate"
                ? "Regenerated Key Skills"
                : "Manage Skills"}
            </h2>

            <div className="flex flex-col md:flex-row md:space-x-6">
              {/* Previous Skills */}
              <div className="w-full space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Previous Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {previousSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 px-4 py-1 rounded-full text-sm text-gray-700 cursor-pointer hover:bg-gray-200 flex items-center gap-1"
                      onClick={() => moveToAdded(skill)}
                    >
                      {skill} <Plus size={14} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Currently Added Skills */}
              <div className="w-full space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Currently Added Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {addedSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm flex items-center gap-1 cursor-pointer"
                    >
                      {skill}{" "}
                      <X size={14} onClick={() => removeFromAdded(skill)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="bg-secondary"
              >
                Cancel
              </Button>
              <Button onClick={handleOkClick}>OK</Button>
            </div>
          </div>
        )}

        {/* Success Step for Confirm Variant */}
        {variant === "confirm" && step === "success" && (
          <div className="flex flex-col items-center space-y-6 p-6">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Recruitment Requirement (RR) created successfully
              </h2>
              <p className="text-sm text-gray-600">
                and the Job Description (JD) has been generated based on it.
              </p>
            </div>
            <div className="flex space-x-3 w-full">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Later
              </Button>
              <Button onClick={handleViewClick} className="flex-1">
                View
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
