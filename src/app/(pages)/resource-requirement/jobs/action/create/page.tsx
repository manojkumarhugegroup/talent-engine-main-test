"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LucideFileChartColumn, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { BaseDetails } from "@/components/(resource-requirement)/jobs/action/create/BaseDetails";

export default function New() {
  const router = useRouter();

  return (
    <>
      <div className="grid grid-cols-12 gap-2 h-full relative">
        <div className="col-span-3 bg-card p-2 rounded-md ">
          <div className=" sticky top-6 flex flex-col justify-start items-start space-y-4">
            <Button
              type="button"
              variant="ghost"
              className="hover:bg-transparent px-0"
              size="sm"
              onClick={() => router.back()}
            >
              <ChevronLeft />
              <p className="text-lg font-semibold">Resource Requirements</p>
            </Button>

            <RadioGroup.Root
              defaultValue={"0"}
              className="max-w-sm lg:max-w-none w-full grid grid-cols-1 max-h-96 gap-3"
            >
              <RadioGroup.Item
                value={"0"}
                className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:bg-primary data-[state=checked]:text-white cursor-pointer space-y-1"
              >
                <div className="p-4 text-left">
                  <p className="relative font-bold text-xl w-fit pb-2">
                    Generate with Lora
                    <img
                      src={"/assets/icons/job-info/loraAi.svg"}
                      className="w-3 h-3 absolute -top-1 -right-3"
                      alt=""
                    />
                  </p>
                  <p className="text-sm font-semibold">
                    Tell Us, We'll Create!!
                  </p>
                  <p className="text-sm mt-1 opacity-90">
                    Fast, smart form creation in seconds.
                  </p>
                </div>
              </RadioGroup.Item>
              <RadioGroup.Item
                value={"1"}
                onClick={() => {
                  router.push("/resource-requirement/jobs/action/edit");
                }}
                className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:bg-primary data-[state=checked]:text-white cursor-pointer space-y-1"
              >
                <div className="p-4 text-left">
                  <p className="font-bold text-xl flex items-center gap-2 pb-2">
                    <span>
                      <img
                        src={"/assets/icons/job-info/fillOutForm.svg"}
                        className="w-5 h-5"
                        alt=""
                      />
                      {/* <LucideFileChartColumn className="w-5 h-5 " /> */}
                    </span>
                    Fill Out the Form Yourself
                  </p>
                  <p className="text-sm font-semibold">
                    Enter details manually!!
                  </p>
                  <p className="text-sm mt-1 opacity-90">
                    Perfect for full control over every field.
                  </p>
                </div>
              </RadioGroup.Item>
            </RadioGroup.Root>
          </div>
        </div>
        <BaseDetails />
      </div>
    </>
  );
}
