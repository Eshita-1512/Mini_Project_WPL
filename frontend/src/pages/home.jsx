import { Link } from "react-router-dom";
import banner from "../assets/login.jpeg";
import festive from "../assets/festive.png";
import wedding from "../assets/wedding.png";
import special from "../assets/special.png";
import about from "../assets/about_us.png";
import saree1 from "../assets/saree1.jpeg";
import saree2 from "../assets/saree2.jpeg";
import saree3 from "../assets/saree3.jpeg";
import saree4 from "../assets/saree4.jpeg";
import saree5 from "../assets/saree5.jpeg";
import saree6 from "../assets/saree6.jpeg";
import saree7 from "../assets/saree7.jpeg";
import saree8 from "../assets/saree8.jpeg";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const featured = [
  { id: "1", name: "Ore Manjhi", img: saree1, price: 11625, original: 15500 },
  { id: "2", name: "Swarna Kamal", img: saree2, price: 22500, original: 30000 },
  { id: "3", name: "Sun Radhike", img: saree3, price: 9800, original: 13067 },
  { id: "4", name: "Sun Ri Sajni", img: saree4, price: 10500, original: 14000 },
  { id: "5", name: "Hum Hai Taiyar", img: saree5, price: 8700, original: 11600 },
  { id: "6", name: "Gaura", img: saree6, price: 12000, original: 16000 },
  { id: "7", name: "Ganga", img: saree7, price: 13200, original: 17600 },
  { id: "8", name: "Madhu Maas", img: saree8, price: 9100, original: 12133 },
];

const weaverSteps = [
  { icon: "🪡", step: "Loom", desc: "The ancient Banarasi pit-loom is set up by master craftsmen who have spent decades perfecting the tension." },
  { icon: "🧵", step: "Thread", desc: "Pure katan silk threads and real zari gold are handpicked for every single piece." },
  { icon: "✋", step: "Weave", desc: "Each saree is woven by hand — finger by finger — taking weeks or even months to complete." },
  { icon: "🛍️", step: "You", desc: "The finished saree travels from the artisan's home directly to your doorstep." },
];

const collections = [
  { img: festive, label: "Festive", tag: "Navratri & Diwali picks" },
  { img: wedding, label: "Bridal", tag: "For your special day" },
  { img: special, label: "Occasion", tag: "Everyday elegance" },
];

function Home({ addToCart, showToast }) {
  const handleAddToCart = async (product) => {
    try {
      const res = await fetch(`${API}/api/cart`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      if (!res.ok) throw new Error();
      if (showToast) showToast(`${product.name} added to cart!`, "success");
      if (addToCart) addToCart(product);
    } catch {
      // fallback: add locally
      if (addToCart) addToCart(product);
      if (showToast) showToast(`${product.name} added to cart!`, "success");
    }
  };

  return (
    <div style={{ background: "var(--bg)", fontFamily: "'Inter', sans-serif" }}>

      {/* ══ HERO ══ */}
      <div style={{ position: "relative", margin: "0 0 0", overflow: "hidden" }}>
        <img
          src={banner}
          alt="Gaura — Heritage Woven in Gold"
          style={{ width: "100%", maxHeight: 620, objectFit: "cover", objectPosition: "center 20%", display: "block", filter: "brightness(0.85)" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(35,0,10,0.82) 0%, rgba(60,5,18,0.55) 45%, rgba(80,10,25,0.18) 75%, transparent 100%)",
          display: "flex", alignItems: "center", padding: "0 80px",
        }}>
          <div style={{ maxWidth: 480 }}>
            <span style={{
              display: "inline-block", padding: "4px 14px",
              background: "rgba(247,231,206,0.2)", border: "1px solid rgba(247,231,206,0.4)",
              borderRadius: 20, fontSize: 12, color: "#F7E7CE",
              letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16,
            }}>✦ Handwoven in Banaras</span>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 56, fontWeight: 700, color: "#F7E7CE",
              lineHeight: 1.1, marginBottom: 20,
            }}>
              Heritage<br />Woven in Gold
            </h1>
            <p style={{
              color: "rgba(247,231,206,0.85)", fontSize: 16, lineHeight: 1.75, marginBottom: 30,
            }}>
              Pure katan silk Banarasi sarees crafted by artisans whose families have woven for generations.
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              <Link to="/products" className="btn btn-primary" style={{
                padding: "13px 30px", fontSize: 15, background: "#F7E7CE", color: "var(--maroon)",
              }}>
                Shop Collection
              </Link>
              <a href="#story" style={{
                padding: "13px 30px", fontSize: 15, fontWeight: 500,
                border: "2px solid rgba(247,231,206,0.5)", color: "#F7E7CE",
                borderRadius: 8, transition: "0.2s",
              }}>
                Our Story
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ══ FEAT. PRODUCTS ══ */}
      <section style={{ padding: "68px 60px 40px" }}>
        <div className="section-header">
          <p style={{ color: "var(--text-muted)", fontSize: 13, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>
            Curated for You
          </p>
          <h2 className="section-title">Heritage Woven in Gold</h2>
          <div className="divider" />
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24,
        }}>
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link to="/products" className="btn btn-outline" style={{ padding: "12px 36px" }}>
            View All Products →
          </Link>
        </div>
      </section>

      {/* ══ COLLECTIONS ══ */}
      <section style={{ padding: "40px 60px" }}>
        <div className="section-header">
          <h2 className="section-title">Shop by Occasion</h2>
          <div className="divider" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {collections.map(({ img, label, tag }) => (
            <Link to="/products" key={label} style={{
              position: "relative", borderRadius: 14, overflow: "hidden",
              display: "block", boxShadow: "var(--shadow-sm)",
            }}>
              <img src={img} alt={label} style={{
                width: "100%", height: 320, objectFit: "cover",
                transition: "transform 0.4s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "linear-gradient(transparent, rgba(128,0,32,0.8))",
                padding: "32px 20px 20px",
              }}>
                <p style={{ color: "rgba(247,231,206,0.7)", fontSize: 12, letterSpacing: "1px", textTransform: "uppercase" }}>{tag}</p>
                <h3 style={{ color: "#F7E7CE", fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700 }}>
                  {label}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ WEAVER'S PROCESS ══ */}
      <section style={{ padding: "56px 60px", background: "var(--maroon)", margin: "0" }}>
        <div className="section-header">
          <p style={{ color: "rgba(247,231,206,0.65)", fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>
            The Art Behind Every Thread
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 38,
            color: "#F7E7CE", marginBottom: 8,
          }}>
            The Weaver's Process
          </h2>
          <div style={{ width: 54, height: 3, background: "var(--turmeric)", margin: "10px auto 0", borderRadius: 2 }} />
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28,
          position: "relative",
        }}>
          {/* Connector line */}
          <div style={{
            position: "absolute", top: 50, left: "12.5%", right: "12.5%", height: 2,
            background: "#00000000", zIndex: 0,
            display: "grid", gridTemplateColumns: "repeat(3,1fr)",
          }} />

          {weaverSteps.map(({ icon, step, desc }, i) => (
            <div key={step} style={{
              textAlign: "center", padding: "28px 20px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: 14, border: "1px solid rgba(247,231,206,0.12)",
              position: "relative", zIndex: 1,
            }}>
              {/* Step connector */}
              {i < weaverSteps.length - 1 && (
                <div style={{
                  position: "absolute", right: -28, top: 50,
                  color: "rgba(247,231,206,0.3)", fontSize: 22, zIndex: 2,
                }}>→</div>
              )}
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(247,231,206,0.1)",
                border: "2px solid rgba(247,231,206,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, margin: "0 auto 16px",
              }}>
                {icon}
              </div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22, color: "#F7E7CE", marginBottom: 10, fontWeight: 700,
              }}>
                {step}
              </h3>
              <p style={{ fontSize: 13, color: "rgba(247,231,206,0.7)", lineHeight: 1.7 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ OUR STORY ══ */}
      <section id="story" style={{ padding: "68px 60px" }}>
        <div style={{
          display: "flex", gap: 60, alignItems: "center",
          background: "white", borderRadius: 20,
          padding: "48px 52px",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--border)",
        }}>
          <div style={{ flex: "0 0 360px" }}>
            <img src={about} alt="Our Story – Loom" style={{
              width: "100%", height: 380, objectFit: "cover",
              borderRadius: 14, boxShadow: "var(--shadow-md)",
            }} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{
              display: "inline-block",
              padding: "4px 14px", background: "rgba(128,0,32,0.08)",
              borderRadius: 20, fontSize: 12, color: "var(--maroon)",
              letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16,
            }}>✦ Our Story</span>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 40, fontWeight: 700, color: "var(--maroon)", marginBottom: 20, lineHeight: 1.2,
            }}>
              Rooted in the Looms<br />of Banaras
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--text)", marginBottom: 18 }}>
              Gaura was born from a love for the ancient looms of Banaras. Each saree you find here is handwoven by master weavers whose craft has been passed down through generations — a living tradition, not just fabric.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--text)", marginBottom: 28 }}>
              We work directly with artisan families so that every thread carries both heritage and honest livelihood. When you wear Gaura, you wear a story older than time.
            </p>
            <Link to="/products" className="btn btn-primary">
              Explore the Collection
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TRUST CARDS ══ */}
      <section style={{ padding: "20px 60px 72px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { icon: "🏆", title: "100% Satisfaction", desc: "Authentic Banarasi sarees inspected for quality before dispatch." },
            { icon: "💬", title: "24/7 Support", desc: "Quick WhatsApp responses and dedicated customer support." },
            { icon: "🔒", title: "Secure Payment", desc: "End-to-end encrypted checkout with trusted payment gateways." },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{
              background: "white", padding: "28px 26px", borderRadius: 14,
              boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
              display: "flex", gap: 16, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 32, flexShrink: 0 }}>{icon}</span>
              <div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 20, color: "var(--maroon)", marginBottom: 7,
                }}>{title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  return (
    <div style={{
      background: "white", borderRadius: 14, overflow: "hidden",
      boxShadow: "var(--shadow-sm)", transition: "all 0.25s",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src={product.img} alt={product.name} style={{
          width: "100%", height: 240, objectFit: "cover",
          transition: "transform 0.4s",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />
        <span className="badge badge-sale" style={{ position: "absolute", top: 10, left: 10 }}>
          25% OFF
        </span>
      </div>
      <div style={{ padding: "14px 16px 18px" }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18, fontWeight: 600, color: "var(--text)", marginBottom: 8,
        }}>
          {product.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span className="price-discounted">₹{product.price.toLocaleString()}</span>
          <span className="price-original">₹{product.original.toLocaleString()}</span>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          style={{
            width: "100%", padding: "9px 0",
            background: "var(--maroon)", color: "white",
            border: "none", borderRadius: 7, fontSize: 13,
            fontWeight: 500, cursor: "pointer", transition: "0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--maroon-dark)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--maroon)"; }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default Home;