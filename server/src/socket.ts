import { type Server as SocketIOServer } from "socket.io";

interface RoomState {
  code: string;
  users: Map<string, string>;
}

const rooms = new Map<string, RoomState>();

function getOrCreateRoom(roomId: string): RoomState {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      code: `// Welcome to 2gether Programming!\n// Room: ${roomId}\n// Start coding together...\n\nconsole.log("Hello, World!");\n`,
      users: new Map(),
    });
  }
  return rooms.get(roomId)!;
}

export function setupSocketHandlers(io: SocketIOServer) {
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    let currentRoomId: string | null = null;
    let currentUsername: string | null = null;

    socket.on("join-room", ({ roomId }: { roomId: string }) => {
      currentRoomId = roomId;
      socket.join(roomId);

      const room = getOrCreateRoom(roomId);
      const assignedUsername = room.users.size === 0 ? "User1" : "User2";
      currentUsername = assignedUsername;
      room.users.set(socket.id, assignedUsername);

      socket.emit("room-joined", {
        username: assignedUsername,
        usersOnline: room.users.size,
        code: room.code,
      });

      socket.to(roomId).emit("user-joined", {
        username: assignedUsername,
        usersOnline: room.users.size,
      });

      io.to(roomId).emit("user-count", { usersOnline: room.users.size });
      console.log(`${assignedUsername} joined room ${roomId}`);
    });

    socket.on("code-change", ({ roomId, code }: { roomId: string; code: string }) => {
      const room = rooms.get(roomId);
      if (room) {
        room.code = code;
        socket.to(roomId).emit("code-update", { code });
      }
    });

    socket.on("send-message", ({ roomId, message }: { roomId: string; message: string }) => {
      const room = rooms.get(roomId);
      const username = room?.users.get(socket.id) || "User";
      const chatMessage = {
        id: Date.now().toString(),
        username,
        message,
        timestamp: Date.now(),
      };
      socket.to(roomId).emit("chat-message", chatMessage);
    });

    socket.on("disconnect", () => {
      if (currentRoomId) {
        const room = rooms.get(currentRoomId);
        if (room) {
          room.users.delete(socket.id);
          io.to(currentRoomId).emit("user-left", {
            username: currentUsername,
            usersOnline: room.users.size,
          });
          io.to(currentRoomId).emit("user-count", { usersOnline: room.users.size });
          if (room.users.size === 0) {
            setTimeout(() => {
              const r = rooms.get(currentRoomId!);
              if (r && r.users.size === 0) rooms.delete(currentRoomId!);
            }, 5 * 60 * 1000);
          }
        }
      }
    });
  });
}
