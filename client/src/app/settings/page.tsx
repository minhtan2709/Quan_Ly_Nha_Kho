"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/(components)/Header";

type UserSetting = {
  label: string;
  value: string | boolean;
  type: "text" | "toggle";
  readOnly?: boolean;
};

type MeResp = {
  user: {
    userId: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

const Settings = () => {
  // Khởi tạo mặc định, sẽ được ghi đè bằng dữ liệu từ /auth/me
  const [userSettings, setUserSettings] = useState<UserSetting[]>([
    { label: "Username", value: "...", type: "text", readOnly: true },
    { label: "Email", value: "...", type: "text", readOnly: true },
    { label: "Notification", value: true, type: "toggle" },
    { label: "Dark Mode", value: false, type: "toggle" },
    { label: "Language", value: "English", type: "text" },
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  // Lấy username + email từ DB
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const r = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        if (!r.ok) {
          throw new Error(`HTTP ${r.status}`);
        }
        const data = (await r.json()) as MeResp;

        if (!alive) return;

        const next = userSettings.map((s) => {
          if (s.label === "Username") return { ...s, value: data.user.name ?? "User" };
          if (s.label === "Email") return { ...s, value: data.user.email ?? "" };
          return s;
        });
        setUserSettings(next);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load user settings");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleChange = (index: number) => {
    const settingsCopy = [...userSettings];
    settingsCopy[index].value = !settingsCopy[index].value as boolean;
    setUserSettings(settingsCopy);
  };

  return (
    <div className="w-full">
      <Header name="User Settings" />

      {err && (
        <div className="mt-4 text-red-600 text-sm">
          Không tải được thông tin người dùng: {err}
        </div>
      )}

      <div className="overflow-x-auto mt-5 shadow-md">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Setting
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {userSettings.map((setting, index) => (
              <tr className="hover:bg-blue-50" key={setting.label}>
                <td className="py-2 px-4">{setting.label}</td>
                <td className="py-2 px-4">
                  {setting.type === "toggle" ? (
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={setting.value as boolean}
                        onChange={() => handleToggleChange(index)}
                        disabled={loading}
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-blue-400 peer-focus:ring-4 
                        transition peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                        after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  ) : (
                    <input
                      type="text"
                      className={`px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                        setting.readOnly ? "text-gray-500 bg-gray-50" : "text-gray-700"
                      }`}
                      value={String(setting.value)}
                      readOnly={setting.readOnly}
                      onChange={(e) => {
                        if (setting.readOnly) return;
                        const settingsCopy = [...userSettings];
                        settingsCopy[index].value = e.target.value;
                        setUserSettings(settingsCopy);
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="p-4 text-gray-500 text-sm">Đang tải thông tin người dùng…</div>
        )}
      </div>
    </div>
  );
};

export default Settings;
