"use client";

import type * as React from "react";
import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FileIcon, Upload, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/forms/CustomCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/forms/CustomAccordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CusDatePicker } from "@/components/forms/CusDatePicker";
import { CusInput } from "@/components/forms/CusInput";
import FileUpload from "@/components/shared/Upload";
import { ContractTermsFormValues } from "@/types/jobs/Info/kanban/contract";

export default function ContractTerms() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<ContractTermsFormValues>({
    defaultValues: {
      // General information
      workOrder: "",
      dateOfOrder: undefined,
      workOrderRef: "",
      workOrderRefImage: null,
      agreementRef: "",
      agreementRefImage: null,
      mobilizationPoint: "",
      demobilizationPoint: "",
      relievers: "",
      costCode: "",

      // Legal & Commercial
      validityOfProposal: "",
      paymentTerms: "",
      applicableTaxes: "",
      applicableLaw: "",

      // Insurance
      generalLiabilityInsurance: "",
      medicalInsurance: "",
    },
    mode: "onChange",
  });

  // Fixed: Remove | null from the ref type since we know they'll be assigned
  const workOrderRefImgInputRef = useRef<HTMLInputElement>(null);
  const agreementRefImgInputRef = useRef<HTMLInputElement>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedBusinessOption, setSelectedBusinessOption] = useState("");

  const handleChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const handleBusinessChange = (event: any) => {
    setSelectedBusinessOption(event.target.value);
  };

  const onSubmit = (data: ContractTermsFormValues) => {
    // Example production-ready submit handler placeholder
    console.log("[v0] Contract Terms submit:", {
      ...data,
      // For files, avoid logging File blobs directly in real production logs
      workOrderRefImage: data.workOrderRefImage
        ? data.workOrderRefImage.name
        : null,
      agreementRefImage: data.agreementRefImage
        ? data.agreementRefImage.name
        : null,
    });
  };

  // De-dupe files by name + size + lastModified for stability
  function mergeFiles(existing: File[], incoming: File[]): File[] {
    const key = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;
    const map = new Map(existing.map((f) => [key(f), f]));
    for (const f of incoming) {
      map.set(key(f), f);
    }
    return Array.from(map.values());
  }

  // Fixed: Accept nullable refs and add null check
  const handleImagePick = (
    ref: React.RefObject<HTMLInputElement | null>,
    field: "workOrderRefImage" | "agreementRefImage"
  ) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  // File validation function
  const isValidFileType = (file: File): boolean => {
    return file.type === "application/pdf";
  };

  const [files, setFiles] = useState<File[]>([]);

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles((prev) => {
      // merge without duplicates (by name + size + lastModified)
      const existingMap = new Map(
        prev.map((f) => [`${f.name}-${f.size}-${f.lastModified}`, f])
      );
      selectedFiles.forEach((f) => {
        existingMap.set(`${f.name}-${f.size}-${f.lastModified}`, f);
      });
      return Array.from(existingMap.values());
    });

    console.log("Parent received:", selectedFiles);
  };

  return (
    <div className="">
      {/* Header */}
      <CardHeader className="px-2 py-2">
        <CardTitle className="text-md font-semibold text-foreground">
          Contractual Terms &amp; Engagement Details
        </CardTitle>
      </CardHeader>

      <CardContent className="px-2 pb-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* 1. General Information Card */}
          <Card className="py-1">
            <Accordion type="single" collapsible defaultValue="general">
              <AccordionItem value="general" className="border-none">
                <AccordionTrigger className="px-2 py-1 text-sm font-semibold">
                  Work order Details
                </AccordionTrigger>
                <AccordionContent className="px-2  pt-1">
                  {/* Grid with 4 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Client Name/ID (takes 1 column on md+) */}
                    <div className="col-span-2">
                      <CusInput
                        label="Client Name/ID"
                        type="text"
                        placeholder="XYZ Corporation"
                        {...register("clientName")}
                      />
                    </div>

                    {/* Project Name (takes 3 columns on md+) */}
                    <div className="col-span-3">
                      <CusInput
                        label="Project Name"
                        type="text"
                        placeholder="Fuel Operations"
                        {...register("projectName")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
                    <div className="col-span-2">
                      <CusInput
                        label="Work order No."
                        type="text"
                        placeholder="W00001"
                        {...register("work_order_no")}
                      />
                    </div>
                    <div className="col-span-2">
                      <CusInput
                        label="Client Billing Cost Code"
                        type="text"
                        placeholder="CBCC0001"
                        {...register("client_billing_cost")}
                      />
                    </div>
                    <div className="cols-span-2">
                      <div className="flex flex-col space-y-2">
                        <label className="text-gray-700 text-sm">
                          Travel Days Paid
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="travel-days"
                              value="yes"
                              checked={selectedOption === "yes"}
                              onChange={handleChange}
                              className="form-radio text-green-500 border-gray-300 hover:border-gray-400  "
                            />
                            <span className="ml-2 text-gray-700">Yes</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="travel-days"
                              value="no"
                              checked={selectedOption === "no"}
                              onChange={handleChange}
                              className="form-radio text-green-500 border-gray-300 hover:border-gray-400 "
                            />
                            <span className="ml-2 text-gray-700">No</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h1 className="my-4 text-md font-semibold ">
                    Candidate Details{" "}
                  </h1>

                  <div className="">
                    <CusInput
                      label="Point of origin"
                      type="text"
                      placeholder="Houston, Texas, USA"
                      {...register("point_of_origin")}
                    />
                  </div>
                  <h1 className="my-4 text-md font-semibold ">Job Details</h1>

                  <div className="flex flex-col space-y-2 w-full ">
                    <label className="text-gray-700 text-sm font-medium">
                      Office Based, Site Based or Mix of Both
                    </label>
                    <div className="relative">
                      <select
                        value={selectedOption}
                        onChange={handleChange}
                        className="w-full appearance-none border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none"
                      >
                        <option>Office Based</option>
                        <option>Site Based</option>
                        <option>Mix of Both</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="my-2">
                    <CusInput
                      label="Department"
                      type="text"
                      placeholder="procurement"
                      {...register("department")}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
                    <div className="mt-1 col-span-2">
                      <Controller
                        name="started_Date"
                        control={control}
                        rules={{ required: "Joining date is required" }}
                        render={({ field }) => (
                          <div>
                            <CusDatePicker
                              label="work order started Date (Est.)"
                              value={field.value}
                              onChange={field.onChange}
                              minDate={new Date()}
                            />
                          </div>
                        )}
                      />
                    </div>
                    <div className="mt-1 col-span-2 ">
                      <Controller
                        name="end_Date"
                        control={control}
                        rules={{ required: "Joining date is required" }}
                        render={({ field }) => (
                          <div>
                            <CusDatePicker
                              label="work order End Date (Est.)"
                              value={field.value}
                              onChange={field.onChange}
                              minDate={new Date()}
                            />
                          </div>
                        )}
                      />
                    </div>
                    <div className="col-span-2 flex flex-col space-y-2 w-full ">
                      <label className="text-gray-700 text-sm w-full">
                        Business Travel required?
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="business-travel"
                            value="yes"
                            checked={selectedBusinessOption === "yes"}
                            onChange={handleBusinessChange}
                            className="form-radio text-green-500 border-gray-300 hover:border-gray-400  "
                          />
                          <span className="ml-2 text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="business-travel"
                            value="no"
                            checked={selectedBusinessOption === "no"}
                            onChange={handleBusinessChange}
                            className="form-radio text-green-500 border-gray-300 hover:border-gray-400 "
                          />
                          <span className="ml-2 text-gray-700">No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </form>
      </CardContent>
    </div>
  );
}
