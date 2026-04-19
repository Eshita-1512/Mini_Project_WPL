import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import img_saree1 from "../assets/saree1.jpeg";
import img_saree2 from "../assets/saree2.jpeg";
import img_saree3 from "../assets/saree3.jpeg";
import img_saree4 from "../assets/saree4.jpeg";
import img_saree5 from "../assets/saree5.jpeg";
import img_saree6 from "../assets/saree6.jpeg";
import img_saree7 from "../assets/saree7.jpeg";
import img_saree8 from "../assets/saree8.jpeg";
import img_saree9 from "../assets/saree9.jpeg";
import img_saree10 from "../assets/saree10.jpeg";
import img_saree11 from "../assets/saree11.jpeg";
import img_saree12 from "../assets/saree12.jpeg";
import img_saree13 from "../assets/saree13.jpeg";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// ── Map DB filename → local bundled asset ────────────────────────────────────
const FILENAME_MAP = {
  "saree1.jpeg": img_saree1,   "saree2.jpeg": img_saree2,
  "saree3.jpeg": img_saree3,   "saree4.jpeg": img_saree4,
  "saree5.jpeg": img_saree5,   "saree6.jpeg": img_saree6,
  "saree7.jpeg": img_saree7,   "saree8.jpeg": img_saree8,
  "saree9.jpeg": img_saree9,   "saree10.jpeg": img_saree10,
  "saree11.jpeg": img_saree11, "saree12.jpeg": img_saree12,
  "saree13.jpeg": img_saree13,
};
function resolveImage(imageUrl) {
  if (!imageUrl) return "";
  return FILENAME_MAP[imageUrl] || imageUrl;
}

function ProductDetails({ addToCart, showToast }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]         = useState(1);
  const [added, setAdded]     = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/products/${id}`, { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(rawData => {
        // API returns { success, product: {...} } — extract the product object
        const data = rawData?.product || rawData;
        if (data) {
          // Map backend field names → frontend field names
          if (data.original_price) data.price = data.original_price;
          const pid = data.product_id || data.id || id;
          data.id = pid;
          // Always attach local image
          data.image_url = resolveImage(data.image_url) || "";
          setProduct(data);
        } else {
          // API returned nothing — show image-only placeholder if we have the image
          setProduct(null);
        }
      })
      .catch(() => {
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await fetch(`${API}/api/cart`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id || product._id, quantity: qty }),
      });
    } catch { /* ignore */ }
    if (addToCart) addToCart({ ...product, quantity: qty });
    if (showToast) showToast(`${product.name} added to cart!`, "success");
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) return (
    <div style={{ padding: "60px", background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ display: "flex", gap: 48 }}>
        <div className="skeleton" style={{ width: 440, height: 520, borderRadius: 14 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 36, width: "60%", marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 24, width: "30%", marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 80, marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 48, width: "50%" }} />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div style={{ padding: "80px 60px", background: "var(--bg)", minHeight: "100vh", textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 16, fontFamily: "'Cormorant Garamond', serif", color: "var(--maroon)" }}>?</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: "var(--maroon)", marginBottom: 12 }}>
        Product Not Found
      </h2>
      <Link to="/products">
        <button className="btn btn-primary" style={{ padding: "12px 28px" }}>
          Browse All Products
        </button>
      </Link>
    </div>
  );

  const localFallback = LOCAL_PRODUCT_DATA[id] || {};
  const origPrice = product.price || localFallback.price || 0;
  const discPrice = Math.round(origPrice * 0.75);
  const savings   = origPrice - discPrice;
  const imageUrl  = product.image_url || product.image || localFallback.image || "";

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: 80 }}>

      {/* Breadcrumb */}
      <div style={{
        background: "white", padding: "14px 60px",
        borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--text-muted)",
      }}>
        <Link to="/" style={{ color: "var(--text-muted)" }}>Home</Link>
        {" / "}
        <Link to="/products" style={{ color: "var(--text-muted)" }}>Products</Link>
        {" / "}
        <span style={{ color: "var(--maroon)", fontWeight: 500 }}>{product.name}</span>
      </div>

      <div style={{
        maxWidth: 1100, margin: "40px auto 0", padding: "0 60px",
        display: "flex", gap: 56, alignItems: "flex-start",
      }}>

        {/* ── Image ── */}
        <div style={{ flex: "0 0 440px" }}>
          <div style={{
            width: "100%", height: 520, borderRadius: 16, overflow: "hidden",
            boxShadow: "var(--shadow-md)", position: "relative", background: "var(--champagne)",
          }}>
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} style={{
                width: "100%", height: "100%", objectFit: "cover",
              }} />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 36, fontFamily: "'Cormorant Garamond', serif", color: "var(--maroon)",
              }}>No Image</div>
            )}
            <span className="badge badge-sale" style={{ position: "absolute", top: 16, left: 16 }}>
              25% OFF
            </span>
          </div>
        </div>

        {/* ── Details ── */}
        <div style={{ flex: 1, paddingTop: 8 }}>

          {product.category_name && (
            <span style={{
              display: "inline-block",
              padding: "3px 12px", background: "rgba(128,0,32,0.08)",
              borderRadius: 20, fontSize: 12, color: "var(--maroon)",
              letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12,
            }}>
              {product.category_name}
            </span>
          )}

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 44, fontWeight: 700, color: "var(--text)",
            lineHeight: 1.15, marginBottom: 18,
          }}>
            {product.name}
          </h1>

          {/* Pricing */}
          <div style={{
            background: "white", borderRadius: 12, padding: "18px 20px",
            border: "1px solid var(--border)", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 20,
          }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 36, fontWeight: 700, color: "var(--maroon)",
            }}>
              ₹{discPrice.toLocaleString()}
            </span>
            <div>
              <p style={{
                fontSize: 16, color: "var(--text-muted)",
                textDecoration: "line-through",
              }}>
                ₹{origPrice.toLocaleString()}
              </p>
              <p style={{ fontSize: 13, color: "#1a6b3c", fontWeight: 600 }}>
                You save ₹{savings.toLocaleString()} (25%)
              </p>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <p style={{
              fontSize: 15, color: "var(--text)", lineHeight: 1.8,
              marginBottom: 24, padding: "16px 0",
              borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
            }}>
              {product.description}
            </p>
          )}

          {/* Features */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
            {[
              "Handwoven by master artisans in Banaras",
              "Pure Katan Silk with Zari work",
              "Ships within 3–5 business days",
              "7-day hassle-free returns",
            ].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Qty + Add to Cart */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            {/* Qty selector */}
            <div style={{
              display: "flex", alignItems: "center",
              border: "1.5px solid var(--border)", borderRadius: 8, overflow: "hidden",
            }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{
                  width: 40, height: 44, border: "none",
                  background: "white", color: "var(--maroon)",
                  fontSize: 18, fontWeight: 600, cursor: "pointer",
                }}
              >
                −
              </button>
              <span style={{
                width: 44, textAlign: "center", fontSize: 15, fontWeight: 600,
                background: "var(--bg-light)",
              }}>
                {qty}
              </span>
              <button
                onClick={() => setQty(q => q + 1)}
                style={{
                  width: 40, height: 44, border: "none",
                  background: "white", color: "var(--maroon)",
                  fontSize: 18, fontWeight: 600, cursor: "pointer",
                }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              style={{
                flex: 1, padding: "13px 0",
                background: added ? "#1a6b3c" : "var(--maroon)",
                color: "white", border: "none", borderRadius: 8,
                fontSize: 15, fontWeight: 600, cursor: "pointer",
                transition: "background 0.3s",
              }}
            >
              {added ? "Added to Cart!" : "Add to Cart"}
            </button>
          </div>

          <Link to="/checkout">
            <button style={{
              width: "100%", padding: "13px 0",
              background: "transparent", color: "var(--maroon)",
              border: "2px solid var(--maroon)", borderRadius: 8,
              fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}>
              Buy Now →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;