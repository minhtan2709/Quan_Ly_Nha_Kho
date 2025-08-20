import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const protectedPaths = ["/dashboard", "/products", "/inventory", "/users"];
  const isProtected = protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p));

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Nếu đã đăng nhập thì chặn vào /login
  if (req.nextUrl.pathname === "/login" && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/inventory/:path*",
    "/users/:path*",
    "/login",
  ],
};
