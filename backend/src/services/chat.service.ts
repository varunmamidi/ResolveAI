
import { User, UserRole } from "../models";
import { EscalationStatus } from "../models/Escalation";

import { EscalationRepository } from "../repositories/escalation.repository";
import { ChatRepository } from "../repositories/chat.repository";

function httpError(message: string, statusCode: number) {
  return Object.assign(new Error(message), {
    statusCode
  });
}

export class ChatService {
  static async verifyAccess(
    user: User,
    escalationId: number
  ) {
    const escalation =
      await EscalationRepository.findById(escalationId);

    if (!escalation) {
      throw httpError("Escalation not found", 404);
    }

    const allowed =
      user.role === UserRole.ADMIN ||
      escalation.customerId === user.id ||
      (
        user.role === UserRole.AGENT &&
        escalation.assignedAgentId === user.id
      );

    if (!allowed) {
      throw httpError("Access denied", 403);
    }

    return escalation;
  }

  static async getHistory(
    user: User,
    escalationId: number
  ) {
    await this.verifyAccess(user, escalationId);

    return ChatRepository.findByEscalation(
      escalationId
    );
  }

  static async sendMessage(
    user: User,
    escalationId: number,
    content: string
  ) {
    const escalation =
      await this.verifyAccess(user, escalationId);

    if (escalation.status === EscalationStatus.RESOLVED) {
      throw httpError(
        "Cannot send messages to a resolved escalation",
        409
      );
    }

    if (!escalation.assignedAgentId) {
      throw httpError(
        "Waiting for a support agent to be assigned",
        409
      );
    }

    const trimmed = content.trim();

    if (trimmed.length < 1 || trimmed.length > 2000) {
      throw httpError(
        "Message must contain 1 to 2000 characters",
        400
      );
    }

    return ChatRepository.create({
      escalationId,
      senderId: user.id,
      content: trimmed
    });
  }
}
