
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";

import app from "./app";
import { connectDB, sequelize } from "./config/database";
import "./models";

import { initializeChatSocket } from "./sockets/chat.socket";

const PORT = Number(process.env.PORT || 5000);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

initializeChatSocket(io);

async function startServer() {
  try {
    await connectDB();

    await sequelize.sync();

    console.log("Database synchronized");

    httpServer.listen(PORT, () => {
      console.log(
        `ResolveAI running at http://localhost:${PORT}`
      );
      console.log("Socket.IO initialized");
    });
  } catch (error) {
    console.error("Failed to start ResolveAI:", error);
    process.exit(1);
  }
}

startServer();
