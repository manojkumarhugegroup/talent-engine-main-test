import React from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { CusTypography } from "@/components/forms/CusTypography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { timelineAssets } from "@/lib/utils";

interface TimelineItemSubStatus {
  status?: string;
  round?: number;
  type?: string;
  mode?: string;
  date?: string;
  time?: string;
  by?: string;
}

interface TimelineItem {
  title: string;
  status?: string;
  round?: number;
  type?: string;
  mode?: string;
  date?: string;
  time?: string;
  by?: string;
  notes?: string;
  stage: string;
  subStatuses?: TimelineItemSubStatus[];
}

interface Candidate {
  candidate_id: string;
  name: string;
  avatar?: string;
}

interface HistoryDrawerContentProps {
  candidate: Candidate;
  candidatesTimeline: Record<string, TimelineItem[]>;
}

const HistoryDrawerContent: React.FC<HistoryDrawerContentProps> = ({
  candidate,
  candidatesTimeline,
}) => {
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const allKeys =
    candidatesTimeline[candidate.candidate_id]?.map(
      (_, idx) => `item-${idx}`
    ) || [];

  const handleToggleAll = () => {
    console.log("allKeys", allKeys, openItems);
    if (openItems.length === allKeys.length) {
      setOpenItems([]); // Collapse all
    } else {
      setOpenItems(allKeys); // Expand all
    }
  };

  const handleAccordionToggle = (itemKey: string) => {
    setOpenItems((prev) =>
      prev.includes(itemKey)
        ? prev.filter((key) => key !== itemKey)
        : [...prev, itemKey]
    );
  };

  return (
    <DrawerContent className="!w-auto  !max-w-none bg-card">
      <DrawerHeader className="p-2 border-b">
        <DrawerTitle className="flex items-center">
          <DrawerClose asChild>
            <Button type="button" variant="ghost" className="h-5 w-5 p-0">
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
          </DrawerClose>
          <p className="text-lg font-semibold ml-2">History</p>
        </DrawerTitle>
      </DrawerHeader>
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
      <div className="px-6 pb-4 pt-2 overflow-y-scroll">
        <Accordion
          type="multiple"
          className="w-[300px]"
          value={openItems}
          onValueChange={setOpenItems}
        >
          {candidatesTimeline[candidate.candidate_id]?.map((item, index) => (
            <AccordionItem
              key={index}
              className="border-b-0"
              value={`item-${index}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  {item.subStatuses ? (
                    <AccordionTrigger
                      className="py-0 px-0 hover:no-underline"
                      onClick={() => handleAccordionToggle(`item-${index}`)}
                    >
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
                            candidatesTimeline[candidate.candidate_id]?.length -
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
                            <span className="font-semibold">{item.title} </span>
                            <span className={`ml-1 text-xs text-(--onboarded)`}>
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
                              {item.date} – {item.time}
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
                    </AccordionTrigger>
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
                          candidatesTimeline[candidate.candidate_id]?.length -
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
                          <span className="font-semibold">{item.title} </span>
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
                            {item.date} – {item.time}
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
                    <AccordionContent className="p-0">
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
                                {sub.date} – {sub.time}
                              </p>
                              <p className="text-xs pt-1 text-gray-600">
                                {sub.by}
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
    </DrawerContent>
  );
};

export default HistoryDrawerContent;
