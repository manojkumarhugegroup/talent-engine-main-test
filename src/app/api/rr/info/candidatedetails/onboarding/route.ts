import { onboardingData } from "@/data/Info/candidate-details/candidate";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return new Response(JSON.stringify(onboardingData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
