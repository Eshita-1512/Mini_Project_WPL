import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";

// ── Saree images (local assets — always available) ───────────────────────────
import saree1 from "../assets/saree1.jpeg";
import saree2 from "../assets/saree2.jpeg";
import saree3 from "../assets/saree3.jpeg";
import saree4 from "../assets/saree4.jpeg";
import saree5 from "../assets/saree5.jpeg";
import saree6 from "../assets/saree6.jpeg";
import saree7 from "../assets/saree7.jpeg";
import saree8 from "../assets/saree8.jpeg";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// ── Static fallback — shown when backend is unavailable ──────────────────────
const FALLBACK_PRODUCTS = [
  { id: "1", name: "Ore Manjhi",      price: 15500, image_url: saree1, category_name: "Silk Saree",     description: "A timeless Banarasi silk saree with intricate gold zari work." },
  { id: "2", name: "Swarna Kamal",    price: 30000, image_url: saree2, category_name: "Bridal Saree",   description: "Exquisite bridal piece with kamal (lotus) motifs woven in real gold zari." },
  { id: "3", name: "Sun Radhike",     price: 13067, image_url: saree3, category_name: "Festive Saree",  description: "Vibrant festive saree ideal for Diwali and Navratri celebrations." },
  { id: "4", name: "Sun Ri Sajni",    price: 14000, image_url: saree4, category_name: "Silk Saree",     description: "Soft katan silk with subtle thread work — perfect for everyday elegance." },
  { id: "5", name: "Hum Hai Taiyar", price: 11600, image_url: saree5, category_name: "Festive Saree",  description: "Bold colours and fine weaving make this a festival-season favourite." },
  { id: "6", name: "Gaura",           price: 16000, image_url: saree6, category_name: "Bridal Saree",   description: "Our signature piece — named after the brand itself. A masterwork of art." },
  { id: "7", name: "Ganga",           price: 17600, image_url: saree7, category_name: "Silk Saree",     description: "Flowing like the river — pure silk with a naturally luminous finish." },
  { id: "8", name: "Madhu Maas",      price: 12133, image_url: saree8, category_name: "Occasion Saree", description: "Delicate motifs inspired by the honey season — sweet and sophisticated." },
];

// ── Color swatches (UI only) ──────────────────────────────────────────────────
const SAREE_COLORS = [
  { name: "Crimson Red",     hex: "#DC143C" },
  { name: "Deep Maroon",     hex: "#800020" },
  { name: "Rani Pink",       hex: "#E75480" },
  { name: "Rose Gold",       hex: "#B76E79" },
  { name: "Royal Blue",      hex: "#4169E1" },
  { name: "Navy Blue",       hex: "#000080" },
  { name: "Peacock Teal",    hex: "#008080" },
  { name: "Emerald Green",   hex: "#50C878" },
  { name: "Bottle Green",    hex: "#006A4E" },
  { name: "Turmeric Yellow", hex: "#E3A018" },
  { name: "Mustard",         hex: "#FFDB58" },
  { name: "Ivory",           hex: "#FFFFF0", border: true },
  { name: "Champagne",       hex: "#F7E7CE", border: true },
  { name: "Royal Purple",    hex: "#7851A9" },
  { name: "Midnight Black",  hex: "#1C1C1C" },
];

function discounted(price) {
  return Math.round((price || 0) * 0.75);
}

// ── Products page ─────────────────────────────────────────────────────────────
function Products({ addToCart, showToast }) {
  const [products, setProducts]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeCat, setActiveCat]     = useState("all");
  const [activeColor, setActiveColor] = useState(null);
  const [sortBy, setSortBy]           = useState("default");
  const [searchParams]                = useSearchParams();
  const searchQ                       = searchParams.get("q") || "";

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`${API}/api/products`, { credentials: "include" }),
        fetch(`${API}/api/products/categories`, { credentials: "include" }),
      ]);

      const pData = pRes.ok ? await pRes.json() : [];
      const cData = cRes.ok ? await cRes.json() : [];

      const productList = Array.isArray(pData) && pData.length > 0 ? pData : FALLBACK_PRODUCTS;
      setProducts(productList);

      if (Array.isArray(cData) && cData.length > 0) {
        setCategories(cData);
      } else {
        // Derive categories from fallback products
        const cats = [...new Set(productList.map(p => p.category_name).filter(Boolean))];
        setCategories(cats.map(c => ({ name: c })));
      }
    } catch {
      // API completely unreachable — use fallback
      setProducts(FALLBACK_PRODUCTS);
      const cats = [...new Set(FALLBACK_PRODUCTS.map(p => p.category_name))];
      setCategories(cats.map(c => ({ name: c })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAddToCart = (product) => {
    if (addToCart) addToCart(product);
    if (showToast) showToast(`${product.name} added to cart!`, "success");
  };

  // ── Filter + sort ──────────────────────────────────────────────────────────
  let displayed = [...products];

  if (searchQ) {
    displayed = displayed.filter(p =>
      p.name?.toLowerCase().includes(searchQ.toLowerCase()) ||
      p.category_name?.toLowerCase().includes(searchQ.toLowerCase())
    );
  }
  if (activeCat !== "all") {
    displayed = displayed.filter(p =>
      p.category === activeCat || p.category_name === activeCat
    );
  }
  if (sortBy === "low")  displayed.sort((a, b) => discounted(a.price) - discounted(b.price));
  if (sortBy === "high") displayed.sort((a, b) => discounted(b.price) - discounted(a.price));
  if (sortBy === "name") displayed.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: 80 }}>

      {/* ── Page header ── */}
      <div style={{
        background: "var(--maroon)", padding: "40px 60px",
        borderBottom: "3px solid var(--turmeric)",
      }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 44, fontWeight: 700, color: "#F7E7CE",
        }}>
          All Products
        </h1>
        <p style={{ color: "rgba(247,231,206,0.7)", fontSize: 14, marginTop: 6 }}>
          {loading
            ? "Loading..."
            : `${displayed.length} saree${displayed.length !== 1 ? "s" : ""}${searchQ ? ` for "${searchQ}"` : ""}`}
        </p>
      </div>

      <div style={{
        display: "flex", gap: 28, padding: "32px 60px 0",
        maxWidth: 1300, margin: "0 auto",
      }}>

        {/* ── SIDEBAR ── */}
        <aside style={{ width: 240, flexShrink: 0 }}>

          {/* Categories */}
          <SideSection title="Categories">
            <ul style={{ listStyle: "none" }}>
              <SideItem label="All" active={activeCat === "all"} onClick={() => setActiveCat("all")} />
              {categories.map(c => {
                const name = typeof c === "string" ? c : (c.name || c);
                return (
                  <SideItem
                    key={name}
                    label={name}
                    active={activeCat === name}
                    onClick={() => setActiveCat(name)}
                  />
                );
              })}
            </ul>
          </SideSection>

          {/* Sort */}
          <SideSection title="Sort By">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                width: "100%", padding: "9px 12px",
                border: "1.5px solid var(--border)", borderRadius: 7,
                fontSize: 13, background: "white", cursor: "pointer", outline: "none",
                color: "var(--text)",
              }}
            >
              <option value="default">Default</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
              <option value="name">Name: A → Z</option>
            </select>
          </SideSection>

          {/* Color Filter */}
          <SideSection title="Saree Color">
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12, letterSpacing: "0.3px" }}>
              Tap to filter by color
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SAREE_COLORS.map(({ name, hex, border }) => (
                <button
                  key={name}
                  title={name}
                  onClick={() => setActiveColor(activeColor === hex ? null : hex)}
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: hex,
                    border: activeColor === hex
                      ? "3px solid var(--maroon)"
                      : `2px solid ${border ? "#ccc" : "transparent"}`,
                    cursor: "pointer",
                    boxShadow: activeColor === hex
                      ? "0 0 0 2px white, 0 0 0 4px var(--maroon)"
                      : "0 1px 4px rgba(0,0,0,0.18)",
                    transition: "all 0.18s",
                    outline: "none",
                  }}
                />
              ))}
            </div>
            {activeColor && (
              <button
                onClick={() => setActiveColor(null)}
                style={{
                  marginTop: 10, fontSize: 12, color: "var(--maroon)",
                  background: "none", border: "none", cursor: "pointer",
                  textDecoration: "underline", padding: 0,
                }}
              >
                ✕ Clear color filter
              </button>
            )}
          </SideSection>

          {/* Promo badge */}
          <div style={{
            background: "var(--maroon)", color: "#F7E7CE",
            borderRadius: 12, padding: "18px 16px", marginTop: 4,
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>🎁 25% Off All Orders</p>
            <p style={{ fontSize: 12, opacity: 0.8, lineHeight: 1.6 }}>
              Discount is applied automatically at checkout.
            </p>
          </div>
        </aside>

        {/* ── PRODUCT GRID ── */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {Array(6).fill(0).map((_, i) => (
                <div key={i}>
                  <div className="skeleton" style={{ height: 260, borderRadius: 12, marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 18, width: "70%", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: "40%" }} />
                </div>
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 48, marginBottom: 16 }}>🧵</div>
              <h3>No products found</h3>
              <p>{searchQ ? `No results for "${searchQ}"` : "Try a different category or filter."}</p>
              <button
                onClick={() => { setActiveCat("all"); setActiveColor(null); }}
                className="btn btn-outline"
                style={{ marginTop: 16 }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {displayed.map(p => (
                <ProductCard key={p.id || p._id} product={p} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function SideSection({ title, children }) {
  return (
    <div style={{
      background: "white", borderRadius: 12, padding: "18px 16px",
      marginBottom: 16, boxShadow: "var(--shadow-sm)",
      border: "1px solid var(--border)",
    }}>
      <h4 style={{
        fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
        textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 14,
        fontFamily: "'Inter', sans-serif",
      }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function SideItem({ label, active, onClick }) {
  return (
    <li>
      <button
        onClick={onClick}
        style={{
          width: "100%", textAlign: "left", padding: "7px 10px",
          borderRadius: 6, fontSize: 13, border: "none", cursor: "pointer",
          background: active ? "rgba(128,0,32,0.08)" : "transparent",
          color: active ? "var(--maroon)" : "var(--text)",
          fontWeight: active ? 600 : 400,
          transition: "0.18s",
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(128,0,32,0.04)"; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
      >
        {active && <span style={{ marginRight: 6 }}>✔</span>}
        {label}
      </button>
    </li>
  );
}

function ProductCard({ product, onAddToCart }) {
  const origPrice = product.price || 0;
  const discPrice = discounted(origPrice);
  const imageUrl  = product.image_url || product.image || "";

  return (
    <div style={{
      background: "white", borderRadius: 14, overflow: "hidden",
      boxShadow: "var(--shadow-sm)", transition: "all 0.22s",
      display: "flex", flexDirection: "column",
      border: "1px solid var(--border)",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.transform = "translateY(-5px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", height: 260, background: "var(--champagne)" }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.07)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48,
          }}>
            🧵
          </div>
        )}
        <span className="badge badge-sale" style={{ position: "absolute", top: 10, left: 10 }}>
          25% OFF
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        {product.category_name && (
          <p style={{
            fontSize: 11, color: "var(--text-muted)",
            textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4,
          }}>
            {product.category_name}
          </p>
        )}
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18, fontWeight: 600, color: "var(--text)", marginBottom: 10, flex: 1,
        }}>
          {product.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span className="price-discounted">₹{discPrice.toLocaleString()}</span>
          <span className="price-original">₹{origPrice.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onAddToCart(product)}
            style={{
              flex: 1, padding: "9px 0",
              background: "var(--maroon)", color: "white",
              border: "none", borderRadius: 7, fontSize: 13,
              fontWeight: 500, cursor: "pointer", transition: "0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--maroon-dark)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--maroon)"}
          >
            Add to Cart
          </button>
          <Link
            to={`/product/${product.id || product._id}`}
            style={{
              flex: 1, padding: "9px 0", background: "transparent",
              color: "var(--maroon)", border: "2px solid var(--maroon)",
              borderRadius: 7, fontSize: 13, fontWeight: 500,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "var(--maroon)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--maroon)";
            }}
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Products;