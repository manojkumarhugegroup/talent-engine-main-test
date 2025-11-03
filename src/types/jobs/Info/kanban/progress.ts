import { InterviewerType, InterviewSlot } from "./interview-feedback";

export type InterviewType = string;
export type InterviewMode = string;


export interface candidate {
  id?: string;
  name?: string; // ISO yyyy-MM-dd
  image?: string; // HH:mm (24h)
  job_title?: string;
}
 

export interface InterviewFormData {
  candidate: candidate;
  interview_type: InterviewType;
  interview_mode: InterviewMode;
  interviewer: InterviewerType[];
  slots: InterviewSlot[];
}
