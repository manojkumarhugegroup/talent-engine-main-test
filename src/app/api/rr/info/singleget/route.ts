
import { frappeGet } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const jobId = searchParams.get("job_id");

    // Get cookies from the incoming request
    const incomingCookies = req.headers.get("cookie");

    // Prepare headers to forward to Frappe
    const forwardHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward cookies from incoming request to Frappe so it can authenticate
    if (incomingCookies) {
      forwardHeaders["Cookie"] = incomingCookies;
    }

    const {
      data,
      headers: responseHeaders,
      status,
    } = await frappeGet(`/api/method/get_rr_details?rr_name=${jobId}`, {
      headers: forwardHeaders,
    });
    const res = NextResponse.json(data, { status });

    const setCookieArr: string[] =
      (responseHeaders as any).getSetCookie?.() || [];

    if (setCookieArr.length === 0) {
      const single = responseHeaders.get("set-cookie");
      if (single) setCookieArr.push(...single.split(/,(?=\s*[^=]+=)/));
    }

    const isProd = process.env.NEXT_ENV === "production";
    setCookieArr.forEach((raw) => {
      let cookie = raw.trim();
      cookie = cookie.replace(/;\s*Domain=[^;]+/i, "");
      if (!/;\s*Path=/i.test(cookie)) cookie += "; Path=/";
      if (!/;\s*SameSite=/i.test(cookie)) {
        if (isProd) cookie += "; SameSite=None; Secure";
        else cookie += "; SameSite=Lax";
      }
      res.headers.append("Set-Cookie", cookie);
    });
    return res;
  } catch (error: any) {
    console.error("Error fetching job info:", error);

    // Distinguish between different types of errors
    if (error.message.includes("Mock API request failed")) {
      return NextResponse.json(
        { message: "External API unavailable", error: error.message },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
