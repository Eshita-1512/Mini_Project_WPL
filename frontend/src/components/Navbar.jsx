import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpeg";

function Navbar({ cartCount = 0, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?q=${encodeURIComponent(search.trim())}`);
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/cart", label: "Cart" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const isOnAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {/* ── Announcement strip ── */}
      <div style={{
        background: "var(--maroon-dark)", color: "#F7E7CE",
        textAlign: "center", padding: "7px 16px", fontSize: "12.5px",
        letterSpacing: "0.6px", fontWeight: 500,
      }}>
        25% Off Sitewide &nbsp;|&nbsp;  Free Shipping in Mumbai &nbsp;|&nbsp;  Handwoven in Banaras
      </div>

      {/* ── Main navbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 1000,
        background: scrolled ? "rgba(128,0,32,0.97)" : "var(--maroon)",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.2)" : "none",
        transition: "all 0.3s ease",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px", height: "var(--navbar-h)",
        }}>

          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={logo} alt="Gaura" style={{
              width: 40, height: 40, borderRadius: "50%",
              border: "2px solid rgba(247,231,206,0.5)",
              objectFit: "cover",
            }} />
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24, fontWeight: 700, color: "#F7E7CE",
              letterSpacing: 2,
            }}>GAURA</span>
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", gap: 4 }}>
            {links.map(({ to, label }) => (
              <Link
                key={to} to={to}
                style={{
                  color: isActive(to) ? "#F7E7CE" : "rgba(255,255,255,0.8)",
                  padding: "6px 14px", borderRadius: 6, fontSize: 14,
                  fontWeight: isActive(to) ? 600 : 400,
                  background: isActive(to) ? "rgba(255,255,255,0.12)" : "transparent",
                  transition: "all 0.2s",
                  letterSpacing: "0.2px",
                }}
                onMouseEnter={e => { if (!isActive(to)) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { if (!isActive(to)) e.currentTarget.style.background = "transparent"; }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Search */}
            <form onSubmit={handleSearch} style={{ position: "relative" }}>
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search sarees..."
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(138, 16, 16, 0.32)",
                  borderRadius: 20, padding: "6px 14px 6px 32px",
                  color: "white", fontSize: 13, outline: "none", width: 160,
                  transition: "width 0.3s",
                }}
                onFocus={e => { e.target.style.width = "210px"; e.target.style.background = "rgba(255,255,255,0.18)"; }}
                onBlur={e => { e.target.style.width = "160px"; e.target.style.background = "rgba(255,255,255,0.12)"; }}
              />
              <span style={{
                position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.6)", fontSize: 13, pointerEvents: "none",
              }}>🔍</span>
            </form>

            {/* Cart */}
            <Link to="/cart" style={{ position: "relative", color: "#F7E7CE", fontSize: 22 }}
              title="Cart">
              🛒
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -8,
                  background: "var(--turmeric)", color: "#1C1C1C",
                  borderRadius: "50%", width: 18, height: 18,
                  fontSize: 10, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}            {/* User / Admin actions */}
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={onLogout} style={{
                  height: "32px", width: "115px", display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,255,255,0.15)", color: "white", borderRadius: 6, 
                  border: "1px solid rgba(255,255,255,0.2)", fontSize: 13, fontWeight: 500, 
                  cursor: "pointer", transition: "0.2s", boxSizing: "border-box",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                >
                  Logout
                </button>
                {/* Role switch button — same style as Logout */}
                {isOnAdmin ? (
                  <Link to="/login" style={{
                    height: "32px", width: "115px", display: "inline-flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(255,255,255,0.15)", color: "white", borderRadius: 6, 
                    border: "1px solid rgba(255,255,255,0.2)", fontSize: 13, fontWeight: 500, 
                    cursor: "pointer", transition: "0.2s", boxSizing: "border-box", textDecoration: "none",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                  >
                    Login as User
                  </Link>
                ) : (
                  <Link to="/admin/login" style={{
                    height: "32px", width: "115px", display: "inline-flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(255,255,255,0.15)", color: "white", borderRadius: 6, 
                    border: "1px solid rgba(255,255,255,0.2)", fontSize: 13, fontWeight: 500, 
                    cursor: "pointer", transition: "0.2s", boxSizing: "border-box", textDecoration: "none",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                  >
                    Login as Admin
                  </Link>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Link to="/login" style={{
                  height: "32px", width: "115px", display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,255,255,0.14)", color: "#F7E7CE", borderRadius: 6, 
                  border: "1px solid rgba(255,255,255,0.22)", fontSize: 13, fontWeight: 500, 
                  transition: "0.2s", boxSizing: "border-box", textDecoration: "none",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.24)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
                >
                  Login
                </Link>
                <Link to="/admin/login" style={{
                  height: "32px", width: "115px", display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,255,255,0.15)", color: "white", borderRadius: 6, 
                  border: "1px solid rgba(255,255,255,0.2)", fontSize: 13, fontWeight: 500, 
                  transition: "0.2s", boxSizing: "border-box", textDecoration: "none",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                >
                  Login as Admin
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;