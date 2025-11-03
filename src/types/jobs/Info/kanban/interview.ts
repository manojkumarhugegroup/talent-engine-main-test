// types/jobs/interview.ts

export type CostItem = {
  id: string;
  description: string;
  amount: number;
};

export type Stakeholder = "client" | "candidate" | "talent" | "na";

export type BurdenSelection = Record<string, Stakeholder>;

export type DailyRates = {
  base: number;
  mandatoryBurdens: number;
  variableBenefits: number;
  total: number;
};

export type OvertimeRates = {
  weekdays: number;
  weekends: number;
  holidays: number;
  standby: number;
};

export type ProposalFormData = {
  // Location and Currency
  countryId: string;
  currencyCode: string;
  currencySymbol: string;
  
  // Salary Information
  amount: number;
  salaryType: "hourly" | "daily" | "weekly" | "monthly";
  
  // Dates
  joiningDate: Date | undefined;
  
  // Burdens and Benefits
  mandatoryItems: CostItem[];
  mandatorySelection: BurdenSelection;
  variableItems: CostItem[];
  variableSelection: BurdenSelection;
  
  // Additional Information
  notes: string;
  
  // Calculated rates (optional - added during submission)
  dailyRates?: DailyRates;
  overtimeRates?: OvertimeRates;
};