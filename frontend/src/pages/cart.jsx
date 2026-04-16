import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function Cart({ localCart = [], showToast, onUpdateItem, onRemoveItem, onClearCart }) {
  const items = localCart;

  const handleClearCart = () => {
    if (!window.confirm("Clear entire cart?")) return;
    onClearCart();
    if (showToast) showToast("Cart cleared");
  };

  const discounted = (price) => Math.round((price || 0) * 0.75);
  const subtotal = items.reduce(
    (sum, item) => sum + discounted(item.price) * (item.quantity || 1),
    0
  );

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
          Your Cart
        </h1>
        <p style={{ color: "rgba(247,231,206,0.7)", fontSize: 14, marginTop: 6 }}>
          {`${items.length} item${items.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 60px 0" }}>
        {items.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: 80 }}>
            <div style={{ fontSize: 48, marginBottom: 16, fontFamily: "'Cormorant Garamond', serif", color: "var(--maroon)" }}>Cart</div>
            <h3>Your cart is empty</h3>
            <p>Discover our handwoven Banarasi collection and add your favourite pieces.</p>
            <Link to="/products" style={{ marginTop: 8, display: "inline-block" }}>
              <button className="btn btn-primary" style={{ padding: "12px 32px" }}>
                Shop Now
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>

            {/* ── Cart items ── */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 16,
              }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "var(--maroon)" }}>
                  Cart Items
                </h2>
                <button
                  onClick={handleClearCart}
                  style={{
                    fontSize: 13, color: "#b91c1c", background: "none",
                    border: "1px solid #b91c1c", borderRadius: 6,
                    padding: "5px 14px", cursor: "pointer", transition: "0.2s",
                  }}
                >
                  Clear Cart
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {items.map((item) => (
                  <CartItem
                    key={item.id || item._id || item.productId}
                    item={item}
                    onQuantityChange={(newQty) => {
                      onUpdateItem(item, newQty);
                    }}
                    onRemove={() => {
                      onRemoveItem(item);
                      if (showToast) showToast("Item removed");
                    }}
                    discounted={discounted}
                  />
                ))}
              </div>
            </div>

            {/* ── Order summary ── */}
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
                Order Summary
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <Row
                  label="MRP Total"
                  value={`₹${items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0).toLocaleString()}`}
                  muted
                />
                <Row
                  label="Discount (25%)"
                  value={`−₹${(items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0) - subtotal).toLocaleString()}`}
                  green
                />
                <Row label="Subtotal" value={`₹${subtotal.toLocaleString()}`} />
                <Row label="Shipping" value="Calculated at checkout" muted />
                <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
                <Row label="Estimated Total" value={`₹${subtotal.toLocaleString()}`} bold />
              </div>

              <div style={{
                background: "rgba(128,0,32,0.06)", borderRadius: 8,
                padding: "10px 14px", marginBottom: 18, fontSize: 13,
                color: "var(--maroon)",
              }}>
                25% discount applied automatically
              </div>

              <Link to="/checkout">
                <button style={{
                  width: "100%", padding: "13px 0",
                  background: "var(--maroon)", color: "white",
                  border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600,
                  cursor: "pointer", transition: "0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--maroon-dark)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--maroon)"}
                >
                  Proceed to Checkout →
                </button>
              </Link>

              <Link to="/products">
                <button style={{
                  width: "100%", marginTop: 10, padding: "10px 0",
                  background: "transparent", color: "var(--maroon)",
                  border: "2px solid var(--maroon)", borderRadius: 8,
                  fontSize: 14, fontWeight: 500, cursor: "pointer",
                }}>
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CartItem({ item, onQuantityChange, onRemove, discounted }) {
  const qty   = item.quantity || 1;
  const price = discounted(item.price) * qty;
  const image = item.image_url || item.image;

  return (
    <div style={{
      background: "white", borderRadius: 12, padding: "16px 18px",
      boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
      display: "flex", gap: 16, alignItems: "center",
    }}>
      {/* Image */}
      <div style={{
        width: 80, height: 80, borderRadius: 8, overflow: "hidden",
        flexShrink: 0, background: "var(--champagne)",
      }}>
        {image ? (
          <img src={image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "var(--text-muted)" }}>
              N/A
            </div>
        )}
      </div>

      {/* Details */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18, fontWeight: 600, color: "var(--text)", marginBottom: 4,
        }}>
          {item.name || item.product_name}
        </h3>
        {item.category_name && (
          <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>
            {item.category_name}
          </p>
        )}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ color: "var(--maroon)", fontWeight: 700, fontSize: 15 }}>
            ₹{price.toLocaleString()}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "line-through" }}>
            ₹{((item.price || 0) * qty).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Quantity */}
      <div style={{
        display: "flex", alignItems: "center",
        border: "1.5px solid var(--border)", borderRadius: 8, overflow: "hidden",
      }}>
        <button
          onClick={() => onQuantityChange(qty - 1)}
          style={{
            width: 34, height: 34, border: "none",
            background: "white", cursor: "pointer", fontSize: 16, fontWeight: 600,
            color: "var(--maroon)", transition: "0.18s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--champagne)"}
          onMouseLeave={e => e.currentTarget.style.background = "white"}
        >
          −
        </button>
        <span style={{
          width: 38, textAlign: "center", fontSize: 14, fontWeight: 600,
          background: "var(--bg-light)", lineHeight: "34px",
        }}>
          {qty}
        </span>
        <button
          onClick={() => onQuantityChange(qty + 1)}
          style={{
            width: 34, height: 34, border: "none",
            background: "white", cursor: "pointer", fontSize: 16, fontWeight: 600,
            color: "var(--maroon)", transition: "0.18s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--champagne)"}
          onMouseLeave={e => e.currentTarget.style.background = "white"}
        >
          +
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        title="Remove item"
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#9B2335", fontSize: 18, padding: "4px 6px",
          borderRadius: 6, transition: "0.18s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(185,28,28,0.08)"}
        onMouseLeave={e => e.currentTarget.style.background = "none"}
      >
        ✕
      </button>
    </div>
  );
}

function Row({ label, value, muted, bold, green }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 13, color: muted ? "var(--text-muted)" : "var(--text)" }}>{label}</span>
      <span style={{
        fontSize: bold ? 16 : 13,
        fontWeight: bold ? 700 : 400,
        color: green ? "#1a6b3c" : bold ? "var(--maroon)" : muted ? "var(--text-muted)" : "var(--text)",
      }}>
        {value}
      </span>
    </div>
  );
}

export default Cart;