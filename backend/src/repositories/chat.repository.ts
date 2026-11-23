
import { ChatMessage } from "../models/ChatMessage";

export class ChatRepository {
  static async create(data: {
    escalationId: number;
    senderId: number;
    content: string;
  }) {
    return ChatMessage.create(data);
  }

  static async findByEscalation(
    escalationId: number
  ) {
    return ChatMessage.findAll({
      where: { escalationId },
      order: [["createdAt", "ASC"]],
      limit: 100
    });
  }
}
