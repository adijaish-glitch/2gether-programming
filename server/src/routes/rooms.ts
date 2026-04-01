import { Router } from "express";

export const roomsRouter = Router();

const roomRegistry = new Map<string, { roomId: string; createdAt: string }>();

roomsRouter.post("/rooms", (req, res) => {
  let roomId = req.body?.roomId;
  if (!roomId) {
    roomId = Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  if (!roomRegistry.has(roomId)) {
    roomRegistry.set(roomId, { roomId, createdAt: new Date().toISOString() });
  }
  res.json({ ...roomRegistry.get(roomId)!, userCount: 0 });
});

roomsRouter.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  if (!roomRegistry.has(roomId)) {
    roomRegistry.set(roomId, { roomId, createdAt: new Date().toISOString() });
  }
  res.json({ ...roomRegistry.get(roomId)!, userCount: 0 });
});
