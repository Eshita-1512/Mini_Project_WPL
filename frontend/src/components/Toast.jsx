import { useEffect, useRef } from "react";

function Toast({ message, type = "default", onClose }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!message) return;
    timerRef.current = setTimeout(onClose, 3200);
    return () => clearTimeout(timerRef.current);
  }, [message, onClose]);

  if (!message) return null;

  const bg =
    type === "success" ? "#1a6b3c"
    : type === "error"  ? "#b91c1c"
    : "var(--maroon)";

  const icon =
    type === "success" ? "✅"
    : type === "error"  ? "⚠️"
    : "ℹ️";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", bottom: 24, right: 24,
        background: bg, color: "white",
        padding: "13px 20px", borderRadius: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
        fontSize: 14, fontWeight: 500,
        zIndex: 9999,
        display: "flex", alignItems: "center", gap: 10,
        animation: "fadeInUp 0.3s ease",
        cursor: "pointer", maxWidth: 360,
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <span style={{ opacity: 0.6, fontSize: 12 }}>✕</span>
    </div>
  );
}

export default Toast;
