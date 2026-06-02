"use client";

import { useState, useEffect } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  "FDA January 2026: clinical decision support AI guidance removes many tools from premarket device oversight",
  "OCR April 2026: four ransomware HIPAA settlements — $1.165M collected, 427,000 patient records exposed",
  "CMS WISeR Model live January 1 — AI prior authorization now in six states for original Medicare",
  "ONC: nearly 500 million records exchanged through TEFCA; first information blocking enforcement notices issued",
  "Hospital operating margins hit -0.6% in January 2026 per Strata national data — drug costs up 7.6%",
  "HHS HIPAA Security Rule final rule expected May 2026 — mandatory MFA, encryption, 72-hour reporting",
  "Epic native AI Charting launched February 2026, disrupting standalone ambient scribe market",
  "White House AI Action Plan released March 20, 2026 — light federal touch, state authority preserved",
  "Blue Cross Blue Shield analysis: AI-enabled hospital coding linked to $2B+ in additional claims spending",
  "ONC releases draft USCDI v7 January 29, 2026 — 29 new data elements proposed for interoperability",
];

const BREAKING_NEWS = [
  { tag: "HIPAA & COMPLIANCE", title: "HHS OCR settles four ransomware HIPAA investigations in April 2026, collecting $1.165M in penalties covering 427,000 exposed patient records", time: "April 23, 2026" },
  { tag: "HEALTH INFORMATICS", title: "ONC issues first-ever information blocking nonconformity notices to certified EHR developers; nearly 500 million records now exchanged through TEFCA", time: "February 11, 2026" },
  { tag: "HEALTH POLICY", title: "CMS WISeR Model launches January 1, 2026 — AI-assisted prior authorization now active in Arizona, New Jersey, Ohio, Oklahoma, Texas, and Washington", time: "January 1, 2026" },
  { tag: "HOSPITAL FINANCE", title: "Strata data: hospital operating margins turned negative in January 2026 at -0.6%, with drug costs rising 7.6% and supply costs 7.8% year-over-year", time: "April 2026" },
  { tag: "AI IN HEALTHCARE", title: "FDA published revised Clinical Decision Support guidance on January 6, 2026, removing many AI tools from premarket device oversight requirements", time: "January 6, 2026" },
];

const ARTICLES = [
  {
    id: "Article1", emoji: "⚖️", featured: true,
    category: "AI IN HEALTHCARE · HEALTH POLICY",
    title: "The Governance Reckoning: Why Healthcare's AI Boom Is Outrunning Its Safeguards",
    excerpt: "Hospitals are deploying AI at unprecedented speed. The compliance infrastructure to manage it has not kept pace. From ambient documentation to shadow AI, the gap between adoption and oversight is now a material institutional risk.",
    date: "June 2, 2026", read: "12 min read",
  },
  {
    id: "Article2", emoji: "🔐", featured: false,
    category: "HIPAA & COMPLIANCE",
    title: "The HIPAA Security Rule's Biggest Overhaul in 23 Years Is Here",
    excerpt: "HHS targets May 2026 to finalize the first major HIPAA Security Rule update since 2003. Mandatory encryption, MFA, 72-hour breach reporting, and annual pen testing — with $9B in projected year-one compliance costs.",
    date: "June 2, 2026", read: "14 min read",
  },
  {
    id: "Article3", emoji: "💰", featured: false,
    category: "HOSPITAL FINANCE",
    title: "Hospital Operating Margins Went Negative in January 2026",
    excerpt: "Drug costs rose 7.6%, supply costs 7.8%, and the median operating margin hit -0.6% in January. Against that backdrop, the One Big Beautiful Bill Act threatens Medicaid cuts that 66% of healthcare finance professionals call their top concern.",
    date: "June 2, 2026", read: "13 min read",
  },
  {
    id: "Article4", emoji: "🤖", featured: false,
    category: "AI IN HEALTHCARE · HEALTH POLICY",
    title: "The AI Prior Authorization Arms Race Has Reached the Hospital Finance Department",
    excerpt: "CMS launched WISeR on January 1 in six states. March 31 brought the first-ever public PA metrics. Blue Cross Blue Shield attributes $2B in excess claims to AI-enabled hospital coding.",
    date: "June 2, 2026", read: "12 min read",
  },
  {
    id: "Article5", emoji: "🛡️", featured: false,
    category: "HIPAA & COMPLIANCE · AI IN HEALTHCARE",
    title: "Your Clinicians Are Using AI You Did Not Approve. HIPAA Says That Is Your Problem.",
    excerpt: "63% of healthcare organizations lack AI governance policies. One audit found 23% of clinicians using ChatGPT for documentation. When patient data enters a consumer AI tool without a BAA, that is a HIPAA breach.",
    date: "June 2, 2026", read: "12 min read",
  },
];

const RESOURCE_CATEGORIES = [
  { emoji: "🤖", name: "AI in Healthcare", desc: "Clinical AI, ambient documentation, FDA guidance, and AI governance" },
  { emoji: "💵", name: "Hospital Finance", desc: "Operating margins, reimbursement, payer mix, and cost trends" },
  { emoji: "🏛️", name: "Health Policy", desc: "CMS, HHS, ONC updates, legislation, and regulatory analysis" },
  { emoji: "🔐", name: "HIPAA & Compliance", desc: "Security Rule, OCR enforcement, data privacy, and breach analysis" },
  { emoji: "📱", name: "Digital Health", desc: "Telehealth, wearables, digital therapeutics, and health apps" },
  { emoji: "💾", name: "Health Informatics", desc: "EHR, interoperability, FHIR, TEFCA, and data exchange" },
];

const PIPELINE_TOPICS = [
  "ONC Information Blocking Enforcement: What EHR Developers and Hospitals Must Know",
  "TEFCA at 500 Million Records: The State of Nationwide Health Data Exchange",
  "CMS WISeR Model Six-Month Analysis: Denial Rates and Provider Impact",
  "Medicaid Work Requirements and Hospital Finance: A State-by-State Analysis",
  "Epic Native AI Charting vs. Standalone Ambient Scribes: A CIO Evaluation Framework",
  "OpenEvidence at $12B: What AI Medical Reference Platforms Mean for Clinical Practice",
  "ACO LEAD Transition: What Health Systems Must Prepare Before January 2027",
  "ONC Behavioral Health IT Pilots: Implications for Mental Health Data Integration",
  "Google Health AI Platform 2026: Enterprise Strategy and Hospital Implications",
  "Site-Neutral CMS Payments: How the Surgery Migration Is Reshaping Hospital Revenue",
];

// ─── SMALL REUSABLE COMPONENTS ────────────────────────────────────────────────

function SuccessMsg({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "16px 20px", color: "#10b981", fontSize: 14, fontWeight: 500, marginTop: 16 }}>
      ✅ {text || "You are subscribed! Check your inbox to confirm."}
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────

function NavBar({ page, setPage }) {
  const links = ["Home", "Research", "Newsletter", "About", "Contact"];
  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => setPage("Home")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <div className="logo-mark">AI</div>
          <div className="logo-text">
            AI Health Intelligence
            <div className="logo-sub">Healthcare AI Intelligence</div>
          </div>
        </button>
        <div className="nav-links">
          {links.map((l) => (
            <button key={l} className={`nav-link ${page === l ? "active" : ""}`} onClick={() => setPage(l)}>{l}</button>
          ))}
        </div>
        <button className="nav-cta" onClick={() => setPage("Newsletter")}>Free Newsletter</button>
      </div>
    </nav>
  );
}

// ─── TICKER ───────────────────────────────────────────────────────────────────

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker-wrap">
      <div style={{ position: "relative", display: "flex", alignItems: "stretch" }}>
        <div className="ticker-label">LATEST</div>
        <div className="ticker-track" style={{ flex: 1, overflow: "hidden" }}>
          <div className="ticker-inner">
            {items.map((item, i) => (
              <div key={i} className="ticker-item"><span className="ticker-dot" />{item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NEWSLETTER SIGNUP FORM ───────────────────────────────────────────────────

function NewsletterForm({ dark }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 900);
  };

  if (done) return <SuccessMsg text="You are subscribed! Check your inbox to confirm your free newsletter." />;

  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: 8, fontSize: 15,
    border: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid #e2e8f0",
    background: dark ? "rgba(255,255,255,0.07)" : "#f8fafc",
    color: dark ? "#f8fafc" : "#1e293b",
    fontFamily: "inherit", outline: "none", marginBottom: 12,
  };

  return (
    <form onSubmit={handleSubmit}>
      <input style={inputStyle} type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <input style={inputStyle} type="email" placeholder="Your work email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15, marginTop: 4 }} disabled={loading}>
        {loading ? "Subscribing..." : "Subscribe Free →"}
      </button>
      <p style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.35)" : "#94a3b8", textAlign: "center", marginTop: 12 }}>
        Free. No credit card. Unsubscribe anytime.
      </p>
    </form>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <button onClick={() => setPage("Home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div className="logo-mark">AI</div>
              <div className="logo-text" style={{ color: "#f8fafc" }}>
                AI Health Intelligence
                <div className="logo-sub">Healthcare AI Intelligence</div>
              </div>
            </button>
            <p>An independent publication covering AI, digital health, informatics, finance, and health policy for healthcare professionals across the U.S.</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 12, lineHeight: 1.6 }}>
              All content is provided for educational and informational purposes only.
            </p>
          </div>
          <div className="footer-col">
            <h5>Resources</h5>
            {["AI in Healthcare", "Hospital Finance", "Health Policy", "HIPAA & Compliance", "Digital Health", "Health Informatics"].map((l) => (
              <span key={l} className="footer-link" onClick={() => setPage("Research")}>{l}</span>
            ))}
          </div>
          <div className="footer-col">
            <h5>Publication</h5>
            {[["Home", "Home"], ["Research", "Research"], ["Newsletter", "Newsletter"], ["About", "About"], ["Contact", "Contact"]].map(([label, pg]) => (
              <span key={label} className="footer-link" onClick={() => setPage(pg)}>{label}</span>
            ))}
          </div>
          <div className="footer-col">
            <h5>Free Newsletter</h5>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>Free weekly healthcare AI intelligence delivered to your inbox.</p>
            <button className="btn btn-primary" style={{ width: "100%", fontSize: 13 }} onClick={() => setPage("Newsletter")}>Subscribe Free</button>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 AI Health Intelligence. All rights reserved. An independent publication.</div>
          <div className="footer-links">
            <span className="footer-policy">Editorial Policy</span>
            <span className="footer-policy">Privacy</span>
            <span className="footer-policy" onClick={() => setPage("Contact")}>Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE: HOME ───────────────────────────────────────────────────────────────

function HomePage({ setPage }) {
  return (
    <>
      {/* HERO */}
      <div className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-inner">
            <div className="hero-badge">
              <span className="badge-dot" />
              Free Healthcare Intelligence — Open Access
            </div>
            <h1 className="hero-h1">
              AI Health Intelligence<br />
              <em>Independent. Evidence-Based. Free.</em>
            </h1>
            <p className="hero-sub">
              Free analysis, research briefs, and intelligence on healthcare AI, hospital finance,
              HIPAA compliance, health policy, and digital health — published for healthcare
              professionals, researchers, administrators, and policymakers.
            </p>
            {/* Free newsletter signup */}
            <div style={{ maxWidth: 520, margin: "0 auto 28px" }}>
              <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "6px 6px 6px 20px", display: "flex", gap: 10 }}>
                <input
                  className="hero-input"
                  type="email"
                  placeholder="Enter your email for free updates"
                  onKeyDown={(e) => { if (e.key === "Enter") setPage("Newsletter"); }}
                />
                <button className="hero-btn" onClick={() => setPage("Newsletter")}>Subscribe Free →</button>
              </div>
            </div>
            <div className="hero-trust">
              <span className="trust-item"><span className="trust-icon">✓</span> Free to read and subscribe</span>
              <span className="trust-item"><span className="trust-icon">✓</span> Evidence-based reporting</span>
              <span className="trust-item"><span className="trust-icon">✓</span> No paywalls</span>
              <span className="trust-item"><span className="trust-icon">✓</span> Independent editorial</span>
            </div>
          </div>
        </div>
        <div className="hero-stats">
          {[
            { num: "Free", label: "Open Access Publication" },
            { num: "Daily", label: "Healthcare AI Coverage" },
            { num: "100%", label: "Editorial Independence" },
            { num: "Free", label: "Newsletter Subscription" },
          ].map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <Ticker />

      {/* BREAKING NEWS */}
      <section className="section section-alt" style={{ padding: "60px 24px" }}>
        <div className="section-inner">
          <div className="section-header section-header-row">
            <div>
              <span className="section-tag">Latest News</span>
              <h2 className="section-h2">Current Healthcare Intelligence</h2>
            </div>
            <button className="link-more" onClick={() => setPage("Research")}>All research →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {BREAKING_NEWS.map((n, i) => (
              <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "18px 0", borderBottom: "1px solid #e2e8f0" }}>
                <span style={{ background: "rgba(0,145,178,0.1)", color: "#0891b2", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 100, letterSpacing: 1, textTransform: "uppercase", flexShrink: 0, marginTop: 2 }}>{n.tag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, color: "#1e293b", lineHeight: 1.5, marginBottom: 4 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLES */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header section-header-row">
            <div>
              <span className="section-tag">Free Research Articles — June 2, 2026</span>
              <h2 className="section-h2">Open-Access Healthcare Intelligence</h2>
            </div>
            <button className="link-more" onClick={() => setPage("Research")}>All articles →</button>
          </div>
          <div className="card-grid card-grid-3">
            {/* Featured large card */}
            <div className="card card-featured" onClick={() => setPage("Article1")} style={{ cursor: "pointer" }}>
              <div className="card-img" style={{ height: 220, fontSize: 60 }}>⚖️</div>
              <div className="card-body">
                <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <span className="card-category" style={{ marginBottom: 0 }}>AI IN HEALTHCARE · HEALTH POLICY</span>
                  <span style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100 }}>OPEN ACCESS</span>
                </div>
                <div className="card-title">The Governance Reckoning: Why Healthcare's AI Boom Is Outrunning Its Safeguards</div>
                <div className="card-excerpt">Hospitals are deploying AI at unprecedented speed. The compliance infrastructure to manage it has not kept pace. From ambient documentation to shadow AI, the gap is now a material institutional risk.</div>
                <div className="card-meta">
                  <span className="card-date">June 2, 2026 · 12 min read</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0891b2" }}>Read Full Article →</span>
                </div>
              </div>
            </div>
            {/* Regular article cards */}
            {ARTICLES.filter((a) => !a.featured).map((a) => (
              <div key={a.id} className="card" onClick={() => setPage(a.id)} style={{ cursor: "pointer" }}>
                <div className="card-img" style={{ height: 140, position: "relative" }}>
                  <span style={{ fontSize: 40 }}>{a.emoji}</span>
                  <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(16,185,129,0.9)", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>FREE</span>
                </div>
                <div className="card-body">
                  <div className="card-category">{a.category}</div>
                  <div className="card-title" style={{ fontSize: 17 }}>{a.title}</div>
                  <div className="card-excerpt" style={{ fontSize: 13, marginBottom: 14 }}>{a.excerpt}</div>
                  <div className="card-meta">
                    <span className="card-date">{a.date} · {a.read}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#0891b2" }}>Read →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESOURCE CENTER */}
      <section className="section section-dark">
        <div className="section-inner">
          <div className="section-header text-center" style={{ marginBottom: 48 }}>
            <span className="section-tag">Public Resource Center</span>
            <h2 className="section-h2">Free Healthcare Intelligence by Topic</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              Open-access analysis across every dimension of healthcare's technology and policy transformation.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {RESOURCE_CATEGORIES.map((c) => (
              <div key={c.name} onClick={() => setPage("Research")} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "28px 24px", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{c.emoji}</div>
                <div style={{ fontWeight: 700, color: "white", fontSize: 16, marginBottom: 8 }}>{c.name}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>{c.desc}</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--cyan)" }}>View free analysis →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREE NEWSLETTER CTA */}
      <section className="section section-alt">
        <div className="section-inner">
          <div style={{ maxWidth: 880, margin: "0 auto", background: "var(--navy)", borderRadius: 20, padding: "60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--cyan)", display: "block", marginBottom: 14 }}>Free Newsletter</span>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,3.5vw,36px)", color: "white", marginBottom: 16, lineHeight: 1.2 }}>Get Free AI Healthcare Intelligence Updates</h2>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                Weekly insights on healthcare AI, hospital finance, HIPAA compliance, digital health, and health policy — delivered free to your inbox.
              </p>
              {[
                "Healthcare AI developments and governance",
                "Hospital finance and CMS policy updates",
                "HIPAA compliance and OCR enforcement news",
                "Digital health and interoperability analysis",
              ].map((b) => (
                <div key={b} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ color: "var(--cyan)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>{b}</span>
                </div>
              ))}
            </div>
            <div>
              <NewsletterForm dark={true} />
            </div>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <div style={{ background: "#f1f5f9", borderTop: "1px solid #e2e8f0", padding: "20px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#94a3b8", maxWidth: 800, margin: "0 auto", lineHeight: 1.7 }}>
          <strong style={{ color: "#64748b" }}>Disclaimer:</strong> All content published by AI Health Intelligence is provided for educational and informational purposes only. It does not constitute legal, medical, financial, or regulatory advice. Always consult qualified professionals for specific guidance.
        </p>
      </div>
    </>
  );
}

// ─── PAGE: RESEARCH ───────────────────────────────────────────────────────────

function ResearchPage({ setPage }) {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "AI in Healthcare", "Hospital Finance", "HIPAA & Compliance", "Health Policy", "Health Informatics", "Digital Health"];

  const filtered = activeTab === "All" ? ARTICLES : ARTICLES.filter((a) => a.category.includes(activeTab.toUpperCase()) || a.category.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <>
      <div style={{ background: "var(--navy)", padding: "100px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <span className="page-hero-tag">Open-Access Research</span>
          <h1 className="page-hero-h1">Free Healthcare Intelligence</h1>
          <p className="page-hero-sub" style={{ margin: "0 auto" }}>
            Evidence-based analysis on healthcare AI, hospital finance, HIPAA compliance, health policy, and digital health. All articles are free and openly accessible.
          </p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 60 }}>
        <div className="section-inner">
          {/* Disclaimer banner */}
          <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "14px 20px", marginBottom: 32, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
            <p style={{ fontSize: 13, color: "#0369a1", lineHeight: 1.6, margin: 0 }}>
              All content is provided for educational and informational purposes only. Articles are independently researched and written by the AI Health Intelligence editorial team using verified public sources.
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
            {tabs.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "8px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "pointer", border: activeTab === t ? "none" : "1px solid #e2e8f0", background: activeTab === t ? "var(--navy)" : "white", color: activeTab === t ? "white" : "#475569", fontFamily: "inherit", transition: "all 0.2s" }}>{t}</button>
            ))}
          </div>

          {/* Article cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 60 }}>
            {filtered.map((a) => (
              <div key={a.id} onClick={() => setPage(a.id)} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "28px 32px", display: "grid", gridTemplateColumns: "64px 1fr auto", gap: 24, alignItems: "center", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = "#00a8cc"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
                <div style={{ width: 64, height: 64, background: "linear-gradient(135deg,#0a1628,#0891b2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{a.emoji}</div>
                <div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#0891b2" }}>{a.category}</span>
                    <span style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100 }}>FREE</span>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, color: "#0a1628", marginBottom: 8, lineHeight: 1.3 }}>{a.title}</div>
                  <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.55 }}>{a.excerpt}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 10 }}>{a.date} · {a.read}</div>
                </div>
                <button className="btn btn-outline" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>Read Article →</button>
              </div>
            ))}
          </div>

          {/* Research coming soon */}
          <div style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 24 }}>
              <span className="section-tag">Research Pipeline</span>
              <h2 className="section-h2" style={{ marginBottom: 8 }}>Upcoming Free Articles</h2>
              <p style={{ color: "#475569", fontSize: 15 }}>Topics currently in research and editorial development.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
              {PIPELINE_TOPICS.map((t, i) => (
                <div key={i} style={{ padding: "14px 20px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ color: "#00a8cc", fontFamily: "monospace", fontSize: 11, flexShrink: 0, marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 14, color: "#1e293b", lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div style={{ background: "#f1f5f9", borderTop: "1px solid #e2e8f0", padding: "20px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#94a3b8", maxWidth: 800, margin: "0 auto", lineHeight: 1.7 }}>
          <strong style={{ color: "#64748b" }}>Disclaimer:</strong> All content is provided for educational and informational purposes only. It does not constitute legal, medical, financial, or regulatory advice.
        </p>
      </div>
    </>
  );
}

// ─── PAGE: NEWSLETTER ─────────────────────────────────────────────────────────

function NewsletterPage() {
  return (
    <>
      <div className="nl-page-hero">
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <span className="page-hero-tag">Free Newsletter</span>
          <h1 className="page-hero-h1">Get Free AI Healthcare Intelligence Updates</h1>
          <p className="page-hero-sub" style={{ margin: "0 auto 48px" }}>
            Weekly insights on healthcare AI, hospital finance, HIPAA compliance, digital health, and health policy — delivered free to your inbox.
          </p>
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 32, maxWidth: 480, margin: "0 auto" }}>
            <NewsletterForm dark={true} />
          </div>
        </div>
      </div>

      {/* What you get */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header text-center" style={{ marginBottom: 48 }}>
            <span className="section-tag">Free Coverage</span>
            <h2 className="section-h2">What Every Issue Includes</h2>
          </div>
          <div className="nl-editions">
            {[
              { emoji: "⚡", name: "Healthcare AI Updates", desc: "FDA guidance changes, EHR AI deployments, ambient documentation trends, and clinical AI adoption analysis." },
              { emoji: "💰", name: "Hospital Finance Intelligence", desc: "Operating margin data, CMS payment updates, payer mix trends, and health system financial news." },
              { emoji: "🏛️", name: "Health Policy Radar", desc: "CMS rules, ONC interoperability updates, HHS enforcement actions, and congressional healthcare legislation." },
              { emoji: "🔐", name: "HIPAA & Compliance Alerts", desc: "OCR enforcement actions, Security Rule updates, breach reports, and compliance guidance for healthcare organizations." },
              { emoji: "📱", name: "Digital Health News", desc: "Telehealth policy, digital therapeutics, health app developments, and patient-facing technology analysis." },
              { emoji: "💾", name: "Health Informatics Briefs", desc: "TEFCA exchange milestones, information blocking enforcement, FHIR implementation, and EHR interoperability news." },
            ].map((e) => (
              <div key={e.name} className="nl-edition">
                <span className="nl-edition-icon">{e.emoji}</span>
                <div className="nl-edition-name">{e.name}</div>
                <div className="nl-edition-desc">{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section section-dark" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className="section-inner text-center">
          <h2 className="section-h2">Subscribe for Free Updates</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginBottom: 32, maxWidth: 520, margin: "16px auto 32px" }}>
            Join healthcare professionals receiving free AI Health Intelligence updates every week.
          </p>
          <div style={{ maxWidth: 420, margin: "0 auto" }}>
            <NewsletterForm dark={true} />
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 20 }}>
            All content is provided for educational and informational purposes only.
          </p>
        </div>
      </section>
    </>
  );
}

// ─── PAGE: ABOUT ──────────────────────────────────────────────────────────────

function AboutPage({ setPage }) {
  return (
    <>
      <div style={{ background: "var(--navy)", padding: "100px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <span className="page-hero-tag">About</span>
          <h1 className="page-hero-h1">About AI Health Intelligence</h1>
          <p className="page-hero-sub" style={{ margin: "0 auto" }}>
            An independent publication providing free, evidence-based healthcare intelligence to professionals, researchers, administrators, and policymakers.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="section">
        <div className="section-inner">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "start", maxWidth: 1000, margin: "0 auto" }} className="founder-about-grid">
            {/* Founder card */}
            <div style={{ background: "var(--navy)", borderRadius: 16, padding: 40, textAlign: "center", border: "1px solid rgba(0,212,255,0.15)" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,var(--cyan),var(--teal))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: "var(--navy)", margin: "0 auto 20px", border: "3px solid rgba(0,212,255,0.3)" }}>FZ</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: "white", fontWeight: 700, marginBottom: 4 }}>Ferdousi Zaman</div>
              <div style={{ fontSize: 12, color: "var(--cyan)", fontWeight: 600, marginBottom: 4 }}>DrPH Candidate</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Health Policy & Management</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" }}>Founder & Editor-in-Chief</div>
              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "16px 0" }} />
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#60a5fa", textDecoration: "none" }}>
                <span>in</span> Connect on LinkedIn
              </a>
            </div>
            {/* About text */}
            <div>
              <span className="section-tag">Our Mission</span>
              <h2 className="section-h2" style={{ marginBottom: 16 }}>Free Intelligence for Healthcare Professionals</h2>
              <p style={{ color: "var(--text-light)", lineHeight: 1.85, marginBottom: 16, fontSize: 15 }}>
                AI Health Intelligence is a free, independent publication covering the intersection of artificial intelligence, health policy, hospital finance, health informatics, and digital health in the United States.
              </p>
              <p style={{ color: "var(--text-light)", lineHeight: 1.85, marginBottom: 16, fontSize: 15 }}>
                Founded by Ferdousi Zaman, DrPH Candidate in Health Policy and Management, this publication exists to bridge the gap between academic research and operational decision-making. All content is free and openly accessible.
              </p>
              <div style={{ borderLeft: "3px solid var(--cyan)", paddingLeft: 18, fontStyle: "italic", color: "var(--navy)", fontSize: 15, lineHeight: 1.7, fontFamily: "'Playfair Display',serif", marginBottom: 28 }}>
                Healthcare intelligence should be accessible to everyone who needs it — not locked behind paywalls.
              </div>
              {/* Values */}
              {[
                { emoji: "🔬", title: "Evidence-First", text: "Every claim is sourced and verified. We distinguish between peer-reviewed evidence, preliminary data, and vendor claims — always." },
                { emoji: "⚖️", title: "Editorially Independent", text: "No payment for editorial coverage. All content is independently researched and written." },
                { emoji: "🆓", title: "Free and Open Access", text: "All articles, analysis, and research briefs are free. No paywalls, no subscriptions required to read." },
              ].map((v) => (
                <div key={v.title} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{v.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>{v.title}</div>
                    <div style={{ color: "var(--text-light)", fontSize: 14, lineHeight: 1.6 }}>{v.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coverage areas */}
      <section className="section section-alt">
        <div className="section-inner text-center">
          <span className="section-tag">Coverage Areas</span>
          <h2 className="section-h2" style={{ marginBottom: 48 }}>What We Cover</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, maxWidth: 900, margin: "0 auto" }}>
            {RESOURCE_CATEGORIES.map((c) => (
              <div key={c.name} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "28px 24px", textAlign: "left" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{c.emoji}</div>
                <div style={{ fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>{c.name}</div>
                <div style={{ color: "var(--text-light)", fontSize: 13, lineHeight: 1.6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div style={{ background: "#f1f5f9", borderTop: "1px solid #e2e8f0", padding: "20px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#94a3b8", maxWidth: 800, margin: "0 auto", lineHeight: 1.7 }}>
          <strong style={{ color: "#64748b" }}>Disclaimer:</strong> All content published by AI Health Intelligence is provided for educational and informational purposes only. It does not constitute legal, medical, financial, or regulatory advice.
        </p>
      </div>
    </>
  );
}

// ─── PAGE: CONTACT ────────────────────────────────────────────────────────────

function ContactPage() {
  const [form, setForm] = useState({ first: "", last: "", email: "", org: "", subject: "", message: "" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 900);
  };

  const inputStyle = { width: "100%", padding: "13px 16px", borderRadius: 8, fontSize: 15, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#1e293b", fontFamily: "inherit", outline: "none" };

  return (
    <>
      <div style={{ background: "var(--navy)", padding: "100px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <span className="page-hero-tag">Contact</span>
          <h1 className="page-hero-h1">Get in Touch</h1>
          <p className="page-hero-sub" style={{ margin: "0 auto" }}>
            Partnerships, editorial inquiries, story tips, and general questions — we respond to every message.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="section-inner">
          <div className="contact-grid">
            <div>
              <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 22, color: "var(--navy)", marginBottom: 16 }}>We Would Love to Hear from You</h3>
              <p style={{ color: "var(--text-light)", lineHeight: 1.7, marginBottom: 32 }}>Whether you have a story tip, want to discuss editorial, or are interested in a partnership — every inquiry receives a personal response.</p>
              <div className="contact-methods">
                {[
                  { emoji: "👩‍💼", label: "Founder and Editor", val: "Ferdousi Zaman, DrPH Candidate · ferdousi@aihealthintelligence.com" },
                  { emoji: "📧", label: "Editorial", val: "editorial@aihealthintelligence.com" },
                  { emoji: "🤝", label: "Partnerships", val: "partnerships@aihealthintelligence.com" },
                ].map((m) => (
                  <div key={m.label} className="contact-method">
                    <span className="contact-method-icon">{m.emoji}</span>
                    <div>
                      <div className="contact-method-label">{m.label}</div>
                      <div className="contact-method-val">{m.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="contact-form-card">
              <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 22, color: "var(--navy)", marginBottom: 8 }}>Send a Message</h3>
              <p style={{ fontSize: 14, color: "var(--text-light)", marginBottom: 28 }}>We typically respond within one business day.</p>
              {done ? <SuccessMsg text="Message received! We will respond within one business day." /> : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div className="form-row">
                    <input style={inputStyle} placeholder="First name" value={form.first} onChange={(e) => setForm({ ...form, first: e.target.value })} required />
                    <input style={inputStyle} placeholder="Last name" value={form.last} onChange={(e) => setForm({ ...form, last: e.target.value })} required />
                  </div>
                  <input style={inputStyle} type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  <input style={inputStyle} placeholder="Organization (optional)" value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} />
                  <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} placeholder="Your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                  <button type="submit" className="btn btn-primary" style={{ padding: "14px", fontSize: 15 }} disabled={loading}>
                    {loading ? "Sending..." : "Send Message →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── SHARED ARTICLE COMPONENTS ────────────────────────────────────────────────

function ArticleHeader({ category, title, sub, author, date, read, onBack }) {
  return (
    <div style={{ background: "var(--navy)", padding: "60px 24px 48px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer", marginBottom: 24, fontFamily: "inherit" }}>← Back</button>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--cyan)" }}>{category}</span>
          <span style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>OPEN ACCESS</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,4vw,42px)", color: "white", lineHeight: 1.2, marginBottom: 18 }}>{title}</h1>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: 28, fontWeight: 300 }}>{sub}</p>
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>By {author || "AI Health Intelligence Editorial Team"}</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>· {date} · {read}</span>
        </div>
      </div>
    </div>
  );
}

function ArticleBody({ children }) {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", padding: "48px", lineHeight: 1.85, color: "#1e293b", fontSize: 15 }}>
        {children}
      </div>
      <div style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 24px", marginTop: 24 }}>
        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.7 }}>
          <strong style={{ color: "#64748b" }}>Disclaimer:</strong> All content is provided for educational and informational purposes only. It does not constitute legal, medical, financial, or regulatory advice. Always consult qualified professionals for specific guidance.
        </p>
      </div>
    </div>
  );
}

function AH2({ children }) {
  return <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#0a1628", margin: "32px 0 14px", paddingBottom: 10, borderBottom: "2px solid #f1f5f9" }}>{children}</h2>;
}
function AP({ children }) {
  return <p style={{ marginBottom: 16, color: "#334155", lineHeight: 1.85, fontSize: 15 }}>{children}</p>;
}
function ExecSummary({ children }) {
  return (
    <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "24px 28px", marginBottom: 36 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#0369a1", marginBottom: 10 }}>Executive Summary</div>
      <p style={{ margin: 0, color: "#0c4a6e", lineHeight: 1.75, fontSize: 15 }}>{children}</p>
    </div>
  );
}
function KeyTakeaways({ items }) {
  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "28px", margin: "36px 0" }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#64748b", marginBottom: 16 }}>Key Takeaways</div>
      {items.map((t, i) => (
        <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
          <span style={{ color: "#00a8cc", fontWeight: 700, flexShrink: 0 }}>→</span>
          <span style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>{t}</span>
        </div>
      ))}
    </div>
  );
}
function Sources({ items }) {
  return (
    <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 28, marginTop: 28 }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#94a3b8", marginBottom: 14 }}>Sources</div>
      <div style={{ fontSize: 13, color: "#64748b", lineHeight: 2 }}>{items.join(" · ")}</div>
    </div>
  );
}
function FreeNewsletterCTA({ setPage }) {
  return (
    <div style={{ background: "var(--navy)", borderRadius: 12, padding: "32px", textAlign: "center", border: "1px solid rgba(0,212,255,0.15)", marginTop: 32 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--cyan)", marginBottom: 10 }}>Free Newsletter</div>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "white", marginBottom: 10 }}>Get Free Healthcare AI Intelligence Updates</h3>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 20 }}>Weekly insights on healthcare AI, hospital finance, HIPAA compliance, and health policy — free.</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={() => setPage("Newsletter")}>Subscribe Free →</button>
        <button className="btn btn-outline-white" onClick={() => setPage("Research")}>View all articles</button>
      </div>
    </div>
  );
}

// ─── ARTICLE 1 ────────────────────────────────────────────────────────────────

function Article1Page({ setPage }) {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <ArticleHeader
        category="AI IN HEALTHCARE · HEALTH POLICY"
        title="The Governance Reckoning: Why Healthcare's AI Boom Is Outrunning Its Safeguards"
        sub="Hospitals Are Deploying AI at Unprecedented Speed. The Compliance Infrastructure to Manage It Has Not Kept Pace. That Gap Is Now a Material Risk."
        date="June 2, 2026" read="12 min read"
        onBack={() => setPage("Research")}
      />
      <ArticleBody>
        <ExecSummary>
          The first half of 2026 has produced a paradox at the center of American healthcare: AI tools are being adopted faster than at any point in the industry's history, while the institutional structures required to govern, audit, and safely oversee those tools remain years behind. EHR vendors have embedded AI into clinical workflows at scale. Large health systems project hundreds of millions in AI-driven savings. The FDA has relaxed oversight of a significant class of clinical decision support software. And yet a parallel set of developments — documented safety failures, a surge in unauthorized AI use by clinical staff, mounting state-level regulation, and a serious payer-provider AI conflict — suggests the industry is approaching a governance crossroads it can no longer defer.
        </ExecSummary>

        <AH2>What Happened</AH2>
        <AP>On January 6, 2026, the FDA published revised final guidance on Clinical Decision Support Software, removing a large class of AI tools from premarket device oversight. Epic launched native AI Charting in February 2026, directly threatening the standalone ambient scribe market. CMS launched the WISeR AI prior authorization pilot in six states on January 1, 2026. And HHS issued an RFI in February 2026 seeking public comment on accelerating AI adoption while maintaining safety and privacy.</AP>
        <AP>These four regulatory and market events, occurring within weeks of each other, define the current moment: AI is being deployed everywhere, regulated unevenly, and governed almost nowhere.</AP>

        <AH2>Why It Matters</AH2>
        <AP>A 2025 IBM study found 63% of healthcare organizations lack formal AI governance policies. A security audit at one mid-sized health system found 23% of clinicians were using ChatGPT for clinical documentation — without any Business Associate Agreement, outside any institutional oversight. Meanwhile, Blue Cross Blue Shield attributed more than $2 billion in excess claims spending nationally to AI-enabled hospital coding practices.</AP>
        <AP>The financial case for AI is real. HCA Healthcare projects $400 million in 2026 AI savings. UnitedHealth Group projects nearly $1 billion. But the governance infrastructure that should accompany deployment at that scale does not yet exist in most health systems.</AP>

        <AH2>Background: Two Waves of Healthcare AI</AH2>
        <AP>Healthcare AI deployment has moved through two phases. The first wave (2018–2022) involved narrow clinical AI tools — radiology algorithms, sepsis prediction models — that required FDA clearance. The second wave, beginning with the widespread commercialization of large language models in 2023, brought generative AI tools into clinical workflows with minimal regulatory friction and far faster deployment timelines than the industry's governance structures were built to handle.</AP>

        <AH2>The FDA's January 2026 Regulatory Shift</AH2>
        <AP>On January 6, 2026, the FDA published revised final guidance on Clinical Decision Support Software. FDA Commissioner Martin Makary framed the changes as necessary to "adapt with the times." The practical effect: software that provides recommendations a clinician can independently review falls outside the agency's medical device oversight. A large class of AI diagnostic, clinical summary, and treatment recommendation tools can now reach hospitals without premarket FDA review.</AP>
        <AP>This does not eliminate the hospital's responsibility for ensuring those tools are clinically valid, bias-tested, and integrated safely. The governance obligation has been transferred from regulator to institution.</AP>

        <AH2>EHR Vendors Move to Consolidate the AI Market</AH2>
        <AP>Epic launched native AI Charting in February 2026, directly threatening standalone ambient scribe vendors including Abridge and Ambience. Epic is launching more than 150 AI features built directly into its platform in 2026. At Aultman Health System in Northeast Ohio, ambient AI within Oracle Cerner resulted in clinicians saving 30 to 60 minutes per day on documentation, with some reporting capacity to see three to five additional patients daily.</AP>
        <AP>Point-solution AI vendors that built businesses on top of EHR platforms now face competitive pressure from the platforms themselves. Hospital technology leaders should audit AI contracts signed in 2024 and early 2025 that may be redundant with native EHR capabilities now available.</AP>

        <AH2>The Financial Stakes and the AI Billing War</AH2>
        <AP>HCA Healthcare projected $400 million in 2026 cost savings from AI-driven revenue management. UnitedHealth Group projects nearly $1 billion in AI savings. But Blue Cross Blue Shield has released an analysis suggesting AI-enabled coding practices may be responsible for more than $2 billion in additional claims spending nationwide. The result is an AI arms race — hospitals maximizing revenue capture, payers using AI to scrutinize and deny claims — with patients caught between competing algorithms.</AP>

        <AH2>The Shadow AI Crisis</AH2>
        <AP>The most urgent operational challenge facing hospital executives in 2026 is not AI deployment — it is shadow AI. A 2025 IBM study found 97% of organizations that experienced AI-related security incidents had lacked proper AI access controls, and 63% of organizations surveyed lacked AI governance policies. The average healthcare security breach cost $7.4 million in 2025. When clinicians use consumer AI tools without Business Associate Agreements, any patient information entered is an impermissible disclosure under HIPAA.</AP>

        <AH2>Health Policy: Federal Deregulation Meets State Complexity</AH2>
        <AP>The regulatory environment is simultaneously more permissive at the federal level and more demanding at the state level. Texas enacted the Responsible Artificial Intelligence Governance Act effective January 1, 2026, requiring patients to be informed when AI supports their care and prohibiting AI from independently diagnosing without clinician involvement. At least 25 states have issued guidance based on the NAIC model bulletin on AI in insurance. The White House AI Action Plan, released March 20, 2026, preserves state authority to regulate AI in healthcare.</AP>

        <AH2>Expert Analysis</AH2>
        <AP>The organizations navigating this moment most successfully share three characteristics. They have established formal AI governance committees with clinical, legal, compliance, and IT representation. They have created tiered oversight frameworks that apply proportionally more stringent oversight to AI tools operating in clinical decision pathways than to administrative tools. And they have invested in clinician education that goes beyond tool usage to encompass how to critically evaluate AI outputs.</AP>
        <AP>The governance gap is not permanent. But closing it requires treating AI oversight as a core institutional competency rather than a compliance checkbox. Organizations that build that competency now will be better positioned to scale AI responsibly as the technology matures.</AP>

        <AH2>Operational Implications for Hospitals</AH2>
        <AP>Hospital CISOs should conduct an immediate shadow AI inventory: what tools are clinical staff actually using, not just what has been officially deployed. The gap between those two lists is the compliance exposure. Provide sanctioned, HIPAA-compliant alternatives before attempting enforcement. Organizations that prohibit shadow AI without providing alternatives will drive the problem underground rather than solving it.</AP>
        <AP>Hospital technology leaders should audit AI vendor contracts for stranded costs — tools deployed before EHR-native capabilities became available. Board-level AI governance should be established now, with clear decision authority over deployment timelines and vendor selection.</AP>

        <AH2>Future Outlook</AH2>
        <AP>The next 18 months will be defined by EHR consolidation of the AI market, state-level regulatory expansion, and a shift in the measure of AI success from adoption to governance and outcomes. Health systems that can demonstrate measurable outcomes from AI investments — with the institutional infrastructure to substantiate those claims — will be better positioned with boards, payers, regulators, and patients.</AP>

        <KeyTakeaways items={[
          "The FDA's January 2026 guidance removes a large class of AI clinical decision support tools from premarket review — but does not eliminate hospital liability for safe deployment.",
          "EHR vendors including Epic and Oracle Health are embedding AI natively, threatening standalone vendors and potentially stranding recent AI contracts.",
          "UnitedHealth projects $1B in AI savings; HCA $400M. The BCBS $2B coding claims analysis signals regulatory scrutiny of AI revenue cycle tools.",
          "Shadow AI is a current HIPAA breach risk: 63% of organizations lack AI governance policies; 23% of clinicians in one audit used ChatGPT for documentation.",
          "Federal deregulation plus state AI law proliferation creates a patchwork compliance environment that multi-state systems must map explicitly.",
          "The measure of AI success is shifting from adoption to governance: can your AI tools be audited, monitored, and trusted?",
        ]} />

        <Sources items={[
          "FDA: Revised Clinical Decision Support Software guidance, January 6, 2026",
          "STAT News: Epic launches AI Charting, February 2026",
          "HIT Consultant: Aultman Health Nabla deployment, January 2026",
          "Reuters: HCA $400M, UnitedHealth $1B AI savings projections, March 2026",
          "PYMNTS: Healthcare Billing Wars AI analysis, March 2026",
          "IBM: 2025 AI security incident study",
          "Wolters Kluwer: Shadow AI in healthcare report 2026",
          "Censinet: Texas RAIGA, December 2025",
          "KFF: AI in prior authorization, April 2026",
          "Manatt Health: Health AI Policy Tracker, April 2026",
        ]} />
      </ArticleBody>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 60px" }}>
        <FreeNewsletterCTA setPage={setPage} />
      </div>
    </div>
  );
}

// ─── ARTICLE 2 ────────────────────────────────────────────────────────────────

function Article2Page({ setPage }) {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <ArticleHeader
        category="HIPAA & COMPLIANCE"
        title="The HIPAA Security Rule's Biggest Overhaul in 23 Years Is Here"
        sub="Mandatory Encryption, MFA on Every System, 72-Hour Breach Reporting, Annual Penetration Testing — and a 240-Day Window to Comply After Finalization."
        date="June 2, 2026" read="14 min read"
        onBack={() => setPage("Research")}
      />
      <ArticleBody>
        <ExecSummary>
          The HIPAA Security Rule has not seen a substantive update since 2003. That changes in 2026. HHS/OCR published a Notice of Proposed Rulemaking in January 2025 that eliminates the distinction between "required" and "addressable" safeguards, mandates encryption at rest for all ePHI, requires multifactor authentication across all systems, imposes a 72-hour incident reporting timeline, and demands annual penetration testing. HHS projects $9 billion in year-one compliance costs. OCR has targeted May 2026 for finalization, with a 240-day compliance window to follow. OCR has already collected $1.278 million in HIPAA penalties in 2026 through April.
        </ExecSummary>

        <AH2>What Happened</AH2>
        <AP>On December 27, 2024, HHS/OCR published the NPRM for the HIPAA Security Rule — the first significant security update in more than two decades. In April 2026, OCR settled four ransomware-related HIPAA investigations for $1.165 million covering 427,000 exposed patient records. OCR's Risk Analysis Initiative has been expanded to cover risk management — meaning organizations that identified vulnerabilities but failed to remediate them are now in enforcement scope.</AP>

        <AH2>Why It Matters</AH2>
        <AP>OCR is already enforcing the proposed rule's principles through 2026 settlements. CHIME and more than 100 hospital systems submitted a letter to the Trump administration arguing the $9 billion year-one cost estimate would force rural hospitals to choose between cybersecurity compliance and staying open. The rule is not yet final — but compliance planning cannot wait for the final text.</AP>

        <AH2>Background</AH2>
        <AP>The HIPAA Security Rule was finalized in 2003 and last substantially updated in 2013. The healthcare cybersecurity environment has transformed entirely since then. Ransomware has become endemic, with hacking and IT incidents now driving more than 80% of large healthcare data breaches. Third-party involvement has doubled. The proposed rule responds to a pattern OCR has consistently observed: organizations with documented risk analyses that identify vulnerabilities but fail to act on them.</AP>

        <AH2>The Four Major Changes</AH2>
        <AP><strong>1. Elimination of "Addressable" Safeguards:</strong> Every security control becomes required. Policies built on "addressable" documentation must be converted to actual implementation plans.</AP>
        <AP><strong>2. Mandatory Encryption:</strong> Encryption of ePHI at rest and in transit is required. Most organizations encrypt data in transit; encryption at rest has been inconsistently deployed because it was previously addressable.</AP>
        <AP><strong>3. Multifactor Authentication:</strong> MFA is required for all electronic access to systems containing ePHI — remote and on-site. This includes clinical workstations inside hospital networks.</AP>
        <AP><strong>4. Annual Penetration Testing:</strong> Organizations must conduct and document annual penetration tests by qualified security professionals.</AP>
        <AP><strong>5. 72-Hour Incident Reporting:</strong> Internal incident reporting to organizational leadership must occur within 72 hours of discovery. The 60-day external breach notification window is separate.</AP>

        <AH2>Financial Implications</AH2>
        <AP>HHS projects $9 billion in year-one compliance costs. Large health systems (500+ beds) face estimated year-one costs of $2.5–5 million. Mid-size community hospitals face $500K–$2 million. Critical Access Hospitals and small rural hospitals face $250K–$750K — on margins of negative to 2%, potentially existential. The 0.5% annual OPPS conversion factor reduction already eroding CAH revenues compounds this pressure.</AP>

        <AH2>Business Associate Implications</AH2>
        <AP>Every AI tool, cloud service, or third-party platform that processes ePHI is a Business Associate under HIPAA. The proposed rule significantly changes the obligations BAAs must impose. Business Associates will be required to meet the same enhanced security standards as covered entities. BAAs signed before 2026 that lack encryption at rest requirements, MFA obligations, or 72-hour reporting timelines should be renegotiated before the final rule is published.</AP>

        <AH2>Operational Recommendations</AH2>
        <AP>Begin now: conduct a gap assessment against the proposed rule requirements, inventory all systems containing ePHI, assess encryption at rest status, and map MFA deployment gaps. Engage clinical informatics and nursing leadership in MFA workflow design — on-site workstation MFA is an operational change that requires clinical buy-in. Audit all BAAs and identify renegotiation priorities weighted by data volume and breach risk.</AP>

        <AH2>240-Day Compliance Roadmap</AH2>
        <AP>Upon finalization (estimated May–June 2026), hospitals have approximately 240 days — reaching a deadline of approximately January 2027. Days 0–30: gap assessment and board briefing. Days 31–90: remediation project plan, MFA pilot, vendor engagement. Days 91–180: encryption deployment, MFA rollout, annual penetration test completion, BAA updates. Days 181–240: documentation, table-top exercise, board attestation.</AP>

        <KeyTakeaways items={[
          "The HIPAA Security Rule overhaul eliminates 'addressable' flexibility — every control becomes required.",
          "Encryption at rest, MFA everywhere, 72-hour incident reporting, and annual penetration testing are the four headline requirements.",
          "HHS projects $9 billion in year-one compliance costs — rural and critical access hospitals face disproportionate burden.",
          "OCR is already enforcing the proposed rule's principles through 2026 settlements — collected $1.278M through April.",
          "The 240-day compliance window after finalization leaves approximately eight months — begin planning now.",
          "Business Associate Agreements must be updated to reflect the new enhanced BA security obligations.",
        ]} />

        <Sources items={[
          "HHS/OCR: HIPAA Security Rule NPRM, Federal Register, December 27, 2024",
          "HHS.gov: OCR Settles Four HIPAA Ransomware Investigations, April 23, 2026",
          "HIPAA Journal: New HIPAA Regulations in 2026",
          "CBIZ: 5 HIPAA Security Rule Changes in 2026, April 2026",
          "Medcurity: 2026 HIPAA Security Rule Update",
          "HIPAA Vault: 2026 HIPAA Changes, January 2026",
          "Corsica Technologies: Critical HIPAA Updates for 2026, April 2026",
          "Paubox: What's Changing with HIPAA in 2026",
          "HIPAA Journal: HIPAA Violation Statistics 2026",
        ]} />
      </ArticleBody>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 60px" }}>
        <FreeNewsletterCTA setPage={setPage} />
      </div>
    </div>
  );
}

// ─── ARTICLE 3 ────────────────────────────────────────────────────────────────

function Article3Page({ setPage }) {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <ArticleHeader
        category="HOSPITAL FINANCE"
        title="Hospital Operating Margins Went Negative in January 2026. The Worst Is Not Here Yet."
        sub="Drug Costs Rose 7.6%, Supply Costs 7.8%, and the Median Operating Margin Hit -0.6% in January. The One Big Beautiful Bill Threatens to Make It Worse."
        date="June 2, 2026" read="13 min read"
        onBack={() => setPage("Research")}
      />
      <ArticleBody>
        <ExecSummary>
          Hospital operating margins turned negative in January 2026, registering -0.6% before partially recovering to -0.3% year-to-date through February, according to Strata Decision Technology data reported by HFMA. Drug costs rose 7.6% year-over-year. Supply costs rose 7.8%. CMS finalized only a 2.6% payment update for 2026. The One Big Beautiful Bill Act includes Medicaid provisions that 66% of healthcare finance professionals named as their leading concern. Safety-net hospitals face what the Commonwealth Fund has modeled as material margin compression from reduced Medicaid revenue and increased uncompensated care.
        </ExecSummary>

        <AH2>What Happened</AH2>
        <AP>Strata Decision Technology's national hospital performance data shows a significant deterioration in operating margins in early 2026. The median margin was just 2.7% in October 2025 per Kaufman Hall. A hospital that enters 2026 with a 2.7% margin and faces 7-8% non-labor cost inflation against a 2.6% payment update can turn negative rapidly — as the Strata data confirms. Five health system CFOs told Becker's Hospital Review in May 2026 that margin resilience amid reimbursement uncertainty is their top H2 2026 priority.</AP>

        <AH2>Why It Matters</AH2>
        <AP>Medicare covered approximately 83 cents per dollar of hospital spending in 2023, per the AHA — creating aggregate underpayment exceeding $100 billion annually. Commercial payer mix is shrinking as Medicare Advantage grows, eroding the cross-subsidy that has sustained hospital finances. Now add the One Big Beautiful Bill Act: 66% of healthcare finance professionals cite government funding cuts as their top concern — ahead of labor costs, payer contracts, and supply chain.</AP>

        <AH2>Background: The Cost Inflation Problem</AH2>
        <AP>Hospital margins have been fragile since the pandemic. Labor cost inflation peaked in 2022-2023, moderated in 2024-2025, but was replaced by drug and supply cost escalation. CMS's 2026 OPPS final rule added complexity: 285 procedures removed from the inpatient-only list, drug administration at off-campus departments reimbursed at physician rates, and the 340B recoupment policy beginning with a 0.5% annual OPPS conversion factor reduction starting January 1, 2026.</AP>

        <AH2>The Medicaid Threat: One Big Beautiful Bill</AH2>
        <AP>The One Big Beautiful Bill Act includes Medicaid provisions projected by the CBO to reduce Medicaid enrollment. The Commonwealth Fund's hospital impact analysis projects reduced Medicaid revenue and increased uncompensated care will compress margins for high-Medicaid hospitals. Safety-net hospitals and those in states that implement cuts fully face the most acute risk. The Michigan Primary Care Association estimates health centers in that state alone will lose $94 million in reimbursement annually.</AP>
        <AP>Three planning scenarios: Base case (moderate state response) — Medicaid volumes decline 5-10% over 24 months, margin compression of 0.5-1.0 percentage points for high-Medicaid systems. Adverse case (full implementation) — volumes decline 15-20%, uncompensated care rises 20-30%, hospital closures accelerate in rural markets. Favorable case (strong state backstop) — margins stabilize near 2025 levels.</AP>

        <AH2>Drug and Supply Cost Analysis</AH2>
        <AP>The 7.6% drug cost increase is not uniform. Specialty pharmaceuticals — oncology, immunology, rare disease therapeutics — are driving the majority. Drug administration services at off-campus hospital outpatient departments are now reimbursed at physician rates rather than outpatient rates under the 2026 CMS OPPS final rule — a direct revenue reduction for services where drug costs are highest.</AP>

        <AH2>340B Recoupment Impact</AH2>
        <AP>Beginning January 1, 2026, CMS's 340B recoupment policy reduces payments to all OPPS hospitals through a 0.5% annual conversion factor reduction. For a hospital with $200 million in OPPS revenue, this represents $1 million in annual payment reduction — compounding each year the policy remains in effect.</AP>

        <AH2>Payer Mix Stress-Testing Framework</AH2>
        <AP>Hospital CFOs should run three payer mix stress tests before 2027 budget submission. Scenario 1 (status quo): maintain current payer ratios, model performance against expected payment updates and cost inflation. Scenario 2 (Medicaid erosion): assume 10% Medicaid volume reduction over 24 months, model uncompensated care increase at 15-20% of lost Medicaid volume. Scenario 3 (commercial compression plus Medicaid erosion): combine Medicaid erosion with 5% commercial rate reduction. This adverse scenario is what boards need to see — and that many systems are not currently modeling.</AP>

        <AH2>Operational Recommendations</AH2>
        <AP>Conduct a specialty drug cost audit by service line. Identify the top 20 drugs driving cost increases and evaluate GPO alternatives and site-of-care optimization. Review all off-campus provider-based departments providing drug administration services and model the 2026 CMS site-neutral payment impact. Engage state hospital association on Medicaid advocacy — state responses to federal changes will significantly differentiate outcomes. Assess 340B eligibility and compliance documentation.</AP>

        <KeyTakeaways items={[
          "Hospital operating margins went negative in January 2026, driven by drug (+7.6%) and supply (+8%) cost inflation far exceeding the 2.6% CMS payment update.",
          "66% of healthcare finance professionals cite government funding and Medicaid cuts as their top concern — ahead of labor, payer contracts, and supply chain.",
          "The One Big Beautiful Bill Act Medicaid provisions could materially compress margins for safety-net and high-Medicaid hospitals over 24-36 months.",
          "CMS's 2026 site-neutral payment policy and 340B recoupment represent compounding revenue reductions on top of the operating environment.",
          "Hospital CFOs must run multi-scenario payer mix stress tests before 2027 budget submission.",
        ]} />

        <Sources items={[
          "HFMA: Hospital margin trends in 2026 show rising cost pressure, April 22, 2026",
          "Becker's Hospital Review: Big threats to hospital margins, May 2026",
          "Commonwealth Fund: Medicaid Work Requirements and Hospital Revenue Impact, September 2025",
          "Fierce Healthcare: 2026 Outlook — Medicaid cuts domino effect, March 2026",
          "AHA News: CMS increases Medicare hospital outpatient department payment rates by 2.6%, November 2025",
          "Chief Healthcare Executive: Hospitals face more financial pressures in 2026, January 2026",
          "Agility Blog: Hospitals Have a Tough Financial Start to 2026, March 2026",
        ]} />
      </ArticleBody>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 60px" }}>
        <FreeNewsletterCTA setPage={setPage} />
      </div>
    </div>
  );
}

// ─── ARTICLE 4 ────────────────────────────────────────────────────────────────

function Article4Page({ setPage }) {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <ArticleHeader
        category="AI IN HEALTHCARE · HEALTH POLICY"
        title="The AI Prior Authorization Arms Race Has Reached the Hospital Finance Department"
        sub="CMS Launched WISeR on January 1 in Six States. March 31 Brought the First-Ever Public PA Metrics. Blue Cross Blue Shield Links $2B in Excess Claims to AI Hospital Coding."
        date="June 2, 2026" read="12 min read"
        onBack={() => setPage("Research")}
      />
      <ArticleBody>
        <ExecSummary>
          Three simultaneous developments have brought AI-driven prior authorization to a crisis point in 2026. CMS launched the WISeR Model on January 1, introducing technology-assisted prior authorization review for specific Medicare services in six states. March 31, 2026 marked the first public reporting deadline under CMS-0057-F, requiring major insurers to publish prior authorization metrics publicly. And Blue Cross Blue Shield released an analysis attributing more than $2 billion in excess claims spending to AI-enabled hospital coding. Nearly 53 million prior authorization requests were submitted to Medicare Advantage plans in 2024. Of those denied, 81% were overturned on appeal — but only 11.5% of denials were appealed.
        </ExecSummary>

        <AH2>What Happened</AH2>
        <AP>On January 1, 2026, CMS's WISeR Model introduced AI-assisted prior authorization for 13 device and procedure categories in Arizona, New Jersey, Ohio, Oklahoma, Texas, and Washington. Technology companies administering the reviews are paid based on savings generated from denials — a payment structure AARP and patient advocates have called a structural conflict of interest. Providers in these states are already reporting increased denials and more intensive documentation demands.</AP>
        <AP>On March 31, 2026, for the first time in U.S. healthcare history, Medicare Advantage plans, Medicaid managed care organizations, CHIP plans, and ACA marketplace insurers published prior authorization metrics publicly under CMS-0057-F. The 81% appeal overturn rate in Medicare Advantage is the most damning finding: insurers are denying claims that would be approved on appeal at a rate exceeding four in five — and counting on the fact that fewer than 12% of denials are appealed at all.</AP>

        <AH2>Why It Matters</AH2>
        <AP>Hospitals and physician practices spend an estimated 13 hours per physician per week on prior authorization administrative work. 93% of physicians report that prior authorization delays access to necessary care. The 81% MA overturn rate means the initial denial criteria are not aligned with coverage rules — or that insurers are systematically over-denying based on the low appeal rate. Either conclusion demands policy response.</AP>

        <AH2>Background: CMS-0057-F</AH2>
        <AP>CMS-0057-F was finalized in January 2024. Beginning January 1, 2026, covered payers must respond to standard PA requests within 7 calendar days, include specific denial reasons, and publish annual PA metrics publicly. FHIR-based API integration for electronic prior authorization is required by January 1, 2027. The WISeR model adds a separate track: AI-assisted review of specific Medicare services, with technology companies paid based on denial-driven savings.</AP>

        <AH2>The BCBS $2B Hospital Coding AI Analysis</AH2>
        <AP>Blue Cross Blue Shield's analysis attributes more than $2 billion in additional claims spending nationally to AI-enabled hospital coding practices. The allegation is that hospital AI coding tools are trained to maximize coded acuity — adding diagnostic codes that increase DRG weight and reimbursement. The distinction between legitimate coding improvement (capturing billable diagnoses human coders missed) and inappropriate upcoding (assigning codes without adequate documentation support) is the regulatory and legal line hospitals must navigate.</AP>
        <AP>AI-assisted coding is subject to the same False Claims Act exposure as manual coding. If an AI coding tool systematically assigns codes with inadequate clinical documentation support, the hospital bears the legal liability. CMS's CRUSH initiative (RFI released February 2026) is explicitly designed to use AI to counter AI-enabled coding fraud. Hospitals should assume CRUSH will generate audit targets based on coding pattern anomalies.</AP>

        <AH2>Revenue Exposure and Denial Management</AH2>
        <AP>For most health systems, a systematic analysis of denied claims reveals a significant revenue recovery opportunity. The average hospital appeals fewer than 15% of denied claims, and the industry benchmark for appeal success on appealed claims is 50-70%. With the MA overturn rate at 81%, organizations that have not built systematic denial management programs are leaving material revenue unrecovered.</AP>

        <AH2>Operational Recommendations</AH2>
        <AP>Conduct an independent audit of AI-coded claims versus manually-coded claims. Compare case mix index trends before and after AI deployment. Review the coding AI vendor's training data and validation methodology. Establish a WISeR denial review team for providers in the six pilot states — track denial rates by service type weekly. Ensure physician query processes are generating clinically supported documentation, not reverse-engineered documentation to support codes already assigned.</AP>

        <KeyTakeaways items={[
          "WISeR launched January 1, 2026 in six states — bringing AI-reviewed prior authorization to original Medicare for the first time.",
          "The March 31, 2026 first public PA metrics reveal an 81% appeal overturn rate in MA — evidence of systematic over-denial.",
          "BCBS attributes $2B in excess claims spending to AI-enabled hospital coding — a direct threat to hospital revenue cycle AI programs.",
          "Hospitals using AI coding tools face False Claims Act exposure if codes are not supported by clinical documentation.",
          "The AI billing war has no neutral ground — hospitals must build both defensive (denial management) and compliant (accurate documentation) infrastructure.",
        ]} />

        <Sources items={[
          "PYMNTS: Healthcare's Billing Wars Are Becoming an AI vs AI Contest, March 2026",
          "Jones Day: CMS Launches AI Program to Screen Prior Authorization Requests, August 2025",
          "AARP: AI Prior Authorization Pilot Hits Original Medicare, February 2026",
          "KFF: Regulation of AI in Prior Authorization and Claims Review, April 2026",
          "CMS: CMS-0057-F documentation and March 31, 2026 first reporting deadline",
          "MedCity News: Prior Authorization Is Broken, February 2026",
          "Nature/npj Digital Medicine: Medicare advantage becoming a disadvantage with AI in prior authorization, February 2026",
        ]} />
      </ArticleBody>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 60px" }}>
        <FreeNewsletterCTA setPage={setPage} />
      </div>
    </div>
  );
}

// ─── ARTICLE 5 ────────────────────────────────────────────────────────────────

function Article5Page({ setPage }) {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <ArticleHeader
        category="HIPAA & COMPLIANCE · AI IN HEALTHCARE"
        title="Your Clinicians Are Using AI You Did Not Approve. HIPAA Says That Is Your Problem."
        sub="63% of Healthcare Organizations Lack AI Governance Policies. One Audit Found 23% of Clinicians Using ChatGPT for Documentation. Here Is a Governance Framework to Fix It."
        date="June 2, 2026" read="12 min read"
        onBack={() => setPage("Research")}
      />
      <ArticleBody>
        <ExecSummary>
          Shadow AI — the use of consumer-grade AI tools by clinical staff outside institutional oversight — has emerged as the most immediate and underappreciated compliance risk in healthcare in 2026. Physicians spending one to two hours on EHR documentation for every hour of patient care are turning to tools that work: ChatGPT, Claude, Gemini. When a clinician copies patient information into a consumer AI tool without a Business Associate Agreement, that interaction is an impermissible disclosure of protected health information under HIPAA. A 2025 IBM study found 63% of healthcare organizations lack formal AI governance policies. The average healthcare data breach cost $7.4 million in 2025.
        </ExecSummary>

        <AH2>What Happened</AH2>
        <AP>A security audit at a mid-sized eight-hospital system found that 23% of clinicians were regularly using ChatGPT for clinical documentation tasks — without IT knowledge, without a Business Associate Agreement, and without HIPAA-compliant data handling. Wolters Kluwer's 2026 survey documented shadow AI use as surging across healthcare organizations. The IBM study found 97% of organizations that experienced AI-related security incidents had lacked proper AI access controls.</AP>
        <AP>HHS responded in February 2026 with a Request for Information on accelerating AI adoption while maintaining safety and privacy. Texas enacted the Responsible Artificial Intelligence Governance Act effective January 1, 2026. At least 25 states have issued guidance based on the NAIC model bulletin on AI in insurance.</AP>

        <AH2>Why It Matters</AH2>
        <AP>Under HIPAA, any third-party entity that receives, creates, maintains, or transmits protected health information on behalf of a covered entity is a Business Associate requiring a signed BAA. Consumer versions of ChatGPT, Claude, Gemini, and Bing AI do not sign BAAs with hospitals. The consumer versions may use submitted data to train their models. Any patient information entered into these tools constitutes an impermissible disclosure under HIPAA — triggering breach notification obligations and potential OCR investigation.</AP>

        <AH2>Background: The Root Cause</AH2>
        <AP>The shadow AI problem emerged from the collision of two forces: overwhelming clinical administrative burden and the sudden availability of powerful, accessible AI tools. Physicians document for one to two hours for every hour of patient care. EHR systems, designed primarily for billing accuracy rather than clinical workflow, have become documentation burdens contributing to clinician burnout. When generative AI became widely available and demonstrated its ability to draft coherent clinical notes from rough input, clinicians adopted it outside any institutional process — because no institutional process was fast enough.</AP>

        <AH2>HIPAA BAA Analysis: Which AI Tools Require One</AH2>
        <AP><strong>Tools with available HIPAA BAAs (enterprise versions):</strong> Microsoft Azure OpenAI Service, Google Workspace with Gemini, Amazon Bedrock, Anthropic Enterprise, Nuance DAX Copilot, Abridge.</AP>
        <AP><strong>Tools without HIPAA BAAs (consumer versions):</strong> ChatGPT (consumer and Plus), Claude.ai (consumer), Google Gemini (consumer), Microsoft Copilot (consumer). A clinician using ChatGPT Plus to draft a clinical note is creating an impermissible disclosure — there is no BAA, and the consumer terms do not constitute one.</AP>

        <AH2>Shadow AI Inventory Methodology</AH2>
        <AP>Four steps to find what your staff is actually using. Step 1: Network traffic analysis — review network logs for outbound HTTPS traffic to known AI tool endpoints. Step 2: MDM audit — if mobile device management is deployed, review installed AI applications on clinical devices. Step 3: Anonymous clinician survey — frame the survey as an AI governance initiative designed to get staff better sanctioned tools. Step 4: Help desk analysis — review tickets for the past 12 months for AI-related questions, which often surface unauthorized tool adoption.</AP>

        <AH2>Four-Tier AI Governance Framework</AH2>
        <AP><strong>Tier 1 — Prohibited:</strong> Consumer AI tools without BAAs that receive or could receive PHI. Implement technical controls and acceptable use policy. Provide sanctioned alternatives before prohibition.</AP>
        <AP><strong>Tier 2 — Conditionally Permitted:</strong> Enterprise AI tools with BAAs, subject to department-level approval and compliance review. Maintain an AI tool registry with owner, BAA status, and periodic security review.</AP>
        <AP><strong>Tier 3 — Sanctioned Clinical AI:</strong> Purpose-built healthcare AI tools with BAAs, clinical validation, and EHR integration. Formal procurement process, clinical validation review, ongoing performance monitoring required.</AP>
        <AP><strong>Tier 4 — Research AI:</strong> Tools used in research contexts under IRB oversight, separate governance track from operational clinical AI.</AP>

        <AH2>State AI Governance Requirements</AH2>
        <AP>Texas RAIGA (effective January 1, 2026): patients must be informed when AI supports healthcare services; AI tools cannot independently diagnose without clinician involvement; providers must log AI model versions and maintain bias assessment documentation. Arizona, Maryland, Nebraska: state laws banning AI as sole decision-maker in prior authorization denials. At least 25 states with NAIC-based AI guidance applicable to insurance-related AI workflows.</AP>

        <AH2>Operational Recommendations</AH2>
        <AP>Deploy sanctioned, HIPAA-compliant ambient documentation AI before attempting to prohibit shadow AI tools. Audit your BAA portfolio — identify every vendor with ePHI access and establish a renegotiation schedule. Conduct an anonymous shadow AI survey of clinical staff. Implement a formal AI governance committee with clinical, legal, compliance, and IT representation. The goal is governance, not prohibition.</AP>

        <KeyTakeaways items={[
          "Shadow AI — use of consumer AI tools without BAAs for clinical tasks — is a current HIPAA breach risk that most hospitals have not fully assessed.",
          "63% of healthcare organizations lack formal AI governance policies; 23% of clinicians in one audit were using ChatGPT for documentation.",
          "A signed BAA is required before any AI tool can receive, process, or generate PHI — consumer versions of even enterprise AI tools do not meet this requirement.",
          "Prohibition alone will not solve shadow AI. Sanctioned HIPAA-compliant alternatives must be deployed before prohibition is enforced.",
          "Texas RAIGA, effective January 1, 2026, and 25 states with NAIC AI guidance create a compliance patchwork that multi-state systems must map explicitly.",
          "The four-tier governance framework — Prohibited / Conditionally Permitted / Sanctioned Clinical / Research — provides a practical classification structure.",
        ]} />

        <Sources items={[
          "Wolters Kluwer: Shadow AI — A Hidden Risk to Healthcare, 2026",
          "TechTarget: Shadow AI in healthcare — The hidden risk to data security, September 2025",
          "SOAPNoteAI: Shadow AI in Healthcare 2026 — Risks, Compliance and Solutions, February 2026",
          "IBM: 2025 AI security incident study",
          "Censinet: Emerging AI Privacy Regulations in Healthcare, December 2025",
          "Forvis Mazars: AI Governance in Healthcare, March 2026",
          "HHS: RFI on Accelerating Adoption of AI in Clinical Care, February 2026",
          "Holland and Knight Health Dose: HHS RFI on AI in Clinical Care, January 2026",
        ]} />
      </ArticleBody>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 60px" }}>
        <FreeNewsletterCTA setPage={setPage} />
      </div>
    </div>
  );
}

// ─── APP (ROOT) ───────────────────────────────────────────────────────────────

export default function Page() {
  const [page, setPage] = useState("Home");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const pages = {
    Home: <HomePage setPage={setPage} />,
    About: <AboutPage setPage={setPage} />,
    Newsletter: <NewsletterPage />,
    Research: <ResearchPage setPage={setPage} />,
    Contact: <ContactPage />,
    Article1: <Article1Page setPage={setPage} />,
    Article2: <Article2Page setPage={setPage} />,
    Article3: <Article3Page setPage={setPage} />,
    Article4: <Article4Page setPage={setPage} />,
    Article5: <Article5Page setPage={setPage} />,
  };

  return (
    <>
      <NavBar page={page} setPage={setPage} />
      <main style={{ paddingTop: 64 }}>
        {pages[page] || pages["Home"]}
      </main>
      <Footer setPage={setPage} />
    </>
  );
}
