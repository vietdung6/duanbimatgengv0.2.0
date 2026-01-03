"use client";

import { useState } from "react";
import { Link2, Copy, Check, Plus, RotateCcw, Trash2 } from "lucide-react";
import type { InviteToken } from "../../types";
import type { AuthUser } from "@/lib/auth";

interface InviteManagementProps {
  invites: InviteToken[];
  loading: boolean;
  onCreate: (role: "fan" | "staff") => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  currentUser?: AuthUser | null | undefined;
}

export default function InviteManagement({ invites, loading, onCreate, onDelete, currentUser }: InviteManagementProps) {
  const [creatingInvite, setCreatingInvite] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  async function handleCreateInvite(role: "fan" | "staff") {
    setCreatingInvite(true);
    try {
      await onCreate(role);
    } finally {
      setCreatingInvite(false);
    }
  }

  async function handleDeleteInvite(id: number) {
    if (!confirm("Bạn có chắc chắn muốn xoá invite code này?")) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  }

  async function copyInviteLink(token: string) {
    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}/register?token=${token}`;
    await navigator.clipboard.writeText(inviteUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 3000);
  }

  return (
    <div className="space-y-6 pt-8 border-t border-white/10 mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl text-white flex items-center gap-3 uppercase tracking-wide">
            <span className="w-8 h-8 rounded bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
               <Link2 size={16} />
            </span>
            <span>Invite Keys</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1 pl-11">Generate access keys for new members.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleCreateInvite("fan")}
            disabled={creatingInvite}
            className="px-4 py-2 rounded-lg bg-[#111] hover:bg-[#222] border border-white/10 hover:border-gold/30 text-xs font-bold text-gray-300 transition-all flex items-center gap-2 uppercase tracking-wider"
          >
            {creatingInvite ? <RotateCcw size={12} className="animate-spin" /> : <Plus size={12} />}
            Fan Key
          </button>
          
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleCreateInvite("staff")}
              disabled={creatingInvite}
              className="px-4 py-2 rounded-lg bg-purple-900/20 hover:bg-purple-900/40 border border-purple-500/30 hover:border-purple-500/50 text-xs font-bold text-purple-300 transition-all flex items-center gap-2 uppercase tracking-wider"
            >
              {creatingInvite ? <RotateCcw size={12} className="animate-spin" /> : <Plus size={12} />}
              Staff Key
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500 text-sm font-mono animate-pulse">SYNCING_KEYS...</div>
      ) : invites.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-800 p-8 text-center bg-gray-900/20">
          <p className="text-gray-500 text-sm font-mono">NO_ACTIVE_KEYS</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invites.map((inv) => {
            const isExpired = new Date(inv.expiresAt) < new Date();
            const isDeleting = deletingId === inv.id;
            
            return (
              <div 
                key={inv.id}
                className={`group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
                  inv.used 
                    ? 'bg-gray-900/20 border-gray-800 opacity-60' 
                    : isExpired 
                      ? 'bg-red-900/5 border-red-900/20' 
                      : 'bg-[#0A0A0A] border-white/10 hover:border-gold/40 hover:shadow-[0_0_15px_rgba(212,175,55,0.05)]'
                }`}
              >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none"></div>

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                     {inv.used ? (
                       <span className="bg-green-500/20 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Đã dùng</span>
                     ) : isExpired ? (
                       <span className="bg-red-500/20 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Hết hạn</span>
                     ) : (
                       <span className="bg-gold/20 text-gold text-[10px] font-bold px-2 py-0.5 rounded uppercase">Có hiệu lực</span>
                     )}
                  </div>
                  <div className="flex gap-1">
                    {!inv.used && !isExpired && (
                      <button
                        onClick={() => copyInviteLink(inv.token)}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                        title="Copy Link"
                      >
                        {copiedToken === inv.token ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    )}
                    <button
                        onClick={() => handleDeleteInvite(inv.id)}
                        disabled={isDeleting}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Delete Invite"
                    >
                        {isDeleting ? (
                            <RotateCcw size={16} className="animate-spin" />
                        ) : (
                            <Trash2 size={16} />
                        )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">Role</span>
                    <span className={`text-xs font-medium ${inv.role === 'staff' ? 'text-purple-400' : 'text-gray-300'}`}>
                      {inv.role.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] uppercase tracking-wider text-gray-500">Created</span>
                     <span className="text-xs text-gray-400">
                       {new Date(inv.createdAt).toLocaleDateString('vi-VN')}
                     </span>
                  </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] uppercase tracking-wider text-gray-500">Expires</span>
                     <span className="text-xs text-gray-400">
                       {new Date(inv.expiresAt).toLocaleDateString('vi-VN')}
                     </span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <code className="block w-full bg-black/50 rounded px-2 py-1 text-[10px] text-gray-500 font-mono truncate">
                    {inv.token}
                  </code>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
