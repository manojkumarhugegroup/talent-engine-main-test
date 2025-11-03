"use client"

import { useState } from "react";
import { columns } from "./columns";
import { getTimesheetRows } from "./data";
import { TimesheetRow } from "./types";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { ConfirmActionDialog } from "./ConfirmActionDialog";

type Status = "pending" | "approved" | "declined";

interface TimesheetTableProps {
  selectedRows: TimesheetRow[];
  onSelectionChange: (rows: TimesheetRow[]) => void;
  tableRef: React.Ref<{ exportToExcel: () => void }>;
  bulkUpdates?: Record<number, Status>; // optional initial bulk updates
}

export default function TimesheetTable({
  selectedRows,
  onSelectionChange,
  tableRef,
  bulkUpdates: initialBulkUpdates = {},
}: TimesheetTableProps) {
  const data = getTimesheetRows();

  // ✅ Bulk updates are now managed locally
  const [bulkUpdates, setBulkUpdates] = useState<Record<number, Status>>(
    initialBulkUpdates
  );

  // ✅ Sort state
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc" | false;
  }>({
    field: "",
    direction: false,
  });

  // ✅ Bulk action state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  // Handle sorting
  const handleSortChange = (
    field: string,
    direction: "asc" | "desc" | false
  ) => {
    setSort({ field, direction });
    console.log("Sorting field:", field);
    console.log("Direction:", direction);
  };

  // Handle bulk action click
  const handleActionClick = (type: "approve" | "reject") => {
    setActionType(type);
    setDialogOpen(true);
  };

  // Confirm bulk action
  const handleConfirm = () => {
    const newStatus: Status =
      actionType === "approve" ? "approved" : "declined";

    const updated: Record<number, Status> = {};
    selectedRows.forEach(({row}:any) => {
      updated[row.id] = newStatus;
    });

    setBulkUpdates((prev) => ({ ...prev, ...updated }));  
    onSelectionChange([]); // clear selection
    setDialogOpen(false);
  };

  return (
    <main className="p-1 space-y-6 rounded-sm">
      <div className="rounded-md border bg-card">
        <DataTable
          columns={columns}
          ref={tableRef}
          data={data}
          onSelectionChange={onSelectionChange}
          onSortChange={handleSortChange}
          bulkUpdates={bulkUpdates} // ✅ pass updated state
        />
      </div>

      {/* ✅ Show selected rows */}
      {selectedRows.length > 0 && (
        <>
          <div className="text-sm text-muted-foreground">
            Selected: {selectedRows.map((r) => r.name).join(", ")}
          </div>

          {/* ✅ Bulk action buttons */}
          <div className="flex justify-end items-center gap-3 py-2">
            <Button
              variant="outline"
              className="bg-card"
              onClick={() => onSelectionChange([])}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleActionClick("reject")}
            >
              Decline
            </Button>
            <Button
              className="bg-[#243BB1] text-white hover:bg-[#1e2f8f]"
              onClick={() => handleActionClick("approve")}
            >
              Approve
            </Button>
          </div>

          <ConfirmActionDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            type={actionType}
            onConfirm={handleConfirm}
          />
        </>
      )}

      {/* ✅ Show current sort */}
      {sort.field && (
        <div className="text-sm text-blue-600">
          Sorting by <strong>{sort.field}</strong> ({sort.direction || "none"})
        </div>
      )}
    </main>
  );
}
