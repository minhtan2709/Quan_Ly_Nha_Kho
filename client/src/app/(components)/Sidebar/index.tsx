"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  Archive,
  CircleDollarSign,
  Clipboard,
  Layout,
  LucideIcon,
  Menu,
  SlidersHorizontal,
  User,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        }
        hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
          isActive ? "bg-blue-200 text-white" : ""
        }
      }`}
      >
        <Icon className="w-6 h-6 !text-gray-700" />
        <span className={`${isCollapsed ? "hidden" : "block"} font-medium text-gray-700`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const [loggingOut, setLoggingOut] = useState(false);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok && res.status !== 204) {
        console.warn("Logout API returned:", res.status);
      }
    } catch (err) {
      console.warn("Logout request failed:", err);
    } finally {
      // Điều hướng cứng; middleware sẽ cho vào /login vì cookie đã bị xoá
      window.location.href = "/login";
    }
  }

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`}
      >
        <Image
          src="/logo.png"
          alt="edstock-logo"
          width={27}
          height={27}
          className="rounded w-8"
        />
        <h1 className={`${isSidebarCollapsed ? "hidden" : "block"} font-extrabold text-2xl`}>
          STOCK
        </h1>

        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-8">
        <SidebarLink href="/dashboard" icon={Layout} label="Dashboard" isCollapsed={isSidebarCollapsed} />
        <SidebarLink href="/inventory" icon={Archive} label="Inventory" isCollapsed={isSidebarCollapsed} />
        <SidebarLink href="/products" icon={Clipboard} label="Products" isCollapsed={isSidebarCollapsed} />
        <SidebarLink href="/users" icon={User} label="Users" isCollapsed={isSidebarCollapsed} />
        <SidebarLink href="/settings" icon={SlidersHorizontal} label="Settings" isCollapsed={isSidebarCollapsed} />
        <SidebarLink href="/expenses" icon={CircleDollarSign} label="Expenses" isCollapsed={isSidebarCollapsed} />
      </div>

      {/* LOGOUT */}
      <div className="px-2">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className={`${
            isSidebarCollapsed
              ? "w-full flex justify-center py-4"
              : "w-full flex items-center gap-3 px-8 py-4"
          } rounded-lg text-sm transition
             text-black hover:bg-red-300 disabled:opacity-60`}
          title="Đăng xuất"
        >
          <LogOut className="w-5 h-5" />
          <span className={`${isSidebarCollapsed ? "hidden" : "block"} font-medium`}>
            {loggingOut ? "Logout..." : "Logout"}
          </span>
        </button>
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500">&copy; 2025 ADMIN</p>
      </div>
    </div>
  );
};

export default Sidebar;
