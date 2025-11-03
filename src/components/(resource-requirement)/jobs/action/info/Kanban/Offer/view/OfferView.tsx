import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/forms/CustomAccordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Candidate, OrderDataType } from "@/types/jobs/Info/kanban/orderdata"
import { CircleCheckBig } from "lucide-react"

interface candidateProfileProps {
    candidate: Candidate
}

export function OfferView({ candidate }: candidateProfileProps) {
    const sym = candidate.compensation.currencySymbol
    return (
        <div className=" p-3 space-y-2.5">
            {/* Profile Section */}
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <Avatar className="md:w-24 md:h-24 ">
                    <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                    <AvatarFallback className="text-lg font-medium">
                        {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                </Avatar>

                {/* candidate Info */}


                <div className="flex flex-row md:gap-12 gap-2 text-xs mt-2.5">
                    <div className="flex flex-col gap-2">
                        <div>
                            <p className="text-label mb-1 text-xs"> Name</p>
                            <p className="font-bold text-label text-xs">{candidate.name}</p>
                        </div>
                        <div>
                            <p className="text-label mb-1">Position</p>
                            <p className="font-bold text-label">{candidate.profession}</p>
                        </div></div>

                    <div className="flex flex-col gap-2">
                        <div>
                            <p className="text-label mb-1">Nationality</p>
                            <p className="font-bold text-label">{candidate.nationality}</p>
                        </div>

                        <div>
                            <p className="text-label mb-1">Category</p>
                            <p className="font-bold text-label">{candidate.category}</p>
                        </div></div>



                </div>
            </div>

            <Separator className="border-b border-[#D0D0D0]" />

            {/* Project Info */}
            <div className="space-y-2 px-2">
                <h4 className="font-semibold text-label text-sm">Project Info</h4>
                <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                        <p className="text-label mb-1 text-xs">Project Name</p>
                        <p className="font-bold text-label text-xs">{candidate.projectInfo.projectName}</p>
                    </div>
                    <div>
                        <p className="text-label mb-1">Location</p>
                        <p className="font-bold text-label">{candidate.projectInfo.location}</p>
                    </div>
                    <div>
                        <p className="text-label mb-1">Project Est. Start Date</p>
                        <p className="font-bold text-label">{candidate.projectInfo.startDate}</p>
                    </div>
                    <div>
                        <p className="text-label mb-1">Project Est. End Date</p>
                        <p className="font-bold text-label">{candidate.projectInfo.endDate}</p>
                    </div>
                    <div>
                        <p className="text-label mb-1">Minimum Contract Duration</p>
                        <p className="font-bold text-label">{candidate.projectInfo.contractDuration}</p>
                    </div>
                    <div>
                        <p className="text-label mb-1">Min. Mob/Demob Notice Period</p>
                        <p className="font-bold text-label">{candidate.projectInfo.noticePeriod}</p>
                    </div>

                </div>
            </div>

            <Separator className="border-b border-[#D0D0D0]" />

            <div className="space-y-3 px-2">
                <h4 className="font-semibold text-label text-sm">Work & Leave Policy</h4>
                <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                        <p className="text-label mb-1 text-xs">Total Monthly Billable Days</p>
                        <p className="font-bold text-label text-xs">{candidate.workPolicy.monthBillRate}</p>
                    </div>
                    <div>
                        <p className="text-label mb-1">Total Annual Billable Days</p>
                        <p className="font-bold text-label">{candidate.workPolicy.annualBillRate}</p>
                    </div>
                    <div>
                        <p className="text-label mb-1">Public Holidays</p>
                        <p className="font-bold text-label">{candidate.workPolicy.publicHolidays}</p>
                    </div>
                    <div>
                        <p className="text-label mb-1">Vacation / Holidays</p>
                        <p className="font-bold text-label">{candidate.workPolicy.vacation}</p>
                    </div>
                    <div>
                        <p className="text-label mb-1">Sick Leave</p>
                        <p className="font-bold text-label">{candidate.workPolicy.sickLeave}</p>
                    </div>
                    <div>
                        <p className="text-label mb-1">Travel Days</p>
                        <p className="font-bold text-label">{candidate.workPolicy.travelDays}</p>
                    </div>

                </div>
            </div>

            {/* Compensation Details */}
            <Separator className="border-b border-[#D0D0D0]" />



            <div className="space-y-2">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="compensation" className="border-none">
                        <AccordionTrigger className="hover:no-underline py-2">
                            <h4 className="font-semibold text-label text-base">Compensation & Terms Details</h4>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="bg-(--profile-bg) p-1 rounded-md">
                                <div className="bg-[#F4F4F4] p-3 rounded-sm">
                                    <div className="flex items-start justify-between ">
                                        <div>
                                            <div className="text-sm text-label">Base Salary</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-md font-semibold">{candidate.compensation.totalSalary}</div>
                                        </div>
                                    </div>
                                    <div className=" flex items-center justify-between">
                                        <div className="text-sm text-label">Proposed Joining Date</div>
                                        <div className="text-xs font-medium">{candidate.compensation.proposedDate}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {/* Breakdown card */}
                                    <div className="mt-1.5 rounded-lg border ">
                                        <div className="p-3 space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs">Base Daily Salary</span>
                                                <span className="text-xs font-bold">
                                                    {sym}
                                                    {candidate.compensation.baseSalary}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CircleCheckBig className="h-4 w-4 text-(--onboarded)" />
                                                    <span className="text-xs text-label">Mandatory Burdens</span>
                                                </div>
                                                <span className="text-xs font-bold">
                                                    {sym}
                                                    {candidate.compensation.mandatoryBurdens}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CircleCheckBig className="h-4 w-4 text-(--all-candidate)" />
                                                    <span className="text-xs text-label">Variable Benefits (Est.)</span>
                                                </div>
                                                <span className="text-xs font-bold">
                                                    {sym}
                                                    {candidate.compensation.variableBenefits}
                                                </span>
                                            </div>
                                            <div className="border-t pt-2 mt-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-(--candidate-label)">Total Monthly Cost</span>
                                                    <span className="text-xs font-bold text-(--candidate-label)">
                                                        {sym}
                                                        {candidate.compensation.totalDailyCost}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Overtime card */}
                                    <div className="mt-1.5 rounded-lg border ">
                                        <div className="p-3 ">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs">Over time (On weekdays)</span>
                                                <span className="text-sm font-semibold">
                                                    {sym}
                                                    {candidate.compensation.overtimeWeekdays}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs">Over time (On weekends)</span>
                                                <span className="text-sm font-semibold">
                                                    {sym}
                                                    {candidate.compensation.overtimeWeekends}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs">Over time (National Holiday)</span>
                                                <span className="text-sm font-semibold">
                                                    {sym}
                                                    {candidate.compensation.overtimeHoliday}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs">Standby Rate (Including days in Quarantine)</span>
                                                <span className="text-sm font-semibold">
                                                    {sym}
                                                    {candidate.compensation.standbyRate}
                                                </span>
                                            </div>
                                            <div className="">
                                                <span className="text-[11px] text-muted-foreground">* All values are rounded off.</span>
                                            </div>
                                        </div>
                                    </div></div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <Accordion type="single" collapsible defaultValue="terms" className="border-none">
                <AccordionItem value="terms" className="border-none">
                    <AccordionTrigger className="text-base font-semibold hover:no-underline  py-1">
                        Terms
                    </AccordionTrigger>
                    <AccordionContent className="px-2">
                        <div className="grid grid-cols-2 gap-6 relative">
                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#C4C4C4] transform -translate-x-1/2"></div>

                            {/* By Client Column */}
                            <div>
                                <h5 className="font-medium text-xs text-label mb-1">By Client</h5>
                                <div className="space-y-1">
                                    {candidate.terms.byClient.map((term, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <CircleCheckBig className="h-3 w-3 text-(--onboarded) mt-1.5 flex-shrink-0" />
                                            <span className="text-xs leading-relaxed  text-label">
                                                {term}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* By Candidate Column */}
                            <div className="">
                                <h5 className="font-medium text-xs text-label mb-1">By Candidate</h5>
                                <div className="space-y-1">
                                    {candidate.terms.byCandidate.map((term, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <CircleCheckBig className="h-3 w-3 text-(--all-candidate) mt-2 flex-shrink-0" />
                                            <span className="text-xs leading-relaxed text-label">
                                                {term}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <Separator className="mt-2" />
                                {/* By Talent Engine */}
                                <div className="mt-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-medium text-label">By Talent Engine</span>
                                    </div>
                                    <div className="space-y-1">
                                        {candidate.terms.talentEngine.map((item, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <CircleCheckBig className="h-3 w-3 text-(--onboarded) mt-2 flex-shrink-0" />
                                                <span className="text-xs leading-relaxed  text-label">
                                                    {item}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Separator className="mt-2" />
                                {/* Not Applicable */}
                                <div className="mt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-label">Not Applicable</span>
                                    </div>
                                    <div className="space-y-1">
                                        {candidate.terms.notApplicable.map((item, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <CircleCheckBig className="h-3 w-3 text-(--onboarded) mt-2 flex-shrink-0" />
                                                <span className="text-xs leading-relaxed  text-label">
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
        </div>
    )
}
