export interface ContractTermsFormValues {
  // General Information
  workOrder: string
  end_Date:Date|undefined
  started_Date:Date|undefined
  department:string
  point_of_origin:string
  client_billing_cost:string
  work_order_no:string
  projectName:string
  clientName:string
  dateOfOrder: Date | undefined
  workOrderRef: string
  workOrderRefImage?: File | null
  agreementRef: string
  agreementRefImage?: File | null
  mobilizationPoint: string
  demobilizationPoint: string
  relievers: string
  costCode: string
 

  // Legal & Commercial
  validityOfProposal: string
  paymentTerms: string
  applicableTaxes: string
  applicableLaw: string

  // Insurance
  generalLiabilityInsurance: string
  medicalInsurance: string
}
