import { Server } from "socket.io";

declare global {
  var io: Server | undefined;
}

export const socketServer = {
  trigger: async (channel: string, event: string, data: any) => {
    console.log(`[SocketServer] Triggering event '${event}' on channel '${channel}'`);
    
    // 1. Try direct access (if in same process)
    if (global.io) {
      global.io.to(channel).emit(event, data);
      console.log(`[SocketServer] Event emitted successfully via global.io.`);
      return;
    }

    // 2. Fallback to internal HTTP API (if in different process/worker)
    try {
      const port = process.env.PORT || 3000;
      const url = `http://localhost:${port}/api/socket/trigger`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channel, event, data }),
        cache: 'no-store'
      });

      if (!response.ok) {
        console.error(`[SocketServer] Failed to emit via API: ${response.statusText}`);
      } else {
        console.log(`[SocketServer] Event emitted successfully via Internal API.`);
      }
    } catch (error) {
      console.error("[SocketServer] ERROR: Failed to trigger socket event.", error);
    }
  }
};
