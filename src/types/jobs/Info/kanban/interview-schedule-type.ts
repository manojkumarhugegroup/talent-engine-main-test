import { InterviewSlot } from "./interview-feedback";

 

export interface InterviewSchedule {
  rrcandidate_name: string;
  candidate_name: string;
  candidate_role: string;
  job_id: string;
  interview_type: string;
  interview_mode: string;
  interviewer: string[];
  slots: InterviewSlot[];
}
