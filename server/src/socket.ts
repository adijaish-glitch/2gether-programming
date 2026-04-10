import { type Server as SocketIOServer } from "socket.io";
import { randomUUID } from "crypto";

export type Role = "driver" | "navigator" | null;

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  parentId: string | null;
  content: string;
  language: string;
}

interface RoomState {
  files: FileNode[];
  users: Map<string, string>;
  hostSocketId: string | null;
  roles: Map<string, Role>;
}

const rooms = new Map<string, RoomState>();

function langFromName(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    js: "javascript", ts: "typescript", tsx: "typescript", jsx: "javascript",
    py: "python", java: "java", cpp: "cpp", cc: "cpp", cxx: "cpp",
    c: "c", html: "html", htm: "html", css: "css", rs: "rust",
    go: "go", json: "json", md: "markdown", sh: "shell", rb: "ruby",
    php: "php", kt: "kotlin", swift: "swift", cs: "csharp",
  };
  return map[ext] ?? "plaintext";
}

function makeDefaultFiles(roomId: string): FileNode[] {
  const rootId = randomUUID();
  const indexId = randomUUID();
  return [
    {
      id: rootId,
      name: "project",
      type: "folder",
      parentId: null,
      content: "",
      language: "",
    },
    {
      id: indexId,
      name: "index.js",
      type: "file",
      parentId: rootId,
      content: `// Welcome to 2gether Programming!\n// Room: ${roomId}\n\nconsole.log("Hello, World!");\n`,
      language: "javascript",
    },
  ];
}

function deleteRecursive(files: FileNode[], id: string): FileNode[] {
  const children = files.filter((f) => f.parentId === id);
  let result = files.filter((f) => f.id !== id);
  for (const child of children) {
    result = deleteRecursive(result, child.id);
  }
  return result;
}

function getOrCreateRoom(roomId: string): RoomState {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      files: makeDefaultFiles(roomId),
      users: new Map(),
      hostSocketId: null,
      roles: new Map(),
    });
  }
  return rooms.get(roomId)!;
}

function getRolesPayload(room: RoomState): Record<string, Role> {
  const out: Record<string, Role> = {};
  for (const [username, role] of room.roles.entries()) {
    out[username] = role;
  }
  return out;
}

function getUsersList(room: RoomState): string[] {
  return Array.from(room.users.values());
}

export function setupSocketHandlers(io: SocketIOServer) {
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    let currentRoomId: string | null = null;
    let currentUsername: string | null = null;

    socket.on("join-room", ({ roomId, customUsername }: { roomId: string; customUsername?: string }) => {
      currentRoomId = roomId;
      socket.join(roomId);

      const room = getOrCreateRoom(roomId);
      
      let assignedUsername = customUsername && !Array.from(room.users.values()).includes(customUsername) 
        ? customUsername 
        : null;

      if (!assignedUsername) {
        let baseName = "User";
        let count = room.users.size + 1;
        assignedUsername = `${baseName}${count}`;
        while (Array.from(room.users.values()).includes(assignedUsername)) {
          count++;
          assignedUsername = `${baseName}${count}`;
        }
      }
      
      currentUsername = assignedUsername;
      room.users.set(socket.id, assignedUsername);

      const isHost = room.hostSocketId === null;
      if (isHost) room.hostSocketId = socket.id;
      if (!room.roles.has(assignedUsername)) room.roles.set(assignedUsername, null);

      const firstFile = room.files.find((f) => f.type === "file");

      socket.emit("room-joined", {
        username: assignedUsername,
        usersOnline: room.users.size,
        isHost,
        roles: getRolesPayload(room),
        users: getUsersList(room),
        files: room.files,
        activeFileId: firstFile?.id ?? null,
      });

      socket.to(roomId).emit("user-joined", {
        username: assignedUsername,
        usersOnline: room.users.size,
        users: getUsersList(room),
      });

      io.to(roomId).emit("user-count", { usersOnline: room.users.size });
    });

    socket.on("file-content-change", ({ roomId, fileId, code }: { roomId: string; fileId: string; code: string; }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      const file = room.files.find((f) => f.id === fileId);
      if (file) file.content = code;
      socket.to(roomId).emit("file-content-updated", { fileId, code });
    });

    socket.on("create-item", ({ roomId, parentId, name, type }: { roomId: string; parentId: string | null; name: string; type: "file" | "folder"; }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      let finalName = name;
      let suffix = 1;
      const siblings = room.files.filter((f) => f.parentId === parentId).map((f) => f.name);
      while (siblings.includes(finalName)) {
        const dot = name.lastIndexOf(".");
        finalName = dot > 0
          ? `${name.slice(0, dot)} ${suffix}${name.slice(dot)}`
          : `${name} ${suffix}`;
        suffix++;
      }

      const newItem: FileNode = {
        id: randomUUID(),
        name: finalName,
        type,
        parentId,
        content: type === "file" ? `// ${finalName}\n` : "",
        language: type === "file" ? langFromName(finalName) : "",
      };
      room.files.push(newItem);
      io.to(roomId).emit("fs-updated", { files: room.files, newItemId: newItem.id });
    });

    socket.on("delete-item", ({ roomId, id }: { roomId: string; id: string }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      room.files = deleteRecursive(room.files, id);
      io.to(roomId).emit("fs-updated", { files: room.files, deletedId: id });
    });

    socket.on("rename-item", ({ roomId, id, name }: { roomId: string; id: string; name: string }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      const item = room.files.find((f) => f.id === id);
      if (item) {
        item.name = name;
        if (item.type === "file") item.language = langFromName(name);
      }
      io.to(roomId).emit("fs-updated", { files: room.files });
    });

    socket.on("send-message", ({ roomId, message }: { roomId: string; message: string }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      const senderUsername = room.users.get(socket.id) || "User";
      socket.to(roomId).emit("chat-message", {
        id: Date.now().toString(),
        username: senderUsername,
        message,
        timestamp: Date.now(),
      });
    });

    socket.on("assign-role", ({ roomId, username, role }: { roomId: string; username: string; role: Role }) => {
      const room = rooms.get(roomId);
      if (!room || room.hostSocketId !== socket.id) return;
      if (role === "driver") {
        for (const [uname, existing] of room.roles.entries()) {
          if (existing === role) room.roles.set(uname, null);
        }
      }
      room.roles.set(username, role);
      io.to(roomId).emit("roles-updated", { roles: getRolesPayload(room), users: getUsersList(room) });
    });

    socket.on("update-username", ({ roomId, newName }: { roomId: string; newName: string }) => {
      const room = rooms.get(roomId);
      if (!room || currentUsername === newName) return;
      if (Array.from(room.users.values()).includes(newName)) return; // Name taken

      const oldName = currentUsername!;
      room.users.set(socket.id, newName);
      currentUsername = newName;

      if (room.roles.has(oldName)) {
        const role = room.roles.get(oldName);
        room.roles.delete(oldName);
        if (role) {
          room.roles.set(newName, role);
        }
      }
      
      io.to(roomId).emit("roles-updated", { roles: getRolesPayload(room), users: getUsersList(room) });
    });

    socket.on("disconnect", () => {
      if (!currentRoomId) return;
      const room = rooms.get(currentRoomId);
      if (!room) return;
      room.users.delete(socket.id);
      if (room.hostSocketId === socket.id) {
        const next = room.users.keys().next().value;
        room.hostSocketId = next ?? null;
        if (next) io.to(next).emit("host-transferred", { isHost: true });
      }
      io.to(currentRoomId).emit("user-left", {
        username: currentUsername,
        usersOnline: room.users.size,
        users: getUsersList(room),
      });
      io.to(currentRoomId).emit("user-count", { usersOnline: room.users.size });
      if (room.users.size === 0) {
        setTimeout(() => {
          const r = rooms.get(currentRoomId!);
          if (r && r.users.size === 0) rooms.delete(currentRoomId!);
        }, 5 * 60 * 1000);
      }
    });
  });
}
