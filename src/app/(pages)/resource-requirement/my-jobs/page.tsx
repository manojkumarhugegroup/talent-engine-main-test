"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Eye, Save } from "lucide-react";
import RRInfo from "@/components/(resource-requirement)/my-jobs/RRInfo";
import { JobDataType } from "@/types/jobs/editRR.type";
import Chat from "./chat";
import { InputOverviewDrawer } from "@/components/(resource-requirement)/jobs/action/InputoverviewDrawer";
import { useRouter, useSearchParams } from "next/navigation";
import { SubmitButtonWithPopup } from "@/components/(resource-requirement)/jobs/action/SubmitButtonPopup";

interface ChatMessage {
  id: string;
  message: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export default function ResourceRequirementsLayout() {
  const searchParams = useSearchParams();
  const jobID = searchParams.get("d");
  const [fullscreenSection, setFullscreenSection] = useState<string | null>(
    null
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [data, setData] = useState<JobDataType | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => {
    console.log("clicked");
    setShowPopup(true); // Open the popup
  };

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };
  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: currentMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setCurrentMessage("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message:
          "I'm here to help you with the resource requirements. What would you like to know or modify?",
        sender: "assistant",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const fetchJD = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/rr/info/singleget?job_id=${jobID}`, {
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

  useEffect(() => {
    fetchJD();
  }, []);

  // if (fullscreenSection === "list") {
  //   return (
  //     <div className="h-screen w-full">
  //       <RrInfo
  //         data={data}
  //         loading={loading}
  //         setFullscreenSection={setFullscreenSection}
  //         isFull={true}
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className="">
      {/* Header */}
      <div className="py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              className="hover:bg-transparent !px-0 mb-0 lg:mb-auto"
              size="sm"
              onClick={() => router.back()}
            >
              <ChevronLeft />
              <p className="text-lg font-semibold">Resource Requirements</p>
            </Button>
            <Badge
              variant="secondary"
              className="border border-(--all-candidate) text-(--all-candidate) bg-[#FFF5EB]"
            >
              New
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 bg-white rounded-sm"
              onClick={handleOpenDrawer}
            >
              <Eye className="h-4 w-4" />
              Input Overview
            </Button>
            <InputOverviewDrawer
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-[#6C757D] border-[#6C757D] "
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground"
              type="submit"
              onClick={handleClick}
            >
              Submit
            </Button>
            {showPopup && (
              <SubmitButtonWithPopup
                isOpen={showPopup}
                onClose={() => setShowPopup(false)} // Called by "No", "Later", "View"
                variant="confirm"
                onConfirm={() => {
                  console.log("Confirmed"); // Don't close here
                }}
                onView={() => {
                  console.log("Viewing...");
                  setShowPopup(false);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-5 gap-2 h-full">
        {/* Left Column - RrInfo Component */}
        <div className="col-span-3">
          <RRInfo
            data={data}
            loading={loading}
            setFullscreenSection={setFullscreenSection}
            isFull={false}
          />
        </div>

        {/* Right Column - Chat Interface */}
        <Chat
          chatMessages={chatMessages}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          handleSendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
}
