import { useEffect } from "react";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type InputOverviewDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function InputOverviewDrawer({
  open,
  onClose,
}: InputOverviewDrawerProps) {
  useEffect(() => {
    if (open) {
      console.log("Drawer opened");
    }
  }, [open]);

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-4xl bg-white gap-0 overflow-y-auto [&>button]:hidden"
      >
        <div className="flex justify-between items-center border-b p-2">
          <SheetTitle className="text-2xl font-bold text-gray-900">
            Job Title: Fuel Operations Manager
          </SheetTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-2 text-sm p-4">
          {/* Basic Job Information */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-semibold text-gray-900">
                Position Start Date:
              </span>
              <span className="ml-2 text-gray-700">June 23, 2025</span>
            </div>

            <div>
              <span className="font-semibold text-gray-900">Location:</span>
              <span className="ml-2 text-gray-700">Houston, TX, US</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">
                Position Est. End Date:
              </span>
              <span className="ml-2 text-gray-700">June 23, 2027</span>
            </div>

            <div>
              <span className="font-semibold text-gray-900">
                Working Days / Week:
              </span>
              <span className="ml-2 text-gray-700">6 days</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">
                No. of Resources:
              </span>
              <span className="ml-2 text-gray-700">5</span>
            </div>

            <div>
              <span className="font-semibold text-gray-900">
                Working Hours / Day:
              </span>
              <span className="ml-2 text-gray-700">8 hrs</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Salary:</span>
              <span className="ml-2 text-gray-700">
                USD $2000 - $2500 / Monthly
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">
                Rotation Cycle:
              </span>
              <span className="ml-2 text-gray-700">
                8 Weeks On / 2 Weeks Off
              </span>
            </div>

            {/* <div className="col-span-2">
              <span className="font-semibold text-gray-900">
                Scope of Work:
              </span>
              <span className="ml-2 text-gray-700">
                Field Operations, Office Administration, Project Management,
                On-site Supervision
              </span>
            </div> */}
          </div>

          {/* Project Information */}
          <div className="border-t pt-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Project Name:
              <span className="font-normal pl-2">
                National Fuel Distribution Project
              </span>
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-2">
              <div>
                <span className="font-semibold text-gray-900">
                  Project Type:
                </span>
                <span className="ml-2 text-gray-700">
                  Project-Based Contract
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">
                  Expected Duration:
                </span>
                <span className="ml-2 text-gray-700">24 Months</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Project Details
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The National Fuel Distribution Project is all about improving
                how fuel gets delivered across the country. The goal is to make
                fuel distribution faster, cheaper, and more eco-friendly. In
                this role, you'd be handling logistics, planning delivery
                schedules, and finding the best routes for fuel trucks. You'd
                also make sure everything follows safety and environmental
                rules. If you're good with data, supply chains, and teamwork —
                this one's perfect for you!
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Responsibilities
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  Oversee field operations, fuel logistics, and delivery
                  coordination across assigned regions.
                </li>
                <li>
                  Manage and supervise teams involved in on-site supervision and
                  office administration.
                </li>
                <li>
                  Ensure compliance with safety, regulatory, and environmental
                  standards.
                </li>
                <li>
                  Optimize route planning using modern logistics tools and
                  data-driven insights.
                </li>
                <li>
                  Coordinate with warehouse, fleet, and procurement teams to
                  ensure timely fuel dispatch.
                </li>
                <li>
                  Generate operational reports and recommend improvements.
                </li>
                <li>
                  Liaise with stakeholders to align project goals with on-ground
                  execution.
                </li>
              </ul>
            </div>
          </div>

          {/* Qualifications and Requirements */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Qualification
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>
                    Bachelor of Science in Supply Chain Management, Master of
                    Science in Supply Chain Management
                  </li>
                </ul>

                <h3 className="font-semibold text-gray-900 mb-3 mt-6">
                  Certification
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>
                    Certified Supply Chain Professional (CSCP) – Preferred
                  </li>
                </ul>

                <div className="mt-6">
                  <span className="font-semibold text-gray-900">
                    Visa Requirement:
                  </span>
                  <span className="ml-2 text-gray-700">
                    US Citizen or Green Card Holder
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-3 mt-6">
                  Key Skills
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Fuel Logistics</li>
                  <li>Fleet Operations</li>
                  <li>Supply Chain Management</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Skills & Experience
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Logistics Coordination (3-7 years)</li>
                  <li>Fleet Operations (2-5 years)</li>
                  <li>Project Management</li>
                  <li>Field and Office Operations</li>
                  <li>SAP Logistics (3-7 years)</li>
                  <li>Route Optimization Tools (2-5 years)</li>
                </ul>

                <h3 className="font-semibold text-gray-900 mb-3 mt-6">
                  Tools Familiarity
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>SAP Logistics: 3 - 7 years</li>
                  <li>Route Optimization Tools</li>
                </ul>

                <h3 className="font-semibold text-gray-900 mb-3 mt-6">
                  Language Requirements
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>
                    English: Reading - Medium | Writing - Average | Speaking -
                    Medium
                  </li>
                  <li>
                    Arabic: Reading - Excellent | Writing - Medium | Speaking -
                    Excellent
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Special Notes */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Special Notes</h3>
            <p className="text-gray-700 leading-relaxed">
              This position is vital to national fuel logistics operations and
              demands high attention to detail, leadership, and real-time
              decision-making skills.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
