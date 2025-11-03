import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, ThumbsDown, ThumbsUp } from "lucide-react";
import { CircularProgress } from "../../../../../shared/CircularProgress";
import { Badge } from "@/components/ui/badge";
import { SwipeCandidateType } from "@/types/jobs/Info/Swipe.type";
import { formatCurrency } from "@/lib/utils";

export interface ProfileData {
  name: string;
  role: string;
  experience: string;
  salary: string;
  expectedSalary: string;
  availableDate: string;
  matchPercentage: number;
  avatar?: string;
}

interface ProfileCardProps {
  profile: SwipeCandidateType;
  onDecline?: () => void;
  onAccept?: () => void;
}

export function ProfileCard({
  profile,
  onDecline,
  onAccept,
}: ProfileCardProps) {
  return (
    <Card className="rounded-2xl justify-between w-full max-w-sm lg:max-w-none mx-auto shadow-sm overflow-hidden p-0 border gap-0">
      <CardContent className="p-3 relative">
        <div className="flex items-start justify-between pb-2">
          {/* Profile Section */}
          <div className="flex items-start gap-2">
            <Avatar className="h-11 w-11 border-2 border-gray-200">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="bg-gray-100 text-label">
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="font-semibold text-base text-(--label-foreground) leading-tight line-clamp-2">
                {profile.name}
              </h3>
              <p className="text-sm text-label mt-1 line-clamp-1">
                {profile.location || "N/A"}
              </p>
            </div>
          </div>
          <CircularProgress
            value={profile.match_score || 0}
            size={40}
            strokeWidth={3}
          />
        </div>

        {/* Details */}
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-label">Salary:</span>
            <span className="font-semibold">
              {formatCurrency(
                profile?.currentRate,
                profile?.currentRateBillingCurrency
              )}
              <span className="text-(--muted-foreground) text-xs lowercase">
                {profile?.currentRateBillingFrequency
                  ? ` / ${profile?.currentRateBillingFrequency}`
                  : ""}
              </span>
            </span>
          </div>
          <div
            className={`flex items-center gap-2 ${
              profile?.expectedRate != null &&
              profile?.currentRate != null &&
              profile.expectedRate > profile.currentRate
                ? "text-[var(--orange)] font-semibold"
                : ""
            }`}
          >
            <span>Expected Salary:</span>
            <span className="font-semibold">
              {formatCurrency(
                profile?.expectedRate,
                profile?.expectedRateBillingCurrency
              )}
              <span className="text-(--muted-foreground) text-xs lowercase">
                {profile?.expectedRateBillingFrequency
                  ? ` / ${profile?.expectedRateBillingFrequency}`
                  : ""}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-label">Available Date:</span>
            <span className="font-semibold text-(--label-foreground)">
              {profile.available_date}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Footer Buttons */}
      <CardFooter className="p-0 flex items-center w-full">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 bg-(--failure-light)  transition-colors rounded-none hover:bg-(--failure)/20"
          onClick={onDecline}
        >
          <img
            src="/assets/icons/job-info/thumbsDown.svg"
            alt=""
            className="h-4 w-4 mr-2"
          />
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-(--success-light) text-white transition-colors rounded-none hover:bg-(--success)/20"
          onClick={onAccept}
        >
          <img
            src="/assets/icons/job-info/thumbsUp.svg"
            alt=""
            className="h-4 w-4 mr-2"
          />
        </Button>
      </CardFooter>
    </Card>
  );
}
