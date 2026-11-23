
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  Bot,
  Headset,
  LogOut
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();

  const navigation = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard
    },
    {
      path: "/tickets",
      label: "Tickets",
      icon: Ticket
    },
    {
      path: "/ai-chat",
      label: "AI Assistant",
      icon: Bot
    },
    {
      path: "/escalations",
      label: "Human Support",
      icon: Headset
    }
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">R</div>
          <h2>ResolveAI</h2>
        </div>

        <nav className="sidebar-nav">
          {navigation.map(item => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <Icon size={19} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <strong>{user?.name}</strong>
            <span>{user?.role}</span>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
