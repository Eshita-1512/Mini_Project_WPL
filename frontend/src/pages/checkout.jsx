import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8000";

function getShipping(pincode) {
  if (!pincode) return null;
  if (pincode.length !== 6) return { charge: 999, label: "International Shipping", color: "#b91c1c" };
  if (pincode.startsWith("400")) return { charge: 0, label: "🚀 Free Mumbai Delivery", color: "#1a6b3c" };
  return { charge: 199, label: "Standard India Delivery", color: "var(--royal-blue)" };
}

function Checkout({ showToast, localCart = [] }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [placing, setPlacing]     = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", pincode: "",
  });

  useEffect(() => {
    // Try backend first; if empty/unavailable, fall back to localCart prop
    fetch(`${API}/api/cart`, { credentials: "include" })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const items = Array.isArray(data) && data.length > 0 ? data : localCart;
        setCartItems(items);
      })
      .catch(() => setCartItems(localCart))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const discounted = (price) => Math.round((price || 0) * 0.75);
  const subtotal = cartItems.reduce(
    (s, item) => s + discounted(item.price) * (item.quantity || 1), 0
  );
  const shipping = getShipping(form.pincode);
  const total = subtotal + (shipping?.charge ?? 0);

  const handleOrder = async () => {
    const { name, email, phone, address, city, pincode } = form;
    if (!name || !email || !phone || !address || !city || !pincode) {
      if (showToast) showToast("Please fill all shipping fields", "error");
      return;
    }
    if (cartItems.length === 0) {
      if (showToast) showToast("Your cart is empty", "error");
      return;
    }
    setPlacing(true);
    try {
      const payload = {
        name, email, phone, address, city, pincode,
        cart: cartItems.map(item => ({
          productId: item.productId || item.product_id || item.id,
          quantity: item.quantity || 1,
        })),
      };
      const res = await fetch(`${API}/api/orders/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Order failed");
      }
      const data = await res.json();
      const orderId = data.orderId || data.id || data.order_id;
      navigate(`/order-summary/${orderId}`);
    } catch (err) {
      if (showToast) showToast(err.message || "Failed to place order", "error");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        background: "var(--maroon)", padding: "40px 60px",
        borderBottom: "3px solid var(--turmeric)",
      }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 44, fontWeight: 700, color: "#F7E7CE",
        }}>
          Checkout
        </h1>
        <p style={{ color: "rgba(247,231,206,0.7)", fontSize: 14, marginTop: 6 }}>
          Guest checkout available — no account required
        </p>
      </div>

      <div style={{
        maxWidth: 1100, margin: "36px auto 0",
        padding: "0 60px",
        display: "flex", gap: 36, alignItems: "flex-start",
      }}>

        {/* ── LEFT: Form ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          <FormCard title="Shipping Details">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <FormField label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Priya Sharma" />
              <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="priya@example.com" />
              <FormField label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 99999 99999" />
              <FormField label="City" name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" />
            </div>
            <FormField label="Full Address" name="address" value={form.address} onChange={handleChange} placeholder="Building, Street, Area" />
            <FormField label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" />

            {/* Live shipping preview */}
            {form.pincode && (
              <div style={{
                marginTop: 8,
                background: "rgba(128,0,32,0.04)", border: `1.5px solid ${shipping?.color || "var(--border)"}`,
                borderRadius: 8, padding: "12px 16px",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 18 }}>
                  {shipping?.charge === 0 ? "🚀" : shipping?.charge === 999 ? "✈️" : "📦"}
                </span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: shipping?.color }}>
                    {shipping?.label}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                    {shipping?.charge === 0
                      ? "You qualify for Free Mumbai Delivery!"
                      : `Shipping charge: ₹${shipping?.charge}`}
                  </p>
                </div>
              </div>
            )}
          </FormCard>

          {/* Cart items list */}
          <FormCard title="Your Items">
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 56, borderRadius: 8 }} />)}
              </div>
            ) : cartItems.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No items in cart.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {cartItems.map((item, i) => (
                  <div key={item.id || i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 0",
                    borderBottom: i < cartItems.length - 1 ? "1px solid var(--border)" : "none",
                  }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 6, overflow: "hidden",
                        background: "var(--champagne)", flexShrink: 0,
                      }}>
                        {item.image_url || item.image ? (
                          <img src={item.image_url || item.image} alt={item.name} style={{
                            width: "100%", height: "100%", objectFit: "cover",
                          }} />
                        ) : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 20 }}>🧵</div>}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                          {item.name || item.product_name}
                        </p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          Qty: {item.quantity || 1}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontWeight: 700, color: "var(--maroon)", fontSize: 15 }}>
                        ₹{(discounted(item.price) * (item.quantity || 1)).toLocaleString()}
                      </span>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "line-through" }}>
                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </FormCard>
        </div>

        {/* ── RIGHT: Summary ── */}
        <div style={{
          width: 320, flexShrink: 0,
          background: "white", borderRadius: 14, padding: "24px",
          boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
          position: "sticky", top: 86,
        }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 24, color: "var(--maroon)", marginBottom: 20,
          }}>
            Price Summary
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 20 }}>
            <PriceRow label="MRP Total" value={`₹${cartItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0).toLocaleString()}`} muted />
            <PriceRow label="Discount (25%)" value={`−₹${(cartItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0) - subtotal).toLocaleString()}`} green />
            <PriceRow label="Shipping" value={
              !shipping ? "Enter pincode"
              : shipping.charge === 0 ? "FREE 🎉"
              : `₹${shipping.charge}`
            } />
            <div style={{ height: 1, background: "var(--border)" }} />
            <PriceRow label="Total Payable" value={`₹${total.toLocaleString()}`} bold />
          </div>

          <div style={{
            background: "rgba(128,0,32,0.05)", borderRadius: 8,
            padding: "10px 14px", marginBottom: 18, fontSize: 13,
            color: "var(--maroon)", fontWeight: 500,
          }}>
            🏷 You save ₹{(cartItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0) - subtotal).toLocaleString()} on this order
          </div>

          <button
            onClick={handleOrder}
            disabled={placing}
            style={{
              width: "100%", padding: "14px 0",
              background: placing ? "#999" : "var(--maroon)", color: "white",
              border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700,
              cursor: placing ? "not-allowed" : "pointer",
              transition: "0.2s", letterSpacing: "0.3px",
            }}
          >
            {placing ? "Placing Order..." : "Place Order →"}
          </button>

          <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
            🔒 Secure & encrypted checkout. No account required.
          </p>
        </div>
      </div>
    </div>
  );
}

function FormCard({ title, children, style: extraStyle }) {
  return (
    <div style={{
      background: "white", borderRadius: 14, padding: "24px",
      boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
      marginBottom: 0, ...extraStyle,
    }}>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 22, color: "var(--maroon)", marginBottom: 20,
        paddingBottom: 14, borderBottom: "1px solid var(--border)",
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function FormField({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        className="form-input"
        type={type} name={name} value={value}
        onChange={onChange} placeholder={placeholder}
      />
    </div>
  );
}

function PriceRow({ label, value, muted, bold, green }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{label}</span>
      <span style={{
        fontSize: bold ? 16 : 13,
        fontWeight: bold ? 700 : 500,
        color: green ? "#1a6b3c" : bold ? "var(--maroon)" : muted ? "var(--text-muted)" : "var(--text)",
      }}>
        {value}
      </span>
    </div>
  );
}

export default Checkout;