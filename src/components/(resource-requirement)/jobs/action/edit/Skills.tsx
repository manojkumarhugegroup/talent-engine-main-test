"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCw } from "lucide-react";
import { FormData } from "@/types/jobs/editRR.type";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import SkillTable, { LangTableColumn } from "./SkillTable";
import { CusTextarea } from "@/components/forms/CusTextarea";
import { SubmitButtonWithPopup } from "../SubmitButtonPopup";
import { useDataContext } from "@/context/DataProvider";
import { MultiSelectWithChips } from "@/components/forms/CusMultiSelectwithChip";

interface JobSkillsProps {
  errors: FieldErrors<FormData>;
  control: Control<FormData>;
  register: UseFormRegister<FormData>;
}

export default function JobSkillsForm({
  errors,
  control,
  register,
}: JobSkillsProps) {
  const {
    languageRequirements,
    keySkills,
    fetchLanguageRequirements,
    fetchKeySkills,
  } = useDataContext();

  useEffect(() => {
    fetchLanguageRequirements();
    fetchKeySkills();
  }, []);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Trigger popup
  const handleReGenerateClick = () => {
    setIsPopupOpen(true);
  };

  // Popup close (No / Later / View)
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Table configs
  const skillColumns: LangTableColumn[] = [
    {
      key: "fname",
      header: "Skills",
      type: "input",
      options: [],
      option_value: "",
      option_label: "",
    },
    {
      key: "min_experience",
      header: "Min Experience",
      type: "select",
      options: Array.from({ length: 11 }, (_, i) => ({
        value: i,
        label: i.toString(),
      })),
      option_value: "value",
      option_label: "label",
    },
    {
      key: "max_experience",
      header: "Max Experience",
      type: "select",
      options: Array.from({ length: 11 }, (_, i) => ({
        value: i,
        label: i.toString(),
      })),
      option_value: "value",
      option_label: "label",
    },
    {
      key: "mandatorypreferred",
      header: "Mandatory",
      type: "checkbox",
      options: [],
      option_value: "",
      option_label: "",
    },
    {
      key: "action",
      header: "Action",
      type: "custom",
      options: [],
      option_value: "",
      option_label: "",
    },
  ];

  const toolColumns: LangTableColumn[] = [
    {
      key: "fname",
      header: "Tool",
      type: "input",
      options: [],
      option_value: "",
      option_label: "",
    },
    {
      key: "min_experience",
      header: "Min Experience",
      type: "select",
      options: Array.from({ length: 11 }, (_, i) => ({
        value: i,
        label: i.toString(),
      })),
      option_value: "value",
      option_label: "label",
    },
    {
      key: "max_experience",
      header: "Max Experience",
      type: "select",
      options: Array.from({ length: 11 }, (_, i) => ({
        value: i,
        label: i.toString(),
      })),
      option_value: "value",
      option_label: "label",
    },
    {
      key: "mandatory__preferred",
      header: "Mandatory",
      type: "checkbox",
      options: [],
      option_value: "",
      option_label: "",
    },
    {
      key: "action",
      header: "Action",
      type: "custom",
      options: [],
      option_value: "",
      option_label: "",
    },
  ];

  const proficiencyOptions = [
    { value: "Basic", label: "Basic" },
    { value: "Average", label: "Average" },
    { value: "Medium", label: "Medium" },
    { value: "Good", label: "Good" },
    { value: "Excellent", label: "Excellent" },
  ];

  const languageColumns: LangTableColumn[] = [
    {
      key: "fname",
      header: "Language",
      type: "select",
      options: Array.isArray(languageRequirements)
        ? languageRequirements.map((l) => ({
            id: l.id ?? l.name ?? l.title ?? "",
            name: l.name ?? l.id ?? l.title ?? "",
            title: l.title ?? (l as any).fname ?? l.name ?? String(l.id ?? ""),
            value: l.name ?? l.id ?? l.title ?? "",
            label: l.title ?? (l as any).fname ?? l.name ?? String(l.id ?? ""),
          }))
        : [],
      option_value: "value",
      option_label: "label",
    },
    {
      key: "read",
      header: "Read",
      type: "select",
      options: proficiencyOptions.filter(
        (opt) => opt.value !== "Average" && opt.value !== "Medium"
      ),
      option_value: "value",
      option_label: "label",
    },
    {
      key: "write",
      header: "Write",
      type: "select",
      options: proficiencyOptions,
      option_value: "value",
      option_label: "label",
    },
    {
      key: "speak",
      header: "Speak",
      type: "select",
      options: proficiencyOptions.filter(
        (opt) => opt.value !== "Average" && opt.value !== "Medium"
      ),
      option_value: "value",
      option_label: "label",
    },
    {
      key: "mandatory__preferred",
      header: "Mandatory",
      type: "checkbox",
      options: [],
      option_value: "",
      option_label: "",
    },
    {
      key: "action",
      header: "Action",
      type: "custom",
      options: [],
      option_value: "",
      option_label: "",
    },
  ];

  const handleTableUpdate = (
    field: any,
    index: number,
    key: string,
    value: string | number
  ) => {
    const updated = [...field.value];
    updated[index] = { ...updated[index], [key]: value };
    field.onChange(updated);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Key Skills */}
        <Card className="gap-2">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Key skills <span style={{ color: "red" }}>*</span>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs bg-primary text-accent hover:bg-primary/90 hover:text-accent/90 cursor-pointer"
                onClick={handleReGenerateClick}
              >
                <RotateCw style={{ height: 14 }} />
                <p className="text-xs">Re-generate</p>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-3">
            <div className="col-span-full">
              <MultiSelectWithChips
                name="key_skills"
                placeholder="Keywords"
                options={
                  Array.isArray(keySkills)
                    ? keySkills.map((k) => ({
                        id: String(k.id ?? k.name ?? k.title ?? ""),
                        name: k.name ?? k.title ?? "",
                      }))
                    : []
                }
                error={errors.key_skills?.message}
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills & Experience */}
        <Card className="gap-2">
          <CardHeader className="px-3">
            <CardTitle className="text-base">
              Skills & Experience <span style={{ color: "red" }}>*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3">
            <Controller
              name="skills_and_experience"
              control={control}
              render={({ field }) => (
                <SkillTable
                  columns={skillColumns}
                  data={field.value ?? []}
                  onAdd={() =>
                    field.onChange([
                      ...field.value,
                      {
                        fname: "",
                        min_experience: 0,
                        max_experience: 0,
                        mandatorypreferred: "Mandatory",
                        parentfield: "skills_and_experience",
                      },
                    ])
                  }
                  onRemove={(index) => {
                    const updated = [...field.value];
                    updated.splice(index, 1);
                    field.onChange(updated);
                  }}
                  onClear={(index) => {
                    const updated = [...field.value];
                    updated[index] = {
                      fname: "",
                      min_experience: 0,
                      max_experience: 0,
                      mandatorypreferred: "Mandatory",
                      parentfield: "skills_and_experience",
                    };
                    field.onChange(updated);
                  }}
                  onUpdate={(index, key, value) =>
                    handleTableUpdate(field, index, key, value)
                  }
                  error={errors.skills_and_experience}
                />
              )}
            />
          </CardContent>
        </Card>

        {/* Tools Familiarity */}
        <Card className="gap-2">
          <CardHeader className="px-3">
            <CardTitle className="text-base">
              Tools Familiarity <span style={{ color: "red" }}>*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3">
            <Controller
              name="tools_familarity"
              control={control}
              render={({ field }) => (
                <SkillTable
                  columns={toolColumns}
                  data={field.value ?? []}
                  onAdd={() =>
                    field.onChange([
                      ...field.value,
                      {
                        fname: "",
                        min_experience: 0,
                        max_experience: 0,
                        mandatory__preferred: "Mandatory",
                        parentfield: "tools_familarity",
                      },
                    ])
                  }
                  onRemove={(index) => {
                    const updated = [...field.value];
                    updated.splice(index, 1);
                    field.onChange(updated);
                  }}
                  onClear={(index) => {
                    const updated = [...field.value];
                    updated[index] = {
                      fname: "",
                      min_experience: 0,
                      max_experience: 0,
                      mandatory__preferred: "Mandatory",
                      parentfield: "tools_familarity",
                    };
                    field.onChange(updated);
                  }}
                  onUpdate={(index, key, value) =>
                    handleTableUpdate(field, index, key, value)
                  }
                  error={errors.tools_familarity}
                />
              )}
            />
          </CardContent>
        </Card>

        {/* Language Requirements */}
        <Card className="gap-2">
          <CardHeader className="px-3">
            <CardTitle className="text-base">
              Language Requirements <span style={{ color: "red" }}>*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3">
            <Controller
              name="language_requirement"
              control={control}
              render={({ field }) => (
                <SkillTable
                  columns={languageColumns}
                  data={field.value ?? []}
                  onAdd={() =>
                    field.onChange([
                      ...field.value,
                      {
                        fname: "",
                        read: "Basic",
                        write: "Basic",
                        speak: "Basic",
                        mandatory__preferred: "Mandatory",
                        parentfield: "language_requirement",
                      },
                    ])
                  }
                  onRemove={(index) => {
                    const updated = [...field.value];
                    updated.splice(index, 1);
                    field.onChange(updated);
                  }}
                  onClear={(index) => {
                    const updated = [...field.value];
                    updated[index] = {
                      fname: "",
                      read: "",
                      write: "",
                      speak: "",
                      mandatory__preferred: "Mandatory",
                      parentfield: "language_requirement",
                    };
                    field.onChange(updated);
                  }}
                  onUpdate={(index, key, value) =>
                    handleTableUpdate(field, index, key, value)
                  }
                  error={errors.language_requirement}
                />
              )}
            />
          </CardContent>
        </Card>

        {/* Special Notes */}
        <Card className="gap-2">
          <CardHeader>
            <CardTitle className="text-base">Special Notes</CardTitle>
          </CardHeader>
          <CardContent className="px-3">
            <div className="col-span-full">
              <CusTextarea
                className="min-h-20"
                {...register("special_notes")}
                error={errors.special_notes?.message}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popup */}
      <SubmitButtonWithPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        variant="regenerate"
      />
    </>
  );
}
