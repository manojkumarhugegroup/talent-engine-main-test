import { ProfileData } from "@/data/Info/Profile";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return new Response(
    JSON.stringify({ data: ProfileData }),  
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
