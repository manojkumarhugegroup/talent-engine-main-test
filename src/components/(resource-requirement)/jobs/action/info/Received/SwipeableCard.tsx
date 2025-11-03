"use client"

import * as React from "react"
import { motion, PanInfo } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react" 
 

interface CandidateCardProps {
  name: string
  location: string
  salary: number
  expectedSalary: number
  availableDate: string
  keySkills: string[]
  summary: string
  skills: string[]
  certifications: string[]
  projects: string[]
  onSwipe?: (direction: "like" | "dislike") => void
}

export default function SwipeableCard({
  name,
  location,
  salary,
  expectedSalary,
  availableDate,
  keySkills,
  summary,
  skills,
  certifications,
  projects,
  onSwipe
}: CandidateCardProps) {
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 120) {
      onSwipe?.("like")
    } else if (info.offset.x < -120) {
      onSwipe?.("dislike")
    }
    setIsDragging(false)
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      className="max-w-3xl mx-auto"
    >
      <Card className="shadow-md rounded-xl overflow-hidden">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-blue-700">{name}</h2>
              <p className="text-sm text-gray-500">{location}</p>
            </div>
          </div>

          {/* Salary Info */}
          <div className="mt-3 text-sm text-gray-600">
            <p>Salary: <span className="font-medium">${salary}</span></p>
            <p>
              Expected Salary:{" "}
              <span className="font-medium text-red-500">${expectedSalary}</span>
            </p>
            <p>Available Date: {availableDate}</p>
          </div>

          {/* Key Skills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {keySkills.map((skill, i) => (
              <span
                key={i}
                className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-5">
            <h3 className="font-semibold text-gray-800">Summary</h3>
            <p className="text-sm text-gray-600">{summary}</p>
          </div>

          {/* Skills */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800">Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((s, i) => (
                <span key={i} className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-md">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800">Certifications</h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {certifications.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800">Projects</h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {projects.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" className="text-red-500 border-red-300 hover:bg-red-50">
              <ThumbsDown className="w-4 h-4 mr-1" /> Dislike
            </Button>
            <Button variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">
              <ThumbsUp className="w-4 h-4 mr-1" /> Like
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
