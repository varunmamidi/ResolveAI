
import { useEffect, useState, type FormEvent } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface TicketItem {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
}

export default function Tickets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  async function loadTickets() {
    try {
      const response = await api.get("/tickets");

      setTickets(
        response.data.data ?? response.data
      );
    } catch {
      setError("Unable to load tickets");
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function createTicket(e: FormEvent) {
    e.preventDefault();

    try {
      await api.post("/tickets", {
        title,
        description,
        priority: "MEDIUM"
      });

      setTitle("");
      setDescription("");
      setError("");

      await loadTickets();
    } catch {
      setError("Unable to create ticket");
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Support Tickets</h1>
        <p>Track and manage customer requests</p>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {user?.role === "CUSTOMER" && (
        <form
          className="content-card ticket-form"
          onSubmit={createTicket}
        >
          <h3>Create New Ticket</h3>

          <input
            placeholder="Ticket title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Describe your issue"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />

          <button className="primary-button">
            Create Ticket
          </button>
        </form>
      )}

      <div className="content-card">
        <h3>All Tickets</h3>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>#{ticket.id}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.priority}</td>
                  <td>
                    <span className="status-badge">
                      {ticket.status}
                    </span>
                  </td>
                  <td>
  <button
    type="button"
    onClick={() => navigate(`/tickets/${ticket.id}`)}
  >
    View Ticket
  </button>
</td>
                </tr>
              ))}

              {tickets.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    No tickets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
