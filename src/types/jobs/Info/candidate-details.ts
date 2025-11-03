// Candidate
export type CandidateType = {
  name: string
  role: string
  nationality: string
  category: string
  experience: string
  summary: string
  skills: string[]
  education: { degree: string; year: string; school: string; gpa?: string }[]
  certifications: { name: string; issuer: string; issued: string; expiry?: string }[]
  avatarUrl?: string
}

// Resource Requirement
export type ResourceRequirement = {
  position: string
  projectStart: string
  projectEnd: string
  rotation: string
  daysPerWeek: number
  hoursPerDay: number
  location: string
}

// Work Order
export type WorkOrder = {
  proposedJoiningDate: string
  baseSalaryPerMonth: number
   currencySymbol: string 
  baseMonthlySalary: number  // Changed from baseSalary
  mandatoryBurdens: number
  variableBenefits: number
  totalMonthlyCost: number   // Added missing property
  weekdays: number           // Changed from overtimeWeekdays
  weekends: number           // Changed from overtimeWeekends
  holiday: number            // Changed from overtimeHoliday
  standby: number 

}

// Onboarding
export type ChecklistItem = {
  title: string
  status: "completed" | "pending"
  by?: string
  date?: string
  notes?: string
  icon?: "laptop" | "key" | "id" | "bank" | "badge"
}
export type AssetItem = { label: string; status: string; allocatedOn?: string; returnedOn?: string }
export type Onboarding = {
  actualJoiningDate: string
  checklist: ChecklistItem[]
  assets: AssetItem[]
}

// History
export type HistoryItem = {
  title: string
  statusText: string
  status: "completed" | "ready"
  date: string
  by: string
}
