import { CusInput } from "@/components/forms/CusInput";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { BaseFormData, FormData } from "@/types/jobs/editRR.type";
import { CusTextarea } from "@/components/forms/CusTextarea";
import CusChipInput from "@/components/forms/CusChipInput";
import BaseForm from "../BaseForm";
import { MinimalTiptap } from "@/components/ui/shadcn-io/minimal-tiptap";
import { Label } from "@/components/ui/label";
import { MultiSelectWithChips } from "@/components/forms/CusMultiSelectwithChip";
import { useDataContext } from "@/context/DataProvider";
import { useEffect } from "react";
import { CusSelect } from "@/components/forms/CusSelect";
import { SelectItem } from "@/components/ui/select";
import SkillTable, { LangTableColumn } from "./SkillTable";

interface JobFormProps {
  jobData: {
    register: UseFormRegister<FormData>;
    control: Control<FormData>;
    setValue: UseFormSetValue<FormData>;
    errors: FieldErrors<FormData>;
    // certifications: string[];
    // handleCertificationChange: (certs: string[]) => void;
    watch: UseFormWatch<FormData>;
  };
}

export default function JobDetails({ jobData }: JobFormProps) {
  const { projects, fetchProjects, visaRequirement, fetchVisaRequirement } =
    useDataContext();

  useEffect(() => {
    fetchProjects();
    fetchVisaRequirement();
  }, []);

  const {
    register,
    control,
    setValue,
    errors,
    watch,
  } = jobData;

  console.log(watch("location"), "jobData");

  const { qualification, fetchqualification } = useDataContext();

  useEffect(() => {
    fetchqualification();
  }, []);

  const certificationsColumns: LangTableColumn[] = [
    {
      key: "certification",
      header: "Certification",
      type: "input",
      options: [],
      option_value: "",
      option_label: "",
    },
    {
      key: "mandatory_preferred",
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
      <h3 className="font-medium mb-4">Job Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-2">
        <BaseForm
          register={register as unknown as UseFormRegister<BaseFormData>}
          control={control as unknown as Control<BaseFormData>}
          errors={errors as FieldErrors<BaseFormData>}
          setValue={setValue as unknown as UseFormSetValue<BaseFormData>}
          watch={watch as unknown as UseFormWatch<BaseFormData>}
        />

        <div className="col-span-12 mb-1">
          <Controller
            name="project"
            control={control}
            render={({ field }) => (
              <CusSelect
                label="Project Name"
                value={field.value}
                onValueChange={field.onChange}
                error={errors.project?.message}
                required
              >
                {projects?.map((item: any, i) => (
                  <SelectItem key={i} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </CusSelect>
            )}
          />
        </div>
        {/* project description */}
        <div className="col-span-12 mb-1">
          <CusTextarea
            label="Project Description"
            {...register("project_description")}
            error={errors.project_description?.message}
          />
        </div>
        <div className="col-span-12 mb-1">
          <Controller
            name="responsibilities"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <MinimalTiptap
                  label="Responsibilities"
                  content={field.value}
                  onChange={field.onChange}
                  showStrike={false}
                  showBold={false}
                  showItalic={false}
                  showHeadings={false}
                  showBulletList={true}
                  showOrderedList={false}
                  showHorizontalRule={false}
                  error={errors.responsibilities?.message}
                  required
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
        {/* qualification and certification */}
        <div className="col-span-12 mb-1">
          <Label className="mb-1 text-xs">Qualification</Label>
          <MultiSelectWithChips
            name="qualification"
            placeholder="Select qualifications"
            options={Array.isArray(qualification) ? qualification : []}
            error={errors.qualification?.message}
          />
        </div>

        {/* qualification and certification */}
        <div className="col-span-12 mb-1">
          {/* <CusChipInput
            label="Certification"
            value={certifications}
            onChange={handleCertificationChange}
            placeholder="Add certification and press Enter"
            error={errors.certifications?.message}
            name="certifications"
            required
          /> */}

          <Controller
            name="certifications"
            control={control}
            render={({ field }) => (
              <SkillTable
                columns={certificationsColumns}
                data={field.value ?? []}
                onAdd={() =>
                  field.onChange([
                    ...field.value,
                    {
                      certification: "",
                      mandatory_preferred: "Mandatory",
                      parentfield: "certifications",
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
                    certification: "",
                    mandatory_preferred: "Mandatory",
                    parentfield: "certifications",
                  };
                  field.onChange(updated);
                }}
                onUpdate={(index, key, value) =>
                  handleTableUpdate(field, index, key, value)
                }
                error={errors.certifications}
              />
            )}
          />
        </div>
        <div className="col-span-12 mb-1">
          <Controller
            name="visa_requirements"
            control={control}
            render={({ field }) => (
              <CusSelect
                label="Visa Requirement"
                value={field.value}
                onValueChange={field.onChange}
                error={errors.visa_requirements?.message}
              >
                {visaRequirement?.map((item: any, i) => (
                  <SelectItem key={i} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </CusSelect>
            )}
          />
        </div>
      </div>
    </>
  );
}
