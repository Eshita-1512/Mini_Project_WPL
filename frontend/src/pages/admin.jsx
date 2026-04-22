import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

const API = import.meta.env.PROD ? "" : "http://localhost:8000";

/* ─────────────────────────────────────────────
   AdminLayout — wraps all /admin/* pages
   Guards: user must have is_admin === true
   ───────────────────────────────────────────── */
function AdminLayout({ user, showToast }) {
  const location = useLocation();

  // Not logged in at all → send to admin login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Logged in but not admin
  if (!user.is_admin && user.role !== "admin") {
    return (
      <div style={{
        minHeight: "60vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16, padding: 40,
      }}>
        <div style={{ fontSize: 48, fontFamily: "'Cormorant Garamond', serif", color: "var(--maroon)" }}>Restricted</div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 28, color: "var(--maroon)",
        }}>Unauthorized</h2>
        <p style={{ color: "var(--text-muted)" }}>
          You need admin privileges to access this page.
        </p>
        <Link to="/">
          <button className="btn btn-primary" style={{ padding: "10px 28px" }}>
            Return Home
          </button>
        </Link>
      </div>
    );
  }

  const tab = (path) => ({
    padding: "8px 20px",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    color: location.pathname.includes(path) ? "#F7E7CE" : "rgba(255,255,255,0.75)",
    background: location.pathname.includes(path)
      ? "rgba(255,255,255,0.18)" : "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    transition: "0.2s",
    cursor: "pointer",
  });

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Admin header */}
      <div style={{
        background: "var(--maroon)",
        borderBottom: "3px solid var(--turmeric)",
        padding: "28px 60px",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 34, color: "#F7E7CE", fontWeight: 700,
            }}>
              Admin Dashboard
            </h1>
            <p style={{ color: "rgba(247,231,206,0.65)", fontSize: 13, marginTop: 4 }}>
              Welcome, {user.name || user.email}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/admin/products" style={tab("products")}>
              Products
            </Link>
            <Link to="/admin/orders" style={tab("orders")}>
              Orders
            </Link>
            <Link to="/" style={{
              ...tab("__home__"),
              borderColor: "rgba(255,255,255,0.15)",
            }}>
              ← Store
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "40px 60px" }}>
        <Routes>
          <Route path="products" element={<AdminProducts showToast={showToast} />} />
          <Route path="orders"   element={<AdminOrders   showToast={showToast} />} />
          <Route path="*"        element={<Navigate to="products" replace />} />
        </Routes>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AdminProducts
   ───────────────────────────────────────────── */
function AdminProducts({ showToast }) {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editTarget, setEdit]     = useState(null);   // null | product object
  const [showAdd, setShowAdd]     = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/products`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } else {
        // fallback: public endpoint
        const r2 = await fetch(`${API}/api/products`, { credentials: "include" });
        if (r2.ok) setProducts(await r2.json());
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API}/api/admin/products/${id}`, {
        method: "DELETE", credentials: "include",
      });
      if (res.ok || res.status === 204) {
        setProducts(prev => prev.filter(p => (p.id !== id && p._id !== id)));
        if (showToast) showToast(`"${name}" deleted`, "success");
      } else {
        throw new Error("Delete failed");
      }
    } catch {
      if (showToast) showToast("Failed to delete product", "error");
    }
  };

  const handleSaveEdit = async (updated) => {
    try {
      const id = updated.id || updated._id;
      const res = await fetch(`${API}/api/admin/products/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const saved = await res.json();
        setProducts(prev => prev.map(p => (p.id === id || p._id === id) ? (saved || updated) : p));
        if (showToast) showToast("Product updated", "success");
      } else {
        // Optimistic update if API not available
        setProducts(prev => prev.map(p => (p.id === id || p._id === id) ? updated : p));
        if (showToast) showToast("Saved locally (backend may not support PUT yet)", "default");
      }
    } catch {
      if (showToast) showToast("Failed to update product", "error");
    }
    setEdit(null);
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const res = await fetch(`${API}/api/admin/products`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        const saved = await res.json();
        setProducts(prev => [...prev, saved]);
        if (showToast) showToast("Product added", "success");
      } else {
        // Optimistic
        setProducts(prev => [...prev, { ...newProduct, id: Date.now().toString() }]);
        if (showToast) showToast("Added locally (check backend)", "default");
      }
    } catch {
      if (showToast) showToast("Failed to add product", "error");
    }
    setShowAdd(false);
  };

  return (
    <div>
      {/* Product modal (edit or add) */}
      {(editTarget || showAdd) && (
        <ProductModal
          product={editTarget}
          onSave={editTarget ? handleSaveEdit : handleAddProduct}
          onClose={() => { setEdit(null); setShowAdd(false); }}
        />
      )}

      <div style={{
        background: "white", borderRadius: 14,
        boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
        overflow: "hidden",
      }}>
        {/* Table header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24, color: "var(--maroon)",
            }}>
              Products
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
              {loading ? "Loading..." : `${products.length} products`}
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              padding: "10px 20px", background: "var(--maroon)", color: "white",
              border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
              cursor: "pointer", transition: "0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--maroon-dark)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--maroon)"}
          >
            + Add Product
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 24 }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8, marginBottom: 12 }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-muted)" }}>
            No products found. Add your first product above.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg)" }}>
                {["#", "Product Name", "MRP", "Discounted", "Category", "Actions"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
                    textTransform: "uppercase", letterSpacing: "0.8px",
                    borderBottom: "1px solid var(--border)",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => {
                const discPrice = Math.round((p.price || 0) * 0.75);
                const id = p.id || p._id;
                return (
                  <tr
                    key={id}
                    style={{ borderBottom: "1px solid var(--border)", transition: "0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(128,0,32,0.03)"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                  >
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--text-muted)" }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {(p.image_url || p.image) && (
                          <img
                            src={p.image_url || p.image}
                            alt={p.name}
                            style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }}
                          />
                        )}
                        <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 14, color: "var(--text-muted)", textDecoration: "line-through" }}>
                      ₹{(p.price || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "var(--maroon)" }}>
                      ₹{discPrice.toLocaleString()}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--text-muted)" }}>
                      {p.category_name || p.category || "—"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={() => setEdit(p)}
                        style={{
                          marginRight: 8, padding: "5px 14px",
                          background: "transparent", border: "1px solid var(--royal-blue)",
                          color: "var(--royal-blue)", borderRadius: 6,
                          fontSize: 13, fontWeight: 500, cursor: "pointer",
                          transition: "0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--royal-blue)"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--royal-blue)"; }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(id, p.name)}
                        style={{
                          padding: "5px 14px",
                          background: "transparent", border: "1px solid #b91c1c",
                          color: "#b91c1c", borderRadius: 6,
                          fontSize: 13, fontWeight: 500, cursor: "pointer",
                          transition: "0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#b91c1c"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#b91c1c"; }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ProductModal — Add / Edit
   ───────────────────────────────────────────── */
function ProductModal({ product, onSave, onClose }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name:          product?.name          || "",
    price:         product?.price         || "",
    category_name: product?.category_name || product?.category || "",
    description:   product?.description   || "",
    image_url:     product?.image_url     || product?.image || "",
  });

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      alert("Name and price are required.");
      return;
    }
    const payload = {
      ...(product || {}),
      ...form,
      price: parseFloat(form.price),
    };
    onSave(payload);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "white", borderRadius: 16, padding: "32px",
        width: "100%", maxWidth: 500,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 24,
        }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 26, color: "var(--maroon)",
          }}>
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", fontSize: 22,
              cursor: "pointer", color: "var(--text-muted)",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { label: "Product Name", name: "name", placeholder: "e.g. Swarna Kamal", type: "text" },
            { label: "Price (MRP ₹)", name: "price", placeholder: "e.g. 15000", type: "number" },
            { label: "Category", name: "category_name", placeholder: "e.g. Silk Saree", type: "text" },
            { label: "Image URL", name: "image_url", placeholder: "https://...", type: "text" },
          ].map(({ label, name, placeholder, type }) => (
            <div key={name} className="form-group">
              <label>{label}</label>
              <input
                className="form-input"
                type={type} name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
              />
            </div>
          ))}

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label>Description</label>
            <textarea
              className="form-input"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Product description..."
              style={{ resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="submit"
              style={{
                flex: 1, padding: "12px",
                background: "var(--maroon)", color: "white",
                border: "none", borderRadius: 8, fontSize: 14,
                fontWeight: 600, cursor: "pointer",
              }}
            >
              {isEdit ? "Save Changes" : "Add Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: "12px",
                background: "transparent", color: "var(--text)",
                border: "2px solid var(--border)", borderRadius: 8,
                fontSize: 14, fontWeight: 500, cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AdminOrders
   ───────────────────────────────────────────── */
function AdminOrders({ showToast }) {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/admin/orders`, { credentials: "include" })
      .then(r => (r.ok ? r.json() : []))
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = (status) => {
    const map = {
      pending:   { bg: "#FEF3C7", color: "#92400E" },
      processing:{ bg: "#DBEAFE", color: "#1E40AF" },
      shipped:   { bg: "#EDE9FE", color: "#5B21B6" },
      delivered: { bg: "#D1FAE5", color: "#065F46" },
      cancelled: { bg: "#FEE2E2", color: "#991B1B" },
    };
    const s = (status || "pending").toLowerCase();
    const style = map[s] || map.pending;
    return (
      <span style={{
        padding: "3px 10px", borderRadius: 20,
        background: style.bg, color: style.color,
        fontSize: 12, fontWeight: 600,
        textTransform: "capitalize",
      }}>
        {status || "Pending"}
      </span>
    );
  };

  return (
    <div style={{
      background: "white", borderRadius: 14,
      boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 24px",
        borderBottom: "1px solid var(--border)",
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 24, color: "var(--maroon)",
        }}>
          All Orders
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
          {loading ? "Loading..." : `${orders.length} order${orders.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {loading ? (
        <div style={{ padding: 24 }}>
          {[1,2,3].map(i => (
            <div key={i} className="skeleton" style={{ height: 64, borderRadius: 8, marginBottom: 12 }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-muted)" }}>
          No orders yet.
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg)" }}>
              {["Order ID", "Customer", "Amount", "Shipping", "Status", "Details"].map(h => (
                <th key={h} style={{
                  padding: "12px 16px", textAlign: "left",
                  fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
                  textTransform: "uppercase", letterSpacing: "0.8px",
                  borderBottom: "1px solid var(--border)",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => {
              const oid = o.id || o._id || o.order_id;
              const isExpanded = expandedId === oid;
              return (
                <>
                  <tr
                    key={oid}
                    style={{ borderBottom: "1px solid var(--border)", transition: "0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(128,0,32,0.03)"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                  >
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600 }}>
                      #{oid}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                        {o.name}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{o.email}</p>
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "var(--maroon)", fontSize: 14 }}>
                      ₹{(o.total_amount || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--text-muted)" }}>
                      {o.shipping_charge === 0 ? "FREE" : `₹${o.shipping_charge}`}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {statusBadge(o.order_status)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : oid)}
                        style={{
                          padding: "5px 14px", background: "transparent",
                          border: "1px solid var(--border)", borderRadius: 6,
                          fontSize: 13, cursor: "pointer", color: "var(--text)",
                          transition: "0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--maroon)"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                      >
                        {isExpanded ? "▲ Hide" : "▼ View"}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded row */}
                  {isExpanded && (
                    <tr key={`${oid}-detail`} style={{ background: "rgba(128,0,32,0.02)" }}>
                      <td colSpan={6} style={{ padding: "16px 24px" }}>
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr", gap: 24,
                        }}>
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8 }}>
                              Shipping Address
                            </p>
                            <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7 }}>
                              {o.address}, {o.city}<br />
                              Pincode: {o.pincode}<br />
                              Phone: {o.phone}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8 }}>
                              Items
                            </p>
                            {o.items?.map((item, i) => (
                              <div key={i} style={{
                                display: "flex", justifyContent: "space-between",
                                fontSize: 13, color: "var(--text)", paddingBottom: 4,
                              }}>
                                <span>{item.product_name} × {item.quantity}</span>
                                <span style={{ fontWeight: 600, color: "var(--maroon)" }}>
                                  ₹{item.final_price?.toLocaleString()}
                                </span>
                              </div>
                            )) || (
                              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                                Item details not available
                              </p>
                            )}
                          </div>
                        </div>
                        <div style={{ marginTop: 14 }}>
                          <Link
                            to={`/order-summary/${oid}`}
                            style={{
                              fontSize: 13, color: "var(--royal-blue)",
                              fontWeight: 500, textDecoration: "underline",
                            }}
                          >
                            View full order page →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminLayout;
