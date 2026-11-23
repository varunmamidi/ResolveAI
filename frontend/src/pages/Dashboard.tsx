
import { useEffect, useState } from "react";
import {
  Ticket,
  Clock,
  CheckCircle,
  Headset
} from "lucide-react";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

interface TicketItem {
  id: number;
  status: string;
}

interface EscalationItem {
  id: number;
  status: string;
}

export default function Dashboard() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [escalations, setEscalations] =
    useState<EscalationItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [ticketResponse, escalationResponse] =
          await Promise.all([
            api.get("/tickets"),
            api.get("/escalations")
          ]);

        setTickets(
          ticketResponse.data.data ??
          ticketResponse.data
        );

        setEscalations(
          escalationResponse.data.data ??
          escalationResponse.data
        );
      } catch {
        setError("Unable to load dashboard statistics");
      }
    }

    loadDashboard();
  }, []);

  const stats = [
    {
      label: "Total Tickets",
      value: tickets.length,
      icon: Ticket
    },
    {
      label: "Open Tickets",
      value: tickets.filter(
        t => t.status === "OPEN"
      ).length,
      icon: Clock
    },
    {
      label: "Resolved Tickets",
      value: tickets.filter(
        t => t.status === "RESOLVED"
      ).length,
      icon: CheckCircle
    },
    {
      label: "Human Escalations",
      value: escalations.length,
      icon: Headset
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>
          Welcome back, {user?.name}. Here's your
          support overview.
        </p>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="stats-grid">
        {stats.map(stat => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.label}>
              <Icon size={24} />
              <h2>{stat.value}</h2>
              <p>{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
