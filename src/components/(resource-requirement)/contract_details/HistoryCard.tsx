"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDataContext } from "@/context/DataProvider";
import HistorySkeleton from "../shared/HistorySkeleton";
import { timelineAssets } from "@/lib/utils";
import HistoryDrawer from "../shared/HistoryDrawer";
import HistoryDrawerContent from "../shared/HistoryDrawerContent";
import { candidatesTimeline } from "@/data/Info/candidate-details/history";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";

export default function HistoryCard() {
  const { history, fetchHistory } = useDataContext();
  const [open, setOpen] = useState(false);
  const [drawerOpenItems, setDrawerOpenItems] = useState<string[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  if (!history) return <HistorySkeleton />;
  const data = history;

  const getStatusText = (status: string) =>
    status === "completed" ? "Completed" : "Ready to Onboard";

  const allIds = data.map((_, idx) => `item-${idx}`);
  const isAllExpanded = drawerOpenItems.length === data.length;

  function toggleExpandCollapse() {
    setDrawerOpenItems(isAllExpanded ? [] : allIds);
  }

  const TimelineDot = ({ stage, index }: { stage: string; index: number }) => {
    const normalizedStage = stage.toLowerCase().replace(/\s+/g, "_");
    const asset = timelineAssets[normalizedStage] || timelineAssets.default;

    return (
      <div className="flex flex-col items-center h-full relative">
        <div
          className="w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10"
          style={{
            borderColor: `var(--${asset?.color})`,
            backgroundColor: `var(--${asset?.bgColor})`,
          }}
        >
          {asset?.icon ? (
            <Image src={asset.icon} alt={stage} width={12} height={12} />
          ) : (
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: `var(--${asset?.color})` }}
            />
          )}
        </div>
        {index !== data.length - 1 && (
          <div
            className="w-[2px] flex-1"
            style={{
              backgroundColor: `var(--${asset?.color})`,
              minHeight: "40px",
              marginTop: "4px",
            }}
          />
        )}
      </div>
    );
  };

  const HistoryList = ({ controlled }: { controlled?: boolean }) => (
    <Accordion
      type="multiple"
      className="w-full"
      value={controlled ? drawerOpenItems : undefined}
      onValueChange={
        controlled
          ? (v: string | string[]) => {
              if (Array.isArray(v)) setDrawerOpenItems(v);
              else if (typeof v === "string" && v) setDrawerOpenItems([v]);
              else setDrawerOpenItems([]);
            }
          : undefined
      }
    >
      {data.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border-b-0 relative flex gap-4"
        >
          <div className="flex flex-col items-center pt-1">
            <TimelineDot stage={item.title} index={index} />
          </div>
          <div className="flex-1 pb-4">
            <AccordionTrigger className="py-0 px-0 hover:no-underline [&[data-state=open]>div>svg]:rotate-180">
              <div className="flex items-center justify-between w-full">
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-label">
                      {item.title}
                    </span>
                    <span className="text-xs py-0.5 rounded-full text-(--onboarded)">
                      ({getStatusText(item.status)})
                    </span>
                  </div>
                  <div className="text-xs text-label">{item.date}</div>
                  <div className="text-xs text-label">By {item.by}</div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-2 pb-2">
              {[
                {
                  status: "Document Signed",
                  date: "2025-05-08",
                  time: "09:30 AM",
                  by: "TE HR - Priya Nair",
                },
                {
                  status: "Awaiting Customer Signature",
                  date: "2025-05-08",
                  time: "09:30 AM",
                  by: "TE HR - Priya Nair",
                },
                {
                  status: "Ready for Documentation",
                  date: "2025-05-08",
                  time: "09:30 AM",
                  by: "TE HR - Priya Nair",
                },
              ].map((sub, subIdx) => (
                <div
                  key={subIdx}
                  className="flex items-start gap-4 pb-4 relative"
                >
                  <div className="w-4 h-4 rounded-full border flex items-center justify-center absolute left-[-28px] z-20 border-gray-400 bg-white">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.status === "completed"
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {item.title}
                        </span>
                        <span className="text-xs text-green-600">
                          ({sub.status})
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {sub.date} - {sub.time}
                      </div>
                      <div className="text-xs text-gray-600">{sub.by}</div>
                    </div>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );

  return (
    <>
      <Card className="h-[28%] overflow-y-auto scroll-container gap-0 py-2">
        <CardHeader className="px-3 sticky top-0 bg-white z-10 border-b !pb-1 gap-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">History</CardTitle>
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button variant="outline">View</Button>
              </DrawerTrigger>
              <HistoryDrawerContent
                candidate={{
                  candidate_id: "PR-2025-000001",
                  name: "Ashok Mishra",
                  avatar: "/avatars/avatar-1.png",
                }}
                candidatesTimeline={candidatesTimeline}
              />
            </Drawer>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-0">
          <ScrollArea className="h-[220px] pr-2">
            <div className="relative">
              <div className="px-6 pb-4 pt-2 overflow-y-scroll">
                <div className="w-[300px]">
                  {candidatesTimeline["PR-2025-000001"]?.map((item, index) => (
                    <div key={index} className="border-b-0">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          {item.subStatuses ? (
                            <div className="py-0 px-0 hover:no-underline">
                              <div className="flex">
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`w-6 h-6 rounded-full border grid place-items-center`}
                                    style={{
                                      backgroundColor: `var(--${
                                        timelineAssets[item.stage]?.bgColor
                                      })`,
                                      borderColor: `var(--${
                                        timelineAssets[item.stage]?.color
                                      })`,
                                    }}
                                  >
                                    {timelineAssets[item.stage]?.icon ? (
                                      <Image
                                        src={timelineAssets[item.stage].icon}
                                        alt={timelineAssets[item.stage].icon}
                                        width={10}
                                        height={10}
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  {index !==
                                    candidatesTimeline["PR-2025-000001"]
                                      ?.length -
                                      1 && (
                                    <div
                                      className="w-[2px] h-[60px]"
                                      style={{
                                        backgroundColor: `var(--${
                                          timelineAssets[item.stage]?.color
                                        })`,
                                      }}
                                    />
                                  )}
                                </div>
                                <div className="text-left space-y-1 pl-4">
                                  <h5 className="text-sm">
                                    <span className="font-semibold">
                                      {item.title}{" "}
                                    </span>
                                    <span
                                      className={`ml-1 text-xs text-(--onboarded)`}
                                    >
                                      ({item.status})
                                    </span>
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
                                  </h5>
                                  {item.date && item.time && (
                                    <p className="text-xs pt-1 text-gray-500">
                                      {item.date} - {item.time}
                                    </p>
                                  )}
                                  {item.by && (
                                    <p className="text-xs pt-1 text-gray-600">
                                      {item.by}
                                    </p>
                                  )}
                                  {item.notes && (
                                    <p className="text-xs pt-1 text-gray-600">
                                      {item.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-0 flex">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-6 h-6 rounded-full grid place-items-center border`}
                                  style={{
                                    backgroundColor: `var(--${
                                      timelineAssets[item.stage]?.bgColor
                                    })`,
                                    borderColor: `var(--${
                                      timelineAssets[item.stage]?.color
                                    })`,
                                  }}
                                >
                                  {timelineAssets[item.stage]?.icon ? (
                                    <Image
                                      src={timelineAssets[item.stage].icon}
                                      alt={timelineAssets[item.stage].icon}
                                      width={10}
                                      height={10}
                                    />
                                  ) : (
                                    <div
                                      className={`w-2 h-2 rounded-full`}
                                      style={{
                                        backgroundColor: `var(--${
                                          timelineAssets[item.stage]?.color
                                        })`,
                                      }}
                                    />
                                  )}
                                </div>
                                {index !==
                                  candidatesTimeline["PR-2025-000001"]?.length -
                                    1 && (
                                  <div
                                    className="w-[2px] h-[60px]"
                                    style={{
                                      backgroundColor: `var(--${
                                        timelineAssets[item.stage]?.color
                                      })`,
                                    }}
                                  />
                                )}
                              </div>
                              <div className="text-left py-0 px-0 pl-4">
                                <h5 className="font-semibold text-sm">
                                  <span className="font-semibold">
                                    {item.title}{" "}
                                  </span>
                                  {item?.status && (
                                    <span
                                      className={`ml-1 text-xs  text-(--onboarded)`}
                                    >
                                      ({item.status})
                                    </span>
                                  )}
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
                                </h5>
                                {item.date && item.time && (
                                  <p className="text-xs pt-1 text-gray-500">
                                    {item.date} - {item.time}
                                  </p>
                                )}
                                {item.by && (
                                  <p className="text-xs pt-1 text-gray-600">
                                    {item.by}
                                  </p>
                                )}
                                {item.notes && (
                                  <p className="text-xs pt-1 text-gray-600">
                                    {item.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {(item.subStatuses || item.round || item.type) && (
                            <div className="p-0">
                              <div>
                                {item.subStatuses?.map((sub, subIdx) => (
                                  <div
                                    key={subIdx}
                                    className="pl-2 pb-4 ml-[11px] pt-0 border-l-2 relative"
                                    style={{
                                      borderColor: `var(--${
                                        timelineAssets[item.stage]?.color
                                      })`,
                                    }}
                                  >
                                    <div
                                      className={`w-4 h-4 rounded-full grid border place-items-center absolute -left-[9px] top-0`}
                                      style={{
                                        backgroundColor: `var(--${
                                          timelineAssets[item.stage]?.bgColor
                                        })`,
                                        borderColor: `var(--${
                                          timelineAssets[item.stage]?.color
                                        })`,
                                      }}
                                    >
                                      <div
                                        className={`w-2 h-2 rounded-full`}
                                        style={{
                                          backgroundColor: `var(--${
                                            timelineAssets[item.stage]?.color
                                          })`,
                                        }}
                                      />
                                    </div>
                                    <div className="pl-5">
                                      <h5 className="font-semibold text-sm">
                                        <span className="font-semibold">
                                          {item.title}{" "}
                                        </span>
                                        <span>
                                          {sub.status && (
                                            <span
                                              className={`ml-1 text-xs  text-(--onboarded)`}
                                            >
                                              ({sub.status})
                                            </span>
                                          )}
                                          {sub?.round && (
                                            <span className="ml-1 px-2 py-1 rounded-2xl text-[9px] bg-muted whitespace-nowrap">
                                              Round&nbsp;{sub.round}
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
                                        </span>
                                      </h5>
                                      <p className="text-xs pt-1 text-gray-500">
                                        {sub.date} - {sub.time}
                                      </p>
                                      <p className="text-xs pt-1 text-gray-600">
                                        {sub.by}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-[400px] sm:w-[600px] max-h-[100vh] flex flex-col bg-white"
        >
          <SheetHeader>
            <SheetTitle>History</SheetTitle>
          </SheetHeader>

          <div className="flex items-center justify-between px-4 mt-2">
            <Button variant="outline" onClick={toggleExpandCollapse}>
              {isAllExpanded ? "Collapse all" : "Expand all"}
            </Button>
            <SheetClose asChild>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </SheetClose>
          </div>

          <div className="mt-3 px-2 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="relative p-2">
                <HistoryList controlled />
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
