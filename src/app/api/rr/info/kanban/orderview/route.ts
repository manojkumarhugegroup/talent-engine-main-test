
import { orderData } from "@/data/Info/kanban/orderData";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return new Response(JSON.stringify(orderData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}