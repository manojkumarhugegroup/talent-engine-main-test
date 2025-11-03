import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { CusTypography2 } from "@/components/forms/CusTypography2"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import SummaryTable from "@/components/shared/SummaryTable"
import { ProfileDataType } from "@/types/jobs/Info/profile.type"

interface ProfileSummaryProps {
  data: ProfileDataType;
}

export default function ProfileSummary({ data }: ProfileSummaryProps) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        {/* Left Column - Personal Information */}
        <div className="space-y-2 col-span-3">
          <Card className="rounded-md gap-0">
            <CardHeader className="px-3">
              <CardTitle>
                <CusTypography2 label="Personal Information" value={""} labelSize="base" labelWeight="semibold" labelColor="text-label" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-3">
              <div className="flex flex-col items-center space-y-3">

                <Avatar className="w-24 h-24 my-3">
                  <AvatarImage src={data.avatar || "/assets/icons/placeholder.svg"} alt={data.name} />
                  <AvatarFallback className="text-lg font-medium">
                    {data.name && data.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 w-full">
                  <CusTypography2 label="Name" value={data.name} labelSize="xs" valueSize="xs" />
                </div>

                <div className="flex-1 w-full">
                  <CusTypography2 label="Location" value={data.location} labelSize="xs" valueSize="xs" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="px-3">
            <CusTypography2 label="Key skills" value={''} labelSize="xs" />
            <div className="flex flex-wrap gap-2">
              {data.keySkills.map((skill: any, index: number) => (
                <Badge
                  key={index}
                  variant={skill.type === "match" ? "default" : "secondary"}
                  className={cn(
                    "rounded-md py-1 px-2",
                    skill.type === "match"
                      ? "bg-(--success) hover:bg-(--success)/90 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  )}
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </Card>

        </div>

        {/* Right Column - Professional Details */}
        <div className="col-span-9 space-y-2 h-full max-h-[calc(72vh-10px)] overflow-y-auto">
          <Card>
            <CardContent className="space-y-2">
              <CusTypography2 label="Professional Details" value={"Senior Fuel Operations Manager (12 years 3 months Experienced)"} labelSize="base" labelWeight="semibold" valueWeight="normal" labelColor="text-label" valueColor="text-(--labelLight)" valueSize="sm" />
              <CusTypography2 label="Summary" value={"The National Fuel Distribution Project is a nationwide initiative to improve the efficiency, reliability, and sustainability of fuel distribution through optimized logistics, inventoryvisibility, and delivery coordination across regional hubs."} labelSize="base" labelWeight="semibold" valueWeight="normal" labelColor="text-label" valueColor="text-(--labelLight)" valueSize="sm" />


              <>
                <CusTypography2 label="Skills" value={""} labelSize="base" labelWeight="semibold" labelColor="text-label" />
                <SummaryTable />
              </>

              <>
                <CusTypography2 label="Education" value={""} labelSize="base" labelWeight="semibold" labelColor="text-label" />
                <SummaryTable />
              </>

              <>
                <CusTypography2 label="Certifications" value={""} labelSize="base" labelWeight="semibold" labelColor="text-label" />
                <SummaryTable />
              </>


              {/* Projects */}
              {data.projects && data.projects.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-base font-semibold mb-2">Projects</h3>
                  {data.projects.map((project, idx) => (
                    <div key={idx} className="border rounded-md p-3 mb-2 bg-muted">
                      <p className="font-semibold">{project.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Description: {project.description}
                      </p>
                      <ul className="list-disc list-inside mt-1 text-sm text-muted-foreground space-y-0.5">
                        <li><strong>Customer:</strong> {project.customer}</li>
                        <li><strong>Role:</strong> {project.role}</li>
                        <li><strong>Duration:</strong> {project.duration}</li>
                        <li><strong>Technologies Used:</strong> {project.technologies?.join(", ")}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Work Experience */}
              {data.workExperience && (
                <div className="mt-6">
                  <h3 className="text-base font-semibold mb-2">Work Experience & Salary Details</h3>
                  <div className="border rounded-md p-3 bg-muted">
                    <p className="font-semibold">{data.workExperience.jobTitle}</p>
                    <p className="text-sm">
                      Company: <strong>{data.workExperience.company}</strong>
                    </p>
                    <p className="text-sm">
                      Job Title: <strong>{data.workExperience.jobTitle}</strong>
                    </p>
                    <p className="text-sm">
                      Employment Type: <strong>{data.workExperience.employmentType}</strong>
                    </p>
                    <p className="text-sm">
                      Salary: <strong>{data.workExperience.salary}</strong>
                    </p>
                    <p className="text-sm">
                      Start Date - End Date: <strong>{data.workExperience.startDate} - {data.workExperience.endDate}</strong>
                    </p>
                    <p className="text-sm">
                      Location: <strong>{data.workExperience.location}</strong>
                    </p>
                    <p className="text-sm mt-2 text-muted-foreground">
                      Summary: {data.workExperience.summary}
                    </p>
                  </div>
                </div>
              )}

              {/* Achievements */}
              {data.achievements && data.achievements.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-base font-semibold mb-2">Achievements</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {data.achievements.map((ach: string, idx: number) => (
                      <li key={idx}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}


            </CardContent>
          </Card>




        </div>
      </div>
    </div>
  )
}
