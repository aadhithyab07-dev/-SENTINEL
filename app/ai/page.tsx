'use client';
import { useState } from "react";

export default function AIDetector() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [custom, setCustom] = useState({
    ports_scanned: 0,
    failed_logins: 0,
    packet_size: 1500,
    foreign_connections: 0
  });

  const simulate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:5003/ai/simulate");
      const data = await res.json();
      setResult(data);
    } catch { alert("Cannot connect to AI server!"); }
    setLoading(false);
  };

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:5003/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(custom)
      });
      const data = await res.json();
      setResult(data);
    } catch { alert("Cannot connect to AI server!"); }
    setLoading(false);
  };

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", padding: "40px", fontFamily: "monospace", color: "#00ff88" }}>
      <h1 style={{ fontSize: "2rem", letterSpacing: "0.3rem", textAlign: "center" }}>AI ANOMALY DETECTOR</h1>
      <p style={{ textAlign: "center", color: "#555", marginBottom: "30px" }}>ML-powered threat detection engine</p>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ border: "1px solid #333", padding: "20px", background: "#0f0f0f", marginBottom: "20px" }}>
          <h3 style={{ color: "#00ff88", margin: "0 0 16px" }}>MANUAL ANALYSIS</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            {[
              { key: "ports_scanned", label: "Ports Scanned" },
              { key: "failed_logins", label: "Failed Logins" },
              { key: "packet_size", label: "Packet Size (bytes)" },
              { key: "foreign_connections", label: "Foreign Connections" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label style={{ color: "#555", fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>{label}</label>
                <input type="number" value={(custom as any)[key]}
                  onChange={e => setCustom({ ...custom, [key]: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid #333", color: "#00ff88", fontFamily: "monospace" }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={analyze} disabled={loading} style={{ flex: 1, padding: "12px", background: "#00ff88", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold" }}>
              {loading ? "ANALYZING..." : "ANALYZE"}
            </button>
            <button onClick={simulate} disabled={loading} style={{ flex: 1, padding: "12px", background: "transparent", color: "#00ff88", border: "1px solid #00ff88", cursor: "pointer", fontWeight: "bold" }}>
              {loading ? "SIMULATING..." : "SIMULATE ATTACK"}
            </button>
          </div>
        </div>
        {result && (
          <div style={{ border: `1px solid ${result.threat_color}`, padding: "24px", background: "#0f0f0f" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "3rem", fontWeight: "bold", color: result.threat_color }}>{result.risk_score}%</div>
              <div style={{ fontSize: "1.2rem", color: result.threat_color }}>THREAT LEVEL: {result.threat_level}</div>
            </div>
            <div style={{ background: "#1a1a1a", height: "8px", borderRadius: "4px", marginBottom: "20px" }}>
              <div style={{ background: result.threat_color, height: "100%", width: `${result.risk_score}%`, borderRadius: "4px" }} />
            </div>
            {result.alerts.length === 0 ? (
              <p style={{ textAlign: "center", color: "#00ff88" }}>No threats detected — system is clean!</p>
            ) : (
              <div>
                <h3 style={{ color: "#fff", margin: "0 0 12px" }}>ALERTS ({result.total_alerts})</h3>
                {result.alerts.map((alert: any, i: number) => (
                  <div key={i} style={{ border: `1px solid ${alert.color}`, padding: "12px", marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: alert.color, fontWeight: "bold" }}>{alert.type}</span>
                      <span style={{ color: alert.color, fontSize: "0.8rem" }}>{alert.severity}</span>
                    </div>
                    <p style={{ color: "#888", fontSize: "0.85rem", margin: "4px 0 0" }}>{alert.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}