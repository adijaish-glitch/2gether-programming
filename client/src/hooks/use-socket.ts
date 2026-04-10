import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export type Role = "driver" | "navigator" | null;

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  parentId: string | null;
  content: string;
  language: string;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: number;
}

export function useSocket(roomId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [usersOnline, setUsersOnline] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [files, setFiles] = useState<FileNode[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const [username, setUsername] = useState(() => localStorage.getItem("2gether-username") || "Developer");
  const [isHost, setIsHost] = useState(false);
  const [roles, setRoles] = useState<Record<string, Role>>({});
  const [users, setUsers] = useState<string[]>([]);

  const socketRef = useRef<Socket | null>(null);

  const addSystemMessage = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(), username: "System", message: text, timestamp: Date.now() },
    ]);
  }, []);

  useEffect(() => {
    const socket = io(window.location.origin, {
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      const customUsername = localStorage.getItem("2gether-username");
      socket.emit("join-room", { roomId, customUsername });
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on("room-joined", (data: {
      username: string;
      usersOnline: number;
      isHost?: boolean;
      roles?: Record<string, Role>;
      users?: string[];
      files?: FileNode[];
      activeFileId?: string | null;
    }) => {
      if (data.username && !localStorage.getItem("2gether-username")) {
        setUsername(data.username);
      } else if (data.username && localStorage.getItem("2gether-username")) {
        setUsername(localStorage.getItem("2gether-username")!);
      }
      setUsersOnline(data.usersOnline);
      if (data.isHost !== undefined) setIsHost(data.isHost);
      if (data.roles) setRoles(data.roles);
      if (data.users) setUsers(data.users);
      if (data.files) setFiles(data.files);
      if (data.activeFileId) setActiveFileId(data.activeFileId);
    });

    socket.on("user-joined", (data: { username: string; usersOnline: number; users?: string[] }) => {
      setUsersOnline(data.usersOnline);
      if (data.users) setUsers(data.users);
      addSystemMessage(`${data.username} joined the room.`);
    });

    socket.on("user-left", (data: { username: string; usersOnline: number; users?: string[] }) => {
      setUsersOnline(data.usersOnline);
      if (data.users) setUsers(data.users);
      addSystemMessage(`${data.username} left the room.`);
    });

    socket.on("user-count", (data: { usersOnline: number }) => setUsersOnline(data.usersOnline));

    socket.on("file-content-updated", (data: { fileId: string; code: string }) => {
      if (!data?.fileId) return;
      setFiles((prev) =>
        prev.map((f) => (f.id === data.fileId ? { ...f, content: data.code ?? "" } : f))
      );
    });

    socket.on("fs-updated", (data: { files: FileNode[]; newItemId?: string; deletedId?: string }) => {
      if (!Array.isArray(data?.files)) return;
      setFiles(data.files);
      if (data.deletedId) {
        setActiveFileId((current) => {
          if (current === data.deletedId) {
            const first = data.files.find((f) => f.type === "file");
            return first?.id ?? null;
          }
          return current;
        });
      }
      if (data.newItemId) {
        const newItem = data.files.find((f) => f.id === data.newItemId);
        if (newItem?.type === "file") setActiveFileId(data.newItemId);
      }
    });

    socket.on("chat-message", (msg: ChatMessage) =>
      setMessages((prev) => [...prev, msg])
    );

    socket.on("roles-updated", (data: { roles: Record<string, Role>; users: string[] }) => {
      if (data.roles) setRoles(data.roles);
      if (data.users) setUsers(data.users);
    });

    socket.on("host-transferred", (data: { isHost: boolean }) => {
      setIsHost(data.isHost);
      if (data.isHost) {
        addSystemMessage("You are now the host of this room.");
      }
    });

    return () => { socket.disconnect(); };
  }, [roomId, addSystemMessage]);

  const sendFileContentUpdate = useCallback((fileId: string, code: string) => {
    if (!fileId) return;
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, content: code } : f))
    );
    if (socketRef.current?.connected) {
      socketRef.current.emit("file-content-change", { roomId, fileId, code });
    }
  }, [roomId]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: Math.random().toString(),
      username,
      message: text.trim(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
    if (socketRef.current?.connected) {
      socketRef.current.emit("send-message", { roomId, message: text.trim() });
    }
  }, [roomId, username]);

  const assignRole = useCallback((targetUsername: string, role: Role) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("assign-role", { roomId, username: targetUsername, role });
    }
  }, [roomId]);

  const createItem = useCallback((parentId: string | null, name: string, type: "file" | "folder") => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("create-item", { roomId, parentId, name, type });
    }
  }, [roomId]);

  const deleteItem = useCallback((id: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("delete-item", { roomId, id });
    }
  }, [roomId]);

  const renameItem = useCallback((id: string, name: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("rename-item", { roomId, id, name });
    }
  }, [roomId]);

  const selectFile = useCallback((id: string) => {
    setActiveFileId(id);
  }, []);

  const changeUsername = useCallback((newName: string) => {
    localStorage.setItem("2gether-username", newName);
    setUsername(newName);
    if (socketRef.current?.connected) {
      socketRef.current.emit("update-username", { roomId, newName });
    }
  }, [roomId]);

  return { 
    isConnected, 
    usersOnline, 
    username, 
    files,
    activeFileId,
    messages, 
    isHost,
    roles,
    users,
    myRole: roles[username] ?? null,
    sendFileContentUpdate,
    sendMessage,
    assignRole,
    createItem,
    deleteItem,
    renameItem,
    selectFile,
    changeUsername,
  };
}
