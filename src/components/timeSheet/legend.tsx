"use client"

import type React from "react"
import { BedDouble, Flag, UserX, Dot } from "lucide-react"
import leave from '../../../public/assets/icons/time sheet/leave.png'
import holiday from '../../../public/assets/icons/time sheet/holiday.png'
import weekoff from '../../../public/assets/icons/time sheet/week-off.png'
import working from '../../../public/assets/icons/time sheet/working.png'
import Image from "next/image"

const Item = ({
  icon,
  label,
  className,
}: {
  icon: React.ReactNode
  label: string
  className: string
}) => (
  <div className="flex items-center gap-2 text-sm">
    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-sm border ${className}`}>{icon}</span>
    <span className="text-muted-foreground">{label}</span>
  </div>
)

export function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Item
        icon={<Image src={holiday} alt="public-holiday" className="h-4 w-4 text-blue-700" />}
        label="Public Holiday"
        className="bg-blue-50 border-blue-200"
      />
      <Item
        icon={<Image src={weekoff} alt="week-off" className="h-4 w-4 text-amber-700" />}
        label="Week off"
        className="bg-amber-50 border-amber-200"
      />
      <Item icon={<Image src={working} alt="working" className="h-4 w-4" />} label="Working" className="bg-background border-border" />
      <Item icon={<Image src={leave} alt="leave" className="h-4 w-4 text-rose-700" />} label="Leave" className="bg-rose-50 border-rose-200" />
    </div>
  )
}
