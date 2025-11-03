"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronLeft,
  ChevronRight,
  // Pencil,
  CircleCheckBig,
  Link,
  CircleCheck,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Expectation, Proposal } from "@/types/jobs/Info/kanban/candidate";
import { ScrollArea } from "@/components/ui/scroll-area";

type SectionType = "proposal" | "expectation";

interface UnifiedSectionProps {
  data: Proposal | Expectation;
  type: SectionType;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  onLinkClick?: (expectationVersion: string) => void; // Modified to pass version
  isLinked?: boolean;
  linkedExpectationVersion?: string; // New prop to show linked version
  linkedVersion?:string;
  

}

// Theme configuration for different section types
const themes = {
  proposal: {
    bgColor: "bg-[#FBFDFF]",
    borderColor: "border-(--candidate-border)",
    notesColor: "bg-[#E5F2FF]",
    salaryColor: "text-(--candidate-label)",
    versionColor: "text-(--candidate-label)",
    statusBadge: "bg-orange-50 text-(--selected)  border-orange-200",
    totalCostColor: "text-(--candidate-label)",
  },
  expectation: {
    bgColor: "bg-[#FFFBF9]",
    borderColor: "border-(--expect-border)",
    notesColor: "bg-[#FFE0C4]",
    salaryColor: "text-(--candidate-total)",
    versionColor: "text-(--candidate-total)",
    statusBadge: "", // Not used for expectations
    totalCostColor: "text-(--candidate-total)",
  },
};

export function UnifiedSection({
  data,
  type,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  onLinkClick,
  isLinked = false,
  linkedExpectationVersion,
  // linkedVersion,
}: UnifiedSectionProps) {
  const theme = themes[type];
  const isProposal = type === "proposal";
  const proposal = isProposal ? (data as Proposal) : null;
  // const expectation = !isProposal ? (data as Expectation) : null;

  const title = isProposal ? "Proposal" : "Candidate Expectation";
  const notesTitle = isProposal ? "Notes" : "Candidate Remarks";
 
  return (
    <div className="max-w-none w-full bg-card py-1">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className={`text-sm font-medium ${theme.versionColor}`}>
            ({data.version})
          </span>

          {/* Show linked version indicator for proposals */}
          {/* {isProposal && linkedExpectationVersion && (
            <div className="flex items-center gap-1">
              <CircleCheck className="h-4 w-4 text-(--onboarded)" />
              <span className="text-xs text-(--onboarded) font-medium">
                Linked to Expectation ({linkedExpectationVersion})
              </span>
            </div>
          )}
           */}
          {/* Show edit button and status badge only for proposals */}
          {isProposal && (
            <>
              {/* <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                <Pencil className="h-3 w-3 text-gray-500" />
              </Button> */}
              <Badge
                className={`text-xs px-2 py-0.5 rounded-sm ${theme.statusBadge}`}
              >
                {proposal?.status}
              </Badge>
            </>
          )}
        </div>

        <div className="flex gap-1">
          <Button
            size="sm"
            className="h-7 w-7 p-0 bg-primary hover:bg-primary/90 rounded cursor-pointer"
            onClick={onPrev}
            disabled={!hasPrev}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            className="h-7 w-7 p-0 bg-primary hover:bg-primary/90 rounded cursor-pointer"
            onClick={onNext}
            disabled={!hasNext}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div
        className={`border-2 ${theme.borderColor} ${theme.bgColor} rounded-lg m-3`}
      >
        <ScrollArea className="h-[calc(90vh-4rem)]">
          {/* Salary Section */}
          <div className={`px-1 py-2 border-b ${theme.borderColor} mx-2`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-lg font-bold ${theme.salaryColor}`}>
                    ${data.salary.amount}
                  </span>
                  <span
                    className={`text-base font-medium ${theme.salaryColor}`}
                  >
                    /Month
                  </span>
                  <span className="text-sm text-gray-500 italic ml-1">
                    ({data.salary.type})
                  </span>

                  {/* Link button only for expectations */}
                  {onLinkClick && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onLinkClick?.(data.version)} // make sure prop is passed
                      className="cursor-pointer"
                      title={
                        isLinked
                          ? `Linked to Proposal`
                          : `Link this expectation (${data.version}) to proposal`
                      }
                    >
                      {isLinked ? (
                        <CircleCheck className="h-4 w-4 text-(--onboarded)" />
                      ) : (
                        <Link className="h-4 w-4 text-(--chat)" />
                      )}
                    </Button>
                  )}
                </div>
                <div className="text-sm text-[#0F172A] mt-0.5">
                  Proposed Joining Date -{" "}
                  <span className="font-semibold">{data.joiningDate}</span>
                </div>
              </div>
              <div className="text-right text-xs text-[#717171] mt-4">
                <div className="font-medium">{data.submittedBy.name}</div>
                <div>{data.submittedBy.date}</div>
              </div>
            </div>
          </div>

          {/* Terms Accordion */}
          <Accordion
            type="single"
            collapsible
            defaultValue="terms"
            className="border-none"
          >
            <AccordionItem value="terms" className="border-none">
              <AccordionTrigger className="text-base font-semibold hover:no-underline px-4 py-2">
                Terms
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <div className="grid grid-cols-2 gap-6 relative">
                  <div
                    className={`absolute left-1/2 top-0 bottom-0 w-px transform -translate-x-1/2 bg-(--accent)`}
                  />

                  {/* By Client Column */}
                  <div>
                    <h5 className="font-medium text-sm text-label mb-1">
                      By Client
                    </h5>
                    <div className="space-y-1">
                      {data.terms.byClient.map((term, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CircleCheckBig className="h-3 w-3 text-(--onboarded) mt-1.5 flex-shrink-0" />
                          <span
                            className={`text-xs leading-relaxed ${
                              isProposal ? "text-label" : "text-gray-700"
                            }`}
                          >
                            {term}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* By Candidate Column */}
                  <div>
                    <h5 className="font-medium text-sm text-label mb-1">
                      By Candidate
                    </h5>
                    <div className="space-y-1">
                      {data.terms.byCandidate.map((term, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CircleCheckBig className="h-3 w-3 text-(--all-candidate) mt-2 flex-shrink-0" />
                          <span
                            className={`text-xs leading-relaxed ${
                              isProposal ? "text-label" : "text-gray-700"
                            }`}
                          >
                            {term}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* By Talent Engine */}
                    <div
                      className={`mt-2 border-t ${
                        isProposal
                          ? "pt-2  border-blue-200"
                          : "pt-2 border-orange-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-label">
                          By Talent Engine
                        </span>
                      </div>
                      <div className="space-y-1">
                        {data.terms.talentEngine.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CircleCheckBig className="h-3 w-3 text-(--onboarded) mt-2 flex-shrink-0" />
                            <span
                              className={`text-xs leading-relaxed ${
                                isProposal ? "text-label" : "text-gray-700"
                              }`}
                            >
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Not Applicable */}
                    <div
                      className={`mt-2 ${
                        isProposal ? "pt-2 border-t border-blue-200" : "mt-1"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-label">
                          Not Applicable
                        </span>
                      </div>
                      <div className="space-y-1">
                        {data.terms.notApplicable.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CircleCheckBig className="h-3 w-3 text-(--onboarded) mt-2 flex-shrink-0" />
                            <span
                              className={`text-xs leading-relaxed ${
                                isProposal ? "text-label" : "text-gray-700"
                              }`}
                            >
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="px-4">
            <Separator className={`border-b-2 ${theme.borderColor}`} />
          </div>

          {/* Notes Section */}
          <div className="px-4 py-2">
            <h4 className="font-semibold text-base text-label mb-1">
              {notesTitle}
            </h4>
            <div
              className={`${theme.notesColor} p-3 rounded text-xs text-label leading-relaxed`}
            >
              {data.notes}
            </div>
          </div>

          {/* Compensation Section */}
          <div className="px-4 pt-1 pb-2">
            <h4 className="font-semibold text-base text-label">Compensation</h4>

            <div className={`border rounded-sm ${theme.borderColor} p-2 mt-2`}>
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-label">
                      Base Daily Salary
                    </span>
                    <span className="text-sm font-bold text-label">
                      ${data.compensation.baseSalary}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <div className="flex items-center gap-1">
                      <CircleCheckBig className="h-3.5 w-3.5 text-(--all-candidate)" />
                      <span className="text-sm text-label">
                        Mandatory Burdens
                      </span>
                    </div>
                    <span className="text-sm font-bold text-label">
                      ${data.compensation.mandatoryBurdens}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <div className="flex items-center gap-1">
                      <CircleCheckBig className="h-3.5 w-3.5 text-(--onboarded)" />
                      <span className="text-sm text-label">
                        Variable Benefits (Est.)
                      </span>
                    </div>
                    <span className="text-sm font-bold text-label">
                      ${data.compensation.variableBenefits}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-1">
                    <div className="flex justify-between items-center py-1">
                      <span
                        className={`text-sm font-semibold ${theme.totalCostColor}`}
                      >
                        Total Daily Cost
                      </span>
                      <span
                        className={`text-sm font-bold ${theme.totalCostColor}`}
                      >
                        ${data.compensation.totalDailyCost}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-1 border-l border-gray-200 pl-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-label">
                      Over time (On weekdays)
                    </span>
                    <span className="text-sm font-bold text-label">
                      ${data.compensation.overtimeWeekdays}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-xs text-label">
                      Over time (On weekends)
                    </span>
                    <span className="text-sm font-bold text-label">
                      ${data.compensation.overtimeWeekends}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-xs text-label">
                      Over time (National Holiday)
                    </span>
                    <span className="text-sm font-bold text-label">
                      ${data.compensation.overtimeHoliday}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-xs text-label">
                      Standby Rate (Incl. days in Mob/Demob)
                    </span>
                    <span className="text-sm font-bold text-label">
                      ${data.compensation.standbyRate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F0F0F0] p-1.5 rounded text-xs text-[#7B7B7B] leading-relaxed mt-1.5">
                *{data.compensation.notes}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// Updated wrapper components
interface ProposalSectionProps {
  proposal: Proposal;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  linkedExpectationVersion?: string; // New prop
  onLinkClick?: (expectationVersion: string) => void;
  isLinked?: boolean;
}

export function ProposalSection(props: ProposalSectionProps) {
  return (
    <UnifiedSection
      data={props.proposal}
      type="proposal"
      onNext={props.onNext}
      onPrev={props.onPrev}
      hasNext={props.hasNext}
      hasPrev={props.hasPrev}
      linkedExpectationVersion={props.linkedExpectationVersion}
    />
  );
}

interface ExpectationSectionProps {
  expectation: Expectation;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  onLinkClick?: (expectationVersion: string) => void; // Updated signature
  isLinked?: boolean;
}

export function ExpectationSection(props: ExpectationSectionProps) {
  return (
    <UnifiedSection
      data={props.expectation}
      type="expectation"
      onNext={props.onNext}
      onPrev={props.onPrev}
      hasNext={props.hasNext}
      hasPrev={props.hasPrev}
      onLinkClick={props.onLinkClick}
      isLinked={props.isLinked}
    />
  );
}
