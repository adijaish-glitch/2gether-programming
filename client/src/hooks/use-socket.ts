import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

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
  const [code, setCode] = useState("// Write your code here...\nconsole.log('Hello, 2gether Programming!');");
  const [username, setUsername] = useState("Developer");

  const socketRef = useRef<Socket | null>(null);

  const addSystemMessage = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(), username: "System", message: text, timestamp: Date.now() },
    ]);
  }, []);

  useEffect(() => {
    // In development, Vite proxies /socket.io to the Express server
    const socket = io(window.location.origin, {
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join-room", { roomId });
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on("room-joined", (data: { username: string; usersOnline: number; code?: string }) => {
      setUsername(data.username);
      setUsersOnline(data.usersOnline);
      if (data.code) setCode(data.code);
    });

    socket.on("user-joined", (data: { username: string; usersOnline: number }) => {
      setUsersOnline(data.usersOnline);
      addSystemMessage(`${data.username} joined the room.`);
    });

    socket.on("user-left", (data: { username: string; usersOnline: number }) => {
      setUsersOnline(data.usersOnline);
      addSystemMessage(`${data.username} left the room.`);
    });

    socket.on("user-count", (data: { usersOnline: number }) => setUsersOnline(data.usersOnline));

    socket.on("code-update", (data: { code: string }) => setCode(data.code));

    socket.on("chat-message", (msg: ChatMessage) =>
      setMessages((prev) => [...prev, msg])
    );

    return () => { socket.disconnect(); };
  }, [roomId, addSystemMessage]);

  const sendCodeUpdate = useCallback((newCode: string) => {
    setCode(newCode);
    if (socketRef.current?.connected) {
      socketRef.current.emit("code-change", { roomId, code: newCode });
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

  return { isConnected, usersOnline, username, code, messages, sendCodeUpdate, sendMessage };
}
