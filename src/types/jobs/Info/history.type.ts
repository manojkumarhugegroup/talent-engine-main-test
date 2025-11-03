import { CandidateSummaryTypes } from "../info.types";

export interface ProfileDrawerProps {
  candidate: CandidateSummaryTypes;
  candidate_open: boolean;
  candidate_action: (isOpen: boolean) => void;
}

export type TimelineSubStatusType = {
  status: string;
  date: string;
  time: string;
  by: string;
  round?: number;
  type?: string;
  mode?: string;
};

export type TimelineItemType = {
  title: string;
  stage: string;
  status?: string;
  date: string;
  time: string;
  by: string;
  subStatuses?: TimelineSubStatusType[];
  round?: number;
  type?: string;
  mode?: string;
  notes?: string;
};