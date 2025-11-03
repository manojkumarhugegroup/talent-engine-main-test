"use client";
import { JD } from "@/components/(resource-requirement)/jobs/action/info/jd";
import Kanban from "@/components/(resource-requirement)/jobs/action/info/Kanban/Kanban";
import MainInfo from "@/components/(resource-requirement)/jobs/action/info/CandidateSummary/Main";
import RrInfo from "@/components/(resource-requirement)/jobs/action/info/RrInfo";
import SwipeDeck from "@/components/(resource-requirement)/jobs/action/info/Received/SwipeDeck";
import { getStatusColor } from "@/components/(resource-requirement)/jobs/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  tabTheme,
} from "@/components/forms/CusTabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Fullscreen, Minimize } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { JobDataType } from "@/types/jobs/editRR.type";
import ChatInterface from "@/components/(resource-requirement)/jobs/action/info/Chat/chat";

export default function Info() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fullscreenSection, setFullscreenSection] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<string>("1");
  const [data, setData] = useState<JobDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const job_id = searchParams.get("d");

  useEffect(() => {
    const typeParam = searchParams.get("type");

    if (typeParam) {
      const typeValue = parseInt(typeParam, 10);
      if (!isNaN(typeValue) && typeValue >= 1 && typeValue <= 6) {
        setActiveTab(typeValue.toString());
      } else {
        setActiveTab("1");
      }
    } else {
      setActiveTab("1");
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", value);
    router.push(`?${params.toString()}`, { scroll: false });
    setActiveTab(value);
  };

  const tabOptions = [
    {
      value: "1",
      label: "",
      label_head: "Candidate Summary",
      theme: "all-candidate" as tabTheme,
      activeImage: "/assets/icons/job-info/candidate_summary_w.svg",
      inactiveImage: "/assets/icons/job-listing/candidate_summary.svg",
      bgColor: "bg-[#FF9B10]",
    },
    // {
    //   value: '2',
    //   label: "",
    //   theme: "sourcing" as tabTheme,
    //   activeImage: "/assets/icons/job-listing/sourcing.svg",
    //   inactiveImage: "/assets/icons/job-info/sourcing_w.svg",
    // },
    {
      value: "3",
      label: "",
      label_head: "Received",
      theme: "received" as tabTheme,
      activeImage: "/assets/icons/job-info/received_w.svg",
      inactiveImage: "/assets/icons/job-listing/received.svg",
      bgColor: "bg-[#45B6FC]",
    },
    {
      value: "4",
      label: "",
      label_head: "Processing",
      theme: "onboarded" as tabTheme,
      activeImage: "/assets/icons/job-info/processing_w.svg",
      inactiveImage: "/assets/icons/job-info/processing.svg",
      bgColor: "bg-[#10B981]",
    },
    {
      value: "5",
      label: "",
      label_head: "Chat",
      theme: "chat" as tabTheme,
      activeImage: "/assets/icons/job-info/chat_w.svg",
      inactiveImage: "/assets/icons/job-info/chat.svg",
      bgColor: "bg-[#EA5455]",
    },
    {
      value: "6",
      label: "",
      label_head: "Job Description",
      theme: "jd" as tabTheme,
      activeImage: "/assets/icons/job-info/jd_w.svg",
      inactiveImage: "/assets/icons/job-info/jd.svg",
      bgColor: "bg-[#17A2B8]",
    },
  ];

  const fetchJD = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/rr/info/singleget?job_id=${job_id}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      // Validate that data exists and is an array
      if (responseData && responseData.status === "success") {
        const jobDataArray = responseData.data;
        setData(jobDataArray || null);
      } else {
        console.warn("Unexpected API response structure:", responseData);
        setData(null);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setData(null); // Ensure data is set to null on error
    } finally {
      setLoading(false); // Ensure loading state is set to false after the fetch attempt
    }
  };

  const [kanbanList, setkanbanList] = useState<unknown[]>([]);

  const fetchKanban = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/rr/info/kanban?job_id=${job_id}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const responseData = await res.json();

      if (responseData && Array.isArray(responseData?.message.data)) {
        const data = responseData?.message.data;
        setkanbanList(data ?? []);
      } else {
        setkanbanList([]);
      }
    } catch (error) {
      setkanbanList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJD();
  }, []);

  useEffect(() => {
    if (activeTab === "4") fetchKanban();
  }, [activeTab]);

  const handleRefresh = () => {
    fetchKanban();
  };

  return (
    <>
      {/* Header */}
      <div className="p-0 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-transparent"
          onClick={() => router.push("/resource-requirement/jobs")}
        >
          <ChevronLeft />
          <p className="text-lg font-semibold"> Info</p>
        </Button>
        <Badge
          variant="secondary"
          className={`rounded-sm text-sm ${getStatusColor(data?.state ?? "Open")}`}
        >
          {data?.state}
        </Badge>
        <h1 className="text-xl font-bold w-4/5 capitalize px-3">
          {data?.job_title}
        </h1>
      </div>

      {/* Main */}
      <div className="p-2">
        <>
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-2 relative">
            {/* Left Sidebar */}
            <div
              className={`${
                fullscreenSection === "tab"
                  ? "hidden"
                  : fullscreenSection === "list"
                  ? "col-span-full"
                  : "col-span-1 md:col-span-2 lg:col-span-3 "
              } flex flex-col gap-2 relative  h-[calc(90vh-3rem)]`}
            >
              <RrInfo
                isFull={fullscreenSection === "list"}
                setFullscreenSection={setFullscreenSection}
                data={data}
                loading={loading}
              />
            </div>

            <Card
              className={`${
                fullscreenSection === "list"
                  ? "hidden"
                  : fullscreenSection === "tab"
                  ? "col-span-full"
                  : "col-span-1 md:col-span-4 lg:col-span-9 "
              }  flex-1 justify-between p-0 gap-0 h-full `}
            >
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <div className="border-b border-gray-200 flex justify-between items-center px-2">
                  <span className="flex items-center divide-x divide-gray-200 px-1">
                    <TabsList className="bg-transparent pb-1 pt-2 px-1.5">
                      {tabOptions.map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          className="px-3 py-1"
                          value={tab.value}
                          theme={tab.theme}
                          activeImage={tab.activeImage}
                          inactiveImage={tab.inactiveImage}
                          isActive={activeTab === tab.value}
                          title={tab.label_head}
                          bgColor={tab.bgColor}
                        >
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </span>
                  {fullscreenSection !== "tab" ? (
                    <Button
                      variant="outline"
                      className="bg-card"
                      size="sm"
                      onClick={() => setFullscreenSection("tab")}
                    >
                      <Fullscreen className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="bg-card"
                      size="sm"
                      onClick={() => setFullscreenSection?.(null)}
                    >
                      <Minimize className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <TabsContent value="1" className="mt-0">
                  <MainInfo
                    setFullscreenSection={setFullscreenSection}
                    isFull={fullscreenSection === "tab"}
                  />
                </TabsContent>
                <TabsContent value="3">
                  <SwipeDeck isFull={fullscreenSection === "tab"} />
                </TabsContent>
                <TabsContent value="4">
                  <Kanban
                    setFullscreenSection={setFullscreenSection}
                    isFull={fullscreenSection === "tab"}
                    kanbanList={kanbanList}
                    handleRefresh={handleRefresh}
                  />
                </TabsContent>
                <TabsContent value="5">
                  <ChatInterface />
                </TabsContent>
                <TabsContent value="6">
                  <JD
                    setFullscreenSection={setFullscreenSection}
                    isFull={fullscreenSection === "tab"}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </>
      </div>
    </>
  );
}
