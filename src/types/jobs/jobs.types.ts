export interface JobPostingCardProps extends Omit<Job, "type"> {}

export type JobStats = {
  interview: number;
  received: number;
  selected: number;
  shortlisted: number;
  onboarded: number;
  rejected: number;
  total: number;
};
export type JobNotification = {
  notification: string;
  date: string;
};

export type Job = {
  job_id: string;
  name: string;
  data_uniq_id: string;
  job_stage: "Draft" | "Open" | "Closed";
  state: "Draft" | "Open" | "Closed";
  job_title: string;
  bill_rate: string;
  position_start_date: string;
  location: string;
  applications: JobStats;
  notifications: JobNotification[];
  billing_frequency: string;
  type: string;
  client_name: string;
  min_bill_rate: number;
  max_bill_rate: number;
  billing_currency: string;
};

export interface StatItem {
  label: string;
  value: number | string;
  color: string;
  bgColor: string;
  image: string;
}
