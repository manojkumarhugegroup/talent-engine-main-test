import React from "react";
import {CircularProgress} from "@/components/shared/CircularProgress"; // adjust this
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {MatchingCard} from "./MatchingCard";
import {CandidateCard} from "./CandidateCard";
// import { Button } from "@/components/ui"; // if needed

interface MatchScoreCellProps {
  row: any;
  tab: string;
  onRowSelect?: (row: any) => void;
  setOpen?: (open: boolean) => void;
}

const MatchScoreCell: React.FC<MatchScoreCellProps> = ({ row, tab, onRowSelect, setOpen }) => {
  const score = row.getValue("match_score") || 0;
  const recruiterScore = row.original.recruiter_score;
  const matchScoreChange = row.original.match_score_change;

  const iconSrc = matchScoreChange
    ? "/assets/icons/job-info/suggested_icon.svg"
    : "/assets/icons/job-info/manual_icon.svg";

  const handleClick = () => {
    if (tab === "sourced") {
      onRowSelect?.(row);
      setOpen?.(true);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="relative w-[50px] h-[50px] flex items-center justify-center cursor-pointer"
              onClick={handleClick}
            >
              <CircularProgress value={score} size={40} strokeWidth={3} />
              {tab === "sourced" && (
                <img
                  src={iconSrc}
                  alt="status icon"
                  className="absolute top-[-1px] right-[-1px] w-[18px] h-[18px]"
                />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-transparent p-0 z-50"
            arrowClassName="bg-card shadow-r-lg shadow-b-lg border-r-2 border-b-2"
          >
            {recruiterScore > 0 && matchScoreChange && tab === "sourced" ? (
              <MatchingCard
                row={row}
                score={score}
                recruiterScore={recruiterScore}
                description={row.original.summary}
                skills={row.original.key_skills.map((skill: any) => ({
                  name: skill.name,
                  value: skill.type,
                }))}
                onClick={handleClick}
              />
            ) : (
              <CandidateCard
                description={row.original.summary}
                skills={row.original.key_skills.map((skill: any) => ({
                  name: skill.name,
                  value: skill.type,
                }))}
              />
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MatchScoreCell;
