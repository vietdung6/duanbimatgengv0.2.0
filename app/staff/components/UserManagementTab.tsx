"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Shield, RotateCcw, Search } from "lucide-react";
import type { AuthUser } from "@/lib/auth";
import type { InviteToken } from "../types";
import { 
  getUsers, 
  createUser, 
  deleteUser, 
  resetMonthlyPoints, 
  getInvites, 
  createInvite,
  deleteInvite,
  CreateUserInput
} from "@/lib/api/staff";
import UserList from "./users/UserList";
import UserForm from "./users/UserForm";
import InviteManagement from "./users/InviteManagement";

interface UserManagementTabProps {
  currentUser?: AuthUser | null;
}

export default function UserManagementTab({ currentUser }: UserManagementTabProps) {
  // Data State
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [invites, setInvites] = useState<InviteToken[]>([]);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [loadingInvites, setLoadingInvites] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Initial Data Load
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setLoadingInvites(true);
    try {
      const [usersData, invitesData] = await Promise.all([
        getUsers(),
        getInvites()
      ]);
      setUsers(usersData);
      setInvites(invitesData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      setError(msg);
    } finally {
      setLoading(false);
      setLoadingInvites(false);
    }
  }

  async function handleCreateUser(data: CreateUserInput) {
    try {
      const newUser = await createUser(data);
      setUsers((prev) => [newUser, ...prev]);
      setShowCreateForm(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Có lỗi khi tạo user";
      throw new Error(msg);
    }
  }

  async function handleDeleteUser(id: number) {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setError("Không thể xoá user");
    }
  }

  async function handleResetPoints() {
    if (!confirm("Bạn có chắc muốn reset điểm tháng của tất cả user về 0? Hành động này không thể hoàn tác.")) return;
    setResetting(true);
    try {
      await resetMonthlyPoints();
      // Reload users to update points
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
    } catch {
      setError("Không thể reset điểm");
    } finally {
      setResetting(false);
    }
  }

  async function handleCreateInvite(role: "fan" | "staff") {
    try {
      const newInvite = await createInvite(role);
      setInvites((prev) => [newInvite, ...prev]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không thể tạo invite";
      setError(msg);
    }
  }

  async function handleDeleteInvite(id: number) {
    try {
      await deleteInvite(id);
      setInvites((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không thể xoá invite";
      setError(msg);
    }
  }

  // Filtering
  const filteredUsers = users.filter(u => {
    const searchLower = searchTerm.toLowerCase();
    return (
      u.email.toLowerCase().includes(searchLower) ||
      (u.username && u.username.toLowerCase().includes(searchLower)) ||
      (u.displayName && u.displayName.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Error Display */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3 text-red-400 text-sm">
          <Shield size={16} />
          {error}
        </div>
      )}

      {/* SECTION: USER MANAGEMENT */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="font-heading text-2xl text-white flex items-center gap-3 uppercase tracking-wide">
            <span className="w-8 h-8 rounded bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
              <Users size={18} />
            </span>
            <span className="text-gradient-gold">User Roster</span>
          </h2>
          <button
            onClick={handleResetPoints}
            disabled={resetting}
            className="group px-4 py-2 rounded-lg border border-red-500/30 hover:border-red-500/60 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <RotateCcw size={14} className={`group-hover:-rotate-180 transition-transform duration-500 ${resetting ? "animate-spin" : ""}`} />
            {resetting ? "Resetting..." : "Reset Monthly Points"}
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search by username, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-200 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-all placeholder:text-gray-600"
            />
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-gold text-xs px-5 py-2.5 flex items-center gap-2 uppercase tracking-wider shadow-gold-glow hover:shadow-gold-glow-lg transform hover:-translate-y-0.5 transition-all"
          >
            <Plus size={16} strokeWidth={3} />
            Add Member
          </button>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <div className="relative z-20 bg-black/90 border border-gold/20 rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <UserForm 
              onSave={handleCreateUser}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {/* User List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
             <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
             <p className="text-xs uppercase tracking-widest font-medium">Loading Roster Data...</p>
          </div>
        ) : (
          <UserList 
            users={filteredUsers}
            onDelete={handleDeleteUser}
          />
        )}
      </div>

      {/* SECTION: INVITE MANAGEMENT */}
      <InviteManagement 
        invites={invites} 
        loading={loadingInvites} 
        onCreate={handleCreateInvite}
        onDelete={handleDeleteInvite}
        currentUser={currentUser}
      />
    </div>
  );
}
