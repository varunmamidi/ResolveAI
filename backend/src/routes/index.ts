
import { Router } from "express";

import authRoutes from "./auth.routes";
import ticketRoutes from "./ticket.routes";
import knowledgeRoutes from "./knowledge.routes";
import aiRoutes from "./ai.routes";
import escalationRoutes from "./escalation.routes";
import chatRoutes from "./chat.routes";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ResolveAI API is running",
    timestamp: new Date().toISOString()
  });
});

router.use("/auth", authRoutes);
router.use("/tickets", ticketRoutes);
router.use("/knowledge", knowledgeRoutes);
router.use("/ai", aiRoutes);
router.use("/escalations", escalationRoutes);
router.use("/chat", chatRoutes);

export default router;
