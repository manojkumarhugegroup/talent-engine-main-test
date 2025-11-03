import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/forms/CustomAccordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Candidate } from "@/types/jobs/Info/kanban/candidate"
interface CandidateProfileProps {
    candidate: Candidate
}

export function ProfileSection({ candidate }: CandidateProfileProps) {
    return (
        <div className="max-w-md mx-auto p-4 ">
            {/* Profile Section */}
            <div className="flex flex-col  gap-4">
                {/* Avatar */}
                <Avatar className="w-20 h-20 ">
                    <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                    <AvatarFallback className="text-lg font-medium">
                        {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                </Avatar>



                <div className="flex flex-col gap-2 text-xs">
                    <div>
                        <p className="text-label mb-1 text-xs"> Name</p>
                        <p className="font-bold text-label text-xs">{candidate.name}</p>
                    </div>
                    <div>
                        <p className="text-label mb-1">Nationality</p>
                        <p className="font-bold text-label">{candidate.nationality}</p>
                    </div>
                    <div>
                        <p className="text-label mb-1">Position</p>
                        <p className="font-bold text-label">{candidate.profession}</p>
                    </div>
                    <div>
                        <p className="text-label mb-1">Category</p>
                        <p className="font-bold text-label">{candidate.category}</p>
                    </div>



                </div>
            </div>

            <Separator className="border-b border-[#D0D0D0] mt-2" />


            <Accordion type="single" collapsible  className="w-full">
                {/* Project Info */}
                <AccordionItem value="project-info">
                    <AccordionTrigger className="text-sm font-semibold text-label">Project Info</AccordionTrigger>
                    <AccordionContent>
                        
                        <div className="flex flex-col gap-3 text-xs">
                            <div>
                                <p className="text-label mb-1 text-xs">Project Name</p>
                                <p className="font-bold text-label text-xs">{candidate.projectInfo.projectName}</p>
                            </div>
                            <div>
                                <p className="text-label mb-1">Location</p>
                                <p className="font-bold text-label">{candidate.projectInfo.location}</p>
                            </div>
                            <div>
                                <p className="text-label mb-1">Position Start Date</p>
                                <p className="font-bold text-label">{candidate.projectInfo.startDate}</p>
                            </div>
                            <div>
                                <p className="text-label mb-1">Minimum Contract Duration</p>
                                <p className="font-bold text-label">{candidate.projectInfo.contractDuration}</p>
                            </div>
                            <div>
                                <p className="text-label mb-1">Position Est. End Date</p>
                                <p className="font-bold text-label">{candidate.projectInfo.endDate}</p>
                            </div>
                            <div>
                                <p className="text-label mb-1">Min. Mob/Demob Notice Period</p>
                                <p className="font-bold text-label">{candidate.projectInfo.noticePeriod}</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Work & Leave Policy */}
                <AccordionItem value="work-leave-policy">
                    <AccordionTrigger className="text-sm font-semibold text-label">Work & Leave Policy</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 text-xs">
                            <div className="flex flex-col items-start">
                                <span className="text-label">Total Bill Rate (As per HR)</span>
                                <span className="font-bold text-label">{candidate.compensation.totalBillRate}</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-label">Candidate Expected Salary</span>
                                <span className="font-bold text-label">{candidate.compensation.expectedSalary}</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>


        </div>
    )
}
