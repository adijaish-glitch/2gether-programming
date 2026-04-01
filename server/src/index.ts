import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { setupSocketHandlers } from "./socket.js";
import { roomsRouter } from "./routes/rooms.js";
import { runCodeRouter } from "./routes/run-code.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

app.use("/api", roomsRouter);
app.use("/api", runCodeRouter);

// Serve static frontend files for deployment
app.use(express.static(path.join(__dirname, "../../client/dist")));

// Fallback for React Router
app.get("*", (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

setupSocketHandlers(io);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
