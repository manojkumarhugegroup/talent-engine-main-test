import { CusTypography } from "@/components/forms/CusTypography";
import { CusTypography2 } from "@/components/forms/CusTypography2";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProfileDataType } from "@/types/jobs/Info/profile.type";
import ReactMarkdown from 'react-markdown';

// Candidate type based on your usage


interface QuickSummaryProps {
    data: ProfileDataType;
}
export default function QuickSummary({ data }: QuickSummaryProps) {
    const markdownContent = `
### Skills
JavaScript, TypeScript, React, Node.js, GraphQL



### Certifications
AWS Certified Solutions Architect, Certified Scrum Master, Google Analytics Certified



### Current Rate
$60/hr | Expected: $70/hr



### **Summary**
Experienced full-stack developer with a strong background in building scalable web applications and APIs. Passionate about cloud technologies and agile methodologies.
`;

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

                <div className="p-2 bg-white rounded text-xs space-y-2">
                    <ReactMarkdown
                        components={{
                            h3: ({ node, ...props }) => (
                                <h3
                                    className="text-xs font-medium text-(--labelLight) mt-4"
                                    {...props}
                                />
                            ),
                            strong: ({ node, ...props }) => (
                                <strong
                                    className="font-bold text-(--labelLight)"
                                    {...props}
                                />
                            ),
                            p: ({ node, ...props }) => (
                                <p className="text-label font-semibold leading-relaxed"
                                    {...props}
                                />
                            ),
                            li: ({ node, ...props }) => (
                                <li
                                    className="list-disc ml-5 text-label font-semibold"
                                    {...props}
                                />
                            ),
                        }}
                    >
                        {markdownContent}
                    </ReactMarkdown>
                </div>



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