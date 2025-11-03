// types.tsx

export interface CandidateProfile {
  name: string;
  full_name: string;
  profile_image: string | null;
  email: string;
  date_of_birth: string; // ISO date string (e.g., "2025-10-29")
  [key: string]: any; // To allow extra fields if present
}

export interface Interviewer {
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export interface InterviewSchedule {
  agreed_interview_date: string | null;
  agreed_interview_time: string | null;
  agreed_interview_timezone: string | null;
  interview_mode: string;
  interview_type: string;
  interviewers: Interviewer[];
  meeting_invite_content: string | null;
  name: string;
  profile: CandidateProfile;
  profile_version: Record<string, any>;
  round: number;
}

export interface CandidateInterviewType {
  id: string;
  candidate_id: string;
  candidate_name: string;
  candidate_role: string;
  interview_schedule: InterviewSchedule[];
}
