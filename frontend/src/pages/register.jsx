import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../assets/login.jpeg";

const API = import.meta.env.PROD ? "" : "http://localhost:8000";

function Register({ onLogin, showToast }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", city: "", password: "", confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          city: form.city,
          country: "India",
          password: form.password,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errorDetail = Array.isArray(data.detail) ? data.detail[0].msg : data.detail;
        throw new Error(errorDetail || data.message || "Registration failed");
      }
      const data = await res.json();
      if (onLogin) onLogin(data.user || data);
      if (showToast) showToast("Account created! Welcome to GAURA", "success");
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Left panel ── */}
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
          background: "linear-gradient(to bottom, rgba(128,0,32,0.1) 40%, rgba(128,0,32,0.8) 100%)",
        }} />
        <div style={{ position: "relative", padding: "40px 44px", zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 38, color: "#F7E7CE", fontWeight: 700, marginBottom: 10,
          }}>
            Join the<br />GAURA Family
          </h2>
          <p style={{ color: "rgba(247,231,206,0.8)", fontSize: 14, lineHeight: 1.7 }}>
            Create an account to track your orders, save wishlist items, and get exclusive member offers.
          </p>
        </div>
      </div>

      {/* ── Right form ── */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 40px", overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          <div style={{ marginBottom: 28, textAlign: "center" }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 36, color: "var(--maroon)", fontWeight: 700,
              letterSpacing: 2, marginBottom: 6,
            }}>
              GAURA
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Create your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: "rgba(185,28,28,0.08)",
                border: "1px solid rgba(185,28,28,0.25)",
                borderRadius: 8, padding: "10px 14px", marginBottom: 18,
                color: "#b91c1c", fontSize: 13,
              }}>
                {error}
              </div>
            )}

            {[
              { label: "Full Name", name: "name", placeholder: "Priya Sharma", type: "text" },
              { label: "Email Address", name: "email", placeholder: "you@example.com", type: "email" },
              { label: "Phone Number", name: "phone", placeholder: "+91 99999 99999", type: "tel" },
              { label: "City", name: "city", placeholder: "Mumbai", type: "text" },
              { label: "Password", name: "password", placeholder: "Min. 6 characters", type: "password" },
              { label: "Confirm Password", name: "confirm", placeholder: "Re-enter password", type: "password" },
            ].map(({ label, name, placeholder, type }) => (
              <div key={name} className="form-group">
                <label>{label}</label>
                <input
                  className="form-input"
                  type={type} name={name}
                  value={form[name]} onChange={handleChange}
                  placeholder={placeholder}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading ? "#999" : "var(--maroon)",
                color: "white", border: "none", borderRadius: 8,
                fontSize: 15, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: 6, transition: "0.2s",
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 22, fontSize: 14, color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--maroon)", fontWeight: 600 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;