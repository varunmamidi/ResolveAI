
import { User, UserRole } from "../models";
import {
  EscalationStatus
} from "../models/Escalation";

import { EscalationRepository } from "../repositories/escalation.repository";

const httpError = (message: string, statusCode: number) =>
  Object.assign(new Error(message), { statusCode });

export class EscalationService {
  static async create(
    user: User,
    data: {
      reason: string;
      conversationSummary: string;
    }
  ) {
    return EscalationRepository.createWithTicket({
      customerId: user.id,
      reason: data.reason,
      conversationSummary: data.conversationSummary
    });
  }

  static async getAll(user: User) {
    if (user.role === UserRole.ADMIN) {
      return EscalationRepository.findAll();
    }

    if (user.role === UserRole.AGENT) {
      return EscalationRepository.findAll({
        assignedAgentId: user.id
      });
    }

    return EscalationRepository.findAll({
      customerId: user.id
    });
  }

  static async getById(user: User, id: number) {
    const escalation =
      await EscalationRepository.findById(id);

    if (!escalation) {
      throw httpError("Escalation not found", 404);
    }

    const allowed =
      user.role === UserRole.ADMIN ||
      (
        user.role === UserRole.AGENT &&
        escalation.assignedAgentId === user.id
      ) ||
      (
        user.role === UserRole.CUSTOMER &&
        escalation.customerId === user.id
      );

    if (!allowed) {
      throw httpError("Access denied", 403);
    }

    return escalation;
  }

  static async assign(
    user: User,
    id: number,
    agentId: number
  ) {
    if (user.role !== UserRole.ADMIN) {
      throw httpError("Admin access required", 403);
    }

    const escalation = await this.getById(user, id);

    const agent = await User.findByPk(agentId);

    if (!agent || agent.role !== UserRole.AGENT) {
      throw httpError("Valid agent not found", 400);
    }

    if (escalation.status === EscalationStatus.RESOLVED) {
      throw httpError("Cannot assign a resolved escalation", 409);
    }

    return EscalationRepository.assignAgent(
      escalation,
      agentId
    );
  }

  static async updateStatus(
    user: User,
    id: number,
    status: EscalationStatus
  ) {
    if (
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.AGENT
    ) {
      throw httpError("Agent or Admin access required", 403);
    }

    const escalation = await this.getById(user, id);

    if (
      !escalation.assignedAgentId &&
      user.role !== UserRole.ADMIN
    ) {
      throw httpError("Escalation is not assigned", 409);
    }

    if (
      escalation.status === EscalationStatus.RESOLVED &&
      status !== EscalationStatus.RESOLVED
    ) {
      throw httpError("Resolved escalation cannot be reopened", 409);
    }

    return EscalationRepository.updateStatus(
      escalation,
      status
    );
  }
}
