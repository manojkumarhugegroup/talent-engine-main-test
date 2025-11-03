import { SwipeCandidateType } from "@/types/jobs/Info/Swipe.type";
import React from "react";
import { motion, PanInfo } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { CusTypography } from "@/components/forms/CusTypography";
import { CircularProgress } from "../../../../../shared/CircularProgress";
import { Badge } from "@/components/ui/badge";

export function SwipeCard({
  candidate,
  index,
  total,
  onSwipe,
  offset,
  setOffset,
}: {
  candidate: SwipeCandidateType;
  index: number;
  total: number;
  onSwipe: (rrcandidate_name: string, dir: "like" | "dislike") => void;
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [dragging, setDragging] = React.useState(false);

  const handleDrag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setOffset(info.offset.x);
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 150) {
      onSwipe(candidate.rrcandidate_name ?? "", "like");
    } else if (info.offset.x < -150) {
      onSwipe(candidate.rrcandidate_name ?? "", "dislike");
    }
    setDragging(false);
    setOffset(0);
  };

  console.log(candidate,'candidate');
  

  const leftShade = offset < 0 ? Math.min(Math.abs(offset) / 3, 100) : 0;
  const rightShade = offset > 0 ? Math.min(offset / 3, 100) : 0;

  return (
    <motion.div
      drag={index === 0 ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={() => setDragging(true)}
      onDrag={index === 0 ? handleDrag : undefined}
      onDragEnd={index === 0 ? handleDragEnd : undefined}
      // onDrag={index === 0 ? handleDrag : undefined}
      // onDragEnd={index === 0 ? handleDragEnd : undefined}
      className="absolute w-full"
      style={{
        zIndex: total - index,
        height: "320px",
        width: "80%",
        cursor: index === 0 && dragging ? "grabbing" : "grab",
      }}
      animate={{
        scale: 1 - index * 0.008,
        y: index * -8,
        opacity: 1 - index * 0.15,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card
        className="rounded-xl overflow-hidden shadow-lg transition-colors duration-200 h-full"
        style={{
          background: rightShade
            ? `linear-gradient(to right, rgba(34,197,94,${Math.min(
                rightShade / 50,
                0.1
              )}), white)`
            : leftShade
            ? `linear-gradient(to left, rgba(239,68,68,${Math.min(
                leftShade / 50,
                0.1
              )}), white)`
            : "white",
        }}
      >
        <CardContent className="p-6 flex flex-col md:flex-row gap-6 relative">
          <div className="absolute -top-2 right-2 bg-card/50 flex items-center justify-center">
            <CircularProgress
              value={candidate.match_score ?? 0}
              size={40}
              strokeWidth={3}
            />
          </div>
          {/* Left Side */}
          <div className="md:w-2/5 space-y-2">
            <div>
              <h2 className="text-2xl font-bold text-blue-800">
                {candidate.name}
              </h2>
              <p className="text-sm text-dark flex items-center">
                <MapPin className="mr-1 text-dark " size={14} />
                {candidate.location}
              </p>
            </div>

            <CusTypography
              label="Salary"
              value={`$${candidate.current_rate}` || "N/A"}
              size="sm"
              labelColor="text-muted-foreground"
              valueFontWeight="normal"
            />
            <CusTypography
              label="Expected Salary"
              value={`$${candidate.expected_rate}` || "N/A"}
              size="sm"
              labelColor="text-muted-foreground"
              valueFontWeight="normal"
            />
            <CusTypography
              label="Available Date"
              value={`${candidate.available_date}` || "N/A"}
              size="sm"
              labelColor="text-(--chart-5)"
              valueFontWeight="normal"
            />

            <div className="mt-2">
              <div className="flex justify-between items-center gap-1 pb-1">
                <h4 className="text-sm font-semibold text-gray-800 mb-1">
                  Key skills
                </h4>
              </div>
              {candidate.key_skills && (
                <div className="flex flex-wrap gap-2">
                  {candidate.key_skills
                    .slice() // create a shallow copy to avoid mutating original array
                    .sort((a, b) => b.type - a.type) // value 1 first
                    .map((skill, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className={`text-xs rounded border-none ${
                          skill.type == 1
                            ? "bg-[var(--success)] text-white"
                            : "bg-accent text-label"
                        }`}
                      >
                        {skill.name}
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="md:w-3/5 space-y-2">
            <div>
              <h4 className="font-semibold text-gray-800">Summary</h4>
              <p className="text-sm text-gray-600 line-clamp-3">
                {candidate.summary}
              </p>
            </div>
            {Array.isArray(candidate.skills) && candidate.skills.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800">Skills</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {candidate.skills.map((skill, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-(--secondaryb) rounded text-dark border-none text-xs p-1.5"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(candidate.certifications) &&
              candidate.certifications.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Certifications
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {candidate.certifications.map((cert, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-[#EDEDED] rounded text-[#212529] border-none text-xs"
                      >
                        {cert.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            {Array.isArray(candidate.projects) &&
              candidate.projects.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800">Projects</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {candidate.projects.map((project, i) => (
                      <Badge
                        key={`${project}-${i}`}
                        variant="secondary"
                        className="bg-[#EDEDED] rounded text-[#212529] border-none text-xs"
                      >
                        {project.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
