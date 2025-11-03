// Meeting details for interview
export interface MeetingContent {
  link: string;
  agenda: string;
}

export interface Round {
  roundNumber: number;
  type: string;
  interviewer: string;
  date: string;
  time: string;
  timezone: string;
  mode: string;
  slot?: string;
}

export interface Interview {
  name: string;
  profession: string;
  avatar: string;
  round: Round;
  meeting: MeetingContent;
}

export type CandidateProfile = Interview;

export interface InterviewDataType {
  candidate: Interview | null;
}
 