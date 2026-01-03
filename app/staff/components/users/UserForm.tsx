"use client";

import { useState } from "react";
import { X, Save, RotateCcw } from "lucide-react";
import { CreateUserInput } from "@/lib/api/staff";

interface UserFormProps {
  onSave: (data: CreateUserInput) => Promise<void>;
  onCancel: () => void;
}

export default function UserForm({ onSave, onCancel }: UserFormProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [points, setPoints] = useState<number | "">("");
  const [role, setRole] = useState<"fan" | "staff">("fan");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      await onSave({
        email,
        password,
        role,
        username: username || null,
        displayName: displayName || null,
        points: points === "" ? 0 : Number(points)
      });
    } catch {
      setError("Có lỗi khi tạo user");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="rounded-xl border border-gold/30 bg-gray-900/50 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-heading text-lg text-gold">Thêm User Mới</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      
      {error && (
        <div className="mb-4 text-red-400 text-sm bg-red-500/10 p-3 rounded border border-red-500/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded bg-black/40 border border-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-gold/50 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded bg-black/40 border border-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-gold/50 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "fan" | "staff")}
              className="w-full rounded bg-black/40 border border-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-gold/50 outline-none"
            >
              <option value="fan">Fan</option>
              <option value="staff">Staff</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded bg-black/40 border border-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-gold/50 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded bg-black/40 border border-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-gold/50 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Points (Initial)</label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full rounded bg-black/40 border border-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-gold/50 outline-none"
            />
          </div>
        </div>
        <div className="md:col-span-2 pt-2 flex justify-end">
          <button
            type="submit"
            disabled={creating}
            className="btn-gold text-xs px-6 py-2 disabled:opacity-50 flex items-center gap-2"
          >
            {creating ? <RotateCcw className="animate-spin" size={14} /> : <Save size={14} />}
            {creating ? "Đang tạo..." : "Tạo User"}
          </button>
        </div>
      </form>
    </div>
  );
}
