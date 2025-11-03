import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { ProfileDrawerProps } from "@/types/jobs/Info/history.type";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CusTypography } from "@/components/forms/CusTypography";
import { timelineAssets } from "@/lib/utils";
import Image from "next/image";

interface HistoryItem {
  rr_stage: string;
  rr_status: string;
  remarks?: string | null;
  updated_by: string;
  updated_on: string;
  round?: string;
  type?: string;
  mode?: string;
  current_status?: "completed" | "progress" | "pending";
}

interface GroupedStage {
  stage: string;
  status: string;
  updated_on: string;
  updated_by: string;
  remarks?: string | null;
  round?: string;
  type?: string;
  mode?: string;
  current_status?: "completed" | "progress" | "pending";
  subStatuses: {
    stage: string;
    status: string;
    updated_on: string;
    updated_by: string;
    remarks?: string | null;
    round?: string;
    type?: string;
    mode?: string;
    current_status?: "completed" | "progress" | "pending";
  }[];
}

const HistoryDrawer = ({
  candidate,
  candidate_open,
  candidate_action,
}: ProfileDrawerProps) => {
  const [data, setData] = React.useState<GroupedStage[]>([]);

  const groupByStage = (
    data: HistoryItem[],
    current_rr_stage: string,
    current_rr_status: string
  ): GroupedStage[] => {
    const grouped: Record<string, HistoryItem[]> = {};

    data.forEach((item) => {
      const stage = item.rr_stage;
      if (!grouped[stage]) grouped[stage] = [];
      grouped[stage].push(item);
    });

    const stageOrder = [
      "Onboarded",
      "Offer",
      "Workorder",
      "Selected",
      "Interview",
      "Shortlisted",
      "Sourced",
    ];
    const allStages = stageOrder.map((stage) => {
      const items = grouped[stage] ?? [];
      const sorted = items.sort(
        (a, b) =>
          new Date(a.updated_on).getTime() - new Date(b.updated_on).getTime()
      );
      const lastItem = sorted[sorted.length - 1];
      let current_status: "completed" | "progress" | "pending";
      if (
        stage === current_rr_stage &&
        lastItem?.rr_status === current_rr_status
      ) {
        current_status = "progress";
      } else {
        current_status = "completed";
      }

      const subStatuses =
        sorted.slice(0, -1).map((i) => ({
          stage: i.rr_stage,
          status: i.rr_status,
          updated_on: i.updated_on,
          updated_by: i.updated_by,
          remarks: i.remarks,
          round: "Round 1",
          type: "Technical",
          mode: "Virtual Meeting",
          current_status:
            i.rr_stage === current_rr_stage && i.rr_status === current_rr_status
              ? "progress"
              : "completed",
        })) ?? [];

      if (!lastItem) return null;

      return {
        stage,
        status: lastItem.rr_status,
        updated_on: lastItem.updated_on,
        updated_by: lastItem.updated_by,
        remarks: lastItem.remarks,
        round: "Round 1",
        type: "Technical",
        mode: "Virtual Meeting",
        current_status,
        subStatuses,
      };
    });
    return allStages.filter((s) => s !== null) as GroupedStage[];
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        `/api/rr/info/summary/history?rrcandidate_name=${candidate?.rrcandidate_name}`,
        {
          cache: "no-store",
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const groupedData = groupByStage(
        data?.message?.data[0]?.history,
        data?.message?.data[0]?.current_rr_stage,
        data?.message?.data[0]?.current_rr_status
      );
      console.log(groupedData, "groupedData");

      setData(groupedData ?? []);
    } catch (err) {
      setData([]);
    }
  };

  useEffect(() => {
    if (!candidate?.rrcandidate_name) return;
    fetchData();
  }, [candidate?.rrcandidate_name]);

  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const allKeys = data.map((_, idx) => `item-${idx}`);

  const handleToggleAll = () => {
    if (openItems.length === allKeys.length) {
      setOpenItems([]);
    } else {
      setOpenItems(allKeys);
    }
  };

  const handleAccordionToggle = (itemKey: string) => {
    setOpenItems((prev) =>
      prev.includes(itemKey)
        ? prev.filter((key) => key !== itemKey)
        : [...prev, itemKey]
    );
  };

  const formatDateTime = (datetimeStr: string): string => {
    const date = new Date(datetimeStr);

    if (isNaN(date.getTime())) return "Invalid Date";

    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

    return `${formattedDate} – ${formattedTime}`;
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <Sheet open={candidate_open} onOpenChange={candidate_action}>
        <SheetContent side="right" className="w-full max-w-none p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Loading History Data</SheetTitle>
          </SheetHeader>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading history data...</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={candidate_open} onOpenChange={candidate_action}>
      <SheetContent className="w-[30%] !max-w-none h-screen flex flex-col gap-0">
        <SheetHeader className="p-2 border-b bg-card">
          <SheetTitle className="flex items-center">
            <Button type="button" variant="ghost" className="h-5 w-5 p-0">
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <p className="text-lg font-semibold ml-2">History</p>
          </SheetTitle>
        </SheetHeader>

        <div className="!w-auto  !max-w-none bg-card">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={candidate.avatar || "/assets/icons/placeholder.svg"}
                  alt={candidate.name}
                />
                <AvatarFallback>{candidate.name?.charAt(0)}</AvatarFallback>
              </Avatar>

              <CusTypography
                label={candidate.name ?? "N/A"}
                size="base"
                valueFontWeight="normal"
                className="ml-2"
              />
            </div>
            <div>
              <Button
                variant="secondary"
                size="sm"
                className="ml-4 bg-accent"
                onClick={handleToggleAll}
              >
                {openItems.length === allKeys.length
                  ? "Collapse all"
                  : "Expand all"}
              </Button>
            </div>
          </div>

          <div className="pt-2 h-[86vh] overflow-auto">
            <Accordion
              type="multiple"
              className="w-full"
              value={openItems}
              onValueChange={setOpenItems}
            >
              {data?.map((item, index) => (
                <AccordionItem
                  key={index}
                  className="flex border-b-0 px-6"
                  value={`item-${index}`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full grid place-items-center border z-10 ${
                        item.current_status === "progress"
                          ? "animate-pulse-border"
                          : ""
                      }`}
                      style={{
                        backgroundColor: `var(--${
                          timelineAssets[item.stage.toLowerCase()]?.bgColor
                        })`,
                        borderColor:
                          item.current_status === "progress"
                            ? "#4af610"
                            : `var(--${
                                timelineAssets[item.stage.toLowerCase()]?.color
                              })`,
                      }}
                    >
                      {timelineAssets[item.stage.toLowerCase()]?.icon ? (
                        <Image
                          src={timelineAssets[item.stage.toLowerCase()].icon}
                          alt={timelineAssets[item.stage.toLowerCase()].icon}
                          width={10}
                          height={10}
                        />
                      ) : (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: `var(--${
                              timelineAssets[item.stage.toLowerCase()]?.color
                            })`,
                          }}
                        />
                      )}
                    </div>

                    {index !== data?.length - 1 && (
                      <div
                        className="w-[2px] flex-1"
                        style={{
                          backgroundColor: `var(--${
                            timelineAssets[item.stage.toLowerCase()]?.color
                          })`,
                        }}
                      />
                    )}
                  </div>
                  <div className="flex items-start gap-4 w-full">
                    <div className="flex-1 mb-2">
                      {item.subStatuses?.length !== 0 ? (
                        <AccordionTrigger
                          className="py-0 px-0 hover:no-underline"
                          style={{
                            paddingBottom: "8px",
                            ...(data.length !== index + 1 &&
                              !openItems?.includes(`item-${index}`) && {
                                borderBottom: "1px solid #ebebeb",
                              }),
                          }}
                          onClick={() => handleAccordionToggle(`item-${index}`)}
                        >
                          <div className="flex">
                            <div className="text-left space-y-1 pl-4">
                              <h5 className="text-sm mb-0">
                                <span className="font-semibold">
                                  {item.stage}{" "}
                                </span>
                                <span
                                  className={`ml-1 text-xs text-(--onboarded)`}
                                >
                                  ({item.status})
                                </span>
                              </h5>
                              <div>
                                {item?.round && (
                                  <span className="ml-1 px-2 py-1 rounded-2xl text-[9px] bg-muted">
                                    Round {item?.round}
                                  </span>
                                )}
                                {item?.type && (
                                  <span className="ml-1 px-2 py-1 rounded-2xl text-[9px] bg-(--history-type-light) text-(--history-type)">
                                    {item?.type}
                                  </span>
                                )}
                                {item?.mode && (
                                  <span className="ml-1 px-2 py-1 inline-flex rounded-2xl text-[9px] bg-(--history-mode-light) text-(--history-mode) align-middle">
                                    <Image
                                      src={
                                        "/assets/icons/job-info/Kanban/virtual_meeting.svg"
                                      }
                                      alt={"Virtual Meeting"}
                                      className="mr-1"
                                      width={10}
                                      height={10}
                                    />
                                    {item?.mode}
                                  </span>
                                )}
                              </div>
                              {item.updated_on && (
                                <p className="text-xs pt-1 text-gray-500 mb-0">
                                  {formatDateTime(item.updated_on)}
                                </p>
                              )}
                              {item.updated_by && (
                                <p className="text-xs pt-1 text-gray-600 mb-0">
                                  {item.updated_by}
                                </p>
                              )}
                              {item.remarks && (
                                <p className="text-xs pt-1 text-gray-600 mb-0">
                                  {item.remarks}
                                </p>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                      ) : (
                        <div
                          className="p-0 flex"
                          style={{
                            borderBottom: "1px solid #ebebeb",
                            paddingBottom: "8px",
                          }}
                        >
                          <div className="text-left py-0 px-0 pl-4">
                            <h5 className="font-semibold text-sm">
                              <span className="font-semibold">
                                {item.stage}{" "}
                              </span>
                              {item?.status && (
                                <span
                                  className={`ml-1 text-xs  text-(--onboarded)`}
                                >
                                  ({item.status})
                                </span>
                              )}
                            </h5>
                            <div>
                              {item?.round && (
                                <span className="ml-1 px-2 py-1 rounded-2xl text-[9px] bg-muted">
                                  Round {item?.round}
                                </span>
                              )}
                              {item?.type && (
                                <span className="ml-1 px-2 py-1 rounded-2xl text-[9px] bg-(--history-type-light) text-(--history-type)">
                                  {item?.type}
                                </span>
                              )}
                              {item?.mode && (
                                <span className="ml-1 px-2 py-1 inline-flex rounded-2xl text-[9px] bg-(--history-mode-light) text-(--history-mode) align-middle">
                                  <Image
                                    src={
                                      "/assets/icons/job-info/Kanban/virtual_meeting.svg"
                                    }
                                    alt={"Virtual Meeting"}
                                    className="mr-1"
                                    width={10}
                                    height={10}
                                  />
                                  {item?.mode}
                                </span>
                              )}
                            </div>
                            {item.updated_on && (
                              <p className="text-xs pt-1 text-gray-500">
                                {formatDateTime(item.updated_on)}
                              </p>
                            )}
                            {item.updated_by && (
                              <p className="text-xs pt-1 text-gray-600">
                                {item.updated_by}
                              </p>
                            )}
                            {item.remarks && (
                              <p className="text-xs pt-1 text-gray-600">
                                {item.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {item.subStatuses?.length !== 0 && (
                        <AccordionContent
                          className="p-0 pt-2"
                          style={{
                            border: "2px solid #f0f0f0",
                            borderRadius: "10px"
                          }}
                        >
                          <div>
                            {item.subStatuses?.map((sub, subIdx) => (
                              <div
                                key={subIdx}
                                className="pl-2 pb-4 ml-[11px] pt-0 border-l-2 relative"
                                style={
                                  item.subStatuses?.length !== subIdx + 1
                                    ? {
                                        borderColor: `var(--${
                                          timelineAssets[
                                            sub.stage.toLowerCase()
                                          ]?.color
                                        })`,
                                      }
                                    : { borderColor: "white" }
                                }
                              >
                                <div
                                  className={`w-4 h-4 rounded-full grid border place-items-center absolute -left-[9px] top-0`}
                                  style={{
                                    backgroundColor: `var(--${
                                      timelineAssets[sub.stage.toLowerCase()]
                                        ?.bgColor
                                    })`,
                                    borderColor: `var(--${
                                      timelineAssets[sub.stage.toLowerCase()]
                                        ?.color
                                    })`,
                                  }}
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full`}
                                    style={{
                                      backgroundColor: `var(--${
                                        timelineAssets[sub.stage.toLowerCase()]
                                          ?.color
                                      })`,
                                    }}
                                  />
                                </div>
                                <div className="pl-2.5 pr-2.5">
                                  <h5 className="font-semibold text-sm">
                                    <span className="font-semibold">
                                      {sub.stage}{" "}
                                    </span>
                                    <span>
                                      {sub.status && (
                                        <span
                                          className={`ml-1 text-xs  text-(--onboarded)`}
                                        >
                                          ({sub.status})
                                        </span>
                                      )}
                                    </span>
                                  </h5>
                                  <div>
                                    {sub?.round && (
                                      <span className="ml-1 px-2 py-1 rounded-2xl text-[9px] bg-muted">
                                        Round {sub?.round}
                                      </span>
                                    )}
                                    {sub?.type && (
                                      <span className="ml-1 px-2 py-1 rounded-2xl text-[9px] bg-(--history-type-light) text-(--history-type)">
                                        {sub?.type}
                                      </span>
                                    )}
                                    {sub?.mode && (
                                      <span className="ml-1 px-2 py-1 inline-flex rounded-2xl text-[9px] bg-(--history-mode-light) text-(--history-mode) align-middle">
                                        <Image
                                          src={
                                            "/assets/icons/job-info/Kanban/virtual_meeting.svg"
                                          }
                                          alt={"Virtual Meeting"}
                                          className="mr-1"
                                          width={10}
                                          height={10}
                                        />
                                        {sub?.mode}
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs pt-1 text-gray-500">
                                    {formatDateTime(sub.updated_on)}
                                  </p>
                                  <p
                                    className="text-xs pt-1 text-gray-600"
                                    style={{
                                      paddingBottom: "8px",
                                      ...(item.subStatuses.length !==
                                        subIdx + 1 && {
                                        borderBottom: "1px solid #ebebeb",
                                      }),
                                    }}
                                  >
                                    {sub.updated_by}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      )}
                    </div>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HistoryDrawer;
