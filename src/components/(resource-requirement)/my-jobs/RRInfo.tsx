import { CusTypography } from "@/components/forms/CusTypography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { JobDataType } from "@/types/jobs/editRR.type";
import { Fullscreen, Minimize, Pencil, RotateCcw } from "lucide-react";
import { getRemainingTime } from "../jobs/utils";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

interface Certification {
  certification?: string;
}

interface RrInfoProps {
  setFullscreenSection?: (section: string | null) => void;
  isFull?: boolean;
  data?: JobDataType | null;
  loading?: boolean;
}

export default function RRInfo({
  isFull,
  setFullscreenSection,
  data,
  loading,
}: RrInfoProps) {
  const router = useRouter();

  if (loading)
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-3 p-4 min-w-0">
        <div className="space-y-4 text-sm h-full overflow-auto scroll-container">
          {/* Position and Resource Details */}
          <div className="grid grid-cols-1 gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-1">
                <Skeleton className="h-3 w-32" /> {/* label */}
                <Skeleton className="h-4 w-48" /> {/* value */}
              </div>
            ))}
          </div>

          {/* Project Name and Details */}
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-1">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-4 w-60" />
              </div>
            ))}
          </div>

          {/* Responsibilities */}
          <div>
            <Skeleton className="h-4 w-36 mb-2" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-3 w-full max-w-md" />
              ))}
            </div>
          </div>

          {/* Qualification */}
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-3 w-full max-w-md" />
              ))}
            </div>
          </div>

          {/* Certification */}
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-3 w-full max-w-md" />
              ))}
            </div>
          </div>

          {/* Visa Requirement */}
          <div className="flex flex-col space-y-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Key Skills */}
          <div>
            <Skeleton className="h-4 w-28 mb-2" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-3 w-full max-w-md" />
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  const positionStart = data?.position_start_date
    ? data?.position_start_date
    : "";
  const positionEnd = data?.position_est_end_date
    ? data?.position_est_end_date
    : "";
  const { formatted } =
    data?.position_start_date && data?.position_est_end_date
      ? getRemainingTime(data.position_start_date, data.position_est_end_date)
      : { formatted: "" };

  const certifications: Certification[] =
    (data?.certifications as Certification[]) || [];

  return (
    <>
      <Card className="col-span-1 md:col-span-2 lg:col-span-3 p-4 min-w-0 h-full max-h-[calc(100vh-8rem)] overflow-auto ">
        <div className="space-y-2 ">
          <div className="flex items-center gap-2 justify-between ">
            <h1 className="text-xl font-bold w-4/5 capitalize">
              Job Title : {data?.job_title}
            </h1>
            <Button variant="ghost" className="text-primary ">
              <RotateCcw className="w-4 h-4" />
              Restart
            </Button>
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-background hover:bg-[#E6EAFF] text-primary hover:text-primary rounded-sm"
            >
              <Pencil className="w-3 h-3" />
              Edit Mode
            </Button>
            <div className="absolute top-2 right-3">
              {isFull ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFullscreenSection?.(null)}
                >
                  <Minimize className="h-4 w-4 " />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFullscreenSection?.("list")}
                >
                  <Fullscreen className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4 text-sm h-full overflow-auto ">
            {/* Position and Resource Details */}
            <div className="grid grid-cols-1 gap-2 ">
              <CusTypography
                label="Position Start Date"
                value={positionStart}
                className="sm:flex-wrap"
              />
              <CusTypography
                label="Position Est. End Date"
                value={positionEnd}
                className="sm:flex-wrap"
              />
              <CusTypography
                label="No. of Resources"
                value={data?.no_of_resources ?? "N/A"}
              />
              <CusTypography
                label="Salary"
                value={
                  data?.min_bill_rate === data?.billing_currency
                    ? `${formatCurrency(
                        data?.min_bill_rate,
                        data?.billing_currency
                      )}`
                    : `${formatCurrency(
                        data?.min_bill_rate,
                        data?.billing_currency
                      )} - ${formatCurrency(
                        data?.max_bill_rate,
                        data?.billing_currency
                      )}`
                }
              />
              <CusTypography label="Location" value={data?.location ?? "N/A"} />
              <CusTypography
                label="Working Days / Week"
                value={data?.work_days_per_week ?? "N/A"}
              />
              <CusTypography
                label="Working Hours / Day"
                value={data?.work_hours_per_day ?? "N/A"}
              />
              <CusTypography
                label="Rotation Cycle"
                value={`${data?.rotation_on_weeks ?? 0} On / ${
                  data?.rotation_off_weeks ?? 0
                } Off (weeks)`}
              />
              <CusTypography
                label="Project Name"
                value={`${data?.project ?? "N/A"}`}
              />
              <CusTypography
                label="Project Type"
                value={data?.project_type ?? "N/A"}
              />
              <CusTypography label="Expected Duration" value={formatted} />
              <CusTypography
                label="Responsibilities"
                value={data?.responsibilities ?? "N/A"}
                variant="block"
              />

              <div className="">
                <p className={"font-semibold text-label"}>Qualification </p>
                <ul className="ps-4 mt-2 space-y-1 list-disc list-inside marker:text-(--label)">
                  {Array.isArray(data?.qualification) &&
                  data.qualification.length > 0
                    ? data?.qualification?.map(
                        (item: string, index: number) => (
                          <li
                            key={index}
                            className="capitalize text-muted-foreground"
                          >
                            {item}
                          </li>
                        )
                      )
                    : "N/A"}
                </ul>
              </div>
              <div className="">
                <p className={"font-semibold text-label"}>Certification </p>
                <ul className="ps-4 mt-2 space-y-1 list-disc list-inside marker:text-(--label)">
                  {certifications.length > 0 ? (
                    certifications.map((item, index) => (
                      <li
                        key={index}
                        className="capitalize text-muted-foreground"
                      >
                        {item.certification || "N/A"}
                      </li>
                    ))
                  ) : (
                    <span>N/A</span>
                  )}
                </ul>
              </div>
              <div className="">
                <CusTypography
                  label="Visa Requirement"
                  value={`${data?.visa_requirements ?? "N/A"}`}
                />
                {/* <p className={"font-semibold text-label"}>Visa Requirement </p>
                <ul className="ps-4 mt-2 space-y-1 list-disc list-inside marker:text-(--label)">
                  {Array.isArray(data?.visa_requirements) &&
                  data.visa_requirements.length > 0
                    ? data?.visa_requirements?.map(
                        (item: string, index: number) => (
                          <li
                            key={index}
                            className="capitalize text-muted-foreground"
                          >
                            {item}
                          </li>
                        )
                      )
                    : "N/A"}
                </ul> */}
              </div>
              <div className="">
                <p className={"font-semibold text-label"}>Key Skills </p>
                <ul className="ps-4 mt-2 space-y-1 list-disc list-inside marker:text-(--label)">
                  {data?.key_skills?.map((item: string, index: number) => (
                    <li
                      key={index}
                      className="capitalize text-muted-foreground"
                    >
                      {item || "N/A"}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-label">Skills & Experience</p>
                <ul className="ps-4 mt-2 space-y-1 list-disc list-inside marker:text-label">
                  {Array.isArray(data?.skills_and_experience) &&
                  data.skills_and_experience.length > 0
                    ? data.skills_and_experience.map((item, index) => (
                        <li
                          key={index}
                          className="capitalize text-muted-foreground"
                        >
                          {item.fname} ({item.min_experience} -{" "}
                          {item.max_experience} years)
                        </li>
                      ))
                    : "N/A"}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-label">Tools</p>
                <ul className="ps-4 mt-2 space-y-1 list-disc list-inside marker:text-label">
                  {Array.isArray(data?.tools_familarity) &&
                  data.tools_familarity.length > 0
                    ? data.tools_familarity.map((item, index) => (
                        <li
                          key={index}
                          className="capitalize text-muted-foreground"
                        >
                          {item.fname} ({item.min_experience} -{" "}
                          {item.max_experience} years)
                        </li>
                      ))
                    : "N/A"}
                </ul>
              </div>
              <div className="bg-card dark:bg-muted rounded-lg shadow-md">
                <h3 className="font-semibold text-label mb-4">Languages</h3>
                <div className="grid gap-4">
                  {/* {data?.language_requirement?.map( */}
                  {data?.language_requirement?.map(
                    (
                      item: {
                        fname: string;
                        read: string;
                        speak: string;
                        write: string;
                      },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="border border-border rounded-md p-4 bg-accent hover:shadow-sm transition"
                      >
                        <h4 className="text-sm font-semibold text-label capitalize mb-2">
                          {item.fname}
                        </h4>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className="px-2 py-1 rounded bg-accent text-accent-foreground font-medium">
                            Read: {item.read}
                          </span>
                          <span className="px-2 py-1 rounded bg-accent text-accent-foreground font-medium">
                            Speak: {item.speak}
                          </span>
                          <span className="px-2 py-1 rounded bg-accent text-accent-foreground font-medium">
                            Write: {item.write}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
