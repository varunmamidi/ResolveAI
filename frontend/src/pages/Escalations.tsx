
import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import HumanChat from "../components/HumanChat";
import { useAuth } from "../context/AuthContext";

interface Escalation {
  id: number;
  ticketId: number;
  reason: string;
  status: string;
  assignedAgentId: number | null;
}

export default function Escalations() {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();

  const chatParam = searchParams.get("chat");
  const chatId = chatParam === null ? null : Number(chatParam);

  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [reason, setReason] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [agentIds, setAgentIds] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadEscalations() {
    try {
      const response = await api.get("/escalations");
      const data = response.data.data ?? response.data;

      setEscalations(
        Array.isArray(data)
          ? data
          : data.rows ?? data.escalations ?? []
      );
    } catch {
      setError("Unable to load escalations.");
    }
  }

  useEffect(() => {
    void loadEscalations();
  }, []);

  // Automatically open the correct chat from Ticket Details
  useEffect(() => {
    if (
      chatId === null ||
      !Number.isSafeInteger(chatId) ||
      chatId <= 0
    ) {
      return;
    }

    const match = escalations.find(e => e.id === chatId);

    if (
      match &&
      match.assignedAgentId != null &&
      match.status === "ASSIGNED"
    ) {
      setSelectedId(match.id);
    }
  }, [chatId, escalations]);

  async function createEscalation(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.post("/escalations", {
        reason,
        conversationSummary: summary
      });

      setReason("");
      setSummary("");
      setMessage("Human support requested successfully.");

      await loadEscalations();
    } catch {
      setError("Unable to request human support.");
    }
  }

  async function updateEscalation(
    id: number,
    action: "assign" | "resolve"
  ) {
    setBusyId(id);
    setError("");
    setMessage("");

    try {
      if (action === "assign") {
        const agentId = Number(agentIds[id]);

        if (!Number.isSafeInteger(agentId) || agentId <= 0) {
          setError("Please enter a valid agent ID.");
          return;
        }

        await api.patch(`/escalations/${id}/assign`, {
          agentId
        });

        setMessage(`Agent assigned to escalation #${id}.`);
      } else {
  await api.patch(`/escalations/${id}/status`, {
    status: "RESOLVED"
  });

  setMessage(`Escalation #${id} resolved successfully.`);

  if (selectedId === id) {
    setSelectedId(null);
  }
}

      await loadEscalations();
    } catch (err: unknown) {
      const apiError = err as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
      };

      setError(
        apiError.response?.data?.message ??
        apiError.response?.data?.error ??
        "Unable to update escalation."
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Human Support</h1>
        <p>Escalations and live support conversations</p>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {message && (
        <p role="status">{message}</p>
      )}

      {user?.role === "CUSTOMER" && (
        <form
          className="content-card ticket-form"
          onSubmit={createEscalation}
        >
          <h3>Request Human Support</h3>

          <input
            placeholder="Reason for escalation"
            value={reason}
            onChange={e => setReason(e.target.value)}
            required
            minLength={5}
          />

          <textarea
            placeholder="Describe your conversation or issue"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            required
            minLength={10}
          />

          <button className="primary-button" type="submit">
            Request Agent
          </button>
        </form>
      )}

      <div className="content-card">
        <h3>Escalations</h3>

        {escalations.length === 0 && (
          <p>No escalations found.</p>
        )}

        {escalations.map(escalation => (
          <div
            key={escalation.id}
            className="escalation-item"
          >
            <div>
              <strong>Escalation #{escalation.id}</strong>
              <p>{escalation.reason}</p>
              <p>Ticket #{escalation.ticketId}</p>

              <span className="status-badge">
                {escalation.status}
              </span>

              {escalation.assignedAgentId != null && (
                <p>
                  Assigned Agent: #{escalation.assignedAgentId}
                </p>
              )}

              {user?.role === "ADMIN" &&
                escalation.status === "PENDING" && (
                  <div style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 12
                  }}>
                    <input
                      type="number"
                      min="1"
                      placeholder="Agent ID"
                      value={agentIds[escalation.id] ?? ""}
                      onChange={e =>
                        setAgentIds(previous => ({
                          ...previous,
                          [escalation.id]: e.target.value
                        }))
                      }
                    />

                    <button
                      type="button"
                      disabled={busyId === escalation.id}
                      onClick={() =>
                        updateEscalation(escalation.id, "assign")
                      }
                    >
                      Assign Agent
                    </button>
                  </div>
                )}

              {(user?.role === "ADMIN" ||
                (user?.role === "AGENT" &&
                  escalation.assignedAgentId === user.id)) &&
                escalation.status === "ASSIGNED" && (
                  <button
                    type="button"
                    disabled={busyId === escalation.id}
                    onClick={() =>
                      updateEscalation(escalation.id, "resolve")
                    }
                  >
                    Resolve Escalation
                  </button>
                )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedId(escalation.id)}
              disabled={
                escalation.assignedAgentId == null ||
                escalation.status !== "ASSIGNED"
              }
            >
              Open Chat
            </button>
          </div>
        ))}
      </div>

      {selectedId !== null && token && user && (
        <HumanChat
          escalationId={selectedId}
          token={token}
          currentUserId={user.id}
        />
      )}
    </div>
  );
}
