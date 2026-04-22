import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to GAURA updates!");
  };

  return (
    <footer style={{ background: "var(--maroon-dark)", color: "#F7E7CE", marginTop: "auto" }}>

      {/* ── Trust badges ── */}
      <div style={{
        background: "var(--maroon)", padding: "18px 28px",
        display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 32,
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}>
        {[
          { icon: "✦", text: "100% Authentic Handwoven" },
          { icon: "➜", text: "Free Shipping in Mumbai" },
          { icon: "↩", text: "Easy 7-Day Returns" },
          { icon: "✧", text: "Secure Payments" },
        ].map(({ icon, text }) => (
          <div key={text} style={{
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 13, fontWeight: 500,
          }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ color: "#F7E7CE", letterSpacing: "0.3px" }}>{text}</span>
          </div>
        ))}
      </div>

      {/* ── Main footer grid ── */}
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "52px 28px 32px",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40,
      }}>

        {/* 1 — Brand */}
        <div>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 28, color: "#F7E7CE", marginBottom: 14, letterSpacing: 2,
          }}>GAURA</h3>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(247,231,206,0.7)", marginBottom: 20 }}>
            Handwoven Banarasi sarees crafted by master artisans. Heritage in every thread, tradition in every weave.
          </p>
          {/* Social icons */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { href: "https://instagram.com", label: "Instagram", icon: "IG" },
              { href: "https://wa.me/919999999999", label: "WhatsApp", icon: "WA" },
              { href: "mailto:gaura@gmail.com", label: "Email", icon: "@" },
            ].map(({ href, label, icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                title={label}
                style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, transition: "0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* 2 — Quick Links */}
        <div>
          <FooterHeading>Quick Links</FooterHeading>
          <FooterLinks links={[
            { to: "/", label: "Home" },
            { to: "/products", label: "All Products" },
            { to: "/cart", label: "Cart" },
            { to: "/checkout", label: "Checkout" },
            { to: "/contact", label: "Contact Us" },
            { to: "/feedback", label: "Leave Feedback" },
          ]} />
        </div>

        {/* 3 — Customer Care */}
        <div>
          <FooterHeading>Customer Care</FooterHeading>
          <FooterLinks links={[
            { to: "/feedback", label: "Feedback" },
            { to: "/policies#shipping", label: "Shipping Policy" },
            { to: "/policies#returns", label: "Return Policy" },
            { to: "#", label: "Size Guide" },
            { to: "#", label: "Care Instructions" },
            { to: "#", label: "Track Order" },
          ]} />
        </div>

        {/* 4 — Contact + Newsletter */}
        <div>
          <FooterHeading>Stay Connected</FooterHeading>
          <div style={{ marginBottom: 20 }}>
            <p style={footerTextStyle}>Mumbai, Maharashtra, India</p>
            <p style={footerTextStyle}>+91 99999 99999</p>
            <a href="mailto:gaura@gmail.com" style={{ ...footerTextStyle, display: "block" }}>
              gaura@gmail.com
            </a>
          </div>
          <p style={{ fontSize: 12, color: "rgba(247,231,206,0.6)", marginBottom: 10, fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Newsletter
          </p>
          <form onSubmit={handleNewsletterSubmit} style={{ display: "flex", gap: 0 }}>
            <input
              type="email"
              required
              placeholder="Your email"
              style={{
                flex: 1, padding: "9px 12px", fontSize: 13,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRight: "none",
                borderRadius: "6px 0 0 6px",
                color: "white", outline: "none",
              }}
            />
            <button type="submit" style={{
              padding: "9px 14px", background: "var(--turmeric)",
              color: "#1C1C1C", fontWeight: 600, fontSize: 13,
              border: "none", borderRadius: "0 6px 6px 0", cursor: "pointer",
              transition: "0.2s",
            }}>
              →
            </button>
          </form>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.1)",
        padding: "18px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        maxWidth: 1200, margin: "0 auto",
        flexWrap: "wrap", gap: 10,
      }}>
        <p style={{ fontSize: 12, color: "rgba(247,231,206,0.5)" }}>
          © {year} Gaura. All rights reserved. Handcrafted in Banaras.
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy Policy", "Terms of Service"].map(t => (
            <span key={t} style={{ fontSize: 12, color: "rgba(247,231,206,0.4)", cursor: "pointer" }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }) {
  return (
    <h4 style={{
      color: "#F7E7CE", fontSize: 14, fontWeight: 600, letterSpacing: "1px",
      textTransform: "uppercase", marginBottom: 18, fontFamily: "'Inter', sans-serif",
    }}>
      {children}
    </h4>
  );
}

function FooterLinks({ links }) {
  return (
    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
      {links.map(({ to, label }) => (
        <li key={label}>
          <Link to={to} style={{ fontSize: 13, color: "rgba(247,231,206,0.65)", transition: "0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#F7E7CE"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(247,231,206,0.65)"}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

const footerTextStyle = {
  fontSize: 13, color: "rgba(247,231,206,0.65)", marginBottom: 6, lineHeight: 1.7,
};

export default Footer;
