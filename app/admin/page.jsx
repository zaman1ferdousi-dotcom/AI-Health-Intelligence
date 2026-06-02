"use client";

import { useState, useEffect, useCallback } from "react";

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    color: "#1e293b",
  },
  header: {
    background: "#0a1628",
    borderBottom: "1px solid rgba(0,212,255,0.2)",
    padding: "0 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "white",
  },
  logoMark: {
    width: 36,
    height: 36,
    background: "linear-gradient(135deg,#00d4ff,#0891b2)",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    color: "#0a1628",
  },
  logoText: { color: "white", fontSize: 15, fontWeight: 700, lineHeight: 1.3 },
  logoSub: { color: "#00d4ff", fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase" },
  body: { maxWidth: 1100, margin: "0 auto", padding: "40px 24px" },
  card: {
    background: "white",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    padding: "28px 32px",
    marginBottom: 20,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  row: { display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" },
  input: {
    padding: "11px 16px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    flex: 1,
    minWidth: 200,
  },
  btn: (color = "#00a8cc", text = "white") => ({
    padding: "11px 22px",
    background: color,
    color: text,
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  }),
  btnOutline: {
    padding: "8px 16px",
    background: "transparent",
    color: "#475569",
    border: "1.5px solid #e2e8f0",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  statusBadge: (status) => {
    const colors = {
      draft: { bg: "#fef9c3", color: "#854d0e" },
      published: { bg: "#dcfce7", color: "#166534" },
      error: { bg: "#fee2e2", color: "#991b1b" },
    };
    const c = colors[status] || colors.draft;
    return {
      padding: "3px 10px",
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 600,
      background: c.bg,
      color: c.color,
    };
  },
  draftCard: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "20px 24px",
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
    cursor: "pointer",
    transition: "box-shadow 0.2s",
  },
  previewBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "32px",
    marginTop: 20,
    lineHeight: 1.75,
    fontSize: 15,
    color: "#1e293b",
    whiteSpace: "pre-wrap",
    maxHeight: 600,
    overflowY: "auto",
  },
  tag: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#00a8cc",
    marginBottom: 8,
    display: "block",
  },
  h2: { fontSize: 22, fontWeight: 700, marginBottom: 4, color: "#0a1628" },
  alert: (type) => ({
    padding: "14px 20px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 20,
    background: type === "error" ? "#fee2e2" : type === "success" ? "#dcfce7" : "#fef9c3",
    color: type === "error" ? "#991b1b" : type === "success" ? "#166534" : "#854d0e",
    border: `1px solid ${type === "error" ? "#fca5a5" : type === "success" ? "#86efac" : "#fde047"}`,
  }),
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState("");

  function showMsg(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  }

  const headers = useCallback(
    () => ({ "Content-Type": "application/json", "x-admin-password": password }),
    [password]
  );

  async function loadDrafts() {
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/drafts", { headers: headers() });
      if (!res.ok) { showMsg("error", "Wrong password or server error"); return; }
      const data = await res.json();
      setDrafts(data.drafts || []);
      setAuthed(true);
    } catch (e) {
      showMsg("error", e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadDraft(slug) {
    setLoading(true);
    try {
      const res = await fetch(`/api/newsletter/drafts/${slug}`, { headers: headers() });
      const data = await res.json();
      setSelectedDraft(data.draft);
      setEditContent(data.draft.content);
      setEditMode(false);
    } catch (e) {
      showMsg("error", e.message);
    } finally {
      setLoading(false);
    }
  }

  async function generateNow() {
    setGenerating(true);
    showMsg("info", "Generating newsletter... this takes 30-60 seconds.");
    try {
      const res = await fetch("/api/newsletter/drafts", {
        method: "POST",
        headers: headers(),
      });
      const data = await res.json();
      if (data.success) {
        showMsg("success", `✅ Draft generated! ${data.articleCount} articles processed.`);
        await loadDrafts();
      } else {
        showMsg("error", `Generation failed: ${data.error}`);
      }
    } catch (e) {
      showMsg("error", e.message);
    } finally {
      setGenerating(false);
    }
  }

  async function updateStatus(slug, status) {
    try {
      await fetch(`/api/newsletter/drafts/${slug}`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify({ status }),
      });
      showMsg("success", `Draft marked as ${status}`);
      await loadDrafts();
      if (selectedDraft?.slug === slug) {
        setSelectedDraft((d) => ({ ...d, status }));
      }
    } catch (e) {
      showMsg("error", e.message);
    }
  }

  async function saveEdit() {
    try {
      await fetch(`/api/newsletter/drafts/${selectedDraft.slug}`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify({ content: editContent }),
      });
      showMsg("success", "Changes saved");
      setSelectedDraft((d) => ({ ...d, content: editContent }));
      setEditMode(false);
    } catch (e) {
      showMsg("error", e.message);
    }
  }

  async function deleteDraft(slug) {
    if (!confirm("Delete this draft?")) return;
    try {
      await fetch(`/api/newsletter/drafts/${slug}`, { method: "DELETE", headers: headers() });
      showMsg("success", "Draft deleted");
      setSelectedDraft(null);
      await loadDrafts();
    } catch (e) {
      showMsg("error", e.message);
    }
  }

  // ── LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...S.card, maxWidth: 420, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
          <span style={S.tag}>AI Health Intelligence</span>
          <h1 style={{ ...S.h2, marginBottom: 8 }}>Admin Dashboard</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>
            Ferdousi Zaman — Newsletter Review Portal
          </p>
          {message && <div style={S.alert(message.type)}>{message.text}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              style={{ ...S.input, textAlign: "center" }}
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadDrafts()}
            />
            <button style={S.btn()} onClick={loadDrafts} disabled={loading}>
              {loading ? "Verifying..." : "Access Dashboard →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.logo}>
          <div style={S.logoMark}>AI</div>
          <div>
            <div style={S.logoText}>AI Health Intelligence</div>
            <div style={S.logoSub}>Newsletter Admin</div>
          </div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
          Ferdousi Zaman · Editor-in-Chief
        </div>
      </div>

      <div style={S.body}>
        {message && <div style={S.alert(message.type)}>{message.text}</div>}

        {/* Actions bar */}
        <div style={{ ...S.card, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, padding: "20px 28px" }}>
          <div>
            <span style={S.tag}>Newsletter Control Panel</span>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#0a1628" }}>
              {drafts.length} draft{drafts.length !== 1 ? "s" : ""} saved
            </div>
          </div>
          <div style={S.row}>
            <button style={S.btnOutline} onClick={loadDrafts} disabled={loading}>
              🔄 Refresh
            </button>
            <button
              style={S.btn(generating ? "#94a3b8" : "#00a8cc")}
              onClick={generateNow}
              disabled={generating}
            >
              {generating ? "⏳ Generating..." : "⚡ Generate Today's Newsletter"}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selectedDraft ? "340px 1fr" : "1fr", gap: 24, alignItems: "start" }}>
          {/* Drafts list */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: "1px" }}>
              All Drafts
            </div>
            {drafts.length === 0 && (
              <div style={{ ...S.card, textAlign: "center", color: "#94a3b8", padding: 40 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
                No drafts yet.<br />Click Generate to create today&apos;s edition.
              </div>
            )}
            {drafts.map((d) => (
              <div
                key={d.slug}
                style={{
                  ...S.draftCard,
                  borderColor: selectedDraft?.slug === d.slug ? "#00a8cc" : "#e2e8f0",
                  boxShadow: selectedDraft?.slug === d.slug ? "0 0 0 2px rgba(0,168,204,0.2)" : "none",
                }}
                onClick={() => loadDraft(d.slug)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0a1628", marginBottom: 4 }}>
                    {d.slug}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>
                    {d.articleCount || 0} articles · {d.savedAt ? new Date(d.savedAt).toLocaleTimeString() : ""}
                  </div>
                </div>
                <span style={S.statusBadge(d.status)}>{d.status}</span>
              </div>
            ))}
          </div>

          {/* Draft viewer */}
          {selectedDraft && (
            <div style={S.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <span style={S.tag}>Draft Review</span>
                  <h2 style={S.h2}>{selectedDraft.slug}</h2>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
                    <span style={S.statusBadge(selectedDraft.status)}>{selectedDraft.status}</span>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>
                      {selectedDraft.articleCount} source articles
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {!editMode && (
                    <button style={S.btnOutline} onClick={() => setEditMode(true)}>✏️ Edit</button>
                  )}
                  {editMode && (
                    <>
                      <button style={S.btn("#10b981")} onClick={saveEdit}>💾 Save</button>
                      <button style={S.btnOutline} onClick={() => setEditMode(false)}>Cancel</button>
                    </>
                  )}
                  {selectedDraft.status !== "published" && (
                    <button style={S.btn("#10b981")} onClick={() => updateStatus(selectedDraft.slug, "published")}>
                      ✅ Mark Published
                    </button>
                  )}
                  {selectedDraft.status === "published" && (
                    <button style={S.btn("#f59e0b")} onClick={() => updateStatus(selectedDraft.slug, "draft")}>
                      ↩ Back to Draft
                    </button>
                  )}
                  <button style={S.btn("#ef4444")} onClick={() => deleteDraft(selectedDraft.slug)}>
                    🗑 Delete
                  </button>
                </div>
              </div>

              {/* Source articles list */}
              {selectedDraft.articles?.length > 0 && (
                <details style={{ marginBottom: 16 }}>
                  <summary style={{ fontSize: 13, fontWeight: 600, color: "#64748b", cursor: "pointer", padding: "8px 0" }}>
                    📰 {selectedDraft.articles.length} Source Articles Used
                  </summary>
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                    {selectedDraft.articles.map((a, i) => (
                      <div key={i} style={{ fontSize: 12, padding: "8px 12px", background: "#f8fafc", borderRadius: 6, display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: "#00a8cc", fontWeight: 700, flexShrink: 0 }}>{a.source}</span>
                        <a href={a.link} target="_blank" rel="noreferrer" style={{ color: "#1e293b", textDecoration: "none" }}>{a.title}</a>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              {/* Content editor or preview */}
              {editMode ? (
                <textarea
                  style={{ ...S.previewBox, width: "100%", boxSizing: "border-box", minHeight: 500, resize: "vertical", fontFamily: "'DM Mono',monospace", fontSize: 13 }}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              ) : (
                <div style={S.previewBox}>{selectedDraft.content}</div>
              )}

              {/* Public link */}
              <div style={{ marginTop: 16, padding: "14px 18px", background: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd", fontSize: 13, color: "#0369a1" }}>
                🔗 Public URL: <strong>/newsletter-drafts/{selectedDraft.slug}</strong>
                {" "}
                <button
                  style={{ ...S.btnOutline, marginLeft: 8, padding: "4px 10px", fontSize: 12 }}
                  onClick={() => window.open(`/newsletter-drafts/${selectedDraft.slug}`, "_blank")}
                >
                  Preview →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
