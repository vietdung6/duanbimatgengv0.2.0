"use client";

import { useState, useEffect } from "react";
import { Calendar, Video, Edit, X } from "lucide-react";
import { IViewingSession } from "@/lib/types/viewing-party";
import { createSession, updateSession } from "@/app/actions/viewing-party";

interface ViewingPartyFormProps {
  initialSession: IViewingSession | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ViewingPartyForm({ initialSession, onSuccess, onCancel }: ViewingPartyFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [title, setTitle] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [startTime, setStartTime] = useState("");

  useEffect(() => {
    if (initialSession) {
      setTitle(initialSession.title);
      setStreamUrl(initialSession.stream_url || "");
      
      const date = new Date(initialSession.start_time);
      const localIsoString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      setStartTime(localIsoString);
    } else {
      // Reset form
      setTitle("");
      setStreamUrl("");
      setStartTime("");
    }
  }, [initialSession]);

  async function handleSubmit(e: React.FormEvent, isInstant: boolean = false) {
    e.preventDefault();
    
    if (!title || !streamUrl) {
        alert("Vui lòng điền tiêu đề và Stream URL!");
        return;
    }

    setIsProcessing(true);
    try {
      if (initialSession) {
        // Update existing session
        const res = await updateSession(
          initialSession.id, 
          title, 
          streamUrl
        );
        
        if (res.success) {
            alert("Đã cập nhật buổi xem!");
            onSuccess();
        } else {
            alert("Lỗi: " + res.error);
        }
      } else {
        // Create new session
        if (!isInstant && !startTime) {
             alert("Vui lòng chọn thời gian bắt đầu hoặc chọn 'Bắt đầu ngay'!");
             setIsProcessing(false);
             return;
        }

        const res = await createSession({
          title,
          stream_url: streamUrl,
          start_time: isInstant ? new Date() : new Date(startTime),
        });

        if (res.success) {
          alert(isInstant ? "Đã bắt đầu phát sóng!" : "Đã lên lịch xem chung!");
          onSuccess();
        } else {
          alert("Lỗi: " + res.error);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="bg-[#111] border border-white/10 rounded-lg p-6 animate-in slide-in-from-top-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">
            {initialSession ? "Chỉnh Sửa Buổi Xem" : "Tạo Buổi Xem Mới"}
        </h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <X size={18} />
        </button>
      </div>
      
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Tiêu đề
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-gold focus:outline-none"
            placeholder="VD: Gen.G vs T1 - LCK Spring 2025"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Stream URL (YouTube/Twitch)
          </label>
          <input
            type="text"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-gold focus:outline-none"
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Thời gian bắt đầu (để trống nếu muốn bắt đầu ngay)
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-gold focus:outline-none"
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white"
          >
            Hủy
          </button>

          {initialSession ? (
              <button
                type="submit"
                disabled={isProcessing}
                className="bg-blue-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Edit size={14} />
                {isProcessing ? "Đang lưu..." : "Lưu Thay Đổi"}
              </button>
          ) : (
              <>
                <button
                    type="submit"
                    disabled={isProcessing || !startTime}
                    className="bg-gold text-black px-4 py-2 rounded text-xs font-bold hover:bg-yellow-500 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Calendar size={14} />
                    {isProcessing ? "Đang xử lý..." : "Lên lịch"}
                </button>

                <button
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={isProcessing || (!title || !streamUrl)}
                    className="bg-red-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                    <Video size={14} />
                    {isProcessing ? "Đang xử lý..." : "Bắt đầu ngay"}
                </button>
              </>
          )}
        </div>
      </form>
    </div>
  );
}
