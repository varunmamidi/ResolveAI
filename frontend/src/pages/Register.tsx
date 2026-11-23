
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
        name,
        email,
        password
      });

      alert("Registration successful! Please sign in.");
      navigate("/login");
    } catch (err: unknown) {
      setError(
        "Registration failed. Email may already be registered."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="brand-logo">R</div>

        <h1>Create an Account</h1>
        <p>Join ResolveAI Customer Support</p>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label>Email Address</label>
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
          placeholder="Create a strong password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={8}
          required
        />

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
