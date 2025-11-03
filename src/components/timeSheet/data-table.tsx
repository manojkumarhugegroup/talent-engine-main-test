"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { forwardRef, useImperativeHandle } from "react"
import * as XLSX from "xlsx"
import Image from "next/image"
import leave from "../../../public/assets/icons/time sheet/leave.png"
import holiday from "../../../public/assets/icons/time sheet/holiday.png"
import weekoff from "../../../public/assets/icons/time sheet/week-off.png"
import working from "../../../public/assets/icons/time sheet/working.png"
import type { TimesheetRow } from "./types"
import { ActionButtons } from "./action-buttons"

type Status = "pending" | "approved" | "declined"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends unknown, TValue> {
    className?: string
  }
}

export const DataTable = forwardRef(function DataTable(
  {
    columns,
    data,
    onSelectionChange,
    onSortChange,
    bulkUpdates = {},  
  }: {
    columns: ColumnDef<TimesheetRow, unknown>[]
    data: TimesheetRow[]
    onSelectionChange?: (rows: TimesheetRow[]) => void
    onSortChange?: (field: string, direction: "asc" | "desc" | false) => void
    bulkUpdates?: Record<string, Status> // ✅ allow bulk updates from parent
  },
  ref: React.Ref<{ exportToExcel: () => void }>
) {
  const [sorting, setSorting] = React.useState([{ id: "name", desc: false }])
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    enableSortingRemoval: false,
    enableSorting: true,
    meta: {
      onSelectionChange,
      onSortChange,
    },
  })

  React.useEffect(() => {
    if (!onSelectionChange) return
    const selected = table.getSelectedRowModel().rows.map((r) => r.original)
    onSelectionChange(selected)
  }, [rowSelection, table, onSelectionChange])

  const Item = ({
    icon,
    label,
    className,
  }: {
    icon: React.ReactNode
    label: string
    className: string
  }) => (
    <div className="flex items-center gap-2 text-sm px-2">
      <span className="inline-flex items-center justify-center">{icon}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  )

  const totals = React.useMemo(() => {
    return data.reduce(
      (acc, r) => {
        acc.reg += r.regularHours
        acc.ot += r.overtimeHours
        acc.total += r.totalHours
        return acc
      },
      { reg: 0, ot: 0, total: 0 }
    )
  }, [data])

  const exportToExcel = () => {
    try {
      const rows = table.getRowModel().rows.map((row) => row.original)

      const formattedRows = rows.map((row) => {
        const dayData = Object.fromEntries(
          Object.entries(row.days).map(([day, entry]) => [day, entry.hours ?? 0])
        )

        return {
          Resource: row.name,
          Title: row.title,
          ...dayData,
          "Regular Hours": row.regularHours,
          "Overtime Hours": row.overtimeHours,
          "Total Hours": row.totalHours,
        }
      })

      const worksheet = XLSX.utils.json_to_sheet(formattedRows)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheet")
      XLSX.writeFile(
        workbook,
        `Timesheet_${new Date().toISOString().slice(0, 10)}.xlsx`
      )
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  useImperativeHandle(ref, () => ({
    exportToExcel,
  }))

  return (
    <div className="w-full h-[calc(80vh-1rem)] flex flex-col bg-card rounded overflow-hidden">
      <div className="flex-1 overflow-auto">
        <table className="min-w-[1200px] w-full table-fixed border-collapse">
          {/* Sticky Header */}
          <thead className="bg-gray-50 sticky top-0 z-40">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      "whitespace-nowrap text-center align-middle border-r border-gray-200 last:border-r-0 h-12 bg-gray-50",
                      header.column.columnDef.meta?.className
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Table Body */}
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={i % 2 === 0 ? "bg-muted/30" : ""}
                >
                  {row.getVisibleCells().map((cell) => {
                    const dayColumns = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                    const isDayColumn = dayColumns.includes(cell.column.id)

                    // ✅ Inject external status into ActionButtons
                    if (cell.column.id === "actions") {
                      return (
                        <td
                          key={cell.id}
                          className="align-middle text-center p-0 border-r border-gray-200"
                        >
                          <ActionButtons
                            externalStatus={bulkUpdates[row.original.id]}
                          />
                        </td>
                      )
                    }

                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          "align-middle text-center p-0 border-r border-gray-200",
                          isDayColumn ? "bg-[#BEC9FF]" : "",
                          cell.column.columnDef.meta?.className
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  No results.
                </td>
              </tr>
            )}
          </tbody>

          {/* Sticky Footer */}
          <tfoot className="sticky bottom-0 bg-card z-40 border-t border-gray-200">
            <tr className="h-12">
              <td colSpan={columns.length - 5} className="border-r border-gray-200">
                <div className="flex flex-wrap items-center gap-6">
                  <Item
                    icon={
                      <Image
                        src={holiday || "/placeholder.svg"}
                        alt="public-holiday"
                        className="h-4 w-4 object-contain"
                      />
                    }
                    label="Public Holiday"
                    className="bg-blue-50 border-blue-200"
                  />
                  <Item
                    icon={
                      <Image
                        src={weekoff || "/placeholder.svg"}
                        alt="week-off"
                        className="h-4 w-4 object-contain"
                      />
                    }
                    label="Week off"
                    className="bg-amber-50 border-amber-200"
                  />
                  <Item
                    icon={
                      <Image
                        src={working || "/placeholder.svg"}
                        alt="working"
                        className="h-4 w-4 object-contain"
                      />
                    }
                    label="Working"
                    className="bg-background border-border"
                  />
                  <Item
                    icon={
                      <Image
                        src={leave || "/placeholder.svg"}
                        alt="leave"
                        className="h-4 w-4 object-contain"
                      />
                    }
                    label="Leave"
                    className="bg-rose-50 border-rose-200"
                  />
                </div>
              </td>
              <td className="text-center font-extrabold text-md min-w-[100px] border-r border-gray-200">
                {totals.reg}
              </td>
              <td className="text-center font-extrabold text-md min-w-[100px] border-r border-gray-200">
                {totals.ot}
              </td>
              <td className="text-center font-extrabold text-md text-blue-600 min-w-[100px] border-r border-gray-200">
                {totals.total}
              </td>
              <td className="min-w-[100px] border-r border-gray-200" />
              <td className="min-w-[100px]" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
})

