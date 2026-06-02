"use client";

import { useState, useEffect, useCallback } from "react";

const S = {
  page: { minHeight: "100vh", background: "#f1f5f9", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#1e293b" },
  header: { background: "#0a1628", borderBottom: "1px solid rgba(0,212,255,0.2)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 },
  logoMark: { width: 36, height: 36, background: "linear-gradient(135deg,#00d4ff,#0891b2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#0a1628" },
  body: { maxWidth: 1100, margin: "0 auto", padding: "40px 24px" },
  card: { background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "28px 32px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  row: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" },
  input: { padding: "11px 16px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit", flex: 1, minWidth: 200 },
  btn: (bg = "#00a8cc", color = "white") => ({ padding: "11px 22px", background: bg, color, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }),
  btnSm: (bg = "transparent", color = "#475569") => ({ padding: "7px 14px", background: bg, color, border: "1.5px solid #e2e8f0", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }),
  badge: (s) => {
    const map = { published: ["#dcfce7","#166534"], error: ["#fee2e2","#991b1b"], draft: ["#fef9c3","#854d0e"] };
    const [bg, c] = map[s] || map.draft;
    return { padding: "3px 10px", borderRadius: 100, fontSize: 12, fontWeight: 600, background: bg, color: c };
  },
  alert: (t) => ({ padding: "14px 20px", borderRadius: 8, fontSize: 14, fontWeight: 500, marginBottom: 20, background: t === "error" ? "#fee2e2" : t === "success" ? "#dcfce7" : "#dbeafe", color: t === "error" ? "#991b1b" : t === "success" ? "#166534" : "#1e40af", border: `1px solid ${t === "error" ? "#fca5a5" : t === "success" ? "#86efac" : "#93c5fd"}` }),
  previewBox: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "28px", marginTop: 16, lineHeight: 1.75, fontSize: 14, color: "#1e293b", whiteSpace: "pre-wrap", maxHeight: 560, overflowY: "auto" },
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [editions, setEditions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [msg, setMsg] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState("");

  function showMsg(type, text) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 6000);
  }

  const hdrs = useCallback(() => ({ "Content-Type": "application/json", "x-admin-password": password }), [password]);

  async function loadEditions() {
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/drafts", { headers: hdrs() });
      if (!res.ok) { showMsg("error", "Wrong password — try again"); return; }
      const data = await res.json();
      setEditions(data.drafts || []);
      setAuthed(true);
    } catch (e) { showMsg("error", e.message); }
    finally { setLoading(false); }
  }

  async function loadEdition(slug) {
    setLoading(true);
    try {
      const res = await fetch(`/api/newsletter/drafts/${slug}`, { headers: hdrs() });
      const data = await res.json();
      setSelected(data.draft);
      setEditContent(data.draft.content);
      setEditMode(false);
    } catch (e) { showMsg("error", e.message); }
    finally { setLoading(false); }
  }

  async function generateAndPublish() {
    setGenerating(true);
    showMsg("info", "⏳ Fetching healthcare news and generating newsletter... takes 30–60 seconds.");
    try {
      const res = await fetch("/api/newsletter/drafts", { method: "POST", headers: hdrs() });
      const data = await res.json();
      if (data.success) {
        showMsg("success", `✅ Newsletter auto-published! ${data.articleCount} articles used. Live at /newsletter-drafts/${data.slug}`);
        await loadEditions();
      } else {
        showMsg("error", `Failed: ${data.error}`);
      }
    } catch (e) { showMsg("error", e.message); }
    finally { setGenerating(false); }
  }

  async function saveEdit() {
    try {
      await fetch(`/api/newsletter/drafts/${selected.slug}`, { method: "PATCH", headers: hdrs(), body: JSON.stringify({ content: editContent }) });
      showMsg("success", "Changes saved.");
      setSelected((d) => ({ ...d, content: editContent }));
      setEditMode(false);
    } catch (e) { showMsg("error", e.message); }
  }

  async function deleteEdition(slug) {
    if (!confirm(`Delete edition ${slug}? This cannot be undone.`)) return;
    try {
      await fetch(`/api/newsletter/drafts/${slug}`, { method: "DELETE", headers: hdrs() });
      showMsg("success", "Edition deleted.");
      setSelected(null);
      await loadEditions();
    } catch (e) { showMsg("error", e.message); }
  }

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...S.card, maxWidth: 420, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#00a8cc", marginBottom: 8 }}>AI Health Intelligence</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0a1628", marginBottom: 6 }}>Admin Dashboard</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Newsletter Management Portal</p>
          {msg && <div style={S.alert(msg.type)}>{msg.text}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input style={{ ...S.input, textAlign: "center" }} type="password" placeholder="Enter admin password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadEditions()} />
            <button style={S.btn()} onClick={loadEditions} disabled={loading}>{loading ? "Verifying..." : "Access Dashboard →"}</button>
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  const published = editions.filter((e) => e.status === "published").length;
  const errors = editions.filter((e) => e.status === "error").length;

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={S.logoMark}>AI</div>
          <div>
            <div style={{ color: "white", fontSize: 15, fontWeight: 700 }}>AI Health Intelligence</div>
            <div style={{ color: "#00d4ff", fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase" }}>Newsletter Admin</div>
          </div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>Auto-publish enabled</div>
      </div>

      <div style={S.body}>
        {msg && <div style={S.alert(msg.type)}>{msg.text}</div>}

        {/* How it works banner */}
        <div style={{ background: "#dbeafe", border: "1px solid #93c5fd", borderRadius: 10, padding: "14px 20px", marginBottom: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>⚡</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1e40af", marginBottom: 4 }}>Auto-Publish is ON</div>
            <div style={{ fontSize: 13, color: "#1e40af", lineHeight: 1.6 }}>
              Every night at <strong>12:00 AM UTC</strong>, the system automatically fetches real healthcare news, generates a newsletter using AI, and <strong>publishes it immediately</strong> — no manual review required. You can also generate and publish manually below at any time.
            </div>
          </div>
        </div>

        {/* Stats + generate button */}
        <div style={{ ...S.card, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, padding: "20px 28px" }}>
          <div style={S.row}>
            <div style={{ textAlign: "center", paddingRight: 20, borderRight: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#0a1628" }}>{editions.length}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Total editions</div>
            </div>
            <div style={{ textAlign: "center", paddingRight: 20, borderRight: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#166534" }}>{published}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Published</div>
            </div>
            {errors > 0 && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#991b1b" }}>{errors}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>Errors</div>
              </div>
            )}
          </div>
          <div style={S.row}>
            <button style={S.btnSm()} onClick={loadEditions} disabled={loading}>🔄 Refresh</button>
            <button style={S.btn(generating ? "#94a3b8" : "#0a1628")} onClick={generateAndPublish} disabled={generating}>
              {generating ? "⏳ Generating & Publishing..." : "⚡ Generate & Publish Now"}
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: selected ? "300px 1fr" : "1fr", gap: 20, alignItems: "start" }}>

          {/* Edition list */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 12, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: "1px" }}>Published Editions</div>
            {editions.length === 0 && (
              <div style={{ ...S.card, textAlign: "center", color: "#94a3b8", padding: 48 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>No editions yet</div>
                <div style={{ fontSize: 13 }}>Click "Generate & Publish Now" to create today's edition, or wait for the 12am auto-publish.</div>
              </div>
            )}
            {editions.map((e) => (
              <div key={e.slug}
                onClick={() => loadEdition(e.slug)}
                style={{ background: "white", border: `1px solid ${selected?.slug === e.slug ? "#00a8cc" : "#e2e8f0"}`, borderRadius: 10, padding: "16px 20px", marginBottom: 10, cursor: "pointer", boxShadow: selected?.slug === e.slug ? "0 0 0 2px rgba(0,168,204,0.2)" : "none", transition: "all 0.15s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0a1628", marginBottom: 3 }}>{e.slug}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{e.articleCount || 0} articles · {e.savedAt ? new Date(e.savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</div>
                  </div>
                  <span style={S.badge(e.status)}>{e.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Edition viewer */}
          {selected && (
            <div style={S.card}>
              {/* Title bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#00a8cc", marginBottom: 6 }}>Edition</div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0a1628", marginBottom: 6 }}>{selected.slug}</h2>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={S.badge(selected.status)}>{selected.status}</span>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{selected.articleCount} source articles</span>
                  </div>
                </div>
                <div style={S.row}>
                  {!editMode
                    ? <button style={S.btnSm()} onClick={() => setEditMode(true)}>✏️ Edit</button>
                    : <>
                        <button style={S.btn("#10b981")} onClick={saveEdit}>💾 Save Changes</button>
                        <button style={S.btnSm()} onClick={() => setEditMode(false)}>Cancel</button>
                      </>
                  }
                  <button style={S.btn("#ef4444")} onClick={() => deleteEdition(selected.slug)}>🗑 Delete</button>
                </div>
              </div>

              {/* Auto-publish notice */}
              <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#166534" }}>
                ✅ This edition was <strong>automatically published</strong> — it is live at the public URL below.
              </div>

              {/* Source articles */}
              {selected.articles?.length > 0 && (
                <details style={{ marginBottom: 14 }}>
                  <summary style={{ fontSize: 13, fontWeight: 600, color: "#64748b", cursor: "pointer", padding: "6px 0" }}>
                    📰 {selected.articles.length} source articles used (click to expand)
                  </summary>
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                    {selected.articles.map((a, i) => (
                      <div key={i} style={{ fontSize: 12, padding: "8px 12px", background: "#f8fafc", borderRadius: 6, display: "flex", gap: 10 }}>
                        <span style={{ color: "#00a8cc", fontWeight: 700, flexShrink: 0 }}>{a.source}</span>
                        <a href={a.link} target="_blank" rel="noreferrer" style={{ color: "#1e293b", textDecoration: "none" }}>{a.title}</a>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              {/* Content */}
              {editMode
                ? <textarea style={{ ...S.previewBox, width: "100%", boxSizing: "border-box", minHeight: 500, resize: "vertical", fontFamily: "'DM Mono',monospace", fontSize: 13 }} value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                : <div style={S.previewBox}>{selected.content}</div>
              }

              {/* Public link */}
              <div style={{ marginTop: 16, padding: "14px 18px", background: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ fontSize: 13, color: "#0369a1" }}>
                  🔗 <strong>Live URL:</strong> /newsletter-drafts/{selected.slug}
                </div>
                <button style={S.btnSm("#0369a1", "white")} onClick={() => window.open(`/newsletter-drafts/${selected.slug}`, "_blank")}>
                  View Live →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
