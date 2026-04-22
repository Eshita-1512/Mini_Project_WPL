import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";

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
              Welcome, {user.name || user.username || user.email}
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
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/products`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        // Backend returns { success, count, products: [...] }
        const list = data.products || (Array.isArray(data) ? data : []);
        setProducts(list);
      } else {
        // fallback: public endpoint
        const r2 = await fetch(`${API}/api/products`, { credentials: "include" });
        if (r2.ok) {
          const data2 = await r2.json();
          const list2 = data2.products || (Array.isArray(data2) ? data2 : []);
          setProducts(list2);
        }
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
        setProducts(prev => prev.filter(p => (p.product_id !== id && p.id !== id && p._id !== id)));
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
      const id = updated.product_id || updated.id || updated._id;
      const res = await fetch(`${API}/api/admin/products/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updated.name,
          description: updated.description,
          price: parseFloat(updated.price) || 0,
          stock: parseInt(updated.stock) || 0,
          category_id: updated.category_id ? parseInt(updated.category_id) : null,
        }),
      });
      if (res.ok) {
        if (showToast) showToast("Product updated", "success");
        fetchProducts(); // refresh from backend
      } else {
        // Optimistic update if API not available
        setProducts(prev => prev.map(p => {
          const pid = p.product_id || p.id || p._id;
          return pid === id ? { ...p, ...updated } : p;
        }));
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
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description || "",
          price: parseFloat(newProduct.price) || 0,
          stock: parseInt(newProduct.stock) || 0,
          category_id: newProduct.category_id ? parseInt(newProduct.category_id) : null,
        }),
      });
      if (res.ok) {
        if (showToast) showToast("Product added successfully!", "success");
        fetchProducts(); // refresh from backend
      } else {
        // Optimistic
        setProducts(prev => [...prev, { ...newProduct, product_id: Date.now() }]);
        if (showToast) showToast("Added locally (check backend)", "default");
      }
    } catch {
      if (showToast) showToast("Failed to add product", "error");
    }
    setShowAdd(false);
  };

  const filteredProducts = products.filter(p =>
    !searchTerm || (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      || (p.category_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Stats bar */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 16, marginBottom: 24,
      }}>
        {[
          { label: "Total Products", value: products.length, icon: "📦", color: "#4F46E5" },
          { label: "In Stock", value: products.filter(p => (p.stock_quantity || p.stock || 0) > 0).length, icon: "✅", color: "#059669" },
          { label: "Out of Stock", value: products.filter(p => (p.stock_quantity || p.stock || 0) === 0).length, icon: "⚠️", color: "#DC2626" },
        ].map(stat => (
          <div key={stat.label} style={{
            background: "white", borderRadius: 12, padding: "20px 22px",
            border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: `${stat.color}12`, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text)" }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

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
          flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24, color: "var(--maroon)",
            }}>
              Products
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
              {loading ? "Loading..." : `${filteredProducts.length} of ${products.length} products`}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {/* Search */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                padding: "8px 14px", borderRadius: 8,
                border: "1px solid var(--border)", fontSize: 13,
                outline: "none", width: 200,
                transition: "0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "var(--maroon)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            {/* Refresh */}
            <button
              onClick={fetchProducts}
              title="Refresh"
              style={{
                padding: "8px 14px", background: "transparent",
                border: "1px solid var(--border)", borderRadius: 8,
                fontSize: 14, cursor: "pointer", transition: "0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--maroon)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              ↻ Refresh
            </button>
            {/* Add */}
            <button
              onClick={() => setShowAdd(true)}
              style={{
                padding: "10px 20px", background: "var(--maroon)", color: "white",
                border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
                cursor: "pointer", transition: "0.2s",
                display: "flex", alignItems: "center", gap: 6,
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--maroon-dark)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--maroon)"}
            >
              + Add Product
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 24 }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8, marginBottom: 12 }} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-muted)" }}>
            {products.length === 0
              ? "No products found. Add your first product above."
              : "No products match your search."}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ background: "var(--bg)" }}>
                  {["#", "Product Name", "Price (MRP)", "Stock", "Category", "Actions"].map(h => (
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
                {filteredProducts.map((p, idx) => {
                  const id = p.product_id || p.id || p._id;
                  const price = p.original_price || p.price || 0;
                  const stock = p.stock_quantity ?? p.stock ?? 0;
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
                          <div>
                            <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>
                              {p.name}
                            </span>
                            {p.description && (
                              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {p.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "var(--maroon)" }}>
                        ₹{price.toLocaleString()}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: stock > 0 ? "#D1FAE5" : "#FEE2E2",
                          color: stock > 0 ? "#065F46" : "#991B1B",
                        }}>
                          {stock > 0 ? `${stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--text-muted)" }}>
                        {p.category_name || p.category || "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => setEdit(p)}
                            style={{
                              padding: "6px 14px",
                              background: "transparent", border: "1px solid var(--royal-blue, #3B82F6)",
                              color: "var(--royal-blue, #3B82F6)", borderRadius: 6,
                              fontSize: 13, fontWeight: 500, cursor: "pointer",
                              transition: "0.2s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "var(--royal-blue, #3B82F6)"; e.currentTarget.style.color = "white"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--royal-blue, #3B82F6)"; }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(id, p.name)}
                            style={{
                              padding: "6px 14px",
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
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
    price:         product?.original_price || product?.price || "",
    stock:         product?.stock_quantity ?? product?.stock ?? "",
    category_id:   product?.category_id   || "",
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
      stock: parseInt(form.stock) || 0,
      category_id: form.category_id ? parseInt(form.category_id) : null,
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
            {isEdit ? "Edit Product" : "Add New Product"}
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
            { label: "Product Name", name: "name", placeholder: "e.g. Swarna Kamal", type: "text", required: true },
            { label: "Price (MRP ₹)", name: "price", placeholder: "e.g. 15000", type: "number", required: true },
            { label: "Stock Quantity", name: "stock", placeholder: "e.g. 50", type: "number", required: false },
            { label: "Category ID", name: "category_id", placeholder: "e.g. 1", type: "number", required: false },
            { label: "Image URL", name: "image_url", placeholder: "https://...", type: "text", required: false },
          ].map(({ label, name, placeholder, type, required }) => (
            <div key={name} className="form-group">
              <label>{label} {required && <span style={{ color: "#b91c1c" }}>*</span>}</label>
              <input
                className="form-input"
                type={type} name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
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

          {/* Preview */}
          {form.image_url && (
            <div style={{ marginBottom: 20, textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Image Preview</p>
              <img
                src={form.image_url}
                alt="Preview"
                style={{
                  maxWidth: "100%", maxHeight: 150, borderRadius: 8,
                  border: "1px solid var(--border)", objectFit: "cover",
                }}
                onError={e => { e.target.style.display = "none"; }}
              />
            </div>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="submit"
              style={{
                flex: 1, padding: "12px",
                background: "var(--maroon)", color: "white",
                border: "none", borderRadius: 8, fontSize: 14,
                fontWeight: 600, cursor: "pointer", transition: "0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--maroon-dark, #5a0018)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--maroon)"}
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
  const [orderDetails, setOrderDetails] = useState({}); // keyed by order_id

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/orders`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        // Backend returns { success, count, orders: [...] }
        const list = data.orders || (Array.isArray(data) ? data : []);
        setOrders(list);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const fetchOrderDetail = async (orderId) => {
    if (orderDetails[orderId]) return; // already fetched
    try {
      const res = await fetch(`${API}/api/admin/orders/${orderId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setOrderDetails(prev => ({ ...prev, [orderId]: data }));
      }
    } catch {
      // silently fail
    }
  };

  const toggleExpand = (oid) => {
    if (expandedId === oid) {
      setExpandedId(null);
    } else {
      setExpandedId(oid);
      fetchOrderDetail(oid);
    }
  };

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

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const statusCounts = orders.reduce((acc, o) => {
    const s = (o.order_status || "pending").toLowerCase();
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 16, marginBottom: 24,
      }}>
        {[
          { label: "Total Orders", value: orders.length, icon: "🛒", color: "#4F46E5" },
          { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: "💰", color: "#059669" },
          { label: "Pending", value: statusCounts.pending || 0, icon: "⏳", color: "#D97706" },
          { label: "Delivered", value: statusCounts.delivered || 0, icon: "✅", color: "#059669" },
        ].map(stat => (
          <div key={stat.label} style={{
            background: "white", borderRadius: 12, padding: "20px 22px",
            border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: `${stat.color}12`, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: "white", borderRadius: 14,
        boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
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
          <button
            onClick={fetchOrders}
            style={{
              padding: "8px 14px", background: "transparent",
              border: "1px solid var(--border)", borderRadius: 8,
              fontSize: 14, cursor: "pointer", transition: "0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--maroon)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 24 }}>
            {[1,2,3].map(i => (
              <div key={i} className="skeleton" style={{ height: 64, borderRadius: 8, marginBottom: 12 }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p style={{ fontSize: 16, fontWeight: 500 }}>No orders yet</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>Orders will appear here when customers place them</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ background: "var(--bg)" }}>
                  {["Order ID", "Customer", "Date", "Amount", "Status", "Details"].map(h => (
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
                  const oid = o.order_id || o.id || o._id;
                  const isExpanded = expandedId === oid;
                  const detail = orderDetails[oid];
                  return (
                    <React.Fragment key={oid}>
                      <tr
                        style={{
                          borderBottom: isExpanded ? "none" : "1px solid var(--border)",
                          transition: "0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(128,0,32,0.03)"}
                        onMouseLeave={e => e.currentTarget.style.background = "white"}
                      >
                        <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600 }}>
                          #{oid}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                            {o.customer_name || o.name || "—"}
                          </p>
                          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                            {o.customer_email || o.email || ""}
                          </p>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--text-muted)" }}>
                          {o.order_date
                            ? new Date(o.order_date).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric"
                              })
                            : "—"}
                        </td>
                        <td style={{ padding: "14px 16px", fontWeight: 700, color: "var(--maroon)", fontSize: 14 }}>
                          ₹{(o.total_amount || 0).toLocaleString()}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {statusBadge(o.order_status)}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <button
                            onClick={() => toggleExpand(oid)}
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
                        <tr style={{ background: "rgba(128,0,32,0.02)" }}>
                          <td colSpan={6} style={{ padding: "20px 24px" }}>
                            <div style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr", gap: 24,
                            }}>
                              <div>
                                <p style={{
                                  fontSize: 12, fontWeight: 700, color: "var(--text-muted)",
                                  textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10
                                }}>
                                  Shipping Address
                                </p>
                                <div style={{
                                  background: "white", borderRadius: 8, padding: 14,
                                  border: "1px solid var(--border)", fontSize: 13,
                                  color: "var(--text)", lineHeight: 1.7,
                                }}>
                                  <strong>{o.customer_name || o.name}</strong><br />
                                  {o.address && <>{o.address}, </>}{o.city}<br />
                                  {o.pincode && <>Pincode: {o.pincode}<br /></>}
                                  {(o.phone || o.customer_phone) && <>Phone: {o.phone || o.customer_phone}</>}
                                </div>
                              </div>
                              <div>
                                <p style={{
                                  fontSize: 12, fontWeight: 700, color: "var(--text-muted)",
                                  textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10,
                                }}>
                                  Order Items
                                </p>
                                <div style={{
                                  background: "white", borderRadius: 8, padding: 14,
                                  border: "1px solid var(--border)",
                                }}>
                                  {(detail?.items || o.items || []).length > 0 ? (
                                    (detail?.items || o.items).map((item, i) => (
                                      <div key={i} style={{
                                        display: "flex", justifyContent: "space-between",
                                        fontSize: 13, color: "var(--text)",
                                        paddingBottom: 6, marginBottom: 6,
                                        borderBottom: i < (detail?.items || o.items).length - 1 ? "1px solid var(--border)" : "none",
                                      }}>
                                        <span>{item.product_name || item.name} × {item.quantity}</span>
                                        <span style={{ fontWeight: 600, color: "var(--maroon)" }}>
                                          ₹{(item.final_price || item.price || 0).toLocaleString()}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                                      {detail ? "No items found" : "Loading items..."}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div style={{
                              marginTop: 16, display: "flex",
                              justifyContent: "space-between", alignItems: "center",
                            }}>
                              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                                {o.razorpay_payment_id && (
                                  <span>Payment ID: <code style={{ fontFamily: "monospace", fontSize: 12 }}>{o.razorpay_payment_id}</code></span>
                                )}
                              </div>
                              <Link
                                to={`/order-summary/${oid}`}
                                style={{
                                  fontSize: 13, color: "var(--royal-blue, #3B82F6)",
                                  fontWeight: 500, textDecoration: "underline",
                                }}
                              >
                                View full order page →
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminLayout;
