import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../assets/login.jpeg";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function Login({ onLogin, showToast }) {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Invalid credentials");
      }
      const data = await res.json();
      if (onLogin) onLogin(data.user || data);
      if (showToast) showToast("Welcome back! 🎉", "success");
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    navigate("/checkout");
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh", background: "var(--bg)",
    }}>
      {/* ── Left image panel ── */}
      <div style={{
        flex: 1, position: "relative", overflow: "hidden",
        display: "flex", alignItems: "flex-end",
      }}>
        <img src={loginImg} alt="Gaura" style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%", objectFit: "cover",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(128,0,32,0.1) 40%, rgba(128,0,32,0.75) 100%)",
        }} />
        <div style={{ position: "relative", padding: "40px 44px", zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 38, color: "#F7E7CE", fontWeight: 700, marginBottom: 10,
          }}>
            Heritage in<br />Every Thread
          </h2>
          <p style={{ color: "rgba(247,231,206,0.8)", fontSize: 14, lineHeight: 1.7 }}>
            Handwoven Banarasi sarees crafted by master artisans. Login to explore your wishlist and orders.
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "60px 40px",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Brand */}
          <div style={{ marginBottom: 36, textAlign: "center" }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 36, color: "var(--maroon)", fontWeight: 700,
              letterSpacing: 2, marginBottom: 6,
            }}>
              GAURA
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: "rgba(185,28,28,0.08)", border: "1px solid rgba(185,28,28,0.25)",
                borderRadius: 8, padding: "10px 14px", marginBottom: 18,
                color: "#b91c1c", fontSize: 13, display: "flex", gap: 8,
              }}>
                ⚠️ {error}
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input
                className="form-input"
                type="email" name="email"
                value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                className="form-input"
                type="password" name="password"
                value={form.password} onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading ? "#999" : "var(--maroon)",
                color: "white", border: "none", borderRadius: 8,
                fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                marginTop: 4, transition: "0.2s",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12, margin: "20px 0",
          }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Guest checkout */}
          <button
            onClick={handleGuest}
            style={{
              width: "100%", padding: "12px",
              background: "transparent", border: "2px solid var(--border)",
              borderRadius: 8, fontSize: 14, fontWeight: 500,
              color: "var(--text)", cursor: "pointer", transition: "0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--maroon)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
          >
            Continue as Guest →
          </button>

          {/* Links */}
          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--maroon)", fontWeight: 600 }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;