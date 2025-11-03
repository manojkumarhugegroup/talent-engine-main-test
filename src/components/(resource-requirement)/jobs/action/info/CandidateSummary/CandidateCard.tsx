import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Skill {
  name: string;
  value: 0 | 1;
}

interface CandidateCardProps {
  description: string;
  skills: Skill[];
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
            {description || "No description available."}
          </p>
        </div>

        {/* Skills Section */}
        {Array.isArray(skills) && skills.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-label font-medium leading-relaxed">
                Key Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {skills
                  .sort((a, b) => b.value - a.value) // Sort from highest to lowest `value`
                  .map((skill) => {
                    const { name, value } = skill;

                    if (!name) return null; // Skip if name is missing

                    const isPrimary = value === 1;
                    const variant = value === 0 ? "outline" : "default";

                    const badgeClasses = [
                      "rounded-md px-3 py-1 text-xs font-medium",
                      isPrimary
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-500 border border-gray-300",
                    ].join(" ");

                    return (
                      <Badge
                        key={name}
                        variant={variant}
                        className={badgeClasses}
                      >
                        {name}
                      </Badge>
                    );
                  })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
