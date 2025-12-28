import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const PROTECTED_PATHS = ["/chat"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const isProtected = PROTECTED_PATHS.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!isProtected) return res;

  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If Supabase is exchanging an auth code, allow it to complete without redirecting.
  const hasAuthCode = !!req.nextUrl.searchParams.get("code");
  console.info("middleware:/chat", {
    path: req.nextUrl.pathname,
    hasAuthCode,
    hasSession: !!session,
  });
  if (hasAuthCode) {
    return res;
  }

  if (!session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/chat/:path*"],
};

