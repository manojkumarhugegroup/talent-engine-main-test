"use client"

import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/forms/CustomSheet"
import { Button } from "@/components/ui/button"
import { ChevronLeft, CircleCheck } from "lucide-react"
import { useDataContext } from "@/context/DataProvider"
import { CandidateProfile } from "../Candidate/CandidateProfile"
import { UnifiedSection } from "../Candidate/CandidateProposal"
import ProposalSection from "./ProposalSection"
type CandidateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProposalDrawer({ open, onOpenChange }: CandidateDrawerProps) {
  const { candidateData, fetchCandidateData } = useDataContext()

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



  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-none  min-w-full lg:min-w-11/12 p-0 gap-0.5 bg-card">
        <SheetHeader className="p-1.5">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="cursor-pointer hover:bg-transparent">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CircleCheck className="w-5 h-5 text-(--all-candidate)" />
            <SheetTitle className="text-label">Select Candidate</SheetTitle>
          </div>
        </SheetHeader>

        <div className="grid grid-cols-5 h-[calc(100vh-80px)] px-4 gap-2">
          <div className="bg-(--profile-bg) overflow-y-auto rounded-sm col-span-1">
            {candidateData.candidate ? (
              <CandidateProfile candidate={candidateData.candidate} />
            ) : (
              <p className="flex justify-center items-center h-full">No candidate data</p>
            )}
          </div>


          <div className="col-span-2 border rounded-sm overflow-y-auto ">
            <ProposalSection
            />
          </div>

          <div className="col-span-2 border rounded-sm overflow-y-auto flex justify-center items-center ">
            <p className="mx-auto">

              No history available</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}