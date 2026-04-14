import { useState } from "react";

/* Star rating widget — purely CSS/React, no libraries */
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div style={{ display: "flex", gap: 6, margin: "4px 0 8px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: "none",
            border: "none",
            fontSize: 32,
            cursor: "pointer",
            color: star <= display ? "#E3A018" : "#D1C0B0",
            transition: "color 0.15s, transform 0.15s",
            transform: star <= display ? "scale(1.15)" : "scale(1)",
            padding: "0 2px",
            lineHeight: 1,
          }}
          title={`${star} star${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
      <span style={{
        alignSelf: "center",
        fontSize: 13,
        color: "var(--text-muted)",
        marginLeft: 6,
        fontWeight: 500,
      }}>
        {value > 0 ? LABELS[value] : "Select rating"}
      </span>
    </div>
  );
}

const LABELS = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Very Good", 5: "Excellent" };

function Feedback({ showToast }) {
  const [form, setForm] = useState({ name: "", rating: 0, message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRating = (val) =>
    setForm((prev) => ({ ...prev, rating: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.rating === 0) {
      if (showToast) showToast("Please select a star rating", "error");
      return;
    }
    console.log("Feedback Submitted:", form);
    if (showToast) showToast("Thank you for your feedback! ❤️", "success");
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({ name: "", rating: 0, message: "" });
    setSubmitted(false);
  };

  return (
    <div style={{
      background: "var(--bg)", minHeight: "100vh", paddingBottom: 80,
    }}>
      {/* Header */}
      <div style={{
        background: "var(--maroon)", padding: "50px 60px",
        borderBottom: "3px solid var(--turmeric)",
      }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 44, fontWeight: 700, color: "#F7E7CE", marginBottom: 8,
        }}>
          Share Your Experience
        </h1>
        <p style={{ color: "rgba(247,231,206,0.75)", fontSize: 15 }}>
          Your feedback helps us serve every customer better.
        </p>
      </div>

      <div style={{
        maxWidth: 680, margin: "56px auto 0", padding: "0 28px",
      }}>
        {submitted ? (
          /* ── Thank you state ── */
          <div style={{
            background: "white", borderRadius: 16,
            padding: "56px 40px", textAlign: "center",
            boxShadow: "var(--shadow-md)", border: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>🙏</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 34, color: "var(--maroon)", marginBottom: 12,
            }}>
              Thank You, {form.name || "Friend"}!
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 8 }}>
              You gave us{" "}
              <span style={{ color: "#E3A018", fontWeight: 700, fontSize: 18 }}>
                {"★".repeat(form.rating)}
              </span>
              {" "}— {LABELS[form.rating]}.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 32, fontStyle: "italic" }}>
              "{form.message}"
            </p>
            <button
              onClick={handleReset}
              style={{
                padding: "11px 28px", background: "var(--maroon)", color: "white",
                border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
                cursor: "pointer", transition: "0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--maroon-dark)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--maroon)"}
            >
              Leave Another Review
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <div style={{
            background: "white", borderRadius: 16, padding: "40px",
            boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
          }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28, color: "var(--maroon)", marginBottom: 28,
              paddingBottom: 16, borderBottom: "1px solid var(--border)",
            }}>
              Write a Review
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="form-group">
                <label>Your Name</label>
                <input
                  className="form-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Priya Sharma"
                />
              </div>

              {/* Star Rating */}
              <div style={{ marginBottom: 20 }}>
                <p style={{
                  fontSize: 12, fontWeight: 500, color: "var(--text-muted)",
                  textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6,
                }}>
                  Overall Rating
                </p>
                <StarRating value={form.rating} onChange={handleRating} />
              </div>

              {/* Message */}
              <div className="form-group" style={{ marginBottom: 28 }}>
                <label>Your Review</label>
                <textarea
                  className="form-input"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us about your experience — the saree quality, delivery, packaging..."
                  style={{ resize: "vertical", lineHeight: 1.7 }}
                />
              </div>

              {/* Tips */}
              <div style={{
                background: "rgba(128,0,32,0.04)",
                borderRadius: 8, padding: "12px 16px",
                marginBottom: 24,
                fontSize: 13, color: "var(--text-muted)",
                lineHeight: 1.7,
                border: "1px solid rgba(128,0,32,0.08)",
              }}>
                💡 <strong style={{ color: "var(--maroon)" }}>Tip:</strong> Mention which saree you bought, the occasion you wore it for, and what you loved most. Honest reviews help other shoppers!
              </div>

              <button
                type="submit"
                style={{
                  width: "100%", padding: "14px",
                  background: "var(--maroon)", color: "white",
                  border: "none", borderRadius: 8,
                  fontSize: 15, fontWeight: 600,
                  cursor: "pointer", transition: "0.2s",
                  letterSpacing: "0.3px",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--maroon-dark)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--maroon)"}
              >
                Submit Feedback →
              </button>
            </form>
          </div>
        )}

        {/* Side info cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 16, marginTop: 24,
        }}>
          {[
            { icon: "🏆", title: "Honest Reviews", desc: "All reviews are from verified GAURA customers." },
            { icon: "🔒", title: "Private & Safe", desc: "Your details are never shared publicly." },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{
              background: "white", borderRadius: 12, padding: "18px 20px",
              boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
              display: "flex", gap: 14, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>{title}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feedback;
