import { InterviewMode, InterviewType } from "./progress";

// Interview feedback types
export type FeedbackType = "cleared" | "rejected" | "reschedule";

export interface RejectionReason {
  id: string;
  label: string;
}

export interface RescheduleReason {
  id: string;
  label: string;
}

export interface InterviewerType {
  name?: string;
  email?: string;
  type?: string;
  user?: string;
  label?: string;
  full_name?: string;
}

export interface InterviewSlot {
  name: string;
  date: string;
  time: string;
  timezone: string;
  status: string;
}

export interface FeedbackFormData {
  feedbackType: FeedbackType;
  remarks: string;
  rejectionReason?: string; 
  cancellationReason?: string;
  rescheduleReason?: string;
   interview_type: InterviewType;
  interview_mode: InterviewMode;
  interviewer: InterviewerType[];
  slots?: InterviewSlot[];
}

// Rejection reasons dropdown options
export const REJECTION_REASONS: RejectionReason[] = [
  { id: "skills_mismatch", label: "Skills Mismatch" },
  { id: "experience_insufficient", label: "Insufficient Experience" },
  { id: "cultural_fit", label: "Cultural Fit Issues" },
  { id: "communication_issues", label: "Communication Issues" },
  { id: "technical_assessment", label: "Failed Technical Assessment" },
  { id: "availability_conflict", label: "Availability Conflict" },
  { id: "salary_expectations", label: "Salary Expectations Mismatch" },
  { id: "other", label: "Other" },
];

 

// Interview types for scheduling
export const INTERVIEW_TYPES = [
   { id: "1", name: "Technical" },
    { id: "2", name: "HR" },
    { id: "3", name: "Managerial" },
    { id: "4", name: "Culture Fit" },
];
