import { InterviewMode, InterviewType } from "./progress"

export interface InterviewSlotAPI {
  slot_no: number
  interview_date: string // YYYY-MM-DD format
  interview_time: string // HH:MM format
}

export interface InterviewRoundData {
  interview_type: InterviewType // Just the name, no ID
  interview_mode: InterviewMode // Just the name, no ID
  interviewer: string[] // Array of interviewer names
  slots: InterviewSlotAPI[] // Array of interview slots
}

export interface InterviewPostData {
  profile: {
    id: string
    image: string
    name: string
    position: string
  }
  round_1: InterviewRoundData[] // Array containing the interview round data
}

export interface InterviewApiResponse {
  success: boolean
  message: string
  data?: any
  error?: string
}