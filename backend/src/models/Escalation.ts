
import {
  Model,
  DataTypes,
  Optional
} from "sequelize";

import { sequelize } from "../config/database";

export enum EscalationStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED"
}

interface EscalationAttributes {
  id: number;
  ticketId: number;
  customerId: number;
  assignedAgentId: number | null;
  reason: string;
  conversationSummary: string;
  status: EscalationStatus;
}

type EscalationCreationAttributes = Optional<
  EscalationAttributes,
  "id" | "assignedAgentId" | "status"
>;

export class Escalation
  extends Model<
    EscalationAttributes,
    EscalationCreationAttributes
  >
  implements EscalationAttributes {

  declare id: number;
  declare ticketId: number;
  declare customerId: number;
  declare assignedAgentId: number | null;
  declare reason: string;
  declare conversationSummary: string;
  declare status: EscalationStatus;
}

Escalation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assignedAgentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    conversationSummary: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(EscalationStatus)),
      defaultValue: EscalationStatus.PENDING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "escalations",
    timestamps: true
  }
);
