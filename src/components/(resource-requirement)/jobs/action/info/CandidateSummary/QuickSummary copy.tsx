import { CusTypography } from "@/components/forms/CusTypography";
import { CusTypography2 } from "@/components/forms/CusTypography2";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";




// Skill type
interface Skill {
    skill: string;
    experienceMonths: number;
    reference: string;
}

// Certification type
interface Certification {
    certificateName: string;
    issuingOrganization: string;
    id: string;
    issuedDate: string;
    expiration: string;
    url: string;
}

// KeySkill type
interface KeySkill {
    name: string;
    type: "match" | "noMatch";
}

// Education type (optional here, since not used in QuickSummary directly)
interface Education {
    course: string;
    institute: string;
    graduationYear: number;
    specialization: string;
    score: string;
}

// ProfessionalDetails type (optional here)
interface ProfessionalDetails {
    title: string;
    Experience: string;
    summary: string;
}

// Projects type (optional here)
interface Project {
    title: string;
    description: string;
    customer: string;
    role: string;
    duration: string;
    technologies: string[];
}

// WorkExperience type (optional here)
interface WorkExperience {
    title: string;
    company: string;
    employmentType: string;
    salary: string;
    location: string;
    startDate: string;
    endDate: string;
    summary: string;
}

export interface ProfileDataType {
    skills: Skill[];
    education?: Education;
    certifications: Certification[];
    name: string;
    experience: string;
    location: string;
    currentRate: string;
    expectedRate: string;
    summary: string;
    keySkills: KeySkill[];
    professionalDetails?: ProfessionalDetails;
    projects?: Project[];
    workExperience?: WorkExperience;
    achievements?: string[];
}

// Candidate type based on your usage
 

interface QuickSummaryProps {
  data: ProfileDataType;
}
export default function QuickSummary({ data }: QuickSummaryProps) {
    return (
        <div className="space-y-2 mt-3 max-w-4xl">
            <Card className="py-2 rounded-md shadow-sm">
                <CardContent className="p-2">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 ">
                            {/* <AvatarImage src={data.name || "/assets/icons/placeholder.svg"} alt={data.name} /> */}
                            <AvatarFallback className="text-lg font-medium">
                                {data.name && data.name.split(" ").map((n: string) => n[0]).join("")}
                            </AvatarFallback>
                        </Avatar>

                        <div className="w-2/3 space-y-2">

                            <div className="grid grid-cols-3 items-center gap-2 text-xs text-label">
                                <div>
                                    <CusTypography2 label="Name" value={data.name} labelSize="xs" valueSize="xs" valueWeight="semibold" />

                                </div>
                                <div>
                                    <CusTypography2 label="Experience" value={data.experience} labelSize="xs" valueSize="xs" valueWeight="semibold" />
                                </div>
                                <div>
                                    <CusTypography2 label="Location" value={data.location} labelSize="xs" valueSize="xs" valueWeight="semibold" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className='h-full max-h-[calc(66vh)] overflow-auto py-2 rounded-md shadow-sm gap-0    '>
                {/* Profile Overview */}
                <Card className="py-0 shadow-none border-0">
                    <CardContent className="p-4 text-xs space-y-2">
                        {/* Skills Section */}
                        <CusTypography2 label="Skills" value={data.skills?.map((s) => s.skill).join(", ")} labelSize="xs" valueSize="xs" valueWeight="semibold" />

                        {/* Certifications Section */}
                        {/* <CusTypography2 label="Certifications" value={data.certifications && data.certifications.join(", ")} labelSize="xs" valueSize="xs" valueWeight="semibold" /> */}
                        {/* Certifications Section */}
                        <CusTypography2
                            label="Certifications"
                            value={data.certifications?.map(c => c.certificateName).join(", ")}
                            labelSize="xs"
                            valueSize="xs"
                            valueWeight="semibold"
                        />

                        {/* Rate Section */}
                        <CusTypography2 label="Current Rate" value={`${data.currentRate} | Expected: ${data.expectedRate}`} labelSize="xs" valueSize="xs" valueWeight="semibold" />

                        {/* Summary Section */}
                        <CusTypography2 label="Summary" value={data.summary} labelSize="xs" valueSize="xs" valueWeight="semibold" />
                    </CardContent>

                </Card>

                {/* Key Skills */}
                <div className="px-3">
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
                </div>
            </Card>

        </div>
    )
};