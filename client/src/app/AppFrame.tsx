"use client";

import { usePathname } from "next/navigation";
import DashboardWrapper from "./dashboardWrapper";

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const authRoutes = ["/login"]; // các route KHÔNG dùng sidebar/navbar
  const isAuth = authRoutes.some((p) => pathname.startsWith(p));

  if (isAuth) {
    // Trang trắng, căn giữa form
    return <div className="min-h-screen flex items-center justify-center">{children}</div>;
  }

  // Các trang còn lại dùng layout chuẩn
  return <DashboardWrapper>{children}</DashboardWrapper>;
}
