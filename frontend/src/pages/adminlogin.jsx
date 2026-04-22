import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.PROD ? "" : "http://localhost:8000";

// Hardcoded fallback credentials (used if API fails)
const ADMIN_EMAIL = "admin@gaura.com";
const ADMIN_PASSWORD = "admin123";

function AdminLogin({ onAdminLogin, showToast }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Enter email and password."); return; }
    setError("");
    setLoading(true);

    try {
      // Try real backend first — backend expects { username, password }
      const res = await fetch(`${API}/api/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (onAdminLogin) onAdminLogin(data.admin || { email, is_admin: true });
        if (showToast) showToast("Admin login successful", "success");
        navigate("/admin/products");
        setLoading(false);
        return;
      }
    } catch {
      // Backend unreachable — fall through to hardcoded check
    }

    // Hardcoded fallback
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = { email, is_admin: true, name: "Admin" };
      if (onAdminLogin) onAdminLogin(adminUser);
      if (showToast) showToast("Admin login successful", "success");
      navigate("/admin/products");
    } else {
      setError("Invalid admin credentials.");
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        background: "white", borderRadius: 16, padding: "44px 40px",
        boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)",
        width: "100%", maxWidth: 400,
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "var(--maroon)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, margin: "0 auto 16px",
          }}>
            ✦
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 30, color: "var(--maroon)", fontWeight: 700, marginBottom: 6,
          }}>
            Admin Access
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            GAURA Dashboard — restricted area
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div style={{
              background: "rgba(185,28,28,0.08)",
              border: "1px solid rgba(185,28,28,0.2)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 18,
              color: "#b91c1c", fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Admin Username / Email</label>
            <input
              className="form-input"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@gaura.com"
              autoComplete="username"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label>Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
              fontSize: 15, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.2s",
            }}
          >
            {loading ? "Signing in..." : "Sign In as Admin"}
          </button>
        </form>


      </div>
    </div>
  );
}

export default AdminLogin;
