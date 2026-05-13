import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** About is WIP: keep the route for local dev, hide it on any Vercel deployment. */
export function proxy(request: NextRequest) {
  if (process.env.VERCEL && request.nextUrl.pathname.startsWith("/about")) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/about", "/about/:path*"],
};
