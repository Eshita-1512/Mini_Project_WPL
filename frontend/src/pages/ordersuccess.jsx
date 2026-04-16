import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function OrderSummary() {
  const { orderId } = useParams();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    if (!orderId) return;
    fetch(`${API}/api/orders/${orderId}`, { credentials: "include" })
      .then(async r => {
        if (!r.ok) throw new Error("Order not found");
        return r.json();
      })
      .then(data => setOrder(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div>
        <div className="spinner" />
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginTop: 12 }}>Loading your order...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16, fontFamily: "'Cormorant Garamond', serif" }}>!</div>
        <h2 style={{ color: "var(--maroon)", fontFamily: "'Cormorant Garamond', serif", fontSize: 28 }}>
          {error}
        </h2>
        <Link to="/" style={{ marginTop: 20, display: "inline-block" }}>
          <button className="btn btn-primary">Go to Home</button>
        </Link>
      </div>
    </div>
  );

  const statusColor = (s) =>
    s === "delivered" ? "#1a6b3c"
    : s === "shipped" ? "var(--royal-blue)"
    : s === "cancelled" ? "#b91c1c"
    : "var(--turmeric)";

  const statusIcon = (s) =>
    s === "delivered" ? "✓"
    : s === "shipped"  ? "→"
    : s === "cancelled" ? "✕"
    : "•••";

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: 80 }}>

      {/* Success banner */}
      <div style={{
        background: "linear-gradient(135deg, #1a6b3c 0%, #2d9e5f 100%)",
        padding: "52px 60px", textAlign: "center",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, margin: "0 auto 20px",
        }}>
          ✓
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 44, fontWeight: 700, color: "white", marginBottom: 10,
        }}>
          Order Placed Successfully!
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16 }}>
          Thank you for shopping with GAURA. Your handwoven saree is on its way!
        </p>
        {orderId && (
          <p style={{
            display: "inline-block", marginTop: 14,
            background: "rgba(255,255,255,0.15)", borderRadius: 8,
            padding: "6px 18px", color: "white", fontWeight: 600, fontSize: 14,
            letterSpacing: "0.5px",
          }}>
            Order ID: #{orderId}
          </p>
        )}
      </div>

      <div style={{ maxWidth: 820, margin: "36px auto 0", padding: "0 40px" }}>

        {/* Status card */}
        <div style={{
          background: "white", borderRadius: 14, padding: "24px 28px",
          boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
          marginBottom: 24,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>
              Order Status
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>{statusIcon(order?.order_status)}</span>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24, fontWeight: 700,
                color: statusColor(order?.order_status),
                textTransform: "capitalize",
              }}>
                {order?.order_status || "Processing"}
              </span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>
              Shipping
            </p>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22, fontWeight: 700, color: "var(--maroon)",
            }}>
              {order?.shipping_charge === 0 ? "FREE" : `₹${order?.shipping_charge}`}
            </span>
          </div>

          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>
              Total Amount
            </p>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28, fontWeight: 700, color: "var(--maroon)",
            }}>
              ₹{order?.total_amount?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Items */}
        <div style={{
          background: "white", borderRadius: 14, padding: "24px 28px",
          boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
          marginBottom: 24,
        }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22, color: "var(--maroon)", marginBottom: 20,
            paddingBottom: 14, borderBottom: "1px solid var(--border)",
          }}>
            Items Ordered
          </h2>

          {!order?.items || order.items.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No items found.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {order.items.map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 0",
                  borderBottom: i < order.items.length - 1 ? "1px solid var(--border)" : "none",
                }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15, color: "var(--text)", marginBottom: 3 }}>
                      {item.product_name}
                    </p>
                    {item.category_name && (
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {item.category_name}
                      </p>
                    )}
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20, fontWeight: 700, color: "var(--maroon)",
                  }}>
                    ₹{item.final_price?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 14 }}>
          <Link to="/" style={{ flex: 1 }}>
            <button style={{
              width: "100%", padding: "13px 0",
              background: "var(--maroon)", color: "white",
              border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}>
              Back to Home
            </button>
          </Link>
          <Link to="/products" style={{ flex: 1 }}>
            <button style={{
              width: "100%", padding: "13px 0",
              background: "transparent", color: "var(--maroon)",
              border: "2px solid var(--maroon)", borderRadius: 8,
              fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}>
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;