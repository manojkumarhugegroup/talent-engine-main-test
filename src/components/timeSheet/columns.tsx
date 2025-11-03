// "use client";

// import type { ColumnDef } from "@tanstack/react-table";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { DayCell } from "./day-cell";
// import { ActionButtons } from "./action-buttons";
// import { ViewDialog } from "./view-dialog";
// import type { TimesheetRow, DayKey } from "./types";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ArrowUp, ArrowDown } from "lucide-react";
// import { SortableHeader } from "@/components/timeSheet/SortableHeader"

// const dayKeys: DayKey[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// export const columns: ColumnDef<TimesheetRow>[] = [
// {
//   accessorKey: "name",
//   enableSorting: true,
//   sortDescFirst: true,
//   size: 200,
//   header: ({ column, table }) => (
//     <SortableHeader column={column} table={table} title="Resource" />
//   ),
//  cell: ({ row }) => {
//   const r = row.original;

//   const handleCheckboxChange = (value: boolean) => {
//     row.toggleSelected(!!value);
//   };

//   return (
//     <div className="flex items-center gap-3 px-4">
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={handleCheckboxChange}
//         aria-label={`Select ${r.name}`}
//       />
//       <Avatar className="h-8 w-8">
//         <AvatarImage
//           src={"/placeholder.svg?height=64&width=64&query=person%20avatar"}
//           alt={`${r.name} avatar`}
//         />
//         <AvatarFallback>{r.name.slice(0, 2).toUpperCase()}</AvatarFallback>
//       </Avatar>

//       {/* Truncated name with tooltip */}
//       <span
//         className="block max-w-[100px] truncate text-sm font-medium text-gray-700"
//         title={r.name}
//       >
//         {r.name}
//       </span>
//     </div>
//   );
// },

//    meta: {
//     className: " w-[200px]",
//   },
// },
//    {
//   accessorKey: "title",
//   enableSorting: true,
//   sortDescFirst: false,
//   size: 250,
//   header: ({ column, table }) => (
//     <SortableHeader column={column} table={table} title="Title" />
//   ),
// cell: ({ getValue }) => {
//   const value = String(getValue() ?? "");

//   return (
//     <div className="text-left px-2 py-3 text-sm font-medium text-gray-700 w-full">
//       <span
//         className="block w-[250px] truncate text-muted-foreground"
//         title={value}
//       >
//         {value}
//       </span>
//     </div>
//   );
// },


//   meta: {
//     className: "w-[250px] ",
//   },
// },


// ...dayKeys.map<ColumnDef<TimesheetRow>>((k) => ({
//   id: k,
//   header: k,
//   cell: ({ row }) => <DayCell value={row.original.days[k]} />,
//   enableSorting: false,
//   meta: {
//     isDay: true,
//     className: "w-[75px]",
//   },
// })),


//  {
//   accessorKey: "regularHours",
//   enableSorting: true,
//   sortDescFirst: false,
//   size: 120,
//   header: ({ column, table }) => (
//     <SortableHeader column={column} table={table} title="Regular Hours" align="right" onSortChange={(field, direction) => {
//         table.options.meta?.onSortChange?.(field, direction);
//       }} />
//   ),
//   cell: ({ getValue }) => (
//     <div className="text-center font-medium">{Number(getValue() ?? 0)}</div>
//   ),
//     meta: {
//     className: "w-[120px]",
//   },
// },

//   {
//   accessorKey: "overtimeHours",
//   enableSorting: true,
//   sortDescFirst: false,
//   size: 140,
//   header: ({ column, table }) => (
//     <SortableHeader column={column} table={table} title="Overtime Hours" align="right" />
//   ),
//   cell: ({ getValue }) => (
//     <div className="text-center">{Number(getValue() ?? 0)}</div>
//   ),   meta: {
//     className: "w-[140px]",
//   },
// },
// {
//   accessorKey: "totalHours",
//   enableSorting: true,
//   sortDescFirst: false,
//   size: 120,
//   header: ({ column, table }) => (
//     <SortableHeader column={column} table={table} title="Total Hours" align="right" />
//   ),
//   cell: ({ getValue }) => (
//     <div className="text-center font-semibold">{Number(getValue() ?? 0)}</div>
//   ),
//      meta: {
//     className: "w-[120px]",
//   },
// },


// {
//   id: "action",
//   size: 100,
//   header: () => <div className="text-center">Action</div>,
//   cell: ({ row, table }) => {
//     const updates = table.options.meta?.bulkUpdates as Record<number, string> | undefined;
//     return <ActionButtons externalStatus={updates?.[row.original.id]} />;
//   },
//   meta: {
//     className: "w-[100px]",
//   },
//   enableSorting: false,
// },

//   {
//     id: "view",
//     size: 75,
//     header: () => <div className="text-center">View</div>,
//     cell: ({ row }) => <ViewDialog row={row.original} />,
//     enableSorting: false,
//         meta: {
//     className: "w-[75px]",
//   }
//   },
// ];


"use client";

import type { ColumnDef, TableMeta } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DayCell } from "./day-cell";
import { ActionButtons } from "./action-buttons";
import { ViewDialog } from "./view-dialog";
import type { TimesheetRow, DayKey } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import { SortableHeader } from "@/components/timeSheet/SortableHeader";

// ✅ Import your Status type (assuming it’s here, adjust if needed)
type Status = "pending" | "approved" | "declined";
// ✅ Extend TableMeta so TypeScript knows about bulkUpdates + onSortChange
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends unknown> {
    bulkUpdates?: Record<number, Status>;
    onSortChange?: (field: string, direction: "asc" | "desc" | false) => void;
  }
}

const dayKeys: DayKey[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const columns: ColumnDef<TimesheetRow>[] = [
  {
    accessorKey: "name",
    enableSorting: true,
    sortDescFirst: true,
    size: 200,
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table} title="Resource" />
    ),
    cell: ({ row }) => {
      const r = row.original;

      const handleCheckboxChange = (value: boolean) => {
        row.toggleSelected(!!value);
      };

      return (
        <div className="flex items-center gap-3 px-4">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={handleCheckboxChange}
            aria-label={`Select ${r.name}`}
          />
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={"/placeholder.svg?height=64&width=64&query=person%20avatar"}
              alt={`${r.name} avatar`}
            />
            <AvatarFallback>{r.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <span
            className="block max-w-[100px] truncate text-sm font-medium text-gray-700"
            title={r.name}
          >
            {r.name}
          </span>
        </div>
      );
    },
    meta: {
      className: " w-[200px]",
    },
  },
  {
    accessorKey: "title",
    enableSorting: true,
    sortDescFirst: false,
    size: 250,
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table} title="Title" />
    ),
    cell: ({ getValue }) => {
      const value = String(getValue() ?? "");

      return (
        <div className="text-left px-2 py-3 text-sm font-medium text-gray-700 w-full">
          <span
            className="block w-[250px] truncate text-muted-foreground"
            title={value}
          >
            {value}
          </span>
        </div>
      );
    },
    meta: {
      className: "w-[250px] ",
    },
  },

  ...dayKeys.map<ColumnDef<TimesheetRow>>((k) => ({
    id: k,
    header: k,
    cell: ({ row }) => <DayCell value={row.original.days[k]} />,
    enableSorting: false,
    meta: {
      isDay: true,
      className: "w-[75px]",
    },
  })),

  {
    accessorKey: "regularHours",
    enableSorting: true,
    sortDescFirst: false,
    size: 120,
    header: ({ column, table }) => (
      <SortableHeader
        column={column}
        table={table}
        title="Regular Hours"
        align="right"
        onSortChange={(field, direction) => {
          table.options.meta?.onSortChange?.(field, direction);
        }}
      />
    ),
    cell: ({ getValue }) => (
      <div className="text-center font-medium">{Number(getValue() ?? 0)}</div>
    ),
    meta: {
      className: "w-[120px]",
    },
  },

  {
    accessorKey: "overtimeHours",
    enableSorting: true,
    sortDescFirst: false,
    size: 140,
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table} title="Overtime Hours" align="right" />
    ),
    cell: ({ getValue }) => (
      <div className="text-center">{Number(getValue() ?? 0)}</div>
    ),
    meta: {
      className: "w-[140px]",
    },
  },
  {
    accessorKey: "totalHours",
    enableSorting: true,
    sortDescFirst: false,
    size: 120,
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table} title="Total Hours" align="right" />
    ),
    cell: ({ getValue }) => (
      <div className="text-center font-semibold">{Number(getValue() ?? 0)}</div>
    ),
    meta: {
      className: "w-[120px]",
    },
  },

  {
    id: "action",
    size: 100,
    header: () => <div className="text-center">Action</div>,
    cell: ({ row, table }) => {
      const updates = table.options.meta?.bulkUpdates;
      const recordId = Number(row.original.id); // ensure number key
      return <ActionButtons externalStatus={updates?.[recordId]} />;
    },
    meta: {
      className: "w-[100px]",
    },
    enableSorting: false,
  },

  {
    id: "view",
    size: 75,
    header: () => <div className="text-center">View</div>,
    cell: ({ row }) => <ViewDialog row={row.original} />,
    enableSorting: false,
    meta: {
      className: "w-[75px]",
    },
  },
];
