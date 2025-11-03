"use client"

import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/forms/CustomSheet"
import { Button } from "@/components/ui/button"
import { ChevronLeft, CircleCheck } from "lucide-react"
import { useDataContext } from "@/context/DataProvider"
import { CandidateProfile } from "./CandidateProfile"
import { UnifiedSection } from "./CandidateProposal"
import ScrollableShadowBox from "@/components/layout/ScrollableShadowBox"

type CandidateDrawerProps = {
  open: boolean
  stage: string | null;
  onOpenChange: (open: boolean) => void
}

export function CandidateDrawer({ open, stage, onOpenChange }: CandidateDrawerProps) {
  const { candidateData, fetchCandidateData } = useDataContext()
  const [currentProposal, setCurrentProposal] = useState(0)
  const [currentExpectation, setCurrentExpectation] = useState(0)
const [linkedVersion, setLinkedVersion] = useState<string | null>(null);  
  // New state to track active link - independent of navigation
  const [activeLinkVersion, setActiveLinkVersion] = useState<string | null>(null)
  const [activeLinkIndex, setActiveLinkIndex] = useState<number | null>(null)

  useEffect(() => {
    if (open && !candidateData) {
      fetchCandidateData()
    }
  }, [open, candidateData,])

  if (!candidateData) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full max-w-none p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Loading Candidate Data</SheetTitle>
          </SheetHeader>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading candidate data...</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }
const handleLinkClick = (version: string, fromType: "proposal" | "expectation") => {
  setLinkedVersion(version);

  if (fromType === "proposal") {
    const matchedExpectationIndex = candidateData.expectations.findIndex(
      e => e.version === version
    );
    if (matchedExpectationIndex !== -1) setCurrentExpectation(matchedExpectationIndex);
  } else {
    const matchedProposalIndex = candidateData.proposals.findIndex(
      p => p.version === version
    );
    if (matchedProposalIndex !== -1) setCurrentProposal(matchedProposalIndex);
  }
};

 const handleNextProposal = () => {
  // Clear active link when navigating proposals manually
  setActiveLinkVersion(null)
  setActiveLinkIndex(null)
  setCurrentProposal((prev) => (prev + 1) % candidateData.proposals.length)
}

const handlePrevProposal = () => {
  // Clear active link when navigating proposals manually
  setActiveLinkVersion(null)
  setActiveLinkIndex(null)
  setCurrentProposal((prev) =>
    prev === 0 ? candidateData.proposals.length - 1 : prev - 1
  )
}

  const handleNextExpectation = () => {
    setCurrentExpectation((prev) => (prev + 1) % candidateData.expectations.length)
    // Don't clear the active link when navigating expectations
  }

  const handlePrevExpectation = () => {
    setCurrentExpectation((prev) =>
      prev === 0 ? candidateData.expectations.length - 1 : prev - 1
    )
    // Don't clear the active link when navigating expectations
  }

  // Check if there's an active link
  const hasActiveLink = activeLinkVersion !== null && activeLinkIndex !== null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-none min-w-full lg:min-w-11/12 p-0 gap-0.5 bg-card">
        <SheetHeader className="p-2 border-b pb-2 mb-2">
          <div className="flex items-center gap-1">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-8 px-2 hover:bg-transparent">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            <CircleCheck className="w-5 h-5 text-(--all-candidate)" />
            <SheetTitle className="text-lg">Select Candidate</SheetTitle>
          </div>
        </SheetHeader>
        
        <div className="grid grid-cols-5 h-[calc(100vh-80px)] px-4 gap-2">
          <ScrollableShadowBox>
            <div className="bg-(--profile-bg) overflow-y-auto rounded col-span-1">
              {candidateData.candidate ? (
                <CandidateProfile candidate={candidateData.candidate} />
              ) : (
                <p className="flex justify-center items-center h-full">No candidate data</p>
              )}
            </div>
          </ScrollableShadowBox>

          {/* Proposal Section (Left) - Always shows proposal data */}
          <div className="col-span-2 border rounded-sm">
            <UnifiedSection
              // data={
              //   hasActiveLink
              //     ? candidateData.proposals[activeLinkIndex!] // Show matching proposal version
              //     : candidateData.proposals[currentProposal] // Show current proposal
              // }
                data={candidateData.proposals[currentProposal]}
              type="proposal" // Always render as proposal
              // Left side navigation always works independently
              onNext={handleNextProposal}
              onPrev={handlePrevProposal}
              hasNext={candidateData.proposals.length > 1}
              hasPrev={candidateData.proposals.length > 1}
              linkedExpectationVersion={
                hasActiveLink ? activeLinkVersion : undefined
              }
                isLinked={linkedVersion === candidateData.proposals[currentProposal].version}
  linkedVersion={linkedVersion || undefined}
              onLinkClick={(version) => handleLinkClick(version, "proposal")}
            />
          </div>

          {/* Expectation Section (Right) */}
          <div className="col-span-2 border rounded-sm overflow-y-auto scroll-container">
            <UnifiedSection
              data={candidateData.expectations[currentExpectation]}
              type="expectation"
              onNext={handleNextExpectation}
              onPrev={handlePrevExpectation}
              hasNext={candidateData.expectations.length > 1}
              hasPrev={candidateData.expectations.length > 1}
              onLinkClick={(version) => handleLinkClick(version, "expectation")}
                isLinked={
                activeLinkVersion === candidateData.expectations[currentExpectation]?.version
              }
                linkedVersion={linkedVersion || undefined}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}