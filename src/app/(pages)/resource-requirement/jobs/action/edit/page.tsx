"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, ChevronLeft, Save, RotateCcw } from "lucide-react";
import { getStatusColor } from "@/components/(resource-requirement)/jobs/utils";
import JobDetails from "@/components/(resource-requirement)/jobs/action/edit/JobDetails";
import Skills from "@/components/(resource-requirement)/jobs/action/edit/Skills";
import { useRouter, useSearchParams } from "next/navigation";
import { addDays, format } from "date-fns";
import { FormProvider, useForm, Resolver } from "react-hook-form";
import { FormData } from "@/types/jobs/editRR.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/schemas/editRR.schemas";
import { FieldErrors } from "react-hook-form";

export default function EditRR() {
  const router = useRouter();
  const search = useSearchParams();
  const jobId = search.get("d");

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema) as Resolver<FormData>,
    defaultValues: {
      job_title: "",
      position_start_date: new Date(),
      position_est_end_date: addDays(new Date(), 2),
      no_of_resources: 1,
      salaryRangeEnabled: false,
      min_bill_rate: 0,
      max_bill_rate: 0,
      billing_frequency: "Monthly",
      billing_currency: "USD",
      project_type: "",
      location: "",
      work_days_per_week: 5,
      work_hours_per_day: 8,
      expected_duration: 4,
      project: "",
      is_rotation: false,
      rotation_on_weeks: 1,
      rotation_off_weeks: 1,
      project_description: "",
      responsibilities: "",
      certifications: [
        {
          certification: "",
          mandatory_preferred: "Mandatory",
          parentfield: "certifications",
        },
      ],
      qualification: [],
      visa_requirements: "",
      key_skills: [],
      special_notes: "",
      skills_and_experience: [
        {
          fname: "",
          min_experience: 0,
          max_experience: 0,
          mandatorypreferred: "Mandatory",
          parentfield: "skills_and_experience",
        },
      ],
      tools_familarity: [
        {
          fname: "",
          min_experience: 0,
          max_experience: 0,
          mandatory__preferred: "Mandatory",
          parentfield: "tools_familarity",
        },
      ],
      language_requirement: [
        {
          fname: "",
          read: "",
          write: "",
          speak: "",
          mandatory__preferred: "Mandatory",
          parentfield: "language_requirement",
        },
      ],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = methods;
  const certifications = watch("certifications") || [];
  const qualification = watch("qualification") || [];

  const handleQualificationsChange = (newQuals: string[]) =>
    setValue("qualification", newQuals, { shouldValidate: true });

  const onSubmit = async (data: FormData) => {
    const startDate = data.position_start_date
      ? typeof data.position_start_date === "string"
        ? data.position_start_date
        : format(data.position_start_date, "yyyy-MM-dd")
      : null;

    const endDate = data.position_est_end_date
      ? typeof data.position_est_end_date === "string"
        ? data.position_est_end_date
        : format(data.position_est_end_date, "yyyy-MM-dd")
      : null;

    // Keep certifications / qualification / key_skills as arrays of strings
    const certificationsArr = Array.isArray(data.certifications)
      ? data.certifications
          .filter(
            (it: any) =>
              it?.certification && String(it.certification).trim() !== ""
          )
          .map((it: any) => ({
            certification: it.certification,
            mandatory_preferred: it.mandatory_preferred || "Mandatory",
            parentfield: it.parentfield || "certifications",
          }))
      : [];

    const keySkillsArr: string[] = Array.isArray(data.key_skills)
      ? data.key_skills.filter((k) => k != null && k !== "")
      : [];

    const qualificationArr: string[] = Array.isArray(data.qualification)
      ? data.qualification.filter((q) => q != null && q !== "")
      : [];

    // Coerce numeric fields in nested tables and remove empty rows
    const skillsAndExperience = Array.isArray(data.skills_and_experience)
      ? data.skills_and_experience
          .filter((it: any) => it?.fname && String(it.fname).trim() !== "")
          .map((it: any) => ({
            fname: it.fname,
            min_experience: Number(it.min_experience) || 0,
            max_experience: Number(it.max_experience) || 0,
            mandatorypreferred:
              it.mandatorypreferred || it.mandatory__preferred || "Mandatory",
            parentfield: it.parentfield || "skills_and_experience",
          }))
      : [];

    const toolsFamilarity = Array.isArray(data.tools_familarity)
      ? data.tools_familarity
          .filter((it: any) => it?.fname && String(it.fname).trim() !== "")
          .map((it: any) => ({
            fname: it.fname,
            min_experience: Number(it.min_experience) || 0,
            max_experience: Number(it.max_experience) || 0,
            mandatory__preferred:
              it.mandatory__preferred || it.mandatorypreferred || "Mandatory",
            parentfield: it.parentfield || "tools_familarity",
          }))
      : [];

    const languageRequirement = Array.isArray(data.language_requirement)
      ? data.language_requirement
          .filter((it: any) => it?.fname && String(it.fname).trim() !== "")
          .map((it: any) => ({
            fname: it.fname,
            read: it.read || "",
            write: it.write || "",
            speak: it.speak || "",
            mandatory__preferred: it.mandatory__preferred || "Mandatory",
            parentfield: it.parentfield || "language_requirement",
          }))
      : [];

    const payload = {
      ...data,
      position_start_date: startDate,
      position_est_end_date: endDate,
      certifications: certificationsArr,
      key_skills: keySkillsArr,
      qualification: qualificationArr,
      skills_and_experience: skillsAndExperience,
      tools_familarity: toolsFamilarity,
      language_requirement: languageRequirement,
    };

    if (!data.salaryRangeEnabled) {
      payload.max_bill_rate = payload.min_bill_rate;
    }
    try {
      const res = await fetch("/api/rr/post/pre-rr/form-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Failed: ${res.status} ${res.statusText}`);
      }

      const result = await res.json();
      console.log("✅ Form submitted:", result);
    } catch (err) {
      console.error("❌ API error:", err);
    }
  };

  const onError = (errors: FieldErrors<FormData>) => {
    console.log("❌ Validation errors:", errors);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    onSubmit(getValues());
  };

  const jobDetailsData = {
    register,
    control,
    setValue,
    errors,
    certifications,
    qualification,
    handleQualificationsChange,
    handleKeySkillsChange: (newSkills: string[]) =>
      setValue("key_skills", newSkills, { shouldValidate: true }),
    watch,
  };

  return (
    <div className="mx-auto space-y-6 ">
      {/* Header */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                className="hover:bg-transparent"
                size="sm"
                onClick={() => router.back()}
              >
                <ChevronLeft />
                <p className="text-lg font-semibold">Resource Requirements</p>
              </Button>
              <Badge
                variant="secondary"
                className={`rounded-sm ${getStatusColor("New")}`}
              >
                New
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="bg-card cursor-pointer"
              >
                <EyeIcon />
                Input Overview
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[#6C757D] border-[#6C757D] bg-muted"
                onClick={handleSave}
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 p-3 rounded-lg bg-card">
            <div className="col-span-full flex justify-between items-center">
              <p className="text-lg font-semibold">
                {jobId ? "Edit Details" : "Create Details"}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-[#6C757D]  cursor-pointer"
                  onClick={handleSave}
                >
                  <RotateCcw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="bg-[#E6EAFF] text-[#5069E7] hover:bg-accent text-sm cursor-pointer"
                >
                  View Mode
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="bg-card border-foreground hover:bg-primary-foreground hover:shadow-lg text-primary-foreground shadow-md cursor-pointer"
                >
                  <img
                    src="/assets/icons/job-listing/AI.svg"
                    alt=""
                    className="h-4 w-4 cursor-pointer"
                  />
                </Button>
              </div>
            </div>
            {/* Left Column - Edit Details */}
            <div className="col-span-full lg:col-span-3">
              <Card>
                <CardContent className="space-y-6 px-3">
                  <JobDetails jobData={jobDetailsData} />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Key Skills & Requirements */}
            <div className="space-y-3 col-span-full lg:col-span-3">
              <Skills errors={errors} control={control} register={register} />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
