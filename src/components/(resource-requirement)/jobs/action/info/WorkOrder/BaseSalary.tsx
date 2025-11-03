"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, CircleCheckBig } from "lucide-react"
import { useDataContext } from "@/context/DataProvider"

export function CompensationSummary() {
    const { compensationData, fetchCompensationData } = useDataContext()

    // Fetch data when component mounts
    useEffect(() => {
        if (!compensationData) {
            fetchCompensationData()
        }
    }, [compensationData, fetchCompensationData])

    if (!compensationData) {
        return <div className="p-6 text-sm text-muted-foreground">Loading compensation...</div>
    }

    const sym = compensationData.currencySymbol

    return (
        <div className="w-full ">
            <div className="flex-1 overflow-hidden">
            <div className="p-4 md:p-3">
                {/* Header */}
                <div className="bg-(--profile-bg) p-2.5 rounded-md">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-sm text-label">Base Salary</div>
                        </div>
                        <div className="text-right">
                            <div className="text-md font-semibold">{compensationData.baseSalaryValue}</div>
                        </div>
                    </div>

                    {/* Proposed Date */}
                    {compensationData.proposedJoiningDate ? (
                        <div className=" flex items-center justify-between">
                            <div className="text-sm text-label">Proposed Joining Date</div>
                            <div className="text-xs font-medium">{compensationData.proposedJoiningDate}</div>
                        </div>
                    ) : null}

                    {/* Section title */}
                    <h2 className=" mt-1.5 font-semibold text-label text-sm ">Compensation</h2>

                    {/* Breakdown card */}
                    <div className="mt-1.5 rounded-lg border ">
                        <div className="p-3 space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs">Base Daily Salary</span>
                                <span className="text-xs font-bold">
                                    {sym}
                                    {compensationData.breakdown.baseMonthlySalary}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {/* <CircleCheckBig className="h-4 w-4 text-(--onboarded)" /> */}
                                    <span className="text-xs text-label">Mandatory Burdens</span>
                                </div>
                                <span className="text-xs font-bold">
                                    {sym}
                                    {compensationData.breakdown.mandatoryBurdens}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {/* <CircleCheckBig className="h-4 w-4 text-(--all-candidate)" /> */}
                                    <span className="text-xs text-label">6 Force Management Fee.</span>
                                </div>
                                <span className="text-xs font-bold">
                                    {sym}
                                    {compensationData.breakdown.fourceManagementfee}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {/* <CircleCheckBig className="h-4 w-4 text-(--all-candidate)" /> */}
                                    <span className="text-xs text-label">Variable Benefits (Est.)</span>
                                </div>
                                <span className="text-xs font-bold">
                                    {sym}
                                    {compensationData.breakdown.variableBenefits}
                                </span>
                            </div>
                            <div className="">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-(--candidate-label)">Total Monthly Cost</span>
                                    <span className="text-xs font-bold text-(--candidate-label)">
                                        {sym}
                                        {compensationData.breakdown.totalMonthlyCost}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Overtime card */}
                    <div className="mt-1.5 rounded-lg border ">
                        <div className="p-3 space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs">Over time (On weekdays)</span>
                                <span className="text-sm font-semibold">
                                    {sym}
                                    {compensationData.overtime.weekdays}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs">Over time (On weekends)</span>
                                <span className="text-sm font-semibold">
                                    {sym}
                                    {compensationData.overtime.weekends}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs">Over time (National Holiday)</span>
                                <span className="text-sm font-semibold">
                                    {sym}
                                    {compensationData.overtime.holiday}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs">Standby Rate (Including days in Quarantine)</span>
                                <span className="text-sm font-semibold">
                                    {sym}
                                    {compensationData.overtime.standby}
                                </span>
                            </div>
                            <div className="">
                                <span className="text-[11px] text-muted-foreground">* All values are rounded off.</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Terms */}
                {/* <section className="mt-2">
                    <h3 className="font-medium">Terms</h3>

                  
                    <div className="mt-2">
                        <div className="text-xs text-label">By Client</div>
                        <ul className="mt-2 space-y-2" aria-label="Terms by client">
                            {compensationData.terms.byClient.map((item, idx) => (
                                <li key={`client-${idx}`} className="flex items-start gap-2">
                                   <CircleCheckBig className="h-3 w-3 text-(--onboarded)" />
                                    <span className="text-xs">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                  
                    <div className="mt-4">
                        <div className="text-xs text-label">By Candidate</div>
                        {compensationData.terms.byCandidate.length ? (
                            <ul className="mt-2 space-y-2" aria-label="Terms by candidate">
                                {compensationData.terms.byCandidate.map((item, idx) => (
                                    <li key={`candidate-${idx}`} className="flex items-start gap-2">
                                       <CircleCheckBig className="h-3 w-3 text-(--onboarded)" />
                                        <span className="text-xs">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="mt-2 text-xs text-muted-foreground">No items</div>
                        )}
                    </div>

                   
                    <div className="mt-4">
                        <div className="text-xs text-muted-foreground">By Talent Engine</div>
                        {compensationData.terms.byTalentEngine.length ? (
                            <ul className="mt-2 space-y-2" aria-label="Terms by talent engine">
                                {compensationData.terms.byTalentEngine.map((item, idx) => (
                                    <li key={`te-${idx}`} className="flex items-start gap-2">
                                       <CircleCheckBig className="h-3 w-3 text-(--onboarded)" />
                                        <span className="text-xs">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="mt-2 text-xs text-muted-foreground">No items</div>
                        )}
                    </div>

                   
                    <div className="mt-4">
                        <div className="text-xs text-muted-foreground">Not Applicable</div>
                        {compensationData.terms.notApplicable.length ? (
                            <ul className="mt-2 space-y-2" aria-label="Terms not applicable">
                                {compensationData.terms.notApplicable.map((item, idx) => (
                                    <li key={`na-${idx}`} className="flex items-start gap-2">
                                      <CircleCheckBig className="h-3 w-3 text-(--onboarded)" />
                                        <span className="text-xs">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="mt-2 text-xs text-muted-foreground">No items</div>
                        )}
                    </div>
                </section> */}
<section className="mt-1">
                    <h3 className="font-medium mb-2">Terms</h3>

                    {/* Scrollable Terms Container */}
                    <div className="max-h-64 overflow-y-auto pr-2 space-y-2 scroll-container">
                        {/* By Client */}
                        <div>
                            <div className="text-xs text-label">By Client</div>
                            <ul className="mt-2 space-y-2" aria-label="Terms by client">
                                {compensationData.terms.byClient.map((item, idx) => (
                                    <li key={`client-${idx}`} className="flex items-start gap-2">
                                       <CircleCheckBig className="h-3 w-3 text-(--onboarded) flex-shrink-0 mt-0.5" />
                                        <span className="text-xs">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* By Candidate */}
                        <div>
                            <div className="text-xs text-label">By Candidate</div>
                            {compensationData.terms.byCandidate.length ? (
                                <ul className="mt-2 space-y-2" aria-label="Terms by candidate">
                                    {compensationData.terms.byCandidate.map((item, idx) => (
                                        <li key={`candidate-${idx}`} className="flex items-start gap-2">
                                           <CircleCheckBig className="h-3 w-3 text-(--onboarded) flex-shrink-0 mt-0.5" />
                                            <span className="text-xs">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="mt-2 text-xs text-muted-foreground">No items</div>
                            )}
                        </div>

                        {/* By Talent Engine */}
                        <div>
                            <div className="text-xs text-label">By Talent Engine</div>
                            {compensationData.terms.byTalentEngine.length ? (
                                <ul className="mt-2 space-y-2" aria-label="Terms by talent engine">
                                    {compensationData.terms.byTalentEngine.map((item, idx) => (
                                        <li key={`te-${idx}`} className="flex items-start gap-2">
                                           <CircleCheckBig className="h-3 w-3 text-(--onboarded) flex-shrink-0 mt-0.5" />
                                            <span className="text-xs">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="mt-2 text-xs text-label">No items</div>
                            )}
                        </div>

                        {/* Not Applicable */}
                        <div>
                            <div className="text-xs text-label">Not Applicable</div>
                            {compensationData.terms.notApplicable.length ? (
                                <ul className="mt-2 space-y-2" aria-label="Terms not applicable">
                                    {compensationData.terms.notApplicable.map((item, idx) => (
                                        <li key={`na-${idx}`} className="flex items-start gap-2">
                                          <CircleCheckBig className="h-3 w-3 text-(--onboarded) flex-shrink-0 mt-0.5" />
                                            <span className="text-xs">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="mt-2 text-xs text-label">No items</div>
                            )}
                        </div>
                    </div>
                </section>
                {/* Actions */}
                
                <div className="mt-4 flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="flex-1 bg-transparent border-foreground/20 text-foreground hover:bg-transparent"
                    >
                       Cancel   
                    </Button>
                    <Button className="flex-1 bg-(--label) hover:bg-(--label) text-white">Submit</Button>
                </div>
            </div></div>
        </div>
    )
}