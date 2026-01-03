"use client";

import { useState, useEffect } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { IViewingSession } from "@/lib/types/viewing-party";
import { endSession, fetchSessions, deleteSession } from "@/app/actions/viewing-party";
import ViewingPartyForm from "./viewing-party/ViewingPartyForm";
import ViewingPartyList from "./viewing-party/ViewingPartyList";

export default function ViewingPartyManagementTab() {
  const [sessions, setSessions] = useState<IViewingSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<IViewingSession | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    setLoading(true);
    try {
      const res = await fetchSessions();
      if (res.success && res.data) {
        setSessions(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function startCreating() {
    setEditingSession(null);
    setShowForm(true);
  }

  function startEditing(session: IViewingSession) {
    setEditingSession(session);
    setShowForm(true);
  }

  function handleFormSuccess() {
    loadSessions();
    setShowForm(false);
    setEditingSession(null);
  }

  function handleFormCancel() {
    setShowForm(false);
    setEditingSession(null);
  }

  async function handleEndSession(id: number) {
    if (!confirm("Bạn có chắc chắn muốn kết thúc buổi xem này?")) return;

    try {
      const res = await endSession(id);
      if (res.success) {
        loadSessions();
      } else {
        alert("Lỗi: " + res.error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteSession(id: number) {
    if (!confirm("Bạn có chắc chắn muốn xóa buổi xem này không? Hành động này không thể hoàn tác.")) {
      return;
    }

    try {
      const res = await deleteSession(id);
      if (res.success) {
        await loadSessions();
      } else {
        alert("Lỗi khi xóa: " + res.error);
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi");
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl text-gold">Quản lý Viewing Party</h2>
          <p className="text-xs text-gray-400 mt-1">
            Tạo và quản lý các buổi xem chung (Live Viewing).
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadSessions}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCcw size={18} />
          </button>
          <button
            onClick={startCreating}
            className="btn-gold text-xs px-4 py-2 flex items-center gap-2"
          >
            <Plus size={14} />
            Tạo Buổi Xem
          </button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <ViewingPartyForm
            initialSession={editingSession}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
        />
      )}

      {/* Session List */}
      <ViewingPartyList
        sessions={sessions}
        loading={loading}
        onEdit={startEditing}
        onEndSession={handleEndSession}
        onDeleteSession={handleDeleteSession}
      />
    </div>
  );
}
