import React from "react";
import { ProfileCard } from "./ProfileCard";
import { SwipeCandidateType } from "@/types/jobs/Info/Swipe.type";
import ScrollableShadowBox from "@/components/layout/ScrollableShadowBox";

interface ReceivedCardsProps {
  cards: SwipeCandidateType[];
  onSwipe: (data_uniq_id: string, dir: "like" | "dislike") => void;
}

export default function ReceivedCards({ cards, onSwipe }: ReceivedCardsProps) {
  return (
    <ScrollableShadowBox>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[calc(80vh-8rem)] pr-2">
        {cards.map((card, i) => (
          <ProfileCard
            key={i}
            profile={card}
            onDecline={() => onSwipe(card?.rrcandidate_name || "", "dislike")}
            onAccept={() => onSwipe(card?.rrcandidate_name || "", "like")}
          />
        ))}
      </div>
    </ScrollableShadowBox>
  );
}
