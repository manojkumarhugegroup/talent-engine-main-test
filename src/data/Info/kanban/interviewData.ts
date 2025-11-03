// data/mockInterviewData.ts (or wherever you keep your mock data)

import { InterviewDataType } from "@/types/jobs/Info/kanban/interview-meeting";

export const interviewData: InterviewDataType = {
  candidate: {
    name: "John",
    profession: "Procurement Specialist",
    avatar: "/assets/images/candidate-profile.jpg",
    round: {
      roundNumber: 1,
      type: "Technical",
      interviewer: "Michael Brown",
      date: "2025-09-03",
      time: "2:00 PM",
      timezone: "EST",
      mode: "In-Person",
    },
    meeting: {
      link: "https://meet.google.com/xyz-abc",
      agenda: "",
    },
  },
};


export const interviewMeetingData: InterviewDataType = {
  candidate: {
    name: "John",
    profession: "Procurement Specialist",
    avatar: "/assets/images/candidate-profile.jpg",
    round: {
      roundNumber: 1,
      type: "Technical",
      interviewer: "Michael Brown",
      date: "2025-09-03",
      time: "2:00 PM",
      timezone: "EST",
      mode: "In-Person",
    },
    meeting: {

      link: "https://meet.google.com/xyz-abc",
      agenda: `Dear John,
Your interview has been scheduled, and we would like to confirm the meeting details below. Please use the Microsoft Teams link to join at the scheduled time.
Meeting Details:
Click here to join the meeting
Meeting ID: 123 456 789
Passcode: ABC123`,
    },
  },
};

export const INTERVIEW_TYPES = ["HR", "Technical"] as const;
export const INTERVIEW_MODES = ["Virtual Meeting", "Face to Face Meeting",] as const;