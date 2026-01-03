"use client";

import { Video, Calendar, ExternalLink, Edit, Trash2 } from "lucide-react";
import { IViewingSession } from "@/lib/types/viewing-party";
import Link from "next/link";
import { obfuscateId } from "@/lib/viewing-party/obfuscation";

interface ViewingPartyListProps {
  sessions: IViewingSession[];
  loading: boolean;
  onEdit: (session: IViewingSession) => void;
  onEndSession: (id: number) => void;
  onDeleteSession: (id: number) => void;
}

export default function ViewingPartyList({
  sessions,
  loading,
  onEdit,
  onEndSession,
  onDeleteSession
}: ViewingPartyListProps) {

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Đang tải...</div>;
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed border-white/10 rounded-lg text-gray-500">
        Chưa có buổi xem chung nào.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="bg-[#111] border border-white/10 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-white/20 transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded bg-black flex items-center justify-center border border-white/10 flex-shrink-0">
              <Video size={20} className="text-gray-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white">{session.title}</h4>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${session.status === "live"
                    ? "bg-red-500/20 text-red-400"
                    : session.status === "scheduled"
                      ? "bg-gold/20 text-gold"
                      : "bg-gray-800 text-gray-400"
                    }`}
                >
                  {session.status.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <Calendar size={12} />
                  {new Date(session.start_time).toLocaleString("vi-VN")}
                </div>
                <div className="text-xs text-blue-400 flex items-center gap-2 truncate max-w-[300px]" title={session.stream_url}>
                  <ExternalLink size={12} />
                  {session.stream_url}
                </div>

                <Link
                  href={`/fan-zone/viewing-party/${obfuscateId(session.id)}`}
                  target="_blank"
                  className="text-xs text-gold hover:underline flex items-center gap-2"
                >
                  <Video size={12} />
                  Xem phòng (Preview)
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => onEdit(session)}
              className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
              title="Chỉnh sửa"
            >
              <Edit size={18} />
            </button>

            <Link
              href={`/fan-zone/viewing-party/${obfuscateId(session.id)}`}
              target="_blank"
              className="p-2 text-gray-400 hover:text-gold transition-colors"
              title="Mở trang xem"
            >
              <ExternalLink size={18} />
            </Link>

            {session.status !== "ended" && (
              <button
                onClick={() => onEndSession(session.id)}
                className="px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded text-xs transition-colors ml-auto md:ml-0"
              >
                Kết thúc
              </button>
            )}

            <button
              onClick={() => onDeleteSession(session.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Xóa buổi xem"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
