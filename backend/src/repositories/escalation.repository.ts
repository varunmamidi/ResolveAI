
import { Op, Transaction } from "sequelize";

import {
  Escalation,
  EscalationStatus
} from "../models/Escalation";

import { Ticket, TicketStatus, TicketPriority } from "../models/Ticket";

export class EscalationRepository {
  static async createWithTicket(data: {
    customerId: number;
    reason: string;
    conversationSummary: string;
  }) {
    const { sequelize } = await import("../config/database");

    return sequelize.transaction(async transaction => {
      const ticket = await Ticket.create(
        {
          title: `Human support: ${data.reason.slice(0, 150)}`,
          description: data.conversationSummary,
          customerId: data.customerId,
          status: TicketStatus.OPEN,
          priority: TicketPriority.MEDIUM,
          assignedAgentId: null
        },
        { transaction }
      );

      const escalation = await Escalation.create(
        {
          ticketId: ticket.id,
          customerId: data.customerId,
          reason: data.reason,
          conversationSummary: data.conversationSummary
        },
        { transaction }
      );

      return escalation;
    });
  }

  static async findById(id: number) {
    return Escalation.findByPk(id, {
      include: [
        {
          model: Ticket,
          as: "ticket"
        }
      ]
    });
  }

  static async findAll(where: object = {}) {
    return Escalation.findAll({
      where: where as any,
      include: [
        {
          model: Ticket,
          as: "ticket"
        }
      ],
      order: [["createdAt", "DESC"]]
    });
  }

  static async assignAgent(
    escalation: Escalation,
    agentId: number
  ) {
    const { sequelize } = await import("../config/database");

    return sequelize.transaction(async transaction => {
      await Ticket.update(
        { assignedAgentId: agentId },
        {
          where: { id: escalation.ticketId },
          transaction
        }
      );

      escalation.assignedAgentId = agentId;
      escalation.status = EscalationStatus.ASSIGNED;

      return escalation.save({ transaction });
    });
  }

  static async updateStatus(
    escalation: Escalation,
    status: EscalationStatus
  ) {
    const { sequelize } = await import("../config/database");

    return sequelize.transaction(async transaction => {
      escalation.status = status;

      const ticketStatus =
        status === EscalationStatus.RESOLVED
          ? TicketStatus.RESOLVED
          : status === EscalationStatus.IN_PROGRESS
            ? TicketStatus.IN_PROGRESS
            : TicketStatus.OPEN;

      await Ticket.update(
        { status: ticketStatus },
        {
          where: { id: escalation.ticketId },
          transaction
        }
      );

      return escalation.save({ transaction });
    });
  }
}
