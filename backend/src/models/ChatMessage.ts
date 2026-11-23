
import {
  Model,
  DataTypes,
  Optional
} from "sequelize";

import { sequelize } from "../config/database";

interface ChatMessageAttributes {
  id: number;
  escalationId: number;
  senderId: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type ChatMessageCreationAttributes = Optional<
  ChatMessageAttributes,
  "id"
>;

export class ChatMessage
  extends Model<
    ChatMessageAttributes,
    ChatMessageCreationAttributes
  >
  implements ChatMessageAttributes {

  declare id: number;
  declare escalationId: number;
  declare senderId: number;
  declare content: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ChatMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    escalationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "chat_messages",
    timestamps: true,
    indexes: [
      {
        fields: ["escalationId", "createdAt"]
      }
    ]
  }
);
