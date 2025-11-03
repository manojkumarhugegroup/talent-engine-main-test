"use client"

import Image from "next/image"
import leave from '../../../public/assets/icons/time sheet/leave.png'
import holiday from '../../../public/assets/icons/time sheet/holiday.png'
import weekoff from '../../../public/assets/icons/time sheet/week-off.png'
import working from '../../../public/assets/icons/time sheet/working.png'
import type { DayEntry } from "./types"
import { cn } from "@/lib/utils"

type Props = {
  value: DayEntry
}

const colorMap: Record<NonNullable<DayEntry["status"]>, string> = {
  PH: "bg-blue-50 border-blue-200 text-blue-700",
  WO: "bg-amber-50 border-amber-200 text-amber-700",
  W: "bg-card border-gray-300 text-gray-900",
  L: "bg-rose-50 border-rose-200 text-rose-700",
}

export function DayCell({ value }: Props) {
  const { status, hours } = value

  return (
    <div
   className={cn(
      "h-15 min-w-15 max-w-auto flex items-center justify-center text-sm font-semibold",
      status === "WO"
        ? "bg-[#FFF4E4]"
        : status === "PH"
        ? "bg-[#F3FAFB]"
        : hours
        ? "bg-[#F4F6FF]"
        : "bg-[#FFEDED]"
    )}
>

      {status === "W" ? (
        typeof hours === "number" && hours > 0 ? (
          hours
        ) : (
          <Image src={working} alt="working" className=" w-5" />
        )
      ) : status === "WO" ? (
        <Image src={weekoff} alt="week-off" className="w-5 " />
      ) : status === "PH" ? (
        <Image src={holiday} alt="Public-holiday" className=" w-5" />
      ) : (
        <Image src={leave} alt="leave" className=" w-5" />
      )}
    </div>
  )
}
