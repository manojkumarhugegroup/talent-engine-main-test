// BaseForm.tsx
import React, { useEffect, useState } from "react";
import {
  Controller,
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  useFormContext,
  UseFormWatch,
} from "react-hook-form";
import { BaseFormData } from "@/types/jobs/editRR.type";
import { CusInput } from "@/components/forms/CusInput";
import { CusDatePicker } from "@/components/forms/CusDatePicker";
import { NumInput } from "@/components/forms/NumInput";
import { CusSelect } from "@/components/forms/CusSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import CurrencyFlag from "react-currency-flags";
import { addDays, differenceInWeeks, format } from "date-fns";
import { useDataContext } from "@/context/DataProvider";
import { Separator } from "@/components/ui/separator";
import { getRemainingTime } from "../utils";
import { LocationCombobox } from "@/components/forms/Customlocation";
import { useWatch } from "react-hook-form";
import { currencies } from "@/data/currency";
import { useSearchParams } from "next/navigation";

interface BaseFormProps {
  register: UseFormRegister<BaseFormData>;
  control: Control<BaseFormData>;
  errors: FieldErrors<BaseFormData>;
  setValue: UseFormSetValue<BaseFormData>;
  watch?: UseFormWatch<BaseFormData>;
}

const BaseForm: React.FC<BaseFormProps> = ({
  register,
  control,
  errors,
  setValue,
}) => {
  const { setError, clearErrors } = useFormContext();
  const {
    projectTypes,
    fetchProjectTypes,
    location,
    locationHasMore,
    locationLoading,
    fetchLocation,
    requestedPages,
  } = useDataContext();

  const { watch } = useFormContext();

  const search = useSearchParams();
  const jobId = search.get("d");

  const location_search = watch("location");
  const locationValue = location_search && jobId !== null ? location_search.split("--")[0] : "";

  const [searchInput, setsearchInput] = useState(locationValue || "");
  const [locationPage, setlocationPage] = useState(1);

  useEffect(() => {
    fetchProjectTypes();
    requestedPages.current.clear();
    fetchLocation(1, locationValue || "");
  }, [location_search]);

  const handleSearchInput = (input: string) => {
    setsearchInput(input);
    setlocationPage(1);
    fetchLocation(1, input);
  };

  const handleLoadLocationMore = () => {
    if (locationHasMore && !locationLoading) {
      const nextPage = locationPage + 1;
      setlocationPage(nextPage);
      fetchLocation(nextPage, searchInput);
    }
  };

  const rotation = watch("is_rotation");
  const postStart = useWatch({ control, name: "position_start_date" });
  const postEnd = watch("position_est_end_date");

  const { formatted } = getRemainingTime(
    format(new Date(postStart), "yyyy-MM-dd"),
    format(new Date(postEnd), "yyyy-MM-dd"),
    2
  );

  useEffect(() => {
    if (postStart && postEnd && new Date(postStart) >= new Date(postEnd)) {
      const nextDay = new Date(postStart);
      nextDay.setDate(nextDay.getDate() + 1);
      setValue("position_est_end_date", nextDay);
    }
  }, [postStart]);

  // const formatted = 0;
  const currencyCode = watch("billing_currency");
  const salaryFrom = watch("min_bill_rate");
  const salaryTo = watch("max_bill_rate");
  const isRange = watch("salaryRangeEnabled");

  const selectedSymbol =
    currencies.find((c) => c.code === currencyCode)?.symbol ?? "";

  const weeks = differenceInWeeks(new Date(postEnd), new Date(postStart));

  const [rotationOnValue, setRotationOnValue] = useState<number | string>("");

  useEffect(() => {
    if (salaryTo && salaryFrom && salaryTo < salaryFrom) {
      setError("max_bill_rate", {
        type: "manual",
        message: "To Salary must be greater than the From Salary",
      });
    } else {
      clearErrors("max_bill_rate");
    }
  }, [salaryFrom, salaryTo, setError, clearErrors]);

  useEffect(() => {
    if (!rotation) {
      setValue("rotation_on_weeks", 0);
      setValue("rotation_off_weeks", 0);
      setRotationOnValue("");
    }
  }, [rotation, setValue]);

  useEffect(() => {
    if (rotationOnValue == "") {
      setValue("rotation_off_weeks", 0);
    }
  }, [rotationOnValue, setValue]);

  function getCountry(input: string) {
    const parts = input.split("--");
    return parts.length > 1 ? parts[1].trim() : "";
  }

  return (
    <>
      {/* Job Title */}
      <div className="col-span-1 md:col-span-6">
        <CusInput
          label="Job Title"
          type="text"
          placeholder="Ex. Fuel Operations Manager"
          error={errors.job_title?.message}
          required
          {...register("job_title")}
        />
      </div>

      {/* Position Start Date */}
      <div className="col-span-1 md:col-span-3">
        <Controller
          name="position_start_date"
          control={control}
          render={({ field }) => (
            <CusDatePicker
              label="Position Start Date"
              value={field.value}
              onChange={(date) => {
                field.onChange(date);
              }}
              required
              error={errors.position_start_date?.message}
              minDate={new Date()}
            />
          )}
        />
      </div>

      {/* Position End Date */}
      <div className="col-span-1 md:col-span-3">
        <Controller
          name="position_est_end_date"
          control={control}
          render={({ field }) => {
            const startDate = watch("position_start_date");
            return (
              <>
                <CusDatePicker
                  label="Position Est. End date"
                  value={field.value}
                  onChange={(date) => {
                    field.onChange(date);
                    if (
                      startDate &&
                      date &&
                      new Date(date) <= new Date(startDate)
                    ) {
                      setError("position_est_end_date", {
                        type: "manual",
                        message: "End date must be after start date",
                      });
                    } else {
                      clearErrors("position_est_end_date");
                    }
                  }}
                  required
                  minDate={
                    startDate ? addDays(new Date(startDate), 1) : new Date()
                  }
                  error={errors.position_est_end_date?.message}
                />
              </>
            );
          }}
        />
      </div>

      {/* Number of Resources */}
      <div className="col-span-1 lg:col-span-3">
        <Controller
          name="no_of_resources"
          control={control}
          render={({ field }) => (
            <NumInput
              label="No. of Resources"
              value={field.value}
              onChange={(val) => field.onChange(Number(val) || 0)}
              error={errors.no_of_resources?.message}
              noNegative
            />
          )}
        />
      </div>

      {/* Salary Range */}
      <div className={`${isRange ? "col-span-7" : "col-span-6"}`}>
        <div className="flex items-center gap-2 mb-1">
          <Label className="font-medium text-xs">Salary</Label>
          <Controller
            name="salaryRangeEnabled"
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs pl-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <span>Range</span>
              </label>
            )}
          />
        </div>

        <div className="flex items-start gap-2">
          <div className="col-span-1">
            <Controller
              name="billing_currency"
              control={control}
              rules={{ required: "Salary type is required" }}
              render={({ field }) => {
                const sortedCurrencies = [
                  ...currencies.filter((item) => item.code === field.value),
                  ...currencies.filter((item) => item.code !== field.value),
                ];

                return (
                  <CusSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.billing_currency?.message}
                    className="text-xs mb-0"
                  >
                    {sortedCurrencies?.map((item, i) => (
                      <SelectItem key={i} value={item.code}>
                        <CurrencyFlag currency={item.code} width={20} />{" "}
                        {item.code}
                      </SelectItem>
                    ))}
                  </CusSelect>
                );
              }}
            />
          </div>
          <Controller
            name="min_bill_rate"
            control={control}
            render={({ field }) => (
              <NumInput
                placeholder="From"
                startIcon={selectedSymbol}
                value={field.value}
                onChange={(val) => field.onChange(Number(val) || 0)}
                error={errors.min_bill_rate?.message}
                noNegative
              />
            )}
          />

          {isRange && (
            <>
              <p className="text-muted-foreground h-9 flex items-center">-</p>
              <Controller
                name="max_bill_rate"
                control={control}
                render={({ field }) => (
                  <NumInput
                    placeholder="To"
                    startIcon={selectedSymbol}
                    value={field.value}
                    onChange={(val) => field.onChange(Number(val) || 0)}
                    error={errors.max_bill_rate?.message}
                    noNegative
                  />
                )}
              />
            </>
          )}
        </div>
      </div>

      {/* Salary Type */}
      <div
        className={`${
          isRange ? "col-span-4 lg:col-span-2" : "col-span-3"
        } flex items-start`}
      >
        <Controller
          name="billing_frequency"
          control={control}
          rules={{ required: "Salary type is required" }}
          render={({ field }) => (
            <CusSelect
              label={<div className="h-4"></div>}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.billing_frequency?.message}
              className="mb-0"
            >
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
            </CusSelect>
          )}
        />
      </div>

      {/* Project Type */}
      <div className="col-span-3 md:col-span-6">
        <Controller
          name="project_type"
          control={control}
          render={({ field }) => (
            <CusSelect
              label="Project Type"
              value={field.value}
              onValueChange={field.onChange}
              error={errors.project_type?.message}
              required
            >
              {projectTypes.map((item: any, i: number) => (
                <SelectItem key={`${item.name}-${i}`} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </CusSelect>
          )}
        />
      </div>

      {/* Location */}
      <div className="col-span-3 md:col-span-6">
        <Controller
          name="location"
          control={control}
          rules={{ required: "Location is required" }}
          render={({ field, fieldState }) => (
            <LocationCombobox
              locations={
                location?.map((loc) => ({
                  label: loc.name,
                  value: loc.name,
                  code: loc.name,
                })) || []
              }
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              onSelectLocation={({ id }) => {
                field.onChange(id);
                setValue("location", id);
                setValue("country", getCountry(id));
              }}
              onLoadMore={handleLoadLocationMore}
              hasMore={locationHasMore}
              isLoading={locationLoading}
              handleSearchInput={handleSearchInput}
              searchInput={searchInput}
            />
          )}
        />
      </div>

      {/* Working Hours */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <Controller
            name="work_days_per_week"
            control={control}
            render={({ field }) => (
              <CusSelect
                label="Working Days / Week"
                value={field.value?.toString() ?? ""}
                onValueChange={(val) => field.onChange(Number(val))}
                error={errors.work_days_per_week?.message}
              >
                {[...Array(7).keys()].map((i) => (
                  <SelectItem key={`${i + 1}-${i}`} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </CusSelect>
            )}
          />
        </div>
        <div>
          <Controller
            name="work_hours_per_day"
            control={control}
            render={({ field }) => (
              <CusSelect
                label="Working Hours / Day"
                value={field.value?.toString() ?? ""}
                onValueChange={(val) => field.onChange(Number(val))}
              >
                {[...Array(12).keys()].map((i) => (
                  <SelectItem key={`${i + 1}-${i}`} value={(i + 1).toString()}>
                    {i + 1} hrs
                  </SelectItem>
                ))}
              </CusSelect>
            )}
          />
        </div>
        <div className="col-span-full md:col-span-2 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-1">
            <Controller
              name="is_rotation"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
                  <Checkbox
                    id="rotation"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span>Rotation</span>
                </label>
              )}
            />
            {weeks > 0 && (
              <p className="text-xs text-muted-foreground">({weeks} Weeks)</p>
            )}
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
            <Controller
              name="rotation_on_weeks"
              control={control}
              render={({ field }) => (
                <NumInput
                  disabled={!rotation}
                  value={field.value ?? 0}
                  onChange={(val) => {
                    field.onChange(val);
                    setRotationOnValue(val);
                  }}
                  error={errors.rotation_on_weeks?.message}
                  noNegative
                  min={0}
                />
              )}
            />
            <div className="text-xs whitespace-nowrap h-full flex items-center gap-1">
              on <Separator orientation="vertical" className="w-2 rotate-12" />
            </div>
            <Controller
              name="rotation_off_weeks"
              control={control}
              render={({ field }) => (
                <NumInput
                  disabled={!rotation}
                  value={field.value ?? 0}
                  onChange={(val) => {
                    field.onChange(val);
                    setRotationOnValue(val);
                  }}
                  error={errors.rotation_off_weeks?.message}
                  noNegative
                  min={0}
                />
              )}
            />
            <p className="text-xs whitespace-nowrap">Off (Weeks)</p>
          </div>
        </div>
        <div className="flex flex-col justify-center space-y-1">
          <label className="text-xs font-medium text-label dark:text-gray-200">
            Expected Duration
          </label>
          <div className="flex items-center gap-1 px-3 py-1 bg-accent text-xs rounded-md h-9">
            <span className="font-semibold">{formatted}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default BaseForm;
