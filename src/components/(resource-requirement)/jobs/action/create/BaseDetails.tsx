import BaseForm from "@/components/(resource-requirement)/jobs/action/BaseForm";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { totalBaseFormSchema } from "@/schemas/editRR.schemas";
import { BaseFormData } from "@/types/jobs/editRR.type";
import { format } from "date-fns";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdditionalForm } from "../AdditionalForm";
import { useState } from "react";
import { AILoader } from "@/components/shared/AILoading";
import { FieldErrors } from "react-hook-form";
import { useRouter } from "next/navigation";

export const BaseDetails = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const methods = useForm<BaseFormData>({
    resolver: zodResolver(totalBaseFormSchema),
    mode: "onSubmit",
    defaultValues: {
      job_title: "",
      position_start_date: new Date(),
      position_est_end_date: tomorrow,
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
      is_rotation: false,
      rotation_off_weeks: 0,
      rotation_on_weeks: 0,
      qualification: "",
      key_skills: "",
      project_description: "",
      uploaded_jd: "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: BaseFormData) => {
    if (
      data.position_est_end_date &&
      data.position_start_date &&
      data.position_est_end_date <= data.position_start_date
    ) {
      console.log("indside the validation");

      methods.setError("position_est_end_date", {
        type: "manual",
        message: "End date must be after the start date",
      });
      return;
    }

    setIsLoading(true);

    const payload = {
      ...data,
      position_start_date: data.position_start_date
        ? format(data.position_start_date, "yyyy-MM-dd")
        : null,
      position_est_end_date: data.position_est_end_date
        ? format(data.position_est_end_date, "yyyy-MM-dd")
        : null,
      customer: "Shell Corporation",
      is_rotation: data.is_rotation === true ? 1 : 0,
    };

    if (!data.salaryRangeEnabled) {
      payload.max_bill_rate = payload.min_bill_rate;
    }

    console.log(payload, "payload");

    try {
      const res = await fetch("/api/rr/post/pre-rr/ai-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);
      const result = await res.json();
      console.log("✅ Result after the API :", result);
      if (result?.message?.status === "Success"){
        router.push(`/resource-requirement/jobs`, { scroll: false });
      }
    } catch (err) {
      console.error("❌ API error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    methods.reset();
  };

  const onError = (errors: FieldErrors<FormData>) => {
    console.log("❌ Validation errors:", errors);
  };

  return (
    <>
      {isLoading && <AILoader />}
      <div className="col-span-1 lg:col-span-9 bg-card p-2 rounded-md flex flex-col justify-start items-start space-y-4">
        <div className="flex justify-between items-center w-full">
          <p className="text-lg font-bold text-primary w-full">
            Describe what you need — Lora fills it in.
          </p>
          <div className="flex justify-end items-center space-x-2 gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-auto px-2"
              onClick={reset}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button
              className="relative p-2 text-accent text-base  overflow-hidden bg-primary  transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-primary before:to-(--primary-active) before:transition-all before:duration-500 before:ease-in-out before:z-[-1]  hover:before:left-0 flex gap-2 items-center whitespace-nowrap button-hover"
              onClick={handleSubmit(onSubmit, onError)}
            >
              <img
                src={"/assets/icons/job-info/loraAi.svg"}
                className="w-4 h-4 "
                alt=""
              />
              Generate RR
            </Button>
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-2 ">
              <BaseForm
                register={register}
                control={control}
                errors={errors}
                setValue={setValue}
              />
            </div>
            <AdditionalForm
              register={register}
              control={control}
              errors={errors}
              setValue={setValue}
            />
          </form>
        </FormProvider>
      </div>
    </>
  );
};
