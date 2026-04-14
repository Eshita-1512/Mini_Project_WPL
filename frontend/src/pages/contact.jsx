function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("We've received your message! Our team will reach out shortly.");
    e.target.reset();
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        background: "var(--maroon)", padding: "50px 60px",
        borderBottom: "3px solid var(--turmeric)",
      }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 44, fontWeight: 700, color: "#F7E7CE", marginBottom: 8,
        }}>
          Contact Us
        </h1>
        <p style={{ color: "rgba(247,231,206,0.75)", fontSize: 15 }}>
          We'd love to hear from you. Reach out for orders, queries, or just to talk about sarees.
        </p>
      </div>

      <div style={{
        maxWidth: 1020, margin: "48px auto 0", padding: "0 40px",
        display: "flex", gap: 40, alignItems: "flex-start",
      }}>

        {/* ── Contact info ── */}
        <div style={{ flex: "0 0 320px" }}>
          {[
            { icon: "📍", title: "Visit Us", details: ["GAURA Saree House,", "Banaras Weave Street,", "Mumbai – 400001, India"] },
            { icon: "📞", title: "Call Us", details: ["+91 99999 99999", "Mon–Sat, 10am – 7pm"] },
            { icon: "✉️", title: "Email Us", details: ["gaura@gmail.com", "We reply within 24 hours"] },
            { icon: "💬", title: "WhatsApp", details: ["+91 99999 99999", "Quick responses guaranteed"] },
          ].map(({ icon, title, details }) => (
            <div key={title} style={{
              background: "white", borderRadius: 12, padding: "20px",
              boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
              marginBottom: 16, display: "flex", gap: 16,
            }}>
              <span style={{
                fontSize: 28, width: 48, height: 48, borderRadius: "50%",
                background: "rgba(128,0,32,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {icon}
              </span>
              <div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 18, color: "var(--maroon)", marginBottom: 4,
                }}>
                  {title}
                </h3>
                {details.map((d, i) => (
                  <p key={i} style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>{d}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Form ── */}
        <div style={{
          flex: 1, background: "white", borderRadius: 14, padding: "32px",
          boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
        }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 28, color: "var(--maroon)", marginBottom: 24,
          }}>
            Send a Message
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <div className="form-group">
                <label>Full Name</label>
                <input className="form-input" type="text" name="name" required placeholder="Priya Sharma" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input className="form-input" type="email" name="email" required placeholder="priya@example.com" />
              </div>
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input className="form-input" type="text" name="subject" placeholder="Order enquiry, product availability..." />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                className="form-input" name="message" required
                placeholder="Tell us how we can help you..."
                rows={5}
                style={{ resize: "vertical", lineHeight: 1.6 }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "13px 40px", background: "var(--maroon)", color: "white",
                border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600,
                cursor: "pointer", transition: "0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--maroon-dark)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--maroon)"}
            >
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
