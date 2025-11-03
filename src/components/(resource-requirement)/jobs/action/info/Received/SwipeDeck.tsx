"use client";

import * as React from "react";
import {
  ThumbsUp,
  ThumbsDown,
  XCircle,
  CheckCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReceivedCards from "./ReceivedCards";
import { SwipeCandidateType } from "@/types/jobs/Info/Swipe.type";
import { EmptyCard } from "./EmptyReceived";
import { SwipeCard } from "./SwipeCard";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ProfileCardSkeleton } from "./ProfileCardSkeleton";
import { useRouter, useSearchParams } from "next/navigation";

interface SwipeDeckProps {
  isFull?: boolean;
}

export default function SwipeDeck({ isFull }: SwipeDeckProps) {
  const [cards, setCards] = React.useState<SwipeCandidateType[]>([]);
  const [offset, setOffset] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const searchParams = useSearchParams();
  const jobID = searchParams.get("d");
  const router = useRouter();

  const handleSwipe = async (
    data_uniq_id: string,
    direction: "like" | "dislike"
  ) => {
    const payload = {
      rrcandidate_name: data_uniq_id,
      disposition: direction === "like" ? "Accepted" : "Rejected",
    };

    try {
      const res = await fetch(
        `/api/rr/post/shortlist-candidate?id=${data_uniq_id}&direction=${direction}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const response = await res.json();
      console.log(response, "re33");
      if (!res.ok || response?.message?.status === "error") {
        toast("Action Failed", {
          description: response?.message?.message || "Something went wrong.",
          icon: <XCircle className="text-red-500" />,
          style: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
          },
        });
        throw new Error(response?.message?.message || "Request failed");
      }

      // Success toast
      if (response?.message?.status === "success") {
        toast("Application Updated", {
          description:
            direction === "like"
              ? "The candidate has been shortlisted."
              : "The candidate application has been declined.",
          icon: <CheckCircle2 className="text-green-500" />,
          style: {
            backgroundColor: "#dcfce7",
            color: "#166534",
          },
        });
        fetchJD();
      }

      console.log("✅ Form submitted:", response);
    } catch (err) {
      console.error("❌ API error:", err);
    }
  };

  // const handleSwipe = (data_uniq_id: string, direction: "like" | "dislike") => {
  //   console.log(data_uniq_id, direction, "aassdf");
  //   setCards((prev) => prev.filter((c) => c.candidate_id !== data_uniq_id));
  //   onSwipe?.(data_uniq_id, direction);

  //   if (direction === "dislike") {
  //     toast("Application Declined", {
  //       description: "The candidate application has been declined.",
  //       icon: <XCircle className="text-green-500" />,
  //       style: {
  //         backgroundColor: "#dcfce7",
  //         color: "#166534",
  //       },
  //     });
  //   } else if (direction === "like") {
  //     toast("Application Accepted", {
  //       description:
  //         "The candidate application has been accepted successfully!",
  //       icon: <CheckCircle className="text-green-500" />,
  //       style: {
  //         backgroundColor: "#dcfce7",
  //         color: "#166534",
  //       },
  //     });
  //   }
  // };

  const fetchJD = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/rr/info/summary/list?job_id=${jobID}&limit=14&stage=Sourced&status=Awaiting Customer Acceptance`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const data = responseData.data;

      // Validate that data exists and is an array
      if (responseData.status == "success") {
        setCards(data);
      } else {
        console.warn("Unexpected API response structure:", responseData);
        setCards([]);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setCards([]); // Ensure data is set to null on error
    } finally {
      setLoading(false); // Ensure loading state is set to false after the fetch attempt
    }
  };

  React.useEffect(() => {
    if (!jobID) return;
    fetchJD();
  }, [jobID]);

  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const handleClickShortlisted = () => {
    const value = "4";
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div className={`px-4`}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Received</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchJD}>
              Request more profiles
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleClickShortlisted}
            >
              View shortlisted candidates
            </Button>
            <Button
              variant="ghost"
              size={"sm"}
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`flex items-center gap-1 `}>
                      {/* <img src={"/assets/icons/job-info/swipeGridView.svg"} className="h-4 w-4" alt="" /> */}
                      <Image
                        src={"/assets/icons/job-info/swipeGridView.svg"}
                        className="h-4 w-4"
                        width={16}
                        height={16}
                        alt=""
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className={` text-white`}>
                    <p className="font-bold text-sm capitalize">Grid View</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`flex items-center gap-1 `}>
                      {/* <img src={"/assets/icons/job-info/swipeCardView.svg"} className="h-4 w-4" alt="" /> */}
                      <Image
                        src={"/assets/icons/job-info/swipeCardView.svg"}
                        className="h-4 w-4"
                        width={16}
                        height={16}
                        alt=""
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className={` text-white`}>
                    <p className="font-bold text-sm capitalize">List View</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </Button>
          </div>
        </div>
        {isFull && <Separator className="my-2" />}
        <div className="min-w-0 overflow-auto h-full max-h-full">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <ProfileCardSkeleton key={i} />
              ))}
            </div>
          ) : cards && cards.length > 0 ? (
            viewMode === "list" ? (
              <div className="py-0">
                <div className="relative w-full mx-auto min-h-[440px] flex items-center justify-center">
                  {/* ✅ Action Buttons outside the card */}
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <Button
                      onClick={() =>
                        handleSwipe(cards[0].rrcandidate_name ?? "", "dislike")
                      }
                      className={`rounded-md px-5 py-2 border-2 font-semibold transition-colors  bg-destructive hover:bg-destructive/90 hover:text-destructive-foreground hover:shadow gap-1`}
                      // ${offset < 0 ? "bg-red-500 text-white border-red-500" : "text-red-500 border-red-500 bg-card"
                    >
                      <ThumbsDown className="" /> Dislike
                    </Button>
                  </div>

                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <Button
                      onClick={() =>
                        handleSwipe(cards[0].rrcandidate_name ?? "", "like")
                      }
                      className={`rounded-md px-5 py-2 border-2 font-semibold transition-colors bg-(--success) hover:bg-(--success)/90 hover:text-(--success-foreground) hover:shadow gap-1`}
                      // ${offset > 0? "bg-green-500 text-white border-green-500": "text-green-500 border-green-500 bg-card"}
                    >
                      <ThumbsUp className="" /> Like
                    </Button>
                  </div>

                  {/* Cards */}
                  {cards.map((candidate, index) => (
                    <SwipeCard
                      key={index}
                      candidate={candidate}
                      index={index}
                      total={cards.length}
                      onSwipe={handleSwipe}
                      offset={index === 0 ? offset : 0}
                      setOffset={setOffset}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <ReceivedCards cards={cards} onSwipe={handleSwipe} />
            )
          ) : (
            <EmptyCard />
          )}
        </div>
      </div>
    </>
  );
}
