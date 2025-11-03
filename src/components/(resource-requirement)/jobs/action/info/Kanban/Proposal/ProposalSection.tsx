

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectItem,} from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/forms/CustomTable";
import { RadioGroup, RadioGroupItem } from "@/components/forms/CustomeRadio";
import { CircleCheckBig } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useDataContext } from "@/context/DataProvider";
import { Controller, useForm } from "react-hook-form";
import { CusDatePicker } from "@/components/forms/CusDatePicker";
import CurrencyFlag from "react-currency-flags";
import { NumInput } from "@/components/forms/NumInput"; 
import { CusSelect } from "@/components/forms/CusSelect";
import { ProposalFormData, CostItem, Stakeholder, BurdenSelection } from "@/types/jobs/Info/kanban/interview";
import { postProposalCompensation } from "@/app/api/rr/info/kanban/proposals/postProposalCompensation";

export function ProposalBurdensTable({
  title,
  items,
  selection,
  onChange,
}: {
  title: string;
  items: CostItem[];
  selection: BurdenSelection;
  onChange: (id: string, value: Stakeholder) => void;
}) {
  return (
    <div className="rounded-sm border border-(--table-border) inline-block max-w-full">
      <Table >
        <TableHeader className="">
          <TableRow className="bg-[#F0F0F0] rounded-sm">
            <TableHead className=" text-left font-semibold text-xs text-label border-r border-(--table-border) w-[280px]">
              Description
            </TableHead>
            <TableHead className=" text-center font-semibold text-xs text-label border-r border-(--table-border) w-[30px]">
              By Client
            </TableHead>
            <TableHead className=" text-center font-semibold text-xs text-label border-r border-(--table-border) w-[50px]">
              By Candidate
            </TableHead>
            <TableHead className=" text-center font-semibold text-xs text-label border-r border-(--table-border) w-[30px]">
              By TE
            </TableHead>
            <TableHead className=" text-center font-semibold text-xs text-label w-[30px]">
              N/A
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((row) => (
            <TableRow key={row.id} className="">
              <TableCell className="px-3 border-r border-(--table-border)">
                <span className="text-label text-xs whitespace-normal break-words">
                  {row.description}
                </span>
              </TableCell>

              {["client", "candidate", "talent", "na"].map((stake) => (
                <TableCell
                  key={stake}
                  className="px-3 text-center border-r border-(--table-border) last:border-none "
                >
                  <RadioGroup
                    value={selection[row.id]}
                    onValueChange={(value) =>
                      onChange(row.id, value as Stakeholder)
                    }
                    className=""
                  >
                    <div className="flex justify-center">
                      <RadioGroupItem value={stake} className="cursor-pointer" />
                    </div>
                  </RadioGroup>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

  );
}


export default function ProposalSection() {
  const { currency, fetchLocation, fetchCurrency, location } = useDataContext();

  const {
    control,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<ProposalFormData>({
    defaultValues: {
      countryId: "",
      currencyCode: "",
      currencySymbol: "$",
      amount: 0,
      salaryType: "monthly",
      joiningDate: new Date(),
      mandatoryItems: [],
      mandatorySelection: {},
      variableItems: [],
      variableSelection: {},
      notes: "",
    }
  });

  const defaultMandatory: CostItem[] = [
    { id: "pis", description: "Personal Income & Social Taxation (as applicable)", amount: 50 },
    { id: "pension", description: "Pension (as applicable)", amount: 800 },
    { id: "transport", description: "Provision of Visa and Work Permit  (as applicable)", amount: 25 },
    { id: "accommodation", description: "Gate Passes", amount: 120 },
    { id: "training", description: "Employers Liability  and All Risks Insurance", amount: 200 },
    { id: "laptop", description: "Medical Insurance", amount: 150 },
    { id: "spec", description: "Third Party Specialist (Representative) requirements", amount: 75 },
    { id: "mater", description: "Purchase of Any Project Materials and Consumable Materials", amount: 75 },
    { id: "off", description: "Temporary Site Offices", amount: 75 },
    { id: "supply", description: "Power and Water supply to temporary site offices", amount: 75 },
  ];

  const defaultVariable: CostItem[] = [
    { id: "ppe", description: "Personal Protective Clothing", amount: 50 },
    { id: "travel", description: "Air Travel Costs (including mob/demob flights)", amount: 40 },
    { id: "transport", description: "Local Business Transportation (Daily)", amount: 25 },
    { id: "accommodation", description: "Accommodation and Food", amount: 120 },
    { id: "training", description: "Any Third Party Training (if required)", amount: 200 },
    { id: "laptop", description: "Laptop / Computer including Software and maintenance", amount: 150 },
    { id: "tools", description: "Basic Hand Tools (Technicians Only)", amount: 75 },
  ];

  const [mandatoryItems] = useState<CostItem[]>(defaultMandatory);
  const [variableItems] = useState<CostItem[]>(defaultVariable);
  const [mandatorySelection, setMandatorySelection] = useState<BurdenSelection>(
    Object.fromEntries(defaultMandatory.map((i) => [i.id, "na"] as const))
  );
  const [variableSelection, setVariableSelection] = useState<BurdenSelection>(
    Object.fromEntries(defaultVariable.map((i) => [i.id, "na"] as const))
  );

  const watchedValues = watch();
  const currencyCode = watch("currencyCode");
  const amount = watch("amount");

  useEffect(() => {
    fetchLocation();
    fetchCurrency();
  }, []);

  // Update currency symbol when currency code changes
  useEffect(() => {
    const selectedCurrency = currency.find((c) => c.code === currencyCode);
    if (selectedCurrency) {
      setValue("currencySymbol", selectedCurrency.symbol);
    }
  }, [currencyCode, currency, setValue]);

  // Set default values for items and selections
  useEffect(() => {
    setValue("mandatoryItems", mandatoryItems);
    setValue("variableItems", variableItems);
    setValue("mandatorySelection", mandatorySelection);
    setValue("variableSelection", variableSelection);
  }, [mandatoryItems, variableItems, mandatorySelection, variableSelection, setValue]);

  const selectedSymbol = currency.find((c) => c.code === currencyCode)?.symbol ?? "$";

  // totals
  const mandatoryClient = useMemo(() => {
    return mandatoryItems.reduce((sum, i) => {
      return sum + (mandatorySelection[i.id] === "client" ? i.amount : 0);
    }, 0);
  }, [mandatoryItems, mandatorySelection]);

  const variableClient = useMemo(() => {
    return variableItems.reduce((sum, i) => {
      return sum + (variableSelection[i.id] === "client" ? i.amount : 0);
    }, 0);
  }, [variableItems, variableSelection]);

  const base = Number(amount) || 0;
  const dailyBase = Math.round(base / 30);
  const dailyMandatory = Math.round(mandatoryClient / 30);
  const dailyVariable = Math.round(variableClient / 30);
  const totalDaily = dailyBase + dailyMandatory + dailyVariable;

  const overtimeWeekdays = Math.round(dailyBase * 1.5);
  const overtimeWeekends = Math.round(dailyBase * 2);
  const overtimeHolidays = Math.round(dailyBase * 2.5);
  const standbyRate = Math.round(dailyBase * 0.5);

  function handleMandatorySelection(id: string, value: Stakeholder) {
    const newSelection = { ...mandatorySelection, [id]: value };
    setMandatorySelection(newSelection);
    setValue("mandatorySelection", newSelection);
  }

  function handleVariableSelection(id: string, value: Stakeholder) {
    const newSelection = { ...variableSelection, [id]: value };
    setVariableSelection(newSelection);
    setValue("variableSelection", newSelection);
  }

  function onCancel() {
    reset();
    setMandatorySelection(Object.fromEntries(defaultMandatory.map((i) => [i.id, "na"] as const)));
    setVariableSelection(Object.fromEntries(defaultVariable.map((i) => [i.id, "na"] as const)));
  }
  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload: ProposalFormData = {
        ...data,
        mandatoryItems,
        variableItems,
        mandatorySelection,
        variableSelection,
        dailyRates: {
          base: dailyBase,
          mandatoryBurdens: dailyMandatory,
          variableBenefits: dailyVariable,
          total: totalDaily,
        },
        overtimeRates: {
          weekdays: overtimeWeekdays,
          weekends: overtimeWeekends,
          holidays: overtimeHolidays,
          standby: standbyRate,
        },
      };

      console.log("Proposal payload:", JSON.stringify(payload, null, 2));

      const response = await postProposalCompensation(payload);
      console.log("Proposal posted successfully:", response);

      // Optional: Show success UI feedback, e.g. toast or modal
      // toast.success('Proposal submitted successfully!');
    } catch (err) {
      console.error("Error posting proposal:", err);

      // Optional: Show error UI feedback
      // toast.error('Failed to submit proposal. Please try again.');
    }
  });




  return (
    <div className="bg-card  flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-1">
        <h3 className="text-lg font-semibold text-label">Proposal</h3>
      </div>

      <form onSubmit={onSubmit} className="p-4 space-y-4 flex-1 overflow-y-auto ">
        {/* Country Selection */}

        {/* Salary + Joining Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <Label className="font-medium text-xs">Salary</Label>
            </div>

            <div className="flex items-baseline gap-2">
              {/* Currency */}
              <div className="w-24">
                <Controller
                  name="currencyCode"
                  control={control}
                  rules={{ required: "Currency is required" }}
                  render={({ field }) => (
                    <div>
                      <CusSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        className="text-xs"
                      >
                        {currency.map((item) => (
                          <SelectItem key={item.code} value={item.code}>
                            <CurrencyFlag currency={item.code} width={20} /> {item.code}
                          </SelectItem>
                        ))}
                      </CusSelect>
                      {errors.currencyCode && (
                        <p className="text-red-500 text-xs mt-1">{errors.currencyCode.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Salary Input */}
              <div className="flex-1">
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: "Amount is required",
                    min: { value: 1, message: "Amount must be greater than 0" }
                  }}
                  render={({ field }) => (
                    <div>
                      <NumInput
                        placeholder="Amount"
                        startIcon={selectedSymbol}
                        value={field.value}
                        onChange={field.onChange}
                        noNegative
                      />
                      {errors.amount && (
                        <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Salary Type */}
              <div className="w-28">
                <Controller
                  name="salaryType"
                  control={control}
                  rules={{ required: "Salary type is required" }}
                  render={({ field }) => (
                    <div>
                      <CusSelect value={field.value} onValueChange={field.onChange}>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </CusSelect>
                      {errors.salaryType && (
                        <p className="text-red-500 text-xs mt-1">{errors.salaryType.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Proposed Joining Date */}
          <div className="col-span-1">
            <Controller
              name="joiningDate"
              control={control}
              rules={{ required: "Joining date is required" }}
              render={({ field }) => (
                <div>
                  <CusDatePicker
                    label="Proposed Joining Date"
                    value={field.value}
                    onChange={field.onChange}
                    required
                    minDate={new Date()}
                  />
                  {errors.joiningDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.joiningDate.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* Terms Section */}
        <div>
          <h4 className="font-semibold text-label mb-3">Terms</h4>
          <Accordion type="single"  defaultValue="mandatory" className="w-full">
            <AccordionItem value="mandatory" className="mb-2 border-none">
              <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:no-underline cursor-pointer">
                <div className="flex items-center gap-2">
                  <CircleCheckBig className="h-4 w-4 text-(--onboarded)" />
                  <span>Mandatory Burdens</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0">
                <ProposalBurdensTable
                  title="Mandatory Burdens"
                  items={mandatoryItems}
                  selection={mandatorySelection}
                  onChange={handleMandatorySelection}
                />
              </AccordionContent>
            </AccordionItem>

            <Separator />

            <AccordionItem value="variable">
              <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:no-underline cursor-pointer">
                <div className="flex items-center gap-2">
                  <CircleCheckBig className="h-4 w-4 text-(--all-candidate)" />
                  <span>Variable Benefits</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0">
                <ProposalBurdensTable
                  title="Variable Benefits"
                  items={variableItems}
                  selection={variableSelection}
                  onChange={handleVariableSelection}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Notes */}
        <div>
          <Label className="text-sm font-medium text-label">Notes</Label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Textarea
                className="mt-1 resize-none"
                rows={3}
                value={field.value}
                onChange={field.onChange}
                placeholder="Add any additional notes..."
              />
            )}
          />
        </div>

        {/* Compensation Section */}
        <div>
          <h4 className="font-semibold text-label mb-3">Compensation</h4>
          <div className="p-3 bg-(--profile-bg) rounded-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-label">Base Daily Salary</span>
                  <span className="text-sm font-bold text-label">{selectedSymbol}{dailyBase}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CircleCheckBig className="h-4 w-4 text-(--onboarded)" />
                    <span className="text-sm text-label">Mandatory Burdens</span>
                  </div>
                  <span className="text-sm font-bold text-label">{selectedSymbol}{dailyMandatory}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CircleCheckBig className="h-4 w-4 text-(--all-candidate)" />
                    <span className="text-sm text-label">Variable Benefits (Est.)</span>
                  </div>
                  <span className="text-sm font-bold text-label">{selectedSymbol}{dailyVariable}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-(--candidate-label)">Total Daily Cost</span>
                    <span className="text-sm font-bold text-(--candidate-label)">{selectedSymbol}{totalDaily}</span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-2 border-l border-gray-200 pl-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-label">Overtime (Weekdays)</span>
                  <span className="text-sm font-bold text-label">{selectedSymbol}{overtimeWeekdays}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-label">Overtime (Weekends)</span>
                  <span className="text-sm font-bold text-label">{selectedSymbol}{overtimeWeekends}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-label">Overtime (Holidays)</span>
                  <span className="text-sm font-bold text-label">{selectedSymbol}{overtimeHolidays}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-label">Standby Rate</span>
                  <span className="text-sm font-bold text-label">{selectedSymbol}{standbyRate}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#F0F0F0] p-2 rounded text-xs text-gray-600 mt-3">
              *This rate is accurate based on the contract between TE and its client. Any changes affect this price.
            </div>
          </div>
        </div>

        {/* Buttons */}

      </form>
      <div className="sticky bottom-0 bg-card mb-2  flex gap-1 px-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-(--interview) text-(--interview) bg-transparent hover:bg-transparent hover:text-(--interview)"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-(--interview) hover:bg-(--interview)"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}