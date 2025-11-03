import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CircularProgress } from "@/components/shared/CircularProgress"
import Image from "next/image"

interface Skill {
  name: string
  value: 0 | 1
}

interface CandidateCardProps {
  description: string
  skills: Skill[]
   row: any;
  score: number;
  recruiterScore:number
   onClick?: () => void;
}

export function MatchingCard({ description, skills   ,row,score,recruiterScore,onClick}: CandidateCardProps) {
  
  return (
    <Card className="w-[300px] rounded-xl border border-gray-200 bg-card p-4 cursor-pointer" onClick={onClick}>
      <CardContent className="space-y-1 p-0">
        {/* Candidate Description */}
        <div>
          <p className="text-sm text-label font-medium leading-relaxed">
            Click the matching score to view
          </p>
          <div className="flex justify-around items-center mt-5">
                                <div className="flex flex-col items-center gap-2">
                            <CircularProgress value={recruiterScore} size={70} strokeWidth={4}  type="lora" />
                            <p className="relative font-bold text-md w-fit pb-2 text-[#00434E]">
                                                Lora
                                                <Image
                                                  src={"/assets/icons/job-info/loraAI_w.svg"}
                                                  className="w-3 h-3 absolute -top-1 -right-3"
                                                  alt="loraAi"
                                                  width={3}
                                                  height={3}
                                                />
                                              </p>
                            </div>
                            <div className="flex flex-col items-center gap-2">

                            <CircularProgress value={score} size={70} strokeWidth={4}  />
                            <p>Recruiter</p>
                            </div>
            
          </div>
        
        </div>
        <Separator />
        {/* Dynamic Skills */}
        <div>
          <p className="text-sm text-label font-medium leading-relaxed">
            Key Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.slice()  
              .sort((a, b) => b.value - a.value).map((skill, index) => (
                <Badge
                  key={index}
                  variant={skill.value == 0 ? "outline" : "default"}
                  className={`rounded-md px-3 py-1 text-xs font-medium ${skill.value == 1
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-500 border border-gray-300"
                    }`}
                >
                  {skill.name}
                </Badge>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}          