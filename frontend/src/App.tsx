
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import AIChat from "./pages/AIChat";
import Escalations from "./pages/Escalations";
import Register from "./pages/Register";
import TicketDetailsPage from "./pages/TicketDetails";

function ProtectedRoute() {
  const { token, user } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
      <Route
  path="/tickets/:id"
  element={<TicketDetailsPage />}
/>
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/tickets"
            element={<Tickets />}
          />
          <Route
            path="/ai-chat"
            element={<AIChat />}
          />
          <Route
            path="/escalations"
            element={<Escalations />}
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
