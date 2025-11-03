import {
  additionalFormSchema,
  baseFormSchema,
  formSchema,
  totalBaseFormSchema,
} from "@/schemas/editRR.schemas";
import z from "zod";

export type FormData = z.infer<typeof formSchema>;
export type BaseFormData = z.infer<typeof totalBaseFormSchema>;
export type BaseFormSchema = z.infer<typeof baseFormSchema>;
export type AdditionalFormSchema = z.infer<typeof additionalFormSchema>;
export type TotalBaseFormSchema = z.infer<typeof totalBaseFormSchema>;

export type JobDataType = FormData & {
  name: string;
  data_uniq_id: string;
  position_start_date: string;
  position_est_end_date: string;
  salary: string;
  country: string;
  work_days_per_week: number;
  work_hours_per_day: number;
  rotation_on_weeks: number;
  rotation_off_weeks: number;
  expected_duration: string;
  state: string;
};

export type RrInfoType = Pick<
  FormData,
  "skills_and_experience" | "language_requirement"
>;

export interface ToolsFormProps {
  tools_familarity: Tool[];
  onToolsChange: (tools_familarity: Tool[]) => void;
}

export interface SkillsFormProps {
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
}

export interface LanguagesFormProps {
  languages: Language[];
  onLanguagesChange: (language_requirement: Language[]) => void;
}

export interface TableColumn {
  key: string;
  label: string;
  type: "input" | "select";
  placeholder?: string;
  options?: string[] | number[];
}

export interface TableItem {
  id: string;
  [key: string]: string;
}

export interface GenericTableProps<T extends TableItem> {
  title: string;
  items: T[];
  columns: TableColumn[];
  onItemsChange: (items: T[]) => void;
  addButtonText?: string;
}

export interface Skill {
  id: string;
  fname: string;
  min_experience: string | number;
  max_experience: string | number;
}

export interface Tool extends TableItem {
  fname: string;
  min_experience: string;
  max_experience: string;
}

export interface Language extends TableItem {
  fname: string;
  read: string;
  write: string;
  speak: string;
}

export interface TableData {
  [key: string]: unknown;
}

export type SkillExpKeys = "fname" | "min_experience" | "max_experience";
export type LanguageKeys = "fname" | "read" | "write" | "speak";
