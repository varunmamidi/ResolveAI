
import { Server, Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import { z } from "zod";

import { User } from "../models";
import { ChatService } from "../services/chat.service";

const joinSchema = z.object({
  escalationId: z.number().int().positive()
});

const messageSchema = z.object({
  escalationId: z.number().int().positive(),
  content: z.string().trim().min(1).max(2000)
});

type SocketAck = (
  result: {
    success: boolean;
    message?: string;
    data?: unknown;
  }
) => void;

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Unexpected error";
}

export function initializeChatSocket(io: Server) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (typeof token !== "string" || !token) {
        return next(new Error("Authentication required"));
      }

      const secret = process.env.JWT_SECRET;

      if (!secret) {
        return next(new Error("Server configuration error"));
      }

      const decoded = jwt.verify(
        token,
        secret
      ) as JwtPayload;

      const userId = Number(decoded.sub);

      if (!Number.isSafeInteger(userId) || userId <= 0) {
        return next(new Error("Invalid token"));
      }

      const user = await User.findByPk(userId);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.data.user = user;

      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user as User;

    console.log(`Socket connected: user ${user.id}`);

    socket.on(
      "join_escalation",
      async (payload: unknown, ack?: SocketAck) => {
        try {
          const { escalationId } =
            joinSchema.parse(payload);

          await ChatService.verifyAccess(
            user,
            escalationId
          );

          const room = `escalation:${escalationId}`;

          await socket.join(room);

          ack?.({
            success: true,
            message: "Joined escalation room"
          });
        } catch (error) {
          ack?.({
            success: false,
            message: getErrorMessage(error)
          });
        }
      }
    );

    socket.on(
      "send_message",
      async (payload: unknown, ack?: SocketAck) => {
        try {
          const { escalationId, content } =
            messageSchema.parse(payload);

          const message = await ChatService.sendMessage(
            user,
            escalationId,
            content
          );

          const room = `escalation:${escalationId}`;

          // Broadcast only to currently authorized members.
          // Recheck access because assignments can change.
          const members = await io.in(room).fetchSockets();

          for (const member of members) {
            const memberUser = member.data.user as User;

            try {
              await ChatService.verifyAccess(
                memberUser,
                escalationId
              );

              io.to(member.id).emit(
                "new_message",
                message.toJSON()
              );
            } catch {
              member.leave(room);
            }
          }

          ack?.({
            success: true,
            data: message.toJSON()
          });
        } catch (error) {
          ack?.({
            success: false,
            message: getErrorMessage(error)
          });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: user ${user.id}`);
    });
  });
}
