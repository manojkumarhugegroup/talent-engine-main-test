import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface SortableHeaderProps {
  column: any;
  table: any;
  title: string;
  onSortChange?: (field: string, direction: "asc" | "desc" | false) => void;
  align?: "left" | "center" | "right";
}

export function SortableHeader({ column, table, title, onSortChange, align = "left" }: SortableHeaderProps) {
  const isSorted = column.getIsSorted(); // "asc" | "desc" | false

  const toggleSort = () => {
    const newDirection = column.getIsSorted() === "asc" ? "desc" : "asc";
    column.toggleSorting(column.getIsSorted() === "asc");

    // Notify parent
    onSortChange?.(title, newDirection);

    console.log("field:", title);
    console.log("Direction:", newDirection);
  };

  return (
    <div
      className={`flex items-center gap-2 cursor-pointer select-none px-2 ${
        align === "right" ? "justify-end" : align === "center" ? "justify-center" : ""
      }`}
      onClick={toggleSort}
    >
      {/* ✅ Only show "Select All" checkbox if Resource column */}
      {title === "Resource" && (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            const selected = table
              .getSelectedRowModel()
              .rows.map((r: any) => r.original);
            table.options.meta?.onSelectionChange?.(selected);
          }}
          aria-label="Select all"
          onClick={(e) => e.stopPropagation()} 
          className="mx-2"
        />
      )}

      {/* Column label */}
      <span>{title}</span>

      {/* Sorting icons */}
      {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
      {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
      {!isSorted && (
        <ArrowUpDown className="w-4 h-4 opacity-50 group-hover:opacity-100" />
      )}
    </div>
  );
}
