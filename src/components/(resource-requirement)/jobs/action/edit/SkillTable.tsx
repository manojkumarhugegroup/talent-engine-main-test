"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eraser, Plus, Trash2 } from "lucide-react";
import { TableData } from "@/types/jobs/editRR.type";

export interface TableColumn {
  key: string;
  header: string;
  type: "input" | "select" | "custom";
  options?: { value: number | string; label: string }[];
  width?: string;
}

export interface LangTableColumn {
  key: string;
  header: string;
  type: "input" | "select" | "custom" | "checkbox";
  options?: Array<Record<string, any>>;
  width?: string;
  option_value: string;
  option_label: string;
}

interface ReusableTableProps {
  columns: LangTableColumn[];
  data: TableData[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onClear: (index: number) => void;
  onUpdate: (index: number, key: string, value: any) => void;
  error?: any;
}

const SkillTable = ({
  columns,
  data,
  onAdd,
  onRemove,
  onClear,
  onUpdate,
  error,
}: ReusableTableProps) => {
  console.log(error, "errorserror");

  // Renders input/select based on type
  const renderCell = (
    type: string,
    value: any,
    options: any[],
    onChange: (value: any) => void,
    optionValueKey: string = "value",
    optionLabelKey: string = "label",
    fieldError?: string
  ) => {
    switch (type) {
      case "input":
        return (
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`text-sm h-9 focus-visible:ring-[0px] focus-visible:border focus-visible:border-gray-400 ${
              fieldError ? "border-red-500 focus-visible:border-red-500" : ""
            }`}
          />
        );

      case "select":
        return (
          <Select value={value || ""} onValueChange={(val) => onChange(val)}>
            <SelectTrigger
              className={`h-9 w-full focus-visible:ring-[0px] focus-visible:border ${
                fieldError
                  ? "border-red-500 focus-visible:border-red-500"
                  : "focus-visible:border-gray-400"
              }`}
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => {
                const optValue = option[optionValueKey] ?? option.value;
                const optLabel =
                  option[optionLabelKey] ??
                  option.label ??
                  option.name ??
                  option.title;
                return (
                  <SelectItem key={String(optValue)} value={String(optValue)}>
                    {optLabel}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <Checkbox
            checked={value === "Mandatory"}
            onCheckedChange={(checked) =>
              onChange(checked ? "Mandatory" : "Preferred")
            }
            className="h-4 w-4 accent-blue-600 cursor-pointer"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {/* Table Header */}
      <div
        className="grid gap-2 text-sm font-medium text-gray-600 bg-accent p-2 rounded-md"
        style={{
          gridTemplateColumns: columns
            .map((col) => (col.key === "action" ? "70px" : col.type === "checkbox" ? "70px":col.width || "1fr"))
            .join(" "),
        }}
      >
        {columns.map((column) => (
          <span key={column.key}>{column.header}</span>
        ))}
      </div>

      {/* Table Rows */}
      {data.map((item, index) => (
        <div
          key={index}
          className="grid gap-2 items-start"
          style={{
            gridTemplateColumns: columns
              .map((col) => (col.key === "action" ? "70px" : col.type === "checkbox" ? "70px":col.width || "1fr"))
              .join(" "),
          }}
        >
          {columns.map((column, i) => {
            // Handle Action Buttons
            if (column.key === "action") {
              return (
                <div key={i} className="flex items-center">
                  {data.length === 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onClear(index)}
                      className="h-8 w-8 p-0 cursor-pointer"
                      title="Clear item"
                    >
                      <Eraser className="h-4 w-4 text-primary" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(index)}
                      className="h-8 w-8 p-0 cursor-pointer"
                      disabled={data.length === 1}
                    >
                      <Trash2
                        className={`${
                          data.length === 1 ? "text-gray-400" : "text-red-500"
                        } h-4 w-4`}
                      />
                    </Button>
                  )}
                </div>
              );
            }
            // Extract field error if present
            const fieldError =
              Array.isArray(error) &&
              error[index] &&
              error[index][column.key] &&
              error[index][column.key].message;
            console.log(fieldError, "fieldErrors");
            return (
              <div
                key={column.key}
                className={
                  column?.type === "checkbox"
                    ? "flex h-[100%] items-center justify-center"
                    : "space-y-1"
                }
              >
                {renderCell(
                  column.type,
                  item[column.key],
                  column.options || [],
                  (value) => onUpdate(index, column.key, value),
                  (column as any).option_value || "value",
                  (column as any).option_label || "label",
                  fieldError
                )}

                {/* Error message */}
                {fieldError && (
                  <p className="text-xs text-red-500 mt-0.5">{fieldError}</p>
                )}
              </div>
            );
          })}
          {error?.type === "custom" &&
            error?.ref?.name === "skills_and_experience" && (
              <p className="text-xs text-red-500 mt-1 col-span-full">
                {error.message}
              </p>
            )}
          {error?.type === "custom" &&
            error?.ref?.name === "tools_familarity" && (
              <p className="text-xs text-red-500 mt-1 col-span-full">
                {error.message}
              </p>
            )}
        </div>
      ))}

      {/* Add Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          onClick={onAdd}
          className="bg-accent text-accent-foreground hover:bg-accent-foreground/10 cursor-pointer hover:shadow-md"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
};

export default SkillTable;
