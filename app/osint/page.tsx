'use client';
import { useState } from "react";

export default function OSINT() {
  const [ip, setIp] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async () => {
    if (!ip) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await fetch(`https://sentinel-v2tk.onrender.com/ip/${ip}`);
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch { setError("❌ Cannot connect to server!"); }
    setLoading(false);
  };

  const threatColor = (status: string) => {
    if (status === "success") return "#00ff88";
    return "#ff4444";
  };

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", padding: "40px", fontFamily: "monospace", color: "#00ff88" }}>
      <h1 style={{ fontSize: "2rem", letterSpacing: "0.3rem", textAlign: "center" }}>🌐 OSINT INTELLIGENCE</h1>
      <p style={{ textAlign: "center", color: "#555", marginBottom: "30px" }}>IP Address & Domain Intelligence Lookup</p>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <input
            value={ip}
            onChange={e => setIp(e.target.value)}
            onKeyDown={e => e.key === "Enter" && lookup()}
            placeholder="Enter IP address (e.g. 8.8.8.8)"
            style={{ flex: 1, padding: "12px", background: "#111", border: "1px solid #00ff88", color: "#00ff88", fontFamily: "monospace" }}
          />
          <button onClick={lookup} disabled={loading} style={{
            padding: "12px 24px", background: "#00ff88", color: "#000",
            border: "none", cursor: "pointer", fontWeight: "bold"
          }}>
            {loading ? "⏳" : "🔍 LOOKUP"}
          </button>
        </div>

        {error && <p style={{ color: "#ff4444", textAlign: "center" }}>{error}</p>}

        {result && (
          <div style={{ border: "1px solid #00ff88", padding: "24px", background: "#0f0f0f" }}>
            <h2 style={{ color: "#00ff88", margin: "0 0 20px", fontSize: "1.2rem" }}>
              🎯 INTELLIGENCE REPORT: {result.ip}
            </h2>
            {[
              { label: "🌍 Country", value: result.country },
              { label: "🏙️ City", value: result.city },
              { label: "📍 Region", value: result.region },
              { label: "🏢 ISP", value: result.isp },
              { label: "🏛️ Organization", value: result.org },
              { label: "✅ Status", value: result.status },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1a1a1a" }}>
                <span style={{ color: "#555" }}>{item.label}</span>
                <span style={{ color: threatColor(result.status) }}>{item.value || "Unknown"}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "20px", padding: "16px", border: "1px solid #333", background: "#0f0f0f" }}>
          <p style={{ color: "#555", fontSize: "0.8rem", margin: "0 0 8px" }}>🔥 Try these IPs:</p>
          {["8.8.8.8", "1.1.1.1", "192.168.1.1"].map(ip => (
            <button key={ip} onClick={() => { setIp(ip); }} style={{
              margin: "4px", padding: "4px 12px", background: "transparent",
              border: "1px solid #333", color: "#555", cursor: "pointer", fontFamily: "monospace"
            }}>{ip}</button>
          ))}
        </div>
      </div>
    </main>
  );
}