"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import type {
  KanbanFeature,
  KanbanColumn,
} from "@/types/jobs/Info/kanban.type";
import { columns } from "@/data/Kanban";
import { CusKanbanCard } from "./CusKanbanCard";
import { ProcessSheet, type ProcessSheetPayload } from "./Drawers/ProcessSheet";
import { ScheduleInterviewForm } from "./InterviewProgress/ProgressSheet";
import { CandidateDrawer } from "./Candidate/CandidateSection";
import { WorkOrderDrawer } from "../WorkOrder/WorkOrderDrawer";
import { OnboardDrawer } from "./Onboarding/page";
import { ScheduleInterviewMeeting } from "./InterviewProgress/action/InterviewLink";
import { InterviewMeetingEdit } from "./InterviewProgress/action/InterviewEdit";
import { InterviewMeetingView } from "./InterviewProgress/view/page";
import ScrollableShadowBox from "@/components/layout/ScrollableShadowBox";
import { WorkOrderView } from "../WorkOrder/view/page";
import { OfferViewData } from "./Offer/view/page";
import { ProposalDrawer } from "./Proposal/InterviewDrawer";
import { useRouter, useSearchParams } from "next/navigation";
import RejectDialog from "./RejectDialog";

type DrawerType =
  | "chat"
  | "reject"
  | "interview"
  | "interview_b"
  | "selected"
  | "view"
  | "work_order"
  | "work_order_pencil"
  | "work_order_pencil_b"
  | "onboard"
  | "schedule_interview"
  | "pending_interview_schedule"
  | "accept"
  | "candidate_view"
  | "interview_view"
  | "work_view"
  | "offer"
  | "offer_pencil"
  | null;

interface KanbanProps {
  setFullscreenSection?: (section: string | null) => void;
  isFull?: boolean;
  kanbanList: any[];
  handleRefresh?: () => void;
}

export default function Kanban({
  setFullscreenSection,
  isFull,
  kanbanList,
  handleRefresh,
}: KanbanProps) {
  console.log(kanbanList, "kanbanList");
  const [payload, setPayload] = useState<ProcessSheetPayload | null>(null);
  const [drawerType, setDrawerType] = useState<DrawerType>(null);
  const [drawerStage, setDrawerStage] = useState<string | null>(null);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectFeature, setRejectFeature] = useState<KanbanFeature | null>(
    null
  );
  const router = useRouter();
  const [candidateData, setCandidateData] = useState<KanbanFeature | null>(
    null
  );

  const searchParams = useSearchParams();
  const openDrawer = (
    type: typeof drawerType,
    payloadData: typeof payload,
    feature?: KanbanFeature
  ) => {
    setDrawerType(type);
    setPayload(payloadData);
    setDrawerStage(feature?.stage ?? null);
    setCandidateData(feature ?? null);
  };

  const closeDrawer = () => {
    setDrawerType(null);
    setPayload(null);
    setDrawerStage(null);
  };

  const handleChatClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", "5");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const featuresByStage = useMemo(() => {
    const grouped: Record<string, KanbanFeature[]> = {};
    for (const col of columns) grouped[col.id] = [];
    for (const f of kanbanList) {
      if (grouped[f.stage]) grouped[f.stage].push(f);
    }
    return grouped;
  }, [kanbanList]);

  const actionToDrawerMap: Record<string, DrawerType> = {
    chat: "chat",
    reject: "reject",
    selected: "selected",
    view: "view",
    interview: "interview",
    interview_b: "schedule_interview",
    work_order: "work_order",
    work_order_pencil: "work_order",
    work_order_pencil_b: "work_order",
    onboard: "onboard",
    offer: "offer",
  };

  const resolveDrawerType = (
    actionId: string,
    stage?: string | null,
    status?: string | null
  ): DrawerType => {
    const stageL = stage?.toLowerCase();

    console.log(actionId, stageL, status, "hy6sdsd3");

    if (actionId === "view") {
      if (stageL === "onboarding" && status === "Onboarded") {
        router.push("/resource-requirement/contract-details");
        return null;
      }
      if (stageL === "selected") return "candidate_view";
      if (stageL === "work_order") {
        if (
          status === "Awaiting Customer Signature" ||
          status === "Document Signed"
        )
          return "work_view";
          
      }
      if (stageL === "shortlisted") return "interview_view";
      // if (stageL === "offer") return "offer_pencil";
    }

    if (actionId === "interview") {
      if (stageL === "interview") {
        if (status === "Pending Interview Schedule")
          return "schedule_interview";
        if (status === "Awaiting Interviewer Feedback") return "interview_b";
        if (status === "Awaiting Candidate Acceptance") return "interview_b";
        if (status === "Pending Interview Schedule")
          return "schedule_interview";

        if (status === "Awaiting Slot Acceptance") return "interview";
      }
      if (stageL === "shortlisted") return "interview";
    }
    if (actionId === "interview_b") {
      if (stageL === "interview") {
        if (status === "Scheduled") return "interview_b";
        if (status === "Interview Cleared") return "interview_view";
        if (status === "Accepted") return "interview_view";
        if (status === "Awating Interviewer Feedback") return "interview_b";
        if (status === "Cancelled") return "interview_b";
        if (status === "Rejected") return "interview_view";
      }
    }
    if (actionId === "selected") {
      if (stageL === "interview") {
        if (status === "Accepted") return "interview_view";
        if (status === "Selected") return "accept";
      }
    }
    if (actionId === "offer") {
      if (stageL === "work_order" || stageL === "offer") return "offer_pencil";
    }

    return actionToDrawerMap[actionId] ?? null;
  };

  console.log(
    rejectFeature?.stage === "Interview",
    rejectFeature?.stage === "Shortlisted",
    "rr4455",
    rejectFeature
  );

  return (
    <>
      <div className="px-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Processing</h2>
        </div>
         
         {/* <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <button onClick={() => setDrawerType("interview")}>
            Schedule Interview
          </button>
          <button onClick={() => setDrawerType("schedule_interview")}>
            Interview Invite
          </button>
          <button onClick={() => setDrawerType("interview_b")}>
            Interview Feedback
          </button>
          <button onClick={() => setDrawerType("interview_view")}>
            View Interview
          </button>
          <button onClick={() => setDrawerType("candidate_view")}>
            Proposal
          </button>
          <button onClick={() => setDrawerType("work_order")}>
            Work Order
          </button>
          <button onClick={() => setDrawerType("accept")}>
            Select Candidate
          </button>
          <button onClick={() => setDrawerType("work_view")}>
            Work Order View
          </button>
          <button onClick={() => setDrawerType("offer_pencil")}>
            Offer View
          </button>
          <button onClick={() => setDrawerType("onboard")}>Onboard</button>
          <button onClick={() => setShowRejectPopup(true)}>Reject Popup</button>
        </div>    */}
        {isFull && <Separator className="my-2" />}
        <div className="min-w-0 overflow-x-auto h-full ">
          <div className="flex gap-2 h-[calc(90vh-9rem)] mb-3 items-start  justify-between ">
            {columns.map((column) => {
              const columnFeatures = featuresByStage[column.id] || [];
              const rejectedFeatures = columnFeatures.filter(
                (f) => f.status?.toLowerCase() === "rejected"
              );
              const normalFeatures = columnFeatures.filter(
                (f) => f.status?.toLowerCase() !== "rejected"
              );

              return (
                <div
                  key={column.id}
                  className="bg-card min-w-min rounded-lg overflow-hidden border w-full pb-2 h-full"
                >
                  <div className="sticky top-0 z-10 bg-card px-3 py-2">
                    <div className="flex items-center gap-2">
                      {column.icon && (
                        <Image
                          src={column.icon}
                          width={16}
                          height={16}
                          alt=""
                        />
                      )}
                      <span className="text-sm font-medium">{column.name}</span>
                    </div>
                  </div>

                  {columnFeatures.length === 0 ? (
                    <div className=" h-full px-2">
                      <div className="px-1 h-full min-h-40 flex items-center justify-center  bg-muted/10 border border-dashed rounded">
                        <div className="text-sm text-muted-foreground italic p-4 text-center min-w-72 w-full m-1 ">
                          No candidates yet.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ScrollableShadowBox>
                      <div className="p-1 pb-0 space-y-2 px-2 max-h-[calc(80vh-5.8rem)]">
                        {normalFeatures.map((feature) => (
                          <CusKanbanCard
                            key={feature.id}
                            column={column as KanbanColumn}
                            feature={feature}
                            isFull={isFull}
                            onActionClick={({
                              actionId,
                              actionLabel,
                              feature,
                            }) => {
                              if (actionId === "chat") return handleChatClick();
                              if (actionId === "reject") {
                                setRejectFeature(feature);
                                setShowRejectPopup(true);
                                return;
                              }
                              setPayload({ actionId, actionLabel, feature });
                              const drawer = resolveDrawerType(
                                actionId,
                                feature.stage,
                                feature.status
                              );
                              if (drawer)
                                openDrawer(
                                  drawer,
                                  { actionId, actionLabel, feature },
                                  feature
                                );
                            }}
                          />
                        ))}

                        {rejectedFeatures.length > 0 && (
                          <>
                            <div className="flex items-center text-xs font-semibold mt-4 mb-1 text-lavel">
                              <span>
                                Rejected {`(${rejectedFeatures.length})`}
                              </span>
                              <div className="flex-grow border-t border-muted ml-2" />
                            </div>

                            {rejectedFeatures.map((feature) => (
                              <CusKanbanCard
                                key={feature.id}
                                column={column as KanbanColumn}
                                feature={feature}
                                isFull={isFull}
                                onActionClick={({
                                  actionId,
                                  actionLabel,
                                  feature,
                                }) => {
                                  if (actionId === "chat")
                                    return handleChatClick();
                                  if (actionId === "reject") {
                                    setRejectFeature(feature);
                                    setShowRejectPopup(true);
                                    return;
                                  }
                                  setPayload({
                                    actionId,
                                    actionLabel,
                                    feature,
                                  });
                                  const drawer = resolveDrawerType(
                                    actionId,
                                    feature.stage,
                                    feature.status
                                  );
                                  if (drawer)
                                    openDrawer(
                                      drawer,
                                      { actionId, actionLabel, feature },
                                      feature
                                    );
                                }}
                              />
                            ))}
                          </>
                        )}
                      </div>
                    </ScrollableShadowBox>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <CandidateDrawer
        open={drawerType === "candidate_view"}
        stage={drawerStage}
        onOpenChange={(open) => !open && closeDrawer()}
      />
      <WorkOrderDrawer
        open={
          drawerType === "work_order" ||
          drawerType === "work_order_pencil" ||
          drawerType === "work_order_pencil_b"
        }
        onOpenChange={(open) => !open && closeDrawer()}
      />
      <ScheduleInterviewForm
        open={drawerType === "interview"}
        onOpenChange={(open) => !open && closeDrawer()}
        profileData={candidateData}
        type={payload?.feature?.status === "Awaiting Interview" ? 1 : 0}
        handleRefresh={handleRefresh}
      />

      <OnboardDrawer
        open={drawerType === "onboard"}
        onOpenChange={(open) => !open && closeDrawer()}
      />

      <ScheduleInterviewMeeting
        open={drawerType === "schedule_interview"}
        onOpenChange={(open) => !open && closeDrawer()}
        profileData={candidateData}
        handleRefresh={handleRefresh}
      />
      <InterviewMeetingEdit
        open={drawerType === "interview_b"}
        onOpenChange={(open) => !open && closeDrawer()}
        profileData={candidateData}
        handleRefresh={handleRefresh}
      />
      <InterviewMeetingView
        open={drawerType === "interview_view"}
        onOpenChange={(open) => !open && closeDrawer()}
        profileData={candidateData}
        handleRefresh={handleRefresh}
      />
      <ProposalDrawer
        open={drawerType === "accept"}
        onOpenChange={(open) => !open && closeDrawer()}
      />
      <WorkOrderView
        open={drawerType === "work_view"}
        stage={drawerStage}
        onOpenChange={(open) => !open && closeDrawer()}
      />
      <OfferViewData
        open={drawerType === "offer_pencil"}
        stage={drawerStage}
        onOpenChange={(open) => !open && closeDrawer()}
      />

      <RejectDialog
        showRejectPopup={showRejectPopup}
        setShowRejectPopup={setShowRejectPopup}
        rejectFeature={rejectFeature!}
        type={rejectFeature?.stage === "Shortlisted" ? 0 : 1}
        handleRefresh={handleRefresh}
      />
    </>
  );
}
