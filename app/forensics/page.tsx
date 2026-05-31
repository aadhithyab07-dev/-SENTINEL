'use client';
import { useState } from "react";

export default function Forensics() {
  const [path, setPath] = useState("C:\\Users\\jayanthi\\Desktop");
  const [baseline, setBaseline] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const takeBaseline = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("https://sentinel-v2tk.onrender.com/forensics/baseline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path })
      });
      const data = await res.json();
      setBaseline(true);
      setMessage(`✅ Baseline captured! ${data.total_files} files recorded.`);
    } catch { setMessage("❌ Error connecting to server!"); }
    setLoading(false);
  };

  const scanChanges = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("https://sentinel-v2tk.onrender.com/forensics/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path })
      });
      const data = await res.json();
      setResult(data);
    } catch { setMessage("❌ Error connecting to server!"); }
    setLoading(false);
  };

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", padding: "40px", fontFamily: "monospace", color: "#00ff88" }}>
      <h1 style={{ fontSize: "2rem", letterSpacing: "0.3rem", textAlign: "center" }}>🔍 FORENSICS MONITOR</h1>
      <p style={{ textAlign: "center", color: "#555", marginBottom: "30px" }}>Detect unauthorized file changes in real time</p>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <input value={path} onChange={e => setPath(e.target.value)}
          style={{ width: "100%", padding: "10px", background: "#111", border: "1px solid #00ff88", color: "#00ff88", fontFamily: "monospace", marginBottom: "16px" }} />

        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <button onClick={takeBaseline} disabled={loading} style={{
            flex: 1, padding: "12px", background: "#00ff88", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold"
          }}>{loading ? "⏳ WORKING..." : "📸 TAKE BASELINE"}</button>
          <button onClick={scanChanges} disabled={!baseline || loading} style={{
            flex: 1, padding: "12px", background: baseline ? "transparent" : "#222",
            color: baseline ? "#00ff88" : "#555", border: `1px solid ${baseline ? "#00ff88" : "#333"}`,
            cursor: baseline ? "pointer" : "not-allowed", fontWeight: "bold"
          }}>{loading ? "⏳ SCANNING..." : "🔎 DETECT CHANGES"}</button>
        </div>

        {message && <p style={{ color: "#00ff88", textAlign: "center", marginBottom: "20px" }}>{message}</p>}

        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ border: "1px solid #ff4444", padding: "16px", background: "#0f0f0f" }}>
              <h3 style={{ color: "#ff4444", margin: "0 0 10px" }}>🆕 NEW FILES ({result.total_new || 0})</h3>
              {(result.new_files || []).length === 0 ? <p style={{ color: "#555" }}>None detected</p> :
                (result.new_files || []).map((f: string, i: number) => <p key={i} style={{ color: "#ff4444", fontSize: "0.8rem", margin: "2px 0" }}>{f}</p>)}
            </div>
            <div style={{ border: "1px solid #ffaa00", padding: "16px", background: "#0f0f0f" }}>
              <h3 style={{ color: "#ffaa00", margin: "0 0 10px" }}>✏️ MODIFIED ({result.total_modified || 0})</h3>
              {(result.modified || []).length === 0 ? <p style={{ color: "#555" }}>None detected</p> :
                (result.modified || []).map((f: string, i: number) => <p key={i} style={{ color: "#ffaa00", fontSize: "0.8rem", margin: "2px 0" }}>{f}</p>)}
            </div>
            <div style={{ border: "1px solid #ff4444", padding: "16px", background: "#0f0f0f" }}>
              <h3 style={{ color: "#ff4444", margin: "0 0 10px" }}>🗑️ DELETED ({result.total_deleted || 0})</h3>
              {(result.deleted || []).length === 0 ? <p style={{ color: "#555" }}>None detected</p> :
                (result.deleted || []).map((f: string, i: number) => <p key={i} style={{ color: "#ff4444", fontSize: "0.8rem", margin: "2px 0" }}>{f}</p>)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}