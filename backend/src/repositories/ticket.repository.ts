
import { Ticket, User } from "../models";
import { WhereOptions } from "sequelize";
import {
  TicketStatus,
  TicketPriority
} from "../models/Ticket";

export class TicketRepository {

  static async create(data: {
    title: string;
    description: string;
    customerId: number;
  }) {
    return Ticket.create(data);
  }

  static async findById(id: number) {
    return Ticket.findByPk(id, {
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["id", "name", "email"]
        },
        {
          model: User,
          as: "assignedAgent",
          attributes: ["id", "name", "email"]
        }
      ]
    });
  }

  static async findAll(
  where: WhereOptions<Ticket> = {}
) {
  return Ticket.findAll({
    where,
    include: [
      {
        model: User,
        as: "customer",
        attributes: ["id", "name", "email"]
      },
      {
        model: User,
        as: "assignedAgent",
        attributes: ["id", "name", "email"]
      }
    ],
    order: [["createdAt", "DESC"]]
  });
}

  static async updateStatus(
    ticket: Ticket,
    status: TicketStatus
  ) {
    ticket.status = status;
    await ticket.save();
    return ticket;
  }

  static async updatePriority(
    ticket: Ticket,
    priority: TicketPriority
  ) {
    ticket.priority = priority;
    await ticket.save();
    return ticket;
  }

  static async assignAgent(
    ticket: Ticket,
    agentId: number
  ) {
    ticket.assignedAgentId = agentId;
    await ticket.save();
    return ticket;
  }
}
