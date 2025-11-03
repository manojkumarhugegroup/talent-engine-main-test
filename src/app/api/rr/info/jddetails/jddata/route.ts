
import { jobDescription } from "@/data/Info/jd-data";
import { NextRequest } from "next/server";
export async function GET(request: NextRequest) {
  return new Response(JSON.stringify(jobDescription), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
