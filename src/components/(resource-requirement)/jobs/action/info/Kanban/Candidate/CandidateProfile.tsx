import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Candidate } from "@/types/jobs/Info/kanban/candidate"

interface CandidateProfileProps {
  candidate: Candidate
}

export function CandidateProfile({ candidate }: CandidateProfileProps) {
  return (
    <div className="max-w-md mx-auto p-2 space-y-2">
      {/* Profile Section */}
      <div className="flex items-start gap-2">
        {/* Avatar */}
        <Avatar className="w-16 h-16 ">
          <AvatarImage src={candidate.avatar || "/assets/icons/placeholder.svg"} alt={candidate.name} />
          <AvatarFallback className="text-sm font-medium">
            {candidate.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        {/* Candidate Info */}
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="font-semibold text-sm text-label">{candidate.name}</h3>
            <p className="text-xs text-label font-bold">{candidate.profession}</p>
          </div>
          <div className="grid grid-cols-2 text-xs">
            <div>
              <p className="text-label mb-1">Nationality</p>
              <p className="font-bold text-label text-xs">{candidate.nationality}</p>
            </div>
            <div>
              <p className="text-label mb-1">Category</p>
              <p className="font-bold text-label text-xs">{candidate.category}</p>
            </div>
          </div>
        </div>
      </div>

      <Separator className="border-b border-[#D0D0D0]" />

      {/* Project Info */}
      <div className="space-y-2">
        <h4 className="font-semibold text-label">Project Info</h4>
        <div className="grid grid-cols-2 gap-4 text-xs">
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
          <div>
            <p className="text-label mb-1">Rotation Cycle</p>
            <p className="font-bold text-label">{candidate.projectInfo.rotationCycle}</p>
          </div>
          <div>
            <p className="text-label mb-1">Working Hours/Day</p>
            <p className="font-bold text-label">{candidate.projectInfo.workingHours}</p>
          </div>
          <div className="col-span-2">
            <p className="text-label mb-1">Working Days/Week</p>
            <p className="font-bold text-label">{candidate.projectInfo.workingDays}</p>
          </div>
        </div>
      </div>

      <Separator className="border-b border-[#D0D0D0]" />

      {/* Compensation Details */}
      <div className="space-y-4">
        <h4 className="font-semibold text-label">Compensation Details</h4>
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
      </div>
    </div>
  )
}
