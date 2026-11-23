
import { User, UserRole } from "../models";
import { Ticket } from "../models/Ticket";
import {
  TicketStatus,
  TicketPriority
} from "../models/Ticket";

import { TicketRepository } from "../repositories/ticket.repository";

const httpError = (message: string, statusCode: number) =>
  Object.assign(new Error(message), { statusCode });

export class TicketService {

  static async createTicket(
    user: User,
    data: {
      title: string;
      description: string;
    }
  ) {
    return TicketRepository.create({
      ...data,
      customerId: user.id
    });
  }

  static async getTickets(user: User) {
    if (user.role === UserRole.ADMIN) {
      return TicketRepository.findAll();
    }

    if (user.role === UserRole.AGENT) {
      return TicketRepository.findAll({
        assignedAgentId: user.id
      });
    }

    return TicketRepository.findAll({
      customerId: user.id
    });
  }

  static async getTicketById(
    user: User,
    ticketId: number
  ) {
    const ticket =
      await TicketRepository.findById(ticketId);

    if (!ticket) {
      throw httpError("Ticket not found", 404);
    }

    const allowed =
      user.role === UserRole.ADMIN ||
      (
        user.role === UserRole.AGENT &&
        ticket.assignedAgentId === user.id
      ) ||
      (
        user.role === UserRole.CUSTOMER &&
        ticket.customerId === user.id
      );

    if (!allowed) {
      throw httpError("Access denied", 403);
    }

    return ticket;
  }

  static async updateStatus(
    user: User,
    ticketId: number,
    status: TicketStatus
  ) {
    if (
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.AGENT
    ) {
      throw httpError("Access denied", 403);
    }

    const ticket =
      await this.getTicketById(user, ticketId);

    return TicketRepository.updateStatus(ticket, status);
  }

  static async updatePriority(
    user: User,
    ticketId: number,
    priority: TicketPriority
  ) {
    if (
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.AGENT
    ) {
      throw httpError("Access denied", 403);
    }

    const ticket =
      await this.getTicketById(user, ticketId);

    return TicketRepository.updatePriority(
      ticket,
      priority
    );
  }

  static async assignAgent(
    user: User,
    ticketId: number,
    agentId: number
  ) {
    if (user.role !== UserRole.ADMIN) {
      throw httpError(
        "Only admins can assign tickets",
        403
      );
    }

    const ticket =
      await this.getTicketById(user, ticketId);

    const agent = await User.findByPk(agentId);

    if (!agent || agent.role !== UserRole.AGENT) {
      throw httpError(
        "Valid support agent not found",
        400
      );
    }

    return TicketRepository.assignAgent(
      ticket,
      agentId
    );
  }
}
