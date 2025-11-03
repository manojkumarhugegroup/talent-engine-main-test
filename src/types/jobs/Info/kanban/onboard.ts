// Types in a separate file (as requested)

export type ISODate = string // YYYY-MM-DD

export interface ChecklistItem {
  id: string
  label: string
  checked: boolean
  completedDate?: ISODate
  completedBy?: string
  notes?: string
}

export interface OtherItemRow {
  id: string
  label: string
  completedDate?: ISODate
  completedBy?: string
  notes?: string
}

export interface AssetRow {
  id: string
  assetId: string
  assetType: string
  allocatedOn?: ISODate
  returnedOn?: ISODate
  notes?: string
}

export interface OnboardingPayload {
  expectedJoiningDate: ISODate
  actualJoiningDate: ISODate
  checklist: ChecklistItem[]
  otherItems: OtherItemRow[]
  assets: AssetRow[]
}
