'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const fullText = "AI-Powered Cybersecurity Intelligence Platform";

  useEffect(() => {
    setVisible(true);
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const modules = [
    { icon: "🔍", title: "Network Scanner", desc: "Scan live network devices", path: "/", color: "#00ff88" },
    { icon: "📁", title: "Forensics Monitor", desc: "Detect file changes", path: "/forensics", color: "#00aaff" },
    { icon: "🌐", title: "OSINT Intel", desc: "IP & domain intelligence", path: "/osint", color: "#aa00ff" },
    { icon: "🤖", title: "AI Detector", desc: "ML threat detection", path: "/ai", color: "#ff4444" },
  ];

  return (
    <main style={{
      background: "#0a0a0a",
      minHeight: "100vh",
      fontFamily: "monospace",
      color: "#00ff88",
      overflow: "hidden",
      position: "relative"
    }}>
      {/* Animated background grid */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
        zIndex: 0
      }} />

      <div style={{ position: "relative", zIndex: 1, padding: "40px 20px" }}>
        {/* Header */}
        <div style={{
          textAlign: "center", marginBottom: "50px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-30px)",
          transition: "all 1s ease"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "8px", animation: "pulse 2s infinite" }}>⚡</div>
          <h1 style={{
            fontSize: "3.5rem", letterSpacing: "0.5rem", margin: "0 0 8px",
            textShadow: "0 0 20px rgba(0,255,136,0.5)"
          }}>SENTINEL</h1>
          <p style={{ color: "#555", fontSize: "0.9rem", height: "20px" }}>{text}<span style={{ animation: "blink 1s infinite" }}>|</span></p>
        </div>

        {/* Module Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px", maxWidth: "900px", margin: "0 auto 50px"
        }}>
          {modules.map((m, i) => (
            <div key={i} onClick={() => router.push(m.path)}
              style={{
                border: `1px solid ${m.color}33`,
                padding: "28px 20px", background: "#0f0f0f",
                cursor: "pointer", borderRadius: "8px", textAlign: "center",
                transition: "all 0.3s ease",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${i * 0.15}s`,
                boxShadow: `0 0 20px ${m.color}11`
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = m.color;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${m.color}44`;
                (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${m.color}33`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${m.color}11`;
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>{m.icon}</div>
              <div style={{ fontWeight: "bold", fontSize: "1rem", color: m.color, marginBottom: "6px" }}>{m.title}</div>
              <div style={{ color: "#555", fontSize: "0.8rem" }}>{m.desc}</div>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div style={{
          textAlign: "center", maxWidth: "500px", margin: "0 auto",
          border: "1px solid #1a1a1a", padding: "24px", background: "#0f0f0f",
          borderRadius: "8px",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.5s ease"
        }}>
          <p style={{ color: "#333", fontSize: "0.75rem", margin: "0 0 12px", letterSpacing: "0.2rem" }}>BUILT BY</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
            {["Aadhithya B", "Bharath K"].map((name, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  width: "45px", height: "45px", borderRadius: "50%",
                  background: i === 0 ? "#00ff8833" : "#0088ff33",
                  border: `2px solid ${i === 0 ? "#00ff88" : "#0088ff"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 8px", fontSize: "1.2rem"
                }}>
                  {i === 0 ? "A" : "B"}
                </div>
                <div style={{ fontSize: "0.85rem", color: i === 0 ? "#00ff88" : "#0088ff" }}>{name}</div>
                <div style={{ fontSize: "0.7rem", color: "#333" }}>Developer</div>
              </div>
            ))}
          </div>
          <p style={{ color: "#222", fontSize: "0.7rem", margin: "16px 0 0" }}>
            B.E. CSE Cyber Security | Prathyusha Engineering College | 2025-2026
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </main>
  );
}