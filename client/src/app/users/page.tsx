"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/app/(components)/Header";
import { Lock, Plus, Search, Pencil, Trash2 } from "lucide-react";

type Role = "ADMIN" | "STAFF";
type User = { userId: string; name: string; email: string; role: Role; createdAt?: string };
type MeResp = { user: { userId: string; email: string; role: Role; name?: string } };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

/** --------- Minimal modal (no extra libs) ---------- */
function Modal({
  open, title, onClose, children,
}: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded-lg px-2 py-1 hover:bg-gray-100">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  // ---- Access State
  const [checkingRole, setCheckingRole] = useState(true);
  const [role, setRole] = useState<Role | null>(null);

  // ---- list state
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [rows, setRows] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // pagination (server params ready; đang render client)
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // ---- create/edit/delete modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);

  // create/edit form fields
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPassword, setFPassword] = useState("");
  const [fRole, setFRole] = useState<Role>("STAFF");
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const anyModalOpen = addOpen || editOpen || delOpen;

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const listUrl = useMemo(() => {
    const u = new URL(`${API_BASE}/users`, "http://dummy");
    u.searchParams.set("page", String(page));
    u.searchParams.set("limit", String(limit));
    if (debounced) u.searchParams.set("q", debounced);
    return u.pathname + u.search;
  }, [page, limit, debounced]);

  // 1) Check role (Admin mới vào và thấy nút)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = (await r.json()) as MeResp;
        if (alive) setRole(data.user.role);
      } catch {
        if (alive) setRole(null);
      } finally {
        if (alive) setCheckingRole(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // 2) Fetch list
  const fetchList = async () => {
    setLoading(true);
    setErr(null);
    try {
      const full = API_BASE.startsWith("http") ? `${API_BASE}${listUrl}` : listUrl;
      const r = await fetch(full, { cache: "no-store", credentials: "include" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json: User[] = await r.json();
      setRows(json);
    } catch (e: any) {
      setErr(e?.message || "Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checkingRole && role === "ADMIN") fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkingRole, role, listUrl]);

  // Helpers
  const openAdd = () => {
    setSelected(null);
    setFName(""); setFEmail(""); setFPassword(""); setFRole("STAFF");
    setSaveErr(null);
    setAddOpen(true);
  };
  const openEdit = (u: User) => {
    setSelected(u);
    setFName(u.name); setFEmail(u.email); setFPassword(""); setFRole(u.role);
    setSaveErr(null);
    setEditOpen(true);
  };
  const openDel = (u: User) => { setSelected(u); setDelOpen(true); };

  const submitCreate = async () => {
    if (!fName.trim() || !fEmail.trim() || !fPassword.trim()) {
      setSaveErr("Vui lòng nhập Name, Email, Password.");
      return;
    }
    try {
      setSaving(true);
      setSaveErr(null);
      const r = await fetch(`${API_BASE}/users`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fName.trim(), email: fEmail.trim(), password: fPassword, role: fRole }),
      });
      if (!r.ok) {
        setSaveErr(r.status === 409 ? "Email đã tồn tại." : `Tạo user thất bại (HTTP ${r.status})`);
        return;
      }
      setAddOpen(false);
      fetchList();
    } catch (e: any) {
      setSaveErr(e?.message || "Create failed");
    } finally {
      setSaving(false);
    }
  };

  const submitEdit = async () => {
    if (!selected) return;
    if (!fName.trim() && !fEmail.trim() && !fPassword.trim() && !fRole) {
      setSaveErr("Không có thay đổi.");
      return;
    }
    try {
      setSaving(true);
      setSaveErr(null);
      const r = await fetch(`${API_BASE}/users/${selected.userId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fName.trim(),
          email: fEmail.trim(),
          role: fRole,
          ...(fPassword ? { password: fPassword } : {}),
        }),
      });
      if (!r.ok) {
        setSaveErr(r.status === 409 ? "Email đã tồn tại." : `Cập nhật thất bại (HTTP ${r.status})`);
        return;
      }
      setEditOpen(false);
      fetchList();
    } catch (e: any) {
      setSaveErr(e?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const submitDelete = async () => {
    if (!selected) return;
    try {
      const r = await fetch(`${API_BASE}/users/${selected.userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!r.ok && r.status !== 204) throw new Error(`HTTP ${r.status}`);
      setDelOpen(false);
      fetchList();
    } catch (e: any) {
      alert(e?.message || "Delete failed");
    }
  };

  // ----- UI -----
  if (checkingRole) {
    return (
      <div className="flex flex-col">
        <Header name="Users" />
        <div className="mt-6 text-gray-500">Đang kiểm tra quyền truy cập…</div>
      </div>
    );
  }
  if (role !== "ADMIN") {
    return (
      <div className="flex flex-col">
        <Header name="Users" />
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 flex items-start gap-3">
          <Lock className="w-5 h-5 mt-0.5" />
          <div>
            <div className="font-semibold">Permission denied</div>
            <div className="text-sm">You do not have permission to access this page.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Search & Add */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 flex items-center rounded-xl border border-gray-300 bg-white px-3 py-2 shadow-sm">
          <Search className="w-4 h-4 mr-2 text-gray-500" />
          <input
            className="w-full outline-none text-sm"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            
            autoComplete="off"
            name="user-search"
            disabled={anyModalOpen}
          />
        </div>

        {/* Nút Add cho Admin */}
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-black text-black hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          New User
        </button>
      </div>

      <Header name="Users" />

      {/* Table */}
      <div className="bg-white mt-4 border border-gray-200 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left w-36">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">No rows</td></tr>
              ) : (
                rows.map((u) => (
                  <tr key={u.userId} className="border-t">
                    <td className="px-4 py-2">{u.userId}</td>
                    <td className="px-4 py-2">{u.name}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.role}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          className="px-2 py-1 rounded-md border hover:bg-gray-100"
                          onClick={() => openEdit(u)}
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="px-2 py-1 rounded-md border hover:bg-red-50"
                          onClick={() => openDel(u)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {err && <div className="text-center text-red-500 py-3">{err}</div>}
      </div>

      {/* --- Create Modal --- */}
      <Modal open={addOpen} title="Create User" onClose={() => setAddOpen(false)}>
        <div className="space-y-3">
          <div>
            <label className="text-sm block mb-1">Name</label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              value={fName}
              onChange={(e) => setFName(e.target.value)}
              autoFocus
              autoComplete="off"
              name="create-name"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              value={fEmail}
              onChange={(e) => setFEmail(e.target.value)}
              autoComplete="off"
              name="create-email"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              value={fPassword}
              onChange={(e) => setFPassword(e.target.value)}
              autoComplete="new-password"
              name="create-password"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Role</label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              value={fRole}
              onChange={(e) => setFRole(e.target.value as Role)}
              name="create-role"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="STAFF">STAFF</option>
            </select>
          </div>

          {saveErr && <div className="text-sm text-red-600">{saveErr}</div>}

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setAddOpen(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-50" disabled={saving}>
              Cancel
            </button>
            
            <button onClick={submitCreate} className="px-4 py-2 rounded-lg border bg-black text-black hover:opacity-90 disabled:opacity-60" disabled={saving}>
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* --- Edit Modal --- */}
      <Modal open={editOpen} title="Edit User" onClose={() => setEditOpen(false)}>
        <div className="space-y-3">
          <div>
            <label className="text-sm block mb-1">Name</label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              value={fName}
              onChange={(e) => setFName(e.target.value)}
              autoFocus
              autoComplete="off"
              name="edit-name"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              value={fEmail}
              onChange={(e) => setFEmail(e.target.value)}
              autoComplete="off"
              name="edit-email"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">New Password (optional)</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              value={fPassword}
              onChange={(e) => setFPassword(e.target.value)}
              autoComplete="new-password"
              name="edit-password"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Role</label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              value={fRole}
              onChange={(e) => setFRole(e.target.value as Role)}
              name="edit-role"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="STAFF">STAFF</option>
            </select>
          </div>

          {saveErr && <div className="text-sm text-red-600">{saveErr}</div>}

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setEditOpen(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-50" disabled={saving}>
              Cancel
            </button>
            <button onClick={submitEdit} className="px-4 py-2 rounded-lg border bg-black text-black hover:opacity-90 disabled:opacity-60" disabled={saving}>
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* --- Delete Modal --- */}
      <Modal open={delOpen} title="Delete User" onClose={() => setDelOpen(false)}>
        <div className="space-y-4">
          <p>Are you sure you want to delete user? <b>{selected?.name || selected?.email}</b>?</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDelOpen(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Cancel</button>
            <button onClick={submitDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:opacity-90">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
