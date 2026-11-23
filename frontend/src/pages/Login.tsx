
import { useState, type FormEvent } from "react";
import {Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="brand-logo">R</div>
        <h1>Welcome to ResolveAI</h1>
        <p>Sign in to your support workspace</p>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p style={{ textAlign: "center" }}>
  Don't have an account?{" "}
  <Link to="/register">Create an account</Link>
</p>
      </form>
    </div>
  );
}
