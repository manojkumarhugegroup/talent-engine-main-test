"use client";

import type React from "react";
import type {
  KanbanColumn,
  KanbanFeature,
} from "@/types/jobs/Info/kanban.type";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProfileDrawer from "../../../../shared/ProfileDrawer";
import Image from "next/image";
import { ACTION_COLORS, getActionsFor, STATUS_COLORS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CalendarDaysIcon, Clock, Video } from "lucide-react";

function getStatusColor(status?: string) {
  return status
    ? STATUS_COLORS[status] ?? "var(--foreground)"
    : "var(--foreground)";
}

interface CusKanbanCardProps {
  column: KanbanColumn;
  feature: KanbanFeature;
  children?: React.ReactNode;
  isFull?: boolean;
  onActionClick?: (args: {
    actionId: string;
    actionLabel: string;
    feature: KanbanFeature;
  }) => void;
}

export const CusKanbanCard: React.FC<CusKanbanCardProps> = ({
  feature,
  children,
  isFull,
  onActionClick,
}) => {
  return (
    <Card key={feature.id} className="min-w-80 w-full p-0 gap-0 overflow-hidden">
      <div className="p-4">
        {/* Avatar + Candidate Info */}
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8 aspect-square">
            {feature.candidate?.image ? (
              <img
                src={feature.candidate.image || "/assets/icons/placeholder.svg"}
                alt={`${feature.candidate.name}'s avatar`}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold text-xs">
                {feature.candidate.name?.slice(0, 2).toUpperCase() || "NA"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            {/* <h3 className="font-bold text-sm text-slate-900 truncate">
              {feature.candidate.name}
            </h3> */}
            <ProfileDrawer candidateName={feature.candidate.name} />
            <p className="text-xs text-slate-600 font-medium line-clamp-2">
              {feature.job_title}
            </p>

            <span
              className="text-xs font-medium capitalize"
              style={{ color: getStatusColor(feature.status) }}
            >
              {feature.status}
            </span>
          </div>
        </div>

        {/* Summary for Shortlisted */}
        {feature.summary && feature.status === "Shortlisted" && isFull && (
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mt-2">
            {feature.summary}
          </p>
        )}

        {/* Interview Rounds */}
        {feature.stage == "Interview" && feature.round && isFull && (
          <div className="flex flex-wrap mt-1">
            {feature.round.map((r, idx) => (
              <div key={idx} className="flex flex-wrap gap-2">
                <Badge className="rounded-full bg-(--badge-bg) text-label text-xs">
                  Round <span className="font-bold">{r.round_no}</span>
                </Badge>
                {r.date && (
                  <Badge className="rounded-full bg-(--badge-bg) text-label text-xs">
                    <CalendarDaysIcon className="w-3 h-3" />
                    {r.date}
                  </Badge>
                )}
                {r.time && (
                  <Badge className="rounded-full bg-(--badge-bg) text-label text-xs">
                    <Clock className="w-3 h-3" />
                    {r.time}
                  </Badge>
                )}
                <Badge className="rounded-full bg-(--history-type-light) text-(--history-type) text-xs">
                  {r.round_type}
                </Badge>
                <Badge className="rounded-full bg-(--history-mode-light) text-(--history-mode) text-xs">
                  <Video className="w-3 h-3" />
                  {r.round_mode}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Rejected remarks */}
        {feature.stage === "Interview" &&
          feature.interview === "Rejected" &&
          isFull && (
            <p className="text-xs text-slate-600 mt-2">
              Remarks: Candidate did not meet the required technical proficiency
              for the role.
            </p>
          )}

        {/* Work order, selected, offer sections unchanged */}
        {feature.stage === "Work Order" &&
          "baseSalary" in feature &&
          isFull && (
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge className="rounded-full bg-[#EAEAEA] text-label">
                Base Salary{" "}
                <span className="font-bold">{feature.baseSalary}</span>
              </Badge>
              {feature.joinDate && (
                <Badge className="rounded-full bg-[#EAEAEA] text-label">
                  Proposed Joining Date{" "}
                  <span className="font-bold">{feature.joinDate}</span>
                </Badge>
              )}
            </div>
          )}

        {feature.stage === "Selected" && "baseSalary" in feature && isFull && (
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge className="rounded-full bg-[#EAEAEA] text-label">
              Base Salary{" "}
              <span className="font-bold">{feature.baseSalary}</span>
            </Badge>
            {feature.joinDate && (
              <Badge className="rounded-full bg-[#EAEAEA] text-label">
                Proposed Joining Date{" "}
                <span className="font-bold">{feature.joinDate}</span>
              </Badge>
            )}
          </div>
        )}

        {feature.stage === "Offer" && "baseSalary" in feature && isFull && (
          <div className="flex flex-wrap gap-2 mt-1.5">
            <Badge className="rounded-full bg-[#EAEAEA] text-label">
              Base Salary{" "}
              <span className="font-bold">{feature.baseSalary}</span>
            </Badge>
            <Badge className="rounded-full bg-[#EAEAEA] text-label">
              Total Daily Cost{" "}
              <span className="font-bold">{feature.totalCost}</span>
            </Badge>
            {feature.joinDate && (
              <Badge className="rounded-full bg-[#EAEAEA] text-label">
                Proposed Joining Date{" "}
                <span className="font-bold">{feature.joinDate}</span>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-center border-t border-gray-100 flex-wrap overflow-hidden">
        <Button type="button"
          variant="ghost"
          size="sm"
          className="flex-1 h-8 p-0 rounded-none bg-[#7383D5]/10 hover:bg-[#7383D5]/20 transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onActionClick?.({
              actionId: "chat",
              actionLabel: "Chat",
              feature,
            });
          }}
          aria-label="Chat"
          title="Chat"
        >
          <Image
            src="/assets/icons/job-info/Kanban/chat.svg"
            alt="Chat"
            width={16}
            height={16}
          />
        </Button>

        {getActionsFor(feature.stage, feature.status).map((action) => {
          // ✅ Skip all actions except "message" and "view" if rejected
          if (
            feature.interview === "Rejected" &&
            action.id !== "message" &&
            action.id !== "view"
          ) {
            return null;
          }

          const colors = ACTION_COLORS[action.icon] || {
            base: "bg-gray-100",
            hover: "hover:bg-gray-200",
          };

          return (
            <Button 
              key={action.id} type="button"
              size="sm"
              className={`flex-1 h-8 p-0 rounded-none ${colors.base} ${colors.hover} transition-colors duration-200`}
              onClick={(e) => {
                e.stopPropagation();
                onActionClick?.({
                  actionId: action.id,
                  actionLabel: action.label,
                  feature,
                });
              }}
              aria-label={action.label}
              title={action.label}
            >
              <img
                src={`/assets/icons/job-info/Kanban/${
                  action.icon || "default"
                }.svg`}
                alt={action.icon || "default"}
                className="w-4 h-4"
              />
            </Button>
          );
        })}
      </div>

      {children}
    </Card>
  );
};
