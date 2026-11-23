
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  customerId: number;
  assignedAgentId: number | null;
}

interface Escalation {
  id: number;
  ticketId: number;
  status: string;
  assignedAgentId: number | null;
}

export default function TicketDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [escalation, setEscalation] = useState<Escalation | null>(null);
  const [status, setStatus] = useState<TicketStatus>("OPEN");
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
  const [agentId, setAgentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isStaff = user?.role === "AGENT" || user?.role === "ADMIN";
  const isAdmin = user?.role === "ADMIN";

  const loadTicket = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/tickets/${id}`);
      const result: Ticket = response.data.data ?? response.data;

      setTicket(result);
      setStatus(result.status);
      setPriority(result.priority);

      try {
        const escalationResponse = await api.get("/escalations");
        const data = escalationResponse.data.data ?? escalationResponse.data;

        const list: Escalation[] = Array.isArray(data)
          ? data
          : data.rows ?? data.escalations ?? [];

        setEscalation(
          list.find(item => Number(item.ticketId) === result.id) ?? null
        );
      } catch {
        setEscalation(null);
      }
    } catch {
      setError("Unable to load ticket details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadTicket();
  }, [loadTicket]);

  async function performUpdate(
    endpoint: string,
    body: Record<string, unknown>,
    successMessage: string
  ) {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await api.patch(endpoint, body);
      setMessage(successMessage);
      await loadTicket();
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
        err.response?.data?.error ??
        "Unable to update ticket."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading ticket details...</p>;
  if (error && !ticket) return <p className="error-message">{error}</p>;
  if (!ticket) return <p>Ticket not found.</p>;

  return (
    <div>
      <Link to="/tickets">← Back to Tickets</Link>

      <div className="page-header" style={{ marginTop: 24 }}>
        <h1>Ticket #{ticket.id}</h1>
        <p>{ticket.title}</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {message && <p role="status">{message}</p>}

      <div className="content-card">
        <h3>Ticket Information</h3>

        <p><strong>Title:</strong> {ticket.title}</p>
        <p><strong>Description:</strong> {ticket.description}</p>
        <p><strong>Status:</strong> {ticket.status}</p>
        <p><strong>Priority:</strong> {ticket.priority}</p>
        <p><strong>Customer ID:</strong> {ticket.customerId}</p>
        <p>
          <strong>Assigned Agent:</strong>{" "}
          {ticket.assignedAgentId ?? "Not assigned"}
        </p>
      </div>

      {isStaff && (
        <div className="content-card ticket-form">
          <h3>Manage Ticket</h3>

          <label htmlFor="ticket-status">Status</label>
          <select
            id="ticket-status"
            value={status}
            onChange={e => setStatus(e.target.value as TicketStatus)}
          >
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          <button
            className="primary-button"
            disabled={saving}
            onClick={() =>
              performUpdate(
                `/tickets/${ticket.id}/status`,
                { status },
                "Ticket status updated."
              )
            }
          >
            Update Status
          </button>

          <label htmlFor="ticket-priority">Priority</label>
          <select
            id="ticket-priority"
            value={priority}
            onChange={e => setPriority(e.target.value as TicketPriority)}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>

          <button
            className="primary-button"
            disabled={saving}
            onClick={() =>
              performUpdate(
                `/tickets/${ticket.id}/priority`,
                { priority },
                "Ticket priority updated."
              )
            }
          >
            Update Priority
          </button>
        </div>
      )}

      {isAdmin && (
        <div className="content-card ticket-form">
          <h3>Assign Ticket Agent</h3>

          <input
            type="number"
            min="1"
            placeholder="Enter agent user ID"
            value={agentId}
            onChange={e => setAgentId(e.target.value)}
          />

          <button
            className="primary-button"
            disabled={saving || !Number.isSafeInteger(Number(agentId)) || Number(agentId) <= 0}
            onClick={() =>
              performUpdate(
                `/tickets/${ticket.id}/assign`,
                { agentId: Number(agentId) },
                "Ticket agent assigned."
              )
            }
          >
            Assign Agent
          </button>
        </div>
      )}

      <div className="content-card">
        <h3>Human Support</h3>

        {escalation ? (
          <>
            <p>Escalation #{escalation.id}</p>
            <p>Status: {escalation.status}</p>
            <p>
              Assigned Agent: {escalation.assignedAgentId ?? "Pending"}
            </p>

            <Link
              to={`/escalations?chat=${escalation.id}`}
              className="primary-button"
              style={{ display: "inline-block", textDecoration: "none" }}
            >
              Go to Human Support
            </Link>
          </>
        ) : (
          <p>No linked escalation is visible for this ticket.</p>
        )}
      </div>
    </div>
  );
}
