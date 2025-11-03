import { compensationData } from "@/data/Info/kanban/salaryData";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return new Response(JSON.stringify(compensationData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}