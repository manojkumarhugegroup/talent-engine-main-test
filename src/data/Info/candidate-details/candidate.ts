import {  CandidateType, HistoryItem, Onboarding, ResourceRequirement, WorkOrder } from "@/types/jobs/Info/candidate-details"

export const candidateData: CandidateType = {
  name: "John",
  role: "Procurement Specialist",
  nationality: "USA",
  category: "Skilled Technician",
  experience: "12 years 3 months",
  summary:
    "The National Fuel Distribution Project is a nationwide initiative to improve the efficiency, reliability, and sustainability of fuel distribution through optimized logistics, inventory visibility, and delivery coordination across regional hubs.",
  skills: [
    "Fuel Logistics (24 Month Exp)",
    "Fleet Management (12 Month Exp)",
    "HAZMAT Compliance (12 Month Exp)",
  ],
  education: [
    { degree: "B.Sc. in Mechanical Engineering", year: "2018", school: "Energy Systems", gpa: "3.6" },
    { degree: "AVS College", year: "—", school: "—" },
  ],
  certifications: [
    {
      name: "Certified Fuel Handler",
      issuer: "American Petroleum Institute | CFH-11245",
      issued: "Jan 2020",
      expiry: "Jan 2025",
    },
  ],
  avatarUrl: "",
}

export const resourceRequirementData: ResourceRequirement = {
  position: "Fuel Operations Manager",
  projectStart: "Aug 01, 2025",
  projectEnd: "Jul 30, 2027",
  rotation: "8 Weeks On / 2 Weeks Off",
  daysPerWeek: 6,
  hoursPerDay: 8,
  location: "Houston, TX, US",
}

export const workOrderData: WorkOrder = {
  proposedJoiningDate: "Aug 01, 2025",
  baseSalaryPerMonth: 2300,
    currencySymbol: "$",
 baseMonthlySalary: 96,     // Changed property name
  mandatoryBurdens: 18,
  variableBenefits: 9,
  totalMonthlyCost: 123,     // Added missing property
  weekdays: 12,              // Changed property name
  weekends: 12,              // Changed property name
  holiday: 13,               // Changed property name
  standby: 10, 


}

export const onboardingData: Onboarding = {
  actualJoiningDate: "Aug 02, 2025",
  checklist: [
    { title: "Laptop / Work Device Provided", status: "completed", by: "Maddy", date: "Aug 02, 2025", icon: "laptop" },
    { title: "Access to Tools/Portals Granted", status: "completed", by: "Maddy", date: "Aug 02, 2025", icon: "key" },
    { title: "ID & Address Proof Collected", status: "completed", by: "Maddy", date: "Aug 02, 2025", icon: "id" },
    { title: "Bank Details Submitted", status: "completed", by: "Maddy", date: "Aug 02, 2025", icon: "bank" },
    { title: "Employee Code / ID Generated", status: "completed", by: "Maddy", date: "Aug 02, 2025", icon: "badge" },
  ],
  assets: [
    { label: "A0010 - Laptop", status: "Allocated", allocatedOn: "Aug 02, 2025", returnedOn: "Aug 03, 2025" },
  ],
}

export const historyData: HistoryItem[] = [
  {
    title: "Onboarding",
    statusText: "Completed",
    status: "completed",
    date: "May 15, 2025 — 10:00 AM",
    by: "TE HR - Priya Nair",
  },
  {
    title: "Work Order",
    statusText: "Ready to Onboard",
    status: "ready",
    date: "May 8, 2025 — 09:30 AM",
    by: "TE HR - Priya Nair",
  },
]
