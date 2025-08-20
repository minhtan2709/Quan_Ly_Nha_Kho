// client/app/login/page.tsx
"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const r = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!r.ok) {
        setErr("Sai email hoặc mật khẩu");
        return;
      }

      try {
        await r.json();
      } catch {
        /* ignore */
      }

      // Hard redirect để chắc chắn request mới mang cookie
      window.location.href = "/dashboard";
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-[600px] max-w-[95vw] bg-white p-10 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-semibold text-center mb-6">Login</h1>

        {err && (
          <div className="mb-6 rounded-md bg-red-50 text-red-700 px-4 py-2 text-sm">
            {err}
          </div>
        )}

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          className="w-full border rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          autoComplete="username"
        />

        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          className="w-full border rounded-lg px-4 py-3 mb-6 outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading}
          aria-label="Login"
          className="
            w-full h-12 rounded-lg border border-black
            bg-white text-black
            transition-all duration-300 ease-out
            hover:!bg-black hover:!text-white
            active:!bg-black active:!text-white active:scale-[0.98]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {loading ? "Login..." : "Login"}
        </button>
      </form>
    </div>
  );
}
