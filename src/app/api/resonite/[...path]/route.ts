import { NextRequest, NextResponse } from "next/server";

const RESONITE_API = "https://api.resonite.com";

export const maxDuration = 60; // Vercel: extend timeout for SignalR long-poll

const ALLOWED_PREFIXES = [
  "/userSessions",
  "/users",
  "/sessions",
  "/records",
  "/hub",
];

export async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetPath = "/" + path.join("/");

  if (!ALLOWED_PREFIXES.some((prefix) => targetPath.startsWith(prefix))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(targetPath, RESONITE_API);

  // Forward query params
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Forward auth header (strip "Bearer " prefix added by SignalR)
  const auth = req.headers.get("authorization");
  if (auth) {
    headers["Authorization"] = auth.startsWith("Bearer ")
      ? auth.slice(7)
      : auth;
  }

  // Forward UID and TOTP headers
  const uid = req.headers.get("uid");
  if (uid) headers["UID"] = uid;

  const totp = req.headers.get("totp");
  if (totp) headers["TOTP"] = totp;

  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      body = await req.text();
    } catch {
      // no body
    }
  }

  try {
    const response = await fetch(url.toString(), {
      method: req.method,
      headers,
      body,
    });

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", response.headers.get("Content-Type") || "application/json");

    if (response.status === 204) {
      return new NextResponse(null, {
        status: 204,
        headers: responseHeaders,
      });
    }

    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Resonite API proxy error:", error);
    return NextResponse.json(
      { error: "Failed to connect to Resonite API" },
      { status: 502 },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
