
import { interviewMeetingData } from "@/data/Info/kanban/interviewData";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return new Response(JSON.stringify(interviewMeetingData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}