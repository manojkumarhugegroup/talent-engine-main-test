import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Skill {
  name: string
  value: 0 | 1
}

interface CandidateCardProps {
  description: string
  skills: Skill[]
}

export function CandidateCard({ description, skills }: CandidateCardProps) {
  return (
    <Card className="w-[350px] rounded-xl border border-gray-200 bg-card p-4">
      <CardContent className="space-y-1 p-0">
        {/* Candidate Description */}
        <div>
          <p className="text-sm text-label font-medium leading-relaxed">
            Reason
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
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