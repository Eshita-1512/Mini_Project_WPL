import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function Policies() {
  const { hash } = useLocation();

  // Scroll to the section if URL has a #hash
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

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
          Our Policies
        </h1>
        <p style={{ color: "rgba(247,231,206,0.75)", fontSize: 15 }}>
          Transparent policies for a confident shopping experience.
        </p>
      </div>

      <div style={{
        maxWidth: 800, margin: "56px auto 0", padding: "0 28px",
      }}>

        {/* Quick nav */}
        <div style={{
          display: "flex", gap: 12, marginBottom: 32,
        }}>
          {[
            { label: "Shipping Policy", href: "#shipping" },
            { label: "Return Policy", href: "#returns" },
          ].map(({ label, href }) => (
            <a key={href} href={href} style={{
              padding: "10px 22px", borderRadius: 8,
              background: "white", border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)", fontSize: 14,
              fontWeight: 600, color: "var(--maroon)", transition: "0.2s",
              textDecoration: "none",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--maroon)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "var(--maroon)"; }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* ─── SHIPPING POLICY ─── */}
        <section id="shipping" style={{
          background: "white", borderRadius: 16, padding: "40px",
          boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
          marginBottom: 32,
        }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 30, color: "var(--maroon)", marginBottom: 24,
            paddingBottom: 16, borderBottom: "1px solid var(--border)",
          }}>
            Shipping Policy
          </h2>

          <PolicyBlock title="Processing Time">
            All orders are processed within <strong>1–3 business days</strong> after payment confirmation.
            Orders placed on weekends or public holidays will be processed the next business day.
            Each saree is carefully hand-inspected, folded in tissue paper, and packed in our signature GAURA box before dispatch.
          </PolicyBlock>

          <PolicyBlock title="Shipping Rates">
            <ul style={listStyle}>
              <li><strong>Mumbai (Local Delivery):</strong> FREE on all orders</li>
              <li><strong>Maharashtra (Rest of state):</strong> ₹99 (Free on orders above ₹5,000)</li>
              <li><strong>Rest of India:</strong> ₹149 (Free on orders above ₹8,000)</li>
              <li><strong>International:</strong> Calculated at checkout based on destination</li>
            </ul>
          </PolicyBlock>

          <PolicyBlock title="Estimated Delivery">
            <ul style={listStyle}>
              <li><strong>Mumbai:</strong> 1–2 business days</li>
              <li><strong>Maharashtra:</strong> 3–5 business days</li>
              <li><strong>Metro Cities (Delhi, Bangalore, Chennai, etc.):</strong> 4–6 business days</li>
              <li><strong>Rest of India:</strong> 5–8 business days</li>
              <li><strong>International:</strong> 10–15 business days</li>
            </ul>
          </PolicyBlock>

          <PolicyBlock title="Order Tracking">
            Once your order is shipped, you will receive a confirmation email and SMS with your tracking number.
            You can also track your order from the Order Summary page using your order ID.
          </PolicyBlock>

          <InfoCard
            icon="✦"
            title="Handwoven with Care"
            desc="Every GAURA saree is hand-packed with a certificate of authenticity, care instructions card, and complimentary blouse piece."
          />
        </section>

        {/* ─── RETURN POLICY ─── */}
        <section id="returns" style={{
          background: "white", borderRadius: 16, padding: "40px",
          boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
          marginBottom: 32,
        }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 30, color: "var(--maroon)", marginBottom: 24,
            paddingBottom: 16, borderBottom: "1px solid var(--border)",
          }}>
            Return & Exchange Policy
          </h2>

          <PolicyBlock title="Return Window">
            We offer a <strong>7-day return window</strong> from the date of delivery.
            If you are not completely satisfied with your purchase, you may initiate a return within this period.
          </PolicyBlock>

          <PolicyBlock title="Conditions for Return">
            <ul style={listStyle}>
              <li>The saree must be in its <strong>original, unused condition</strong> with all tags attached</li>
              <li>The saree must be returned in its <strong>original packaging</strong></li>
              <li>Sarees with stains, damage, or signs of use <strong>will not be accepted</strong> for return</li>
              <li>Custom or personalised orders are <strong>non-returnable</strong></li>
              <li>Sale items marked as "Final Sale" are <strong>non-returnable</strong></li>
            </ul>
          </PolicyBlock>

          <PolicyBlock title="How to Initiate a Return">
            <ol style={{ ...listStyle, listStyleType: "decimal" }}>
              <li>Email us at <a href="mailto:gaura@gmail.com" style={{ color: "var(--maroon)", fontWeight: 600 }}>gaura@gmail.com</a> with your order ID and reason for return</li>
              <li>Our team will review your request within 24 hours</li>
              <li>Once approved, we'll arrange a free pickup from your address</li>
              <li>Upon receiving and inspecting the item, we'll process your refund</li>
            </ol>
          </PolicyBlock>

          <PolicyBlock title="Refund Process">
            Refunds are processed within <strong>5–7 business days</strong> after we receive the returned item.
            The refund will be credited to your original payment method.
            Please note that your bank may take an additional 3–5 business days to reflect the credit.
          </PolicyBlock>

          <PolicyBlock title="Exchanges">
            We're happy to facilitate exchanges! If you'd like a different colour, size, or design, simply mention it in your return request.
            Exchanges are subject to stock availability.
          </PolicyBlock>

          <InfoCard
            icon="✧"
            title="Questions?"
            desc="Reach out to us at gaura@gmail.com or call +91 99999 99999 for any policy-related queries. We're here to help!"
          />
        </section>

        {/* Bottom info cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16, marginTop: 8,
        }}>
          {[
            { icon: "➜", title: "Free Shipping", desc: "On all Mumbai orders — no minimum spend required." },
            { icon: "↩", title: "7-Day Returns", desc: "Hassle-free returns within 7 days of delivery." },
            { icon: "✧", title: "Secure Payments", desc: "Razorpay-powered payments with 256-bit encryption." },
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

/* ─── Sub-components ─── */

function PolicyBlock({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{
        fontSize: 16, fontWeight: 700, color: "var(--text)",
        marginBottom: 10, letterSpacing: "0.2px",
      }}>
        {title}
      </h3>
      <div style={{
        fontSize: 14, color: "var(--text-muted)", lineHeight: 1.85,
      }}>
        {children}
      </div>
    </div>
  );
}

function InfoCard({ icon, title, desc }) {
  return (
    <div style={{
      background: "rgba(128,0,32,0.04)", borderRadius: 10,
      padding: "16px 20px", marginTop: 8,
      border: "1px solid rgba(128,0,32,0.08)",
      display: "flex", gap: 14, alignItems: "flex-start",
    }}>
      <span style={{ fontSize: 22, flexShrink: 0, color: "var(--maroon)" }}>{icon}</span>
      <div>
        <p style={{ fontWeight: 600, fontSize: 14, color: "var(--maroon)", marginBottom: 4 }}>{title}</p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>{desc}</p>
      </div>
    </div>
  );
}

const listStyle = {
  paddingLeft: 20,
  display: "flex", flexDirection: "column", gap: 8,
};

export default Policies;
