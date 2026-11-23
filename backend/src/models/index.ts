
import { User } from "./User";
import { Ticket } from "./Ticket";
import { KnowledgeArticle } from "./KnowledgeArticle";
import { Escalation } from "./Escalation";
import { ChatMessage } from "./ChatMessage";

User.hasMany(Ticket, {
  foreignKey: "customerId",
  as: "createdTickets"
});

Ticket.belongsTo(User, {
  foreignKey: "customerId",
  as: "customer"
});

User.hasMany(Ticket, {
  foreignKey: "assignedAgentId",
  as: "assignedTickets"
});

Ticket.belongsTo(User, {
  foreignKey: "assignedAgentId",
  as: "assignedAgent"
});

export {
  User,
  Ticket,
  KnowledgeArticle
};
export { UserRole } from "./User";


Ticket.hasOne(Escalation, {
  foreignKey: "ticketId",
  as: "escalation"
});

Escalation.belongsTo(Ticket, {
  foreignKey: "ticketId",
  as: "ticket"
});

User.hasMany(Escalation, {
  foreignKey: "customerId",
  as: "customerEscalations"
});

Escalation.belongsTo(User, {
  foreignKey: "customerId",
  as: "customer"
});

User.hasMany(Escalation, {
  foreignKey: "assignedAgentId",
  as: "agentEscalations"
});

Escalation.belongsTo(User, {
  foreignKey: "assignedAgentId",
  as: "assignedAgent"
});


export { Escalation, EscalationStatus } from "./Escalation";


Escalation.hasMany(ChatMessage, {
  foreignKey: "escalationId",
  as: "messages",
  onDelete: "CASCADE"
});

ChatMessage.belongsTo(Escalation, {
  foreignKey: "escalationId",
  as: "escalation"
});

User.hasMany(ChatMessage, {
  foreignKey: "senderId",
  as: "sentMessages"
});

ChatMessage.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender"
});


export { ChatMessage } from "./ChatMessage";