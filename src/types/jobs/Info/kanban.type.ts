export type KanbanColumn = {
  id: string;
  name: string;
  color: string;
  icon?: string;
};

export type KanbanUser = {
  id: string;
  name: string;
  image: string;
};

export interface Round {
  round_no: number;
  date: string |null;
  time: string |null;
  timezone: string |null;
  round_type: string;
  round_mode: string;
  interviewer: string;
  slot?: number;
}

export type KanbanFeature = {
  id: string;
  job_title: string;
  summary?: string;
  startAt: Date | null;
  endAt: Date | null;
  stage: string;
  status: string;
  interview?:string;
  candidate: KanbanUser;
  baseSalary?: string;
  totalCost?: string;
  joinDate?: string;
  round?: Round[];
};

// Basic types for columns and features
export type Column = {
  id: string;
  name: string;
  icon?: string;
};

export type Feature = {
  id: string;
  name: string;
  description?: string;
  column: string;
};
 