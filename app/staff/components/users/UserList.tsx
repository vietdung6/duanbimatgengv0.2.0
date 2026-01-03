"use client";

import { Trash2 } from "lucide-react";
import type { AuthUser } from "@/lib/auth";

interface UserListProps {
  users: AuthUser[];
  onDelete: (id: number) => Promise<void>;
}

export default function UserList({ users, onDelete }: UserListProps) {
  async function handleDelete(id: number) {
    if (!confirm("Bạn có chắc muốn xoá user này?")) return;
    await onDelete(id);
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-gray-500">
        <div className="col-span-5 md:col-span-4">User Details</div>
        <div className="col-span-3 md:col-span-3 text-center">Points</div>
        <div className="col-span-2 md:col-span-3 text-center">Authority</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {users.map((u) => (
        <div key={u.id} className="group grid grid-cols-12 gap-4 p-4 items-center bg-[#0F0F0F] hover:bg-[#141414] border border-white/5 hover:border-gold/30 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.05)]">
          {/* Info */}
          <div className="col-span-5 md:col-span-4 overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-gold font-heading font-bold text-sm shrink-0 shadow-inner group-hover:border-gold/30 transition-colors">
                {u.username ? u.username.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate group-hover:text-gold transition-colors">
                  {u.displayName || u.username || "No Name"}
                </div>
                <div className="text-xs text-gray-600 truncate font-mono">{u.email}</div>
              </div>
            </div>
          </div>
          
          {/* Points */}
          <div className="col-span-3 md:col-span-3 text-center">
            <div className="flex flex-col items-center">
              <span className="text-white font-mono font-bold text-sm">{u.points.toLocaleString()}</span>
              <span className="text-gray-600 text-[10px] uppercase tracking-wider">{u.totalPoints.toLocaleString()} Total</span>
            </div>
          </div>

          {/* Role */}
          <div className="col-span-2 md:col-span-3 text-center">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${
              u.role === 'admin' 
                ? 'bg-red-500/5 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
                : u.role === 'staff' 
                  ? 'bg-purple-500/5 text-purple-400 border-purple-500/20' 
                  : 'bg-gray-800/50 text-gray-400 border-gray-700'
            }`}>
              {u.role}
            </span>
          </div>

          {/* Action */}
          <div className="col-span-2 flex justify-end">
            <button
              onClick={() => handleDelete(u.id)}
              className="w-8 h-8 flex items-center justify-center rounded bg-gray-900 text-gray-500 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
              title="Delete User"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      
      {users.length === 0 && (
        <div className="text-center py-16 border border-dashed border-gray-800 rounded-xl bg-gray-900/20">
          <p className="text-gray-500 text-sm font-mono">NO_DATA_FOUND</p>
        </div>
      )}
    </div>
  );
}
