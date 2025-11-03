"use client"

import { useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/forms/CustomSheet"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useDataContext } from "@/context/DataProvider"
import { ProfileSection } from "./ProfileSection"
import ContractTerms from "./ContractTerms"
import { CompensationSummary } from "./BaseSalary"
type CandidateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WorkOrderDrawer({ open, onOpenChange }: CandidateDrawerProps) {
  const { candidateData, fetchCandidateData } = useDataContext()

  useEffect(() => {
    if (open && !candidateData) {
      fetchCandidateData()
    }
  }, [open, candidateData])

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
      <SheetContent side="right" className="w-full max-w-none min-w-full lg:min-w-11/12 p-0 gap-0.5 bg-card">
        <SheetHeader className="p-1.5">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="cursor-pointer hover:bg-transparent">
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <SheetTitle className="text-label">Work Order</SheetTitle>
          </div>
        </SheetHeader>

        <div className="grid grid-cols-12 h-[calc(100vh-80px)] px-4 gap-2">
          <div className="bg-(--profile-bg)  rounded-sm col-span-2 overflow-y-auto scroll-container">
            {candidateData.candidate && (
              <ProfileSection candidate={candidateData.candidate} />
            )}
          </div>


          <div className="col-span-6 h-full overflow-y-auto bg-card rounded-sm shadow-sm scroll-container">
            <ContractTerms
            />
          </div>

          <div className="col-span-4 border rounded-sm h-full  overflow-y-auto scroll-container">
            <CompensationSummary />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}