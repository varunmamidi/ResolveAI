
import {
  DataTypes,
  Model,
  Optional
} from "sequelize";

import { sequelize } from "../config/database";

export enum TicketStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED"
}

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT"
}

interface TicketAttributes {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  customerId: number;
  assignedAgentId: number | null;
}

interface TicketCreationAttributes
  extends Optional<
    TicketAttributes,
    "id" | "status" | "priority" | "assignedAgentId"
  > {}

export class Ticket
  extends Model<TicketAttributes, TicketCreationAttributes>
  implements TicketAttributes {

  declare id: number;
  declare title: string;
  declare description: string;
  declare status: TicketStatus;
  declare priority: TicketPriority;
  declare customerId: number;
  declare assignedAgentId: number | null;
}

Ticket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM(...Object.values(TicketStatus)),
      defaultValue: TicketStatus.OPEN,
      allowNull: false
    },

    priority: {
      type: DataTypes.ENUM(...Object.values(TicketPriority)),
      defaultValue: TicketPriority.MEDIUM,
      allowNull: false
    },

    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    assignedAgentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: "tickets",
    timestamps: true
  }
);
