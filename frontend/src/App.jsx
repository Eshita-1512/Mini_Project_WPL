import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Toast from "./components/Toast.jsx";

import Home from "./pages/home.jsx";
import Products from "./pages/products.jsx";
import ProductDetails from "./pages/productdetails.jsx";
import Cart from "./pages/cart.jsx";
import Checkout from "./pages/checkout.jsx";
import OrderSuccess from "./pages/ordersuccess.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Contact from "./pages/contact.jsx";
import Feedback from "./pages/feedback.jsx";
import AdminLayout from "./pages/admin.jsx";
import AdminLogin from "./pages/adminlogin.jsx";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const CART_KEY = "gaura_cart";

// ─── localStorage helpers ───────────────────────────────────────────────────
function loadLocalCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch { /* ignore */ }
}

// ─── App ────────────────────────────────────────────────────────────────────
function App() {
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState("default");
  const [user, setUser] = useState(null);

  // Local cart is the source of truth for the UI.
  // It is also synced to/from the backend when the backend is available.
  const [localCart, setLocalCart] = useState(loadLocalCart);

  const cartCount = localCart.reduce((sum, i) => sum + (i.quantity || 1), 0);

  const showToast = useCallback((msg, type = "default") => {
    setToastMsg(msg);
    setToastType(type);
  }, []);

  // ── Auth ────────────────────────────────────────────────────────────────
  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/auth/me`, { credentials: "include" });
      if (res.ok) setUser(await res.json());
      else setUser(null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  // ── Cart ─────────────────────────────────────────────────────────────────
  // On mount, try to fetch backend cart and merge with localStorage.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/cart`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          const backendCart = data.cart || (Array.isArray(data) ? data : []);
          if (backendCart.length > 0) {
            // Backend has items → use backend as source of truth
            setLocalCart(backendCart);
            saveLocalCart(backendCart);
          }
        }
      } catch {
        // Backend down → use localStorage (already loaded on init)
      }
    })();
  }, []);

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    saveLocalCart(localCart);
  }, [localCart]);

  /**
   * addToCart — called by all pages when a user clicks "Add to Cart".
   * product shape: { id, name, price, image_url|image, category_name, quantity? }
   *
   * 1. Tries to POST to backend (fire-and-forget)
   * 2. Always updates local state immediately so the UI responds instantly
   */
  const addToCart = useCallback((product, qty = 1) => {
    const productId = product.id || product._id;

    // Optimistic local update
    setLocalCart(prev => {
      const existing = prev.find(
        i => (i.id === productId || i._id === productId || i.productId === productId)
      );
      if (existing) {
        return prev.map(i =>
          (i.id === productId || i._id === productId || i.productId === productId)
            ? { ...i, quantity: (i.quantity || 1) + qty }
            : i
        );
      }
      return [...prev, { ...product, id: productId, quantity: qty }];
    });

    // Background sync to backend (failures are silently ignored)
    fetch(`${API}/api/cart`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: qty }),
    }).catch(() => { /* backend may be down — local cart is fine */ });
  }, []);

  /**
   * removeFromCart — called by Cart page
   */
  const removeFromCart = useCallback((item) => {
    const id = item.id || item._id || item.productId;
    setLocalCart(prev => prev.filter(i =>
      i.id !== id && i._id !== id && i.productId !== id
    ));
    fetch(`${API}/api/cart/${id}`, {
      method: "DELETE", credentials: "include",
    }).catch(() => { });
  }, []);

  /**
   * updateCartItem — called by Cart page to change quantity
   */
  const updateCartItem = useCallback((item, newQty) => {
    if (newQty < 1) { removeFromCart(item); return; }
    const id = item.id || item._id || item.productId;
    setLocalCart(prev => prev.map(i =>
      (i.id === id || i._id === id || i.productId === id)
        ? { ...i, quantity: newQty }
        : i
    ));
    fetch(`${API}/api/cart`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id, quantity: newQty }),
    }).catch(() => { });
  }, [removeFromCart]);

  /**
   * clearCart — called by Cart page
   */
  const clearCart = useCallback(() => {
    setLocalCart([]);
    fetch(`${API}/api/cart`, { method: "DELETE", credentials: "include" }).catch(() => { });
  }, []);

  // ── Auth handlers ────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try { await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" }); }
    catch { /* ignore */ }
    setUser(null);
    showToast("Logged out successfully");
  };

  const handleAdminLogin = (adminUser) => setUser(adminUser);

  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar user={user} cartCount={cartCount} onLogout={handleLogout} />

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home showToast={showToast} addToCart={addToCart} />} />
            <Route path="/products" element={<Products showToast={showToast} addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetails showToast={showToast} addToCart={addToCart} />} />

            {/* Cart gets the full local cart + all cart mutation functions */}
            <Route path="/cart" element={
              <Cart
                localCart={localCart}
                showToast={showToast}
                onUpdateItem={updateCartItem}
                onRemoveItem={removeFromCart}
                onClearCart={clearCart}
              />
            } />

            <Route path="/checkout" element={<Checkout showToast={showToast} localCart={localCart} />} />
            <Route path="/order-summary/:orderId" element={<OrderSuccess />} />

            <Route path="/login" element={<Login showToast={showToast} onLogin={setUser} />} />
            <Route path="/register" element={<Register showToast={showToast} onLogin={setUser} />} />

            <Route path="/contact" element={<Contact />} />
            <Route path="/feedback" element={<Feedback showToast={showToast} />} />

            <Route path="/admin/login" element={<AdminLogin onAdminLogin={handleAdminLogin} showToast={showToast} />} />
            <Route path="/admin/*" element={<AdminLayout user={user} showToast={showToast} />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      </div>
    </BrowserRouter>
  );
}

export default App;