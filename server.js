// server.js - File này dùng cho cPanel Node.js deployment
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Internal API to trigger socket events from Server Actions
      if (req.method === 'POST' && pathname === '/api/socket/trigger') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const { channel, event, data } = JSON.parse(body);
            if (global.io) {
              global.io.to(channel).emit(event, data);
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true }));
            } else {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: 'Socket.io not initialized' }));
            }
          } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: 'Invalid request' }));
          }
        });
        return;
      }

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Allow all origins for now, strict it in production
      methods: ["GET", "POST"]
    }
  });

  // Store io globally so we can access it in Server Actions
  global.io = io;

  // Helper to count unique users in a room
  const countViewers = async (room) => {
    try {
      const sockets = await io.in(room).fetchSockets();
      const uniqueUsers = new Set();
      
      sockets.forEach(s => {
        // Only count sockets that have a valid userId (either user:ID or guest:ID)
        // If userId is missing, it's likely a temporary connection state or bug, 
        // but we shouldn't count it to avoid double counting or ghost views.
        if (s.data.userId) {
          uniqueUsers.add(s.data.userId);
        }
      });
      
      const count = uniqueUsers.size;
      // Debug log to trace view count issues
      console.log(`[ViewCount] Room: ${room}, Sockets: ${sockets.length}, Unique: ${count}, IDs:`, Array.from(uniqueUsers));
      
      return count;
    } catch (error) {
      console.error(`Error counting viewers in room ${room}:`, error);
      return 0;
    }
  };

  io.on("connection", (socket) => {
    // Get userId from handshake query immediately
    const handshakeUserId = socket.handshake.query.userId;
    if (handshakeUserId) {
      socket.data.userId = handshakeUserId;
    }

    console.log(`Client connected: ${socket.id} (User: ${socket.data.userId || 'unknown'})`);

    socket.on("join_room", async (data) => {
      const room = typeof data === 'string' ? data : data.room;
      const userId = typeof data === 'object' ? data.userId : null;

      await socket.join(room);
      
      // Update userId if provided in payload (redundancy check)
      if (userId) {
          socket.data.userId = userId;
      }
      
      console.log(`Socket ${socket.id} (User: ${socket.data.userId}) joined room ${room}`);
      
      const count = await countViewers(room);
      io.to(room).emit("view_count_update", { count });
    });

    socket.on("get_view_count", async (room) => {
      const count = await countViewers(room);
      socket.emit("view_count_update", { count });
    });

    socket.on("leave_room", async (room) => {
      socket.leave(room);
      console.log(`Socket ${socket.id} left room ${room}`);
      
      const count = await countViewers(room);
      io.to(room).emit("view_count_update", { count });
    });

    socket.on("disconnecting", async () => {
      // Loop through rooms the socket is in
      for (const room of socket.rooms) {
         if (room !== socket.id) {
            // Calculate count after this socket leaves
            try {
              const sockets = await io.in(room).fetchSockets();
              // Filter out the current disconnecting socket
              const activeSockets = sockets.filter(s => s.id !== socket.id);
              
              const uniqueUsers = new Set();
              activeSockets.forEach(s => {
                  if (s.data.userId) {
                      uniqueUsers.add(s.data.userId);
                  }
              });
              const count = uniqueUsers.size;
              console.log(`[ViewCount] Disconnect from ${room}. Remaining: ${count}`);
              io.to(room).emit("view_count_update", { count });
            } catch (error) {
              console.error("Error counting sockets in disconnecting:", error);
            }
         }
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
