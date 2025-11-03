import { watch } from "fs";
import { z } from "zod";

const toNumber = (val: unknown) => {
  if (val === null || val === undefined || val === "") return undefined;
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  }
  return undefined;
};

const tableDataSchema = z.object({
  fname: z.string().min(1, "Name is required"),
  min_experience: z.preprocess(toNumber, z.number().optional()),
  max_experience: z.preprocess(toNumber, z.number().optional()),
  mandatory__preferred: z.string(),
  parentfield: z.string(),
});

const certificateSchema = z.object({
  certification: z.string().min(1, "Name is required"),
  mandatory_preferred: z.string(),
  parentfield: z.string(),
});

const tableDataSchemaTwo = z.object({
  fname: z.string().min(1, "Name is required"),
  min_experience: z.preprocess(toNumber, z.number().optional()),
  max_experience: z.preprocess(toNumber, z.number().optional()),
  mandatorypreferred: z.string(),
  parentfield: z.string(),
});

const languageSchema = z.object({
  fname: z.string().min(1, "Name is required"),
  read: z.string(),
  write: z.string(),
  speak: z.string(),
  mandatory__preferred: z.string(),
  parentfield: z.string(),
});
export const baseFormSchema = z
  .object({
    job_title: z.string().min(2, "Job title is required"),
    position_start_date: z.date(),
    position_est_end_date: z.date(),
    expected_duration: z.number().min(1).optional(),
    no_of_resources: z
      .number()
      .refine((val) => !isNaN(val), { message: "Must be a number" })
      .min(1, "At least 1 opening")
      .max(1000, "At most 1000 openings"),
    salaryRangeEnabled: z.boolean(),
    min_bill_rate: z.number().min(0, "Salary must be positive"),
    max_bill_rate: z.number().min(0, "Salary must be positive"),
    billing_frequency: z.string(),
    billing_currency: z.string(),
    project_type: z.string().min(1, "Project type is required"),
    location: z.string().min(1, "Location is required"),
    work_days_per_week: z.number().min(1).max(7),
    work_hours_per_day: z.number().min(1).max(24),
    is_rotation: z.boolean(),
    rotation_on_weeks: z.number().optional(),
    rotation_off_weeks: z.number().optional(),
    qualification: z.string().optional(),
    key_skills: z.string().optional(),
    project_description: z.string().optional(), 
  })
  .superRefine((data, ctx) => {
    if (data.position_est_end_date < data.position_start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["position_est_end_date"],
        message: "End date must be after start date",
      });
    }

    if (data.is_rotation) {
      if (data.rotation_on_weeks == null || isNaN(data.rotation_on_weeks)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rotation_on_weeks"],
          message: "Rotation ON value is required",
        });
      }

      if (data.rotation_off_weeks == null || isNaN(data.rotation_off_weeks)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rotation_off_weeks"],
          message: "Rotation OFF value is required",
        });
      }
    }
  });

export const additionalFormSchema = z.object({
  qualification: z.string().optional(),
  key_skills: z.string().optional(),
  project_description: z.string().optional(), 
  country: z.string(),
  uploaded_jd: z.string().optional(),
});

export const totalBaseFormSchema = baseFormSchema.merge(additionalFormSchema);

export const formSchema = baseFormSchema
  .merge(
    z.object({
      project: z.string().min(1, "Project is required"),
      project_description: z.string(),
      responsibilities: z.string().min(1, "Responsibilities is required"),
      qualification: z.array(z.string()),
      certifications: z.array(certificateSchema),
      visa_requirements: z.string(),
      key_skills: z.array(z.string()).min(1, { message: "At least one key skills is required" }),
      special_notes: z.string(),
      skills_and_experience: z.array(tableDataSchemaTwo),
      tools_familarity: z.array(tableDataSchema),
      language_requirement: z.array(languageSchema),
      country: z.string(),
    })
  )
  .refine(
    (data) => {
      if (data.salaryRangeEnabled) {
        return (
          data.min_bill_rate !== undefined && data.max_bill_rate !== undefined
        );
      }
      return true;
    },
    {
      message: "Salary range fields are required when enabled",
      path: ["salaryRangeEnabled"],
    }
  )
  .refine(
    (data) => {
      if (data.salaryRangeEnabled && data.max_bill_rate !== undefined) {
        return data.max_bill_rate >= data.min_bill_rate;
      }
      return true;
    },
    {
      message: "End salary must be greater than or equal to start salary",
      path: ["max_bill_rate"],
    }
  )
  .refine(
    (data) => {
      // Only validate when both min and max are present for each item
      return data.tools_familarity.every((item) => {
        if (
          item.min_experience === undefined ||
          item.max_experience === undefined
        )
          return true; // skip if one side is missing
        return item.max_experience >= item.min_experience;
      });
    },
    {
      message: "Max experience must be greater than or equal to min experience",
      path: ["tools_familarity"],
    }
  )
  .refine(
    (data) => {
      // Only validate when both min and max are present for each item
      return data.skills_and_experience.every((item) => {
        if (
          item.min_experience === undefined ||
          item.max_experience === undefined
        )
          return true; // skip if one side is missing
        return item.max_experience >= item.min_experience;
      });
    },
    {
      message: "Max experience must be greater than or equal to min experience",
      path: ["skills_and_experience"],
    }
  );
