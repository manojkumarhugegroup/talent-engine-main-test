import { CusTextarea } from "@/components/forms/CusTextarea";
import FileUpload from "@/components/shared/Upload";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { TotalBaseFormSchema } from "@/types/jobs/editRR.type";
import { useEffect, useState } from "react";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { AdditionalInformationPreview } from "./AdditionalFormPreview";
import { FileUploadProgress } from "./FileUploadProgress";

interface AdditionalFormProps {
  control: Control<TotalBaseFormSchema>;
  errors: FieldErrors<TotalBaseFormSchema>;
  register: UseFormRegister<TotalBaseFormSchema>;
  setValue: UseFormSetValue<TotalBaseFormSchema>;
}

export function AdditionalForm({
  register,
  control,
  errors,
  setValue,
}: AdditionalFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgresses, setUploadProgresses] = useState<number[]>([]);

  const handleFileSelect = (selectedFiles: File[], base64Files: string[]) => {
    setFiles(selectedFiles); 
    setUploadProgresses(selectedFiles.map(() => 0));
    // selectedFiles.forEach((_, index) => simulateUploadProgress(index));
    onSubmit(selectedFiles);
    setValue("qualification", '');
    setValue("key_skills", '');
    setValue("project_description", '');

  };

  const simulateUploadProgress = (fileIndex: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgresses((prev) => {
        const newProgresses = [...prev];
        newProgresses[fileIndex] = progress > 100 ? 100 : progress;
        return newProgresses;
      });
      if (progress >= 100) clearInterval(interval);
    }, 300);
  };

  const hidetextarea = files.length > 0;

  const onSubmit = async (selectedFiles: File[]) => {
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("file", file));
      formData.append("is_private", "0");
      formData.append("doctype", "File");
      formData.append("docname", "New");
      const fileNames = selectedFiles.map((file) => file.name).join(",");
      formData.append("file_name", fileNames);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/rr/file_upload", true);

    // Set up the progress event
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgresses((prev) => {
          const newProgresses = [...prev];
          newProgresses[0] = progress; // Update the progress for the first file (or adapt for multiple files)
          return newProgresses;
        });
      }
    };

    // Set up the onload event
    xhr.onload = async () => {
      if (xhr.status === 200) {
        const result = await xhr.response.json();
        console.log("✅ Result after the API :", result?.message);
        setValue("uploaded_jd", result?.message?.file_url);
      } else {
        throw new Error(`Failed: ${xhr.status} ${xhr.statusText}`);
      }
    };

    // Set up the onerror event
    xhr.onerror = () => {
      console.error("❌ File upload failed.");
    };

    // Send the request
    xhr.send(formData);
      // const res = await fetch("/api/rr/file_upload", {
      //   method: "POST",
      //   body: formData,
      // });
      // if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);
      // const result = await res.json();
      // console.log("✅ Result after the API :", result?.message);
      // setValue("uploaded_jd", result?.message?.file_url);
    } catch (err) {
      console.error("❌ API error:", err);
    } finally {
      console.error("❌ API error:");
    }
  };
console.log(files,'files')
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="cursor-pointer justify-start">
          Additional Information
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <>
            {files.length > 0 ? (
              <div className=" gap-4 w-full">
                {files.map((file, index) => {
                  const progress = uploadProgresses[index] ?? 0;
                  console.log(file,'uyiuy')
                  if (progress < 100) {
                    return (
                      <div
                        key={index}
                        className="border-2 border-dashed rounded-md transition-colors bg-transparent hover:bg-transparent w-full flex flex-col items-center justify-center py-4"
                      >
                        <FileUploadProgress progress={progress} />
                        <p
                          className="mt-2 text-xs truncate max-w-[100px]"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                      </div>
                    );
                  } else {
                    // Show preview once upload is done
                    const handleRemove = () => {
                      setFiles((prev) => prev.filter((_, i) => i !== index));
                      setUploadProgresses((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                      setValue("uploaded_jd", "");
                    };

                    return (
                      <AdditionalInformationPreview
                        key={index}
                        file={file}
                        onDelete={handleRemove}
                      />
                    );
                  }
                })}
              </div>
            ) : (
              // Show upload button if no files
              <FileUpload
                onFileSelect={handleFileSelect}
                accept={{
                  "application/pdf": [],
                  "application/doc": [],
                  "application/docx": [],
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    [],
                }}
                maxSize={3 * 1024 * 1024} // 3MB
                multiple={false}
              />
            )}

            {!hidetextarea && (
              <>
                <div className="flex items-center">
                  <div
                    aria-hidden="true"
                    className="w-full border-t border-[#B9B9B9] dark:border-white/15"
                  />
                  <div className="relative flex justify-center">
                    <span className="bg-card px-2 text-sm text-[#B9B9B9] dark:bg-gray-900 dark:text-gray-400">
                      (or)
                    </span>
                  </div>
                  <div
                    aria-hidden="true"
                    className="w-full border-t border-[#B9B9B9] dark:border-white/15"
                  />
                </div>
                {/* <div>
                  <div className="col-span-1 md:col-span-6">
                    <Label className="mb-1 text-xs">Scope of work</Label>
                    <CusTextarea
                      className="min-h-20"
                      {...register("scope_of_work")}
                      error={errors.scope_of_work?.message}
                    />
                  </div>
                </div> */}
                <div>
                  <Label className="mb-1 text-xs">Qualification</Label>
                  <CusTextarea
                    className="min-h-20"
                    {...register("qualification")}
                    error={errors.qualification?.message}
                  />
                  <p className="text-[#ABAEB1]">
                    {`Ex: "Bachelor of Science in Supply Chain Management from University of Houston (2017). Specialized in logistics, procurement, and ERP systems. Completed projects focused on fuel distribution and warehouse optimization, building a strong foundation for managing supply chain operations and logistics challenges in dynamic environments."`}
                  </p>
                </div>
                <div>
                  <Label className="mb-1 text-xs">Skills</Label>
                  <CusTextarea
                    className="min-h-20"
                    {...register("key_skills")}
                    error={errors.key_skills?.message}
                  />
                  <p className="text-[#ABAEB1]">
                    Ex: “Skilled in logistics coordination, inventory
                    management, and fleet operations with expertise in SAP
                    Logistics and route optimization tools. Proficient in
                    Microsoft Excel and knowledgeable about environmental
                    compliance in logistics, ensuring efficient and
                    regulation-compliant operations.”
                  </p>
                </div>
                <div>
                  <Label className="mb-1 text-xs">Project Details</Label>
                  <CusTextarea
                    className="min-h-20"
                    {...register("project_description")}
                    error={errors.project_description?.message}
                  />
                  <p className="text-[#ABAEB1]">
                    Ex: “Led Shell’s 18-month National Fuel Distribution
                    Optimization project, improving delivery efficiency by 25%.
                    Managed route planning and inventory using SAP and
                    optimization tools. Collaborated with transport, warehouse,
                    and compliance teams to streamline operations and reduce
                    transportation costs significantly.”
                  </p>
                </div>
              </>
            )}
          </>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
