export type InterviewMode = "Virtual Meeting" | "In-Person" | "Phone Call"
export type InterviewType = "Technical" | "HR" | "Managerial"
export type InterviewStatus = "Cleared" | "Rescheduled" | "Rejected"

export interface InterviewRound {
  id: string
  roundNumber: number
  type: InterviewType
  status: InterviewStatus
  interviewerName: string
  date: string // e.g., "Jun 02, 2025"
  time: string // e.g., "11:30AM CST"
  mode: InterviewMode
  meetingLink: string
  meetingId?: string
  passcode?: string
  feedback?: string
  reason?: string
  remarks?: string
  
}

export interface Candidate {
  id: string
  name: string
  position: string
  avatarUrl?: string
  rounds: InterviewRound[]
}

export interface Candidate {
  candidate_name: string;
  candidate_id: string;
  id: string;
  candidate_role: string;
  interview_schedule: InterviewSchedule[];
}

export interface InterviewSchedule {
  name: string;
  round: number;
  interview_type: string;
  interview_mode: string;
  interviewers: Interviewer[];
  agreed_interview_date: string; // ISO date format
  agreed_interview_time: string; // time in HH:mm:ss
  agreed_interview_timezone: string;
  meeting_invite_content: string; // HTML string
  profile: Profile;
  profile_version: Record<string, any>; // empty object or dynamic fields
}

export interface Interviewer {
  name: string;
  type: string; // "User" | "Email"
  user: string | null;
  email: string;
}

export interface Profile {
  name: string;
  full_name: string;
  profile_image: string | null;
  email: string;
  date_of_birth: string;
  gender: string;
  contact_no: string;
  current_location: string;
  current_profile_version: string;
  state: string;
  history: any[]; // unclear structure — adjust if known
}

