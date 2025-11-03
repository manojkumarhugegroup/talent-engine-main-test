
import { advertisedPosition } from "@/data/Info/jd-data";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return new Response(JSON.stringify(advertisedPosition), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
