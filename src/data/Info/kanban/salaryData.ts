
import { CompensationPayload } from "@/types/jobs/Info/kanban/salary";


export const compensationData: CompensationPayload = {
  billing_currency: "USD",
  currencySymbol: "$",
  baseSalaryLabel: "Base Salary",
  baseSalaryValue: "$2400/Month",
  proposedJoiningDate: "Aug 01, 2025",
  breakdown: {
    baseMonthlySalary: 2400,
    mandatoryBurdens: 400,
    fourceManagementfee:300,
    variableBenefits: 200,
    totalMonthlyCost: 3000,
    
  },
  overtime: {
    weekdays: 19,
    weekends: 21,
    holiday: 22,
    standby: 16,
  },
  terms: {
    byClient: [
      "Personal Income & Social Taxation (as applicable)",
      "Pension (as applicable)",
      "Gate Passes",
      "Medical / Health Check",
      "Temporary Site Offices",
      "Power and Water supply to temporary site offices",
      "Site Facilities (workshop, restroom, stores, etc.)",
      "Test Instruments, Construction Equipment,",
      "Access Platforms and Scaffolding",
    ],
    byCandidate: ["Air Travel Costs (including mob/demob flights)",
          "Provision of Visa and Work Permit (as applicable)",
          "Employers Liability and All Risks Insurance",
          "Medical Insurance",
          "Local Business Transportation (Daily)",
          "Accommodation and Food",],
    byTalentEngine: ["Provision of Visa and Work Permit (as applicable)"],
    notApplicable: ["Third Party Specialist (Representative) requirements",
          "Purchase of Any Project Materials and Consumable Materials",],
  },
}
