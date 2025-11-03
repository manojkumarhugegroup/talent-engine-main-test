// CandidateSearchForm.tsx
import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import CusChipInput from "@/components/forms/CusChipInput"
import { CusDatePicker } from "@/components/forms/CusDatePicker"
import { Controller } from "react-hook-form"
import { CusSelect } from "@/components/forms/CusSelect"
import { SelectItem } from "@/components/ui/select"
import { CusDateRangePicker } from "@/components/forms/CusDateRangePicker"
import { DateRange } from "react-day-picker" // Import from react-day-picker
import { format } from "date-fns";

export const formSchema = z.object({
  expectedJoining: z
    .object({
      from: z.string().nullable().refine(val => val !== null && val !== '', { message: "Start date is required" }),
      to:   z.string().nullable().refine(val => val !== null && val !== '', { message: "End date is required" }),
    })
    .refine((data) => {
      if (data.from && data.to) {
        // compare as strings; or convert to Date if needed
        return data.to >= data.from;
      }
      return true;
    }, {
      message: "End date must be after start date",
      path: ["to"],
    }),
  experience: z.string().min(1, "Experience required"),
  skills: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>

type Props = {
  onCancel: () => void
  onSearch?: (values: FormValues) => void
}

const CandidateSearchForm: React.FC<Props> = ({ onCancel, onSearch }) => {
  const getCurrentDate = () => new Date()
  const getTodayMinDate = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  }

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expectedJoining: { from: undefined, to: undefined },
      experience: "0",
      skills: [],
      locations: [],
      certifications: [],
      keywords: [],
    },
  })

const onSubmit = (data: FormValues) => {
  // Format the date fields if they exist
  const formattedData = {
    ...data,
    expectedJoining: {
      from: data.expectedJoining?.from
        ? format(data.expectedJoining.from, 'yyyy-MM-dd')
        : null,
      to: data.expectedJoining?.to
        ? format(data.expectedJoining.to, 'yyyy-MM-dd')
        : null,
    },
  };

  console.log('Formatted Form Data:', formattedData);

  // Pass the formatted data to the parent component
  if (onSearch) onSearch(formattedData);
};

  // Watch all array values
  const skills = watch("skills")
  const locations = watch("locations")
  const certifications = watch("certifications")
  const keywords = watch("keywords")

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto border p-6 rounded-lg shadow bg-card"
    >
      <h2 className="text-lg font-semibold mb-4">Find the Candidates</h2>

      {/* Date Range Picker */}
      <div className="flex gap-4 mb-4">
        {/* Expected Joining (70%) */}
        <div className="">
          <label className="block font-medium mb-1">Expected Joining</label>

          <Controller
            name="expectedJoining"
            control={control}
            rules={{
              required: "Date range is required",
              // Fixed validate function - remove explicit typing, let TypeScript infer
              validate: (val) => {
                if (!val?.from || !val?.to) return "Both dates must be selected";
                return val.from <= val.to || "Start date cannot be after end date";
              }
            }}
            render={({ field, fieldState }) => (
              <CusDateRangePicker
                value={{
                  from: field.value?.from ? new Date(field.value.from) : undefined,
                  to: field.value?.to ? new Date(field.value.to) : undefined,
                }}
                onChange={(range) => {
                  field.onChange({
                    from: range?.from ? range.from.toISOString() : null,
                    to: range?.to ? range.to.toISOString() : null,
                  });
                }}
                error={fieldState.error?.message}
                placeholder="Date Range"
              />
            )}
          />

          {errors.expectedJoining && (
            <p className="text-red-500 text-sm mt-1">{errors.expectedJoining.message}</p>
          )}
        </div>

        {/* Total Experience (30%) */}
        <div className="w-1/5">
          <label className="block font-medium mb-1">Total Experience</label>
          <Controller
            name="experience"
            control={control}
            render={({ field }) => (
              <CusSelect
                value={field.value}
                onValueChange={field.onChange}
                required
                placeholder="Select experience"
              >
                {[...Array(30)].map((_, i) => (
                  i !== 0 && (
                    <SelectItem key={i} value={String(i)}>
                      {i}
                    </SelectItem>
                  )
                ))}
              </CusSelect>
            )}
          />
          {errors.experience && (
            <p className="text-sm text-red-500 mt-1">{errors.experience.message}</p>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <CusChipInput
          label="Skills"
          name="skills"
          value={skills ?? []}
          onChange={(vals) => setValue("skills", vals)}
          placeholder="Enter skill and press Enter"
          error={errors.skills?.message}
        />
      </div>

      {/* Locations */}
      <div className="mb-4">
        <CusChipInput
          label="Location"
          name="locations"
          value={locations ?? []}
          onChange={(vals) => setValue("locations", vals)}
          placeholder="Enter location and press Enter"
          error={errors.locations?.message}
        />
      </div>

      {/* Certifications */}
      <div className="mb-4">
        <CusChipInput
          label="Certifications"
          name="certifications"
          value={certifications ?? []}
          onChange={(vals) => setValue("certifications", vals)}
          placeholder="Enter certification and press Enter"
          error={errors.certifications?.message}
        />
      </div>

      {/* Keywords */}
      <div className="mb-6">
        <CusChipInput
          label="Keywords"
          name="keywords"
          value={keywords ?? []}
          onChange={(vals) => setValue("keywords", vals)}
          placeholder="Enter keyword and press Enter"
          error={errors.keywords?.message}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-card border border-[#00434E] rounded hover:bg-gray-100 w-100 text-[#00434E]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#00434E] text-white rounded hover:bg-teal-800 w-100"
        >
          Search
        </button>
      </div>
    </form>
  )
}

export default CandidateSearchForm