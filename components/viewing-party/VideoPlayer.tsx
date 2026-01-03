"use client";

import { useEffect, useState } from "react";
import { IViewingSession, EVENTS } from "@/lib/types/viewing-party";
import { io } from "socket.io-client";
import { Maximize, Minimize, Settings, Eye, EyeOff } from "lucide-react";
import VideoEmbed from "./player/VideoEmbed";
import VideoStatusOverlay from "./player/VideoStatusOverlay";
import ViewCounter from "./ViewCounter";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface VideoPlayerProps {
  url: string;
  status: IViewingSession["status"];
  title: string;
  sessionId: number;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isHeaderVisible?: boolean;
}

export default function VideoPlayer({ 
  url: initialUrl, 
  status: initialStatus, 
  title: initialTitle, 
  sessionId,
  isFullscreen = false,
  onToggleFullscreen,
  isHeaderVisible = true
}: VideoPlayerProps) {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [url, setUrl] = useState(initialUrl);
  const [showControls, setShowControls] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    setIsMounted(true);
    setStatus(initialStatus);
    setUrl(initialUrl);
    setTitle(initialTitle);
  }, [initialStatus, initialUrl, initialTitle]);

  useEffect(() => {
    const socket = io();

    socket.on("connect", () => {
      socket.emit("join_room", `session-${sessionId}`);
    });

    socket.on(EVENTS.SESSION_UPDATE, (data: Partial<IViewingSession>) => {
      if (data.status) setStatus(data.status);
      if (data.stream_url) setUrl(data.stream_url);
      if (data.title) setTitle(data.title);
    });

    return () => {
      socket.emit("leave_room", `session-${sessionId}`);
      socket.disconnect();
    };
  }, [sessionId]);

  if (!isMounted) {
    return <div className="w-full h-full bg-black/90 animate-pulse" />;
  }

  return (
    <div className="w-full h-full relative bg-black group flex items-center justify-center">
      {/* View Counter Overlay - Only when header is hidden */}
      {!isHeaderVisible && (
        <div className="absolute top-4 left-4 z-50 animate-in fade-in slide-in-from-top-2 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold/20 shadow-lg flex items-center">
            <ViewCounter />
          </div>
        </div>
      )}

      {/* Native Controls Toggle */}
      {status === "live" && (
        <button
          onClick={() => setShowControls(!showControls)}
          className="absolute bottom-6 left-6 z-50 p-3 bg-black/50 hover:bg-gold/20 text-gold rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-gold/20"
          title={showControls ? t.viewingParty.controls.hideControls : t.viewingParty.controls.showControls}
        >
          {showControls ? <EyeOff size={24} /> : <Settings size={24} />}
        </button>
      )}

      {onToggleFullscreen && (
        <button
          onClick={onToggleFullscreen}
          className="absolute bottom-6 right-6 z-50 p-3 bg-black/50 hover:bg-gold/20 text-gold rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-gold/20"
          title={isFullscreen ? t.viewingParty.controls.exitFullscreen : t.viewingParty.controls.enterFullscreen}
        >
          {isFullscreen ? <Minimize size={28} /> : <Maximize size={28} />}
        </button>
      )}
      <div className="w-full max-w-full max-h-full aspect-video relative">
        {status === "live" ? (
          <VideoEmbed url={url} showControls={showControls} />
        ) : (
          <VideoStatusOverlay status={status} />
        )}
      </div>
    </div>
  );
}
