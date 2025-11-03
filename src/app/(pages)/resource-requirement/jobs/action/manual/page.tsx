"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, ChevronLeft, Save, RotateCcw, Loader2 } from "lucide-react";
import { getStatusColor } from "@/components/(resource-requirement)/jobs/utils";
import JobDetails from "@/components/(resource-requirement)/jobs/action/edit/JobDetails";
import Skills from "@/components/(resource-requirement)/jobs/action/edit/Skills";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { FormProvider, useForm } from "react-hook-form";
import { FormData } from "@/types/jobs/editRR.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/schemas/editRR.schemas";
import { useState, useEffect } from "react";
import Chat from "../../../my-jobs/chat";
import { ChatMessage } from "@/types/myjobs/chat";
import { InputOverviewDrawer } from "@/components/(resource-requirement)/jobs/action/InputoverviewDrawer";
import type { Resolver } from "react-hook-form";
import Cookies from "js-cookie";
import { FieldErrors } from "react-hook-form";
import { useDataContext } from "@/context/DataProvider";
import { toast } from "sonner";

export default function EditRR() {
  const router = useRouter();
  const search = useSearchParams();
  const jobId = search.get("d");

  const { languageRequirements, fetchLanguageRequirements } = useDataContext();

  useEffect(() => {
    fetchLanguageRequirements();
  }, []);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: currentMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setCurrentMessage("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message:
          "I'm here to help you with the resource requirements. What would you like to know or modify?",
        sender: "assistant",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormData>,
    defaultValues: {
      job_title: "",
      position_start_date: new Date(),
      position_est_end_date: new Date(),
      no_of_resources: 1,
      salaryRangeEnabled: false,
      min_bill_rate: 0,
      max_bill_rate: 0,
      country: "",
      billing_frequency: "Monthly",
      billing_currency: "USD",
      project_type: "",
      location: "",
      work_days_per_week: 5,
      work_hours_per_day: 8,
      expected_duration: 4,
      is_rotation: false,
      project: "",
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
          read: "Basic",
          write: "Basic",
          speak: "Basic",
          mandatory__preferred: "Mandatory",
          parentfield: "language_requirement",
        },
      ],
    },
  });

  const CUSTOMER = Cookies.get("full_name");

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
  const [showAIColumn, setShowAIColumn] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleQualificationsChange = (newQuals: string[]) =>
    setValue("qualification", newQuals, { shouldValidate: true });
  const handleKeySkillsChange = (newQuals: string[]) =>
    setValue("key_skills", newQuals, { shouldValidate: true });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData, type: "Open" | "Draft") => {
    setLoading(true);
    // Ensure dates are strings in yyyy-MM-dd format (backend expects date strings)
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

    const keySkillsArr = Array.isArray(data.key_skills)
      ? data.key_skills
          .filter((k) => k != null && k !== "")
          .map((k) => ({ key_skills: k }))
      : [];

    const qualificationArr = Array.isArray(data.qualification)
      ? data.qualification
          .filter((k) => k != null && k !== "")
          .map((k) => ({ qualification: k }))
      : [];

    // Coerce numeric fields in nested tables and remove empty rows
    const skillsAndExperience = Array.isArray(data.skills_and_experience)
      ? data.skills_and_experience
          .filter((it: any) => it?.fname && String(it.fname).trim() !== "")
          .map((it: any) => ({
            fname: it.fname,
            min_experience: it.min_experience || 0,
            max_experience: it.max_experience || 0,
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
            min_experience: it.min_experience || 0,
            max_experience: it.max_experience || 0,
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
      state: type,
      position_start_date: startDate,
      position_est_end_date: endDate,
      // customer: CUSTOMER,
      customer: "Shell Corporation",
      is_rotation: data.is_rotation === true ? 1 : 0,
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
      const endpoint = jobId
        ? `/api/rr/post/pre-rr/form-edit?rr_name=${jobId}`
        : `/api/rr/post/pre-rr/form-create`;

      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Failed: ${res.status} ${res.statusText}`);
      }
      const result = await res.json();
      if (result?.message?.status === "Success") {
        router.push(`/resource-requirement/jobs`, { scroll: false });
      }
      console.log("✅ Form submitted:", result);
      if (result?.message?.status === "Failed") {
        toast.error(result?.message?.message);
      }
    } catch (err) {
      console.error("❌ API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors: FieldErrors<FormData>) => {
    console.log("❌ Validation errors:", errors);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Form Data on Save:", getValues());
  };

  const jobDetailsData = {
    register,
    control,
    setValue,
    errors,
    certifications,
    qualification,
    handleQualificationsChange,
    handleKeySkillsChange,
    watch,
  };

  const fetchJD = async () => {
    try {
      const response = await fetch(`/api/rr/info/singleget?job_id=${jobId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData && responseData.data) {
        const jobDataArray = responseData.data;

        const formattedTools = Array.isArray(jobDataArray?.tools_familarity)
          ? jobDataArray.tools_familarity.map((item: any) => ({
              fname: item.fname || "",
              min_experience: item.min_experience?.toString() || "",
              max_experience: item.max_experience?.toString() || "",
              mandatory__preferred: item.mandatory__preferred || "Mandatory",
              parentfield: "tools_familarity",
            }))
          : [
              {
                fname: "",
                min_experience: "",
                max_experience: "",
                mandatory__preferred: "Mandatory",
                parentfield: "tools_familarity",
              },
            ];

        const formattedSkills = Array.isArray(
          jobDataArray?.skills_and_experience
        )
          ? jobDataArray.skills_and_experience.map((item: any) => ({
              fname: item.fname || "",
              min_experience: item.min_experience?.toString() || "",
              max_experience: item.max_experience?.toString() || "",
              mandatorypreferred: item.mandatorypreferred || "Mandatory",
              parentfield: "skills_and_experience",
            }))
          : [
              {
                fname: "",
                min_experience: "",
                max_experience: "",
                mandatorypreferred: "Mandatory",
                parentfield: "skills_and_experience",
              },
            ];

        const formattedCertificate = Array.isArray(jobDataArray?.certifications)
          ? jobDataArray.certifications.map((item: any) => ({
              certification: item.certification || "",
              mandatory_preferred: item.mandatory_preferred || "Mandatory",
              parentfield: "certifications",
            }))
          : [
              {
                certification: "",
                mandatory_preferred: "Mandatory",
                parentfield: "certifications",
              },
            ];

        const formattedLanguage = Array.isArray(
          jobDataArray?.language_requirement
        )
          ? jobDataArray.language_requirement.map((item: any) => ({
              fname:
                languageRequirements.find((res) => res.title === item.fname)
                  ?.name ||
                item.fname ||
                "",
              title: item.title ?? item.fname ?? item.language ?? "",
              read: item.read || "Basic",
              write: item.write || "Basic",
              speak: item.speak || "Basic",
              mandatory__preferred: item.mandatory__preferred || "Mandatory",
              parentfield: "language_requirement",
            }))
          : [
              {
                fname: "",
                read: "Basic",
                write: "Basic",
                speak: "Basic",
                mandatory__preferred: "Mandatory",
                parentfield: "language_requirement",
              },
            ];

        const salaryRangeEnabled =
          jobDataArray?.min_bill_rate !== jobDataArray?.max_bill_rate;
        setValue(
          "responsibilities",
          `<p>${jobDataArray?.responsibilities}</p>`
        );
        setValue("job_title", jobDataArray?.job_title);

        const parsedStart = jobDataArray?.position_start_date
          ? new Date(jobDataArray.position_start_date)
          : null;
        const parsedEnd = jobDataArray?.position_est_end_date
          ? new Date(jobDataArray.position_est_end_date)
          : null;

        if (parsedStart) setValue("position_start_date", parsedStart);
        else setValue("position_start_date", new Date());

        if (parsedEnd) setValue("position_est_end_date", parsedEnd);
        else setValue("position_est_end_date", new Date());
        setValue("no_of_resources", jobDataArray?.no_of_resources);
        setValue("min_bill_rate", jobDataArray?.min_bill_rate);
        setValue("max_bill_rate", jobDataArray?.max_bill_rate);
        setValue("country", jobDataArray?.country);
        setValue("billing_frequency", jobDataArray?.billing_frequency);
        setValue("billing_currency", jobDataArray?.billing_currency);
        setValue("project_type", jobDataArray?.project_type);
        setValue("location", jobDataArray?.location);
        setValue("work_days_per_week", jobDataArray?.work_days_per_week);
        setValue("work_hours_per_day", jobDataArray?.work_hours_per_day);
        setValue("is_rotation", jobDataArray?.is_rotation === 0 ? false : true);
        setValue("project", jobDataArray?.project);
        setValue("rotation_on_weeks", jobDataArray?.rotation_on_weeks);
        setValue("rotation_off_weeks", jobDataArray?.rotation_off_weeks);
        setValue("project_description", jobDataArray?.project_description);
        setValue("salaryRangeEnabled", salaryRangeEnabled);
        setValue("certifications", formattedCertificate);
        setValue("qualification", jobDataArray?.qualification);
        setValue("visa_requirements", jobDataArray?.visa_requirements);
        setValue("skills_and_experience", formattedSkills);
        setValue("tools_familarity", formattedTools);
        setValue("language_requirement", formattedLanguage);
        setValue("key_skills", jobDataArray?.key_skills);
        setValue("special_notes", jobDataArray?.special_notes);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  useEffect(() => {
    if (jobId !== null && languageRequirements) {
      fetchJD();
    }
  }, [jobId, languageRequirements]);

  return (
    <div className="mx-auto space-y-6">
      {/* Header */}
      <FormProvider {...methods}>
        <form
          // onSubmit={handleSubmit((data) => onSubmit(data, "Open"), onError)}
          onSubmit={handleSubmit((data, e) => {
            // detect which button triggered the submit
            const action = (e?.nativeEvent as SubmitEvent)
              ?.submitter as HTMLButtonElement;
            const actionValue = action?.value || "open"; // fallback if somehow missing
            onSubmit(data, actionValue === "draft" ? "Draft" : "Open");
          }, onError)}
        >
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
                {jobId !== null ? jobId : "New"}
              </Badge>
              {jobId && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 bg-white rounded-sm"
                  onClick={handleOpenDrawer}
                >
                  <EyeIcon className="h-4 w-4" />
                  Input Overview
                </Button>
              )}
              <InputOverviewDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                name="action"
                value="draft"
                variant="outline"
                size="sm"
                className="text-[#6C757D] border-[#6C757D] bg-muted"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground"
                type="submit"
                name="action"
                value="open"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submit
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-3 relative ${
              showAIColumn ? "lg:grid-cols-5" : "lg:grid-cols-6"
            } gap-3 p-3 rounded-lg bg-card`}
          >
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
                  onClick={() =>
                    router.push(`/resource-requirement/my-jobs?d=${jobId}`)
                  }
                  size="sm"
                  className="bg-primary/5 text-primary hover:bg-accent text-sm cursor-pointer"
                >
                  View Mode
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowAIColumn(!showAIColumn)}
                  className="bg-card border-foreground hover:bg-primary-foreground hover:shadow-lg text-primary-foreground shadow-md cursor-pointer"
                >
                  <img
                    src={"/assets/icons/job-listing/AI.svg"}
                    alt="Printer"
                    className="h-4 w-4 cursor-pointer"
                  />
                </Button>
              </div>
            </div>
            {/* Left Column - Edit Details */}
            <div
              className={`${
                showAIColumn ? "lg:col-span-3" : "lg:col-span-3"
              } col-span-full`}
            >
              <Card>
                <CardContent className="space-y-6 px-3">
                  <JobDetails jobData={jobDetailsData} />
                </CardContent>
              </Card>
            </div>
            {showAIColumn && (
              <Chat
                chatMessages={chatMessages}
                currentMessage={currentMessage}
                setCurrentMessage={setCurrentMessage}
                handleSendMessage={handleSendMessage}
                handleKeyPress={handleKeyPress}
              />
            )}
            {/* Right Column - Key Skills & Requirements */}
            <div
              className={`${
                showAIColumn ? "lg:col-span-3" : "lg:col-span-3"
              } space-y-3 col-span-full`}
            >
              <Skills errors={errors} control={control} register={register} />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
