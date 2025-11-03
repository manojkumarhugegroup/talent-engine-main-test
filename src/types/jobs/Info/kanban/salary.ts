export type Currency = "USD" | "EUR" | "SAR" | "AED" | "INR";

export interface OvertimeRates {
  weekdays: number;
  weekends: number;
  holiday: number;
  standby: number;
}

export interface CompensationBreakdown {
  baseMonthlySalary: number;
  mandatoryBurdens: number;
  variableBenefits: number;
  fourceManagementfee:number;
  totalMonthlyCost: number;
}

export interface Terms {
  byClient: string[];
  byCandidate: string[];
  byTalentEngine: string[];
  notApplicable: string[];
}

export interface CompensationPayload {
  billing_currency: Currency;
  currencySymbol: string;
  baseSalaryLabel: string;
  baseSalaryValue: string;
  proposedJoiningDate?: string;
  breakdown: CompensationBreakdown;
  overtime: OvertimeRates;
  terms: Terms;
}
