"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/forms/CustomCard";
import { Button } from "@/components/ui/button"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import {
  Calendar, 
  Circle, 
  ChevronLeft,
  CircleCheckBig,
  SquareArrowOutUpRight, 
} from "lucide-react";
import type React from "react";
import { useDataContext } from "@/context/DataProvider";
import { useEffect } from "react";  
import HistoryCard from "@/components/(resource-requirement)/contract_details/HistoryCard";

// Candidate Profile
function CandidateProfileCard() {
  const { candidateDetails, fetchCandidateDetails } = useDataContext();

  useEffect(() => {
    fetchCandidateDetails();
  }, []);

  if (!candidateDetails) return <CandidateProfileSkeleton />;
  const data = candidateDetails;

  return (
    <Card className="h-full bg-(--profile-bg) relative flex flex-col ">
      <CardHeader className="px-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Candidate Profile</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-1 text-xs bg-card border-[#ADADAD] rounded hover:bg-card"
          >
            View Profile
          </Button>
        </div>
      </CardHeader>
      <div className="flex-1 overflow-auto pb-14 scroll-container">
        <CardContent className="px-1.5 pt-1">
          <div className="flex items-start gap-2 border-b pb-2">
            {/* Avatar */}
            <Avatar className="w-14 h-14 ">
              <AvatarImage
                src={data.avatarUrl || "/assets/icons/placeholder.svg"}
                alt={data.name}
              />
              <AvatarFallback className="text-sm font-medium">
                {data.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            {/* data Info */}
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-semibold text-sm text-(--contract-text)">
                  {data.name}
                </h3>
                <p className="text-xs text-(--contract-text) font-bold">
                  {data.role}
                </p>
              </div>
              <div className="grid grid-cols-2 text-xs">
                <div>
                  <p className="text-(--contract-text) mb-1">Nationality</p>
                  <p className="font-bold text-(--contract-text) text-xs">
                    {data.nationality}
                  </p>
                </div>
                <div>
                  <p className="text-(--contract-text) mb-1">Category</p>
                  <p className="font-bold text-(--contract-text) text-xs">
                    {data.category}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 ">
            <p className="text-(--contract-text) font-semibold text-sm ">
              Senior Fuel Operations Manager
            </p>
            <p className="text-xs leading-5 text-(--contract-text)">
              {data.experience}
            </p>
          </div>
          <div className="mt-2 space-y-2" />
          <p className="text-(--contract-text) font-bold text-sm mb-1">
            Summary
          </p>
          <p className="text-xs leading-5 text-(--contract-text)">
            {data.summary}
          </p>

          <div className="mt-2 space-y-2" />
          <p className="text-(--contract-text) font-bold text-sm mb-1">
            Skills
          </p>
          <ul className="text-xs space-y-1">
            {data.skills.map((s: string, i: number) => (
              <li key={i} className="text-(--contract-text)">
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2" />
          <p className="text-(--contract-text) font-bold text-sm mb-1">
            Education
          </p>
          <ul className="text-xs space-y-1">
            {data.education.map(
              (
                e: {
                  degree: string;
                  year: string;
                  school: string;
                  gpa?: string;
                },
                i: number
              ) => (
                <li key={i}>
                  <span className="font-medium">{e.degree}</span> • {e.year}{" "}
                  <span className="text-(--contract-text)">
                    — {e.school}
                    {e.gpa ? ` • ${e.gpa} GPA` : ""}
                  </span>
                </li>
              )
            )}
          </ul>

          <div className="mt-4 space-y-2" />
          <p className="text-(--contract-text) font-bold text-sm mb-1">
            Certifcations
          </p>
          <ul className="text-xs space-y-1">
            {data.certifications.map(
              (
                c: {
                  name: string;
                  issuer: string;
                  issued: string;
                  expiry?: string;
                },
                i: number
              ) => (
                <li key={i} className="text-(--contract-text)">
                  <span className="font-medium text-foreground">{c.name}</span>{" "}
                  — {c.issuer} • {c.issued}
                  {c.expiry ? ` • Exp: ${c.expiry}` : ""}
                </li>
              )
            )}
          </ul>
        </CardContent>
      </div>
      <div className="absolute bottom-0 left-0 w-full px-2 pb-2 ">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs w-full bg-card border-[#ADADAD] rounded hover:bg-card"
        >
          View Profile Summary
        </Button>
      </div>
    </Card>
  );
}

function CandidateProfileSkeleton() {
  return (
    <Card>
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-20" />
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
}

// Resource Requirement
function ResourceRequirementCard() {
  const { resourceRequirement, fetchResourceRequirement } = useDataContext();

  useEffect(() => {
    fetchResourceRequirement();
  }, []);

  if (!resourceRequirement) return <ResourceRequirementSkeleton />;
  const data = resourceRequirement;

  return (
    <Card className="h-[34%] bg-(--profile-bg) relative flex flex-col">
      <CardHeader className="px-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Resource Requirement</CardTitle>
        </div>
      </CardHeader>
      <div className="flex-1 overflow-auto pb-14 scroll-container ">
        <CardContent className="p-3 pt-0">
          <div className="grid grid-cols-2 gap-2 text-sm ">
            <div>
              <p className="text-label mb-1 text-xs">Position Name</p>
              <p className="font-bold text-label text-xs">{data.position}</p>
            </div>
            <div>
              <p className="text-label mb-1 text-xs">Rotation Cycle</p>
              <p className="font-bold text-label text-xs">{data.rotation}</p>
            </div>
            <div>
              <p className="text-label mb-1 text-xs">Project Est. Start Date</p>
              <p className="font-bold text-label text-xs">
                {data.projectStart}
              </p>
            </div>
            <div>
              <p className="text-label mb-1 text-xs">Working Days / Week</p>
              <p className="font-bold text-label text-xs">{data.daysPerWeek}</p>
            </div>
            <div>
              <p className="text-label mb-1 text-xs">Project Est. End Date</p>
              <p className="font-bold text-label text-xs">{data.projectEnd}</p>
            </div>
            <div>
              <p className="text-label mb-1 text-xs">Working Hours / Day</p>
              <p className="font-bold text-label text-xs">{data.hoursPerDay}</p>
            </div>

            <div>
              <p className="text-label mb-1 text-xs">Location</p>
              <p className="font-bold text-label text-xs">{data.location}</p>
            </div>
          </div>
        </CardContent>
      </div>
      <div className="absolute bottom-0 left-0 w-full px-4 pb-2 grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8  text-xs  bg-card border-[#ADADAD] rounded hover:bg-card"
        >
          View RR
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8  text-xs  bg-card border-[#ADADAD] rounded hover:bg-card"
        >
          View JD
        </Button>
      </div>
    </Card>
  );
}

function ResourceRequirementSkeleton() {
  return (
    <Card className="">
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-7 w-16" />
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 grid grid-cols-2 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={i === 6 ? "col-span-2" : ""}>
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
 
// Work Order
function WorkOrderCard() {
  const { workOrder, fetchWorkOrder } = useDataContext();

  useEffect(() => {
    fetchWorkOrder();
  }, []);

  if (!workOrder) return <WorkOrderSkeleton />;
  const data = workOrder;
  const sym = data.currencySymbol;

  return (
    <Card className="h-[65%] bg-(--profile-bg) relative flex flex-col">
      <CardHeader className="px-3 py-0.5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex gap-1">
            <img
              src="/assets/icons/job-info/workorder.svg"
              alt="onbaord"
              className="h-4 w-4 mt-0.5"
            />
            Work Order
          </CardTitle>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-auto pb-14 scroll-container">
        <CardContent className="p-3 pt-0">
          <div className="flex flex-col gap-2 mb-2.5">
            <div className="flex items-center justify-between">
              <p className="text-sm">Proposed Joining Date</p>
              <div className="text-xs flex items-center gap-1 ">
                <Calendar className="h-3.5 w-3.5" />
                {data.proposedJoiningDate}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm">Base Salary</p>
              <p className="text-sm font-bold">
                ${data.baseSalaryPerMonth}/Month
              </p>
            </div>
          </div>

          <div className="mt-1.5 rounded-lg border ">
            <div className="p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs">Base Daily Salary</span>
                <span className="text-xs font-bold">
                  {sym}
                  {data.baseMonthlySalary}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CircleCheckBig className="h-3 w-3 text-(--onboarded)" />
                  <span className="text-xs text-label">Mandatory Burdens</span>
                </div>
                <span className="text-xs font-bold">
                  {sym}
                  {data.mandatoryBurdens}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CircleCheckBig className="h-3 w-3 text-(--all-candidate)" />
                  <span className="text-xs text-label">
                    Variable Benefits (Est.)
                  </span>
                </div>
                <span className="text-xs font-bold">
                  {sym}
                  {data.variableBenefits}
                </span>
              </div>
              <div className="border-t pt-1 ">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-(--candidate-label)">
                    Total Monthly Cost
                  </span>
                  <span className="text-xs font-bold text-(--candidate-label)">
                    {sym}
                    {data.totalMonthlyCost}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Overtime card */}
          <div className="mt-1.5 rounded-lg border ">
            <div className="p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs">Over time (On weekdays)</span>
                <span className="text-sm font-semibold">
                  {sym}
                  {data.weekdays}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Over time (On weekends)</span>
                <span className="text-sm font-semibold">
                  {sym}
                  {data.weekends}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Over time (National Holiday)</span>
                <span className="text-sm font-semibold">
                  {sym}
                  {data.holiday}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">
                  Standby Rate (Including days in Quarantine)
                </span>
                <span className="text-sm font-semibold">
                  {sym}
                  {data.standby}
                </span>
              </div>
              <div className="">
                <span className="text-[11px] text-muted-foreground">
                  * All values are rounded off.
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
      <div className="absolute bottom-0 left-0 w-full px-2 pb-2 ">
        <Button
          variant="outline"
          size="sm"
          className="h-8  text-xs w-full bg-card border-[#ADADAD] rounded hover:bg-card"
        >
          View More <SquareArrowOutUpRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}

function WorkOrderSkeleton() {
  return (
    <Card>
      <CardHeader className="p-3 space-y-2">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
}

// Onboarding
function OnboardingCard() {
  type Asset = {
    id: string;
    assetId: string;
    assetType: string;
  };

  const [assets, setAssets] = useState<Asset[]>([]);

  const { onboarding, fetchOnboarding } = useDataContext();
  const [assetEditorOpen, setAssetEditorOpen] = useState(false);
  const [assetDraft, setAssetDraft] = useState({ assetId: "", assetType: "" });
  // const [assets, setAssets] = useState([])

  useEffect(() => {
    fetchOnboarding();
  }, []);

  const addAsset = () => {
    if (!assetDraft.assetId.trim() || !assetDraft.assetType.trim()) return;

    const newAsset = {
      id: crypto.randomUUID(),
      assetId: assetDraft.assetId.trim(),
      assetType: assetDraft.assetType.trim(),
    };

    setAssets((prev) => [...prev, newAsset]);
    setAssetDraft({ assetId: "", assetType: "" });
    setAssetEditorOpen(false);
  };

  if (!onboarding) return <OnboardingSkeleton />;
  const data = onboarding;
  return (
    <Card className="h-[70%] bg-(--profile-bg) overflow-y-auto scroll-container">
      <CardHeader className="px-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex gap-1">
            <img
              src="/assets/icons/job-info/onboard.svg"
              alt="onbaord"
              className="w-4 h-4 mt-1"
            />
            Onboarding
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs  bg-card border-[#ADADAD] rounded"
          >
            View More
          </Button>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs font-bold">Actual Joining Date</p>
          <div className="text-xs font-bold">{data.actualJoiningDate}</div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="mb-2">
          <h2 className="text-xs font-semibold">Checklist</h2>
        </div>
        <div className="space-y-2 border-b pb-2.5 border-[#D3D3D3]">
          {data.checklist.map((c, i) => (
            <div key={i} className="rounded-md border p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{c.title}</div>
                </div>
                {c.status === "completed" ? (
                  <span className="flex items-center text-xs text-label">
                    Completed Info
                  </span>
                ) : (
                  <span className="flex items-center text-xs text-(--contract-text)">
                    <Circle className="h-4 w-4 mr-1" /> Pending
                  </span>
                )}
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-xs  text-(--contract-text)">Notes: -</p>
                {(c.by || c.date) && (
                  <div className=" text-xs text-(--contract-text)">
                    {c.by ? ` ${c.by}` : ""} |{c.by && c.date}
                  </div>
                )}
              </div>

              {c.notes && (
                <div className="mt-1 text-xs text-(--contract-text)">
                  Notes: {c.notes}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-2">
          {/* Title and Add Button on the same line */}
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Assets</div>
            <Button
              size="sm"
              className="h-7 px-2 text-[11px] bg-card text-label rounded shadow-sm hover:bg-card"
              onClick={() => setAssetEditorOpen(true)}
            >
              + Add New
            </Button>
          </div>

          {/* Editor should be below the above row */}
          {assetEditorOpen && (
            <div className="border mt-4 p-3 rounded shadow-sm w-full">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium">Asset ID</label>
                  <input
                    type="text"
                    value={assetDraft.assetId}
                    onChange={(e) =>
                      setAssetDraft({ ...assetDraft, assetId: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="A0010"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">Asset Type</label>
                  <input
                    type="text"
                    value={assetDraft.assetType}
                    onChange={(e) =>
                      setAssetDraft({
                        ...assetDraft,
                        assetType: e.target.value,
                      })
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="Laptop"
                  />
                </div>
              </div>

              <div className="mt-3 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setAssetEditorOpen(false);
                    setAssetDraft({ assetId: "", assetType: "" });
                  }}
                  className="border-primary text-primary bg-transparent hover:bg-transparent hover:text-primary"
                >
                  Cancel
                </Button>
                <Button type="button" onClick={addAsset}>
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 space-y-2">
          {data.assets.map((a, i) => (
            <div key={i} className="rounded-md border p-2 text-sm">
              <div className="flex items-center justify-between text-xs">
                <p className="font-bold text-xs">{a.label}</p>
                <p className="text-(--contract-text)">
                  {" "}
                  {a.allocatedOn ? `Allocated on ${a.allocatedOn}` : ""}
                </p>
              </div>
              <div className=" flex items-center justify-between  text-xs text-(--contract-text) mt-1">
                <p className=" text-xs">Notes: -</p>
                {a.returnedOn ? ` • Returned on ${a.returnedOn}` : ""}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function OnboardingSkeleton() {
  return (
    <Card>
      <CardHeader className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-7 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
        <Skeleton className="h-6 w-28" />
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}




 

// Page
export default function OverviewPage() {
  const router = useRouter();
  return (
    <main className="">
       <Button
                type="button"
                variant="ghost"
                className="hover:bg-transparent mb-0.5"
                size="sm"
                onClick={() => router.back()}
              >
                <ChevronLeft />
                <p className="text-lg font-semibold">Contract details</p>
              </Button>
      {/* <div className="flex mb-1">
        <ChevronLeft
          className="cursor-pointer"
          onClick={() => router.back()}
        />{" "}
        <h2 className="text-lg font-bold">Contract details</h2>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-1  ">
        <div className="md:col-span-3  pb-2 h-[600px] ">
          <CandidateProfileCard />
        </div>
        <div className="md:col-span-5 space-y-1  pb-2 h-[600px]">
          <ResourceRequirementCard />
          <WorkOrderCard />
        </div>
        <div className="md:col-span-4 space-y-1 pb-1 h-[600px]">
          <OnboardingCard />
          <HistoryCard />
        </div>
      </div>
    </main>
  );
}
