// Types for the timesheet table
import { RowData } from "@tanstack/react-table"

export type DayKey = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"

export type DayStatus = "W" | "WO" | "PH" | "L" // Working, Week Off, Public Holiday, Leave

export interface DayEntry {
  status: DayStatus
  hours?: number // hours for Working ("W") days; others default to 0
}

export interface TimesheetRow {
  id: string
  name: string
  title: string
  avatar?: string
  days: Record<DayKey, DayEntry>
  regularHours: number
  overtimeHours: number
  totalHours: number
}


declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    onSelectionChange?: (rows: TData[]) => void
    onSortChange?: (field: string, direction: "asc" | "desc" | false) => void
  }
}