"use client";

import { useState, useEffect } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  "FDA January 2026: clinical decision support AI guidance removes many tools from premarket device oversight",
  "OCR April 2026: four ransomware HIPAA settlements, $1.165M collected, 427,000 patient records exposed",
  "CMS WISeR Model live January 1 — AI prior authorization now in six states for original Medicare",
  "ONC: nearly 500 million records exchanged through TEFCA; first information blocking enforcement notices issued",
  "Hospital operating margins hit -0.6% in January 2026 per Strata national data — drug costs up 7.6%",
  "HHS HIPAA Security Rule final rule expected May 2026 — mandatory MFA, encryption, 72-hour reporting",
  "Epic native AI Charting launched February 2026, disrupting standalone ambient scribe market",
  "White House AI Action Plan released March 20, 2026 — light federal touch, state authority preserved",
  "Blue Cross Blue Shield analysis: AI-enabled hospital coding linked to $2B+ in additional claims spending",
  "ONC releases draft USCDI v7 January 29, 2026 — 29 new data elements proposed for interoperability",
];

// ─── REAL PUBLISHED ARTICLES ───────────────────────────────────────────────────
// All articles are real, sourced, and published by AI Health Intelligence.

const ARTICLES = [
  {
    id: 1, featured: true, emoji: "⚖️",
    category: "AI IN HEALTHCARE · HEALTH POLICY",
    title: "The Governance Reckoning: Why Healthcare's AI Boom Is Outrunning Its Safeguards",
    excerpt: "Hospitals are deploying AI at unprecedented speed. The compliance infrastructure to manage it has not kept pace. From ambient documentation to shadow AI, the gap between adoption and oversight is now a material institutional risk.",
    date: "June 2, 2026", read: "12 min read",
    slug: "healthcare-ai-governance-reckoning-2026",
    free: true,
    label: "FREE TO READ",
  },
  {
    id: 2, emoji: "🔐",
    category: "HIPAA & COMPLIANCE",
    title: "The HIPAA Security Rule's Biggest Overhaul in 23 Years Is Here",
    excerpt: "HHS targets May 2026 to finalize the first major HIPAA Security Rule update since 2003. Mandatory encryption, MFA on every system, 72-hour breach reporting, and annual pen testing — with $9B in projected year-one compliance costs.",
    date: "June 2, 2026", read: "14 min read",
    slug: "hipaa-security-rule-overhaul-2026",
    free: false,
    label: "PREMIUM",
  },
  {
    id: 3, emoji: "💰",
    category: "HOSPITAL FINANCE",
    title: "Hospital Operating Margins Went Negative in January 2026. The Worst Is Not Here Yet.",
    excerpt: "Drug costs rose 7.6%, supply costs 7.8%, and the median operating margin hit -0.6% in January. Against that backdrop, the One Big Beautiful Bill Act threatens Medicaid cuts that 66% of healthcare finance professionals call their top concern.",
    date: "June 2, 2026", read: "13 min read",
    slug: "hospital-margins-negative-2026",
    free: false,
    label: "PREMIUM",
  },
  {
    id: 4, emoji: "🤖",
    category: "AI IN HEALTHCARE · HEALTH POLICY",
    title: "The AI Prior Authorization Arms Race Has Reached the Hospital Finance Department",
    excerpt: "CMS launched WISeR on January 1 in six states. March 31 brought the first-ever public PA metrics. Blue Cross Blue Shield attributes $2B in excess claims to AI-enabled hospital coding. Both sides are now using AI — with patients caught in the middle.",
    date: "June 2, 2026", read: "12 min read",
    slug: "ai-prior-authorization-arms-race-2026",
    free: false,
    label: "PREMIUM",
  },
  {
    id: 5, emoji: "🔒",
    category: "HIPAA & COMPLIANCE · AI IN HEALTHCARE",
    title: "Your Clinicians Are Using AI You Did Not Approve. HIPAA Says That Is Your Problem.",
    excerpt: "63% of healthcare organizations lack AI governance policies. One audit found 23% of clinicians using ChatGPT for documentation. When patient data enters a consumer AI tool without a BAA, that is a HIPAA breach — and most hospitals have no idea it is happening.",
    date: "June 2, 2026", read: "12 min read",
    slug: "shadow-ai-hipaa-compliance-2026",
    free: false,
    label: "PREMIUM",
  },
];

const CATEGORIES = [
  { emoji: "🤖", name: "AI in Healthcare", count: "Coverage area" },
  { emoji: "💵", name: "Hospital Finance", count: "Coverage area" },
  { emoji: "🏛️", name: "Health Policy", count: "Coverage area" },
  { emoji: "💾", name: "Health Informatics", count: "Coverage area" },
  { emoji: "📱", name: "Digital Health", count: "Coverage area" },
];

const REPORTS = [
  {
    emoji: "⚖️", tag: "AI GOVERNANCE", lock: false,
    title: "The Governance Reckoning: Why Healthcare's AI Boom Is Outrunning Its Safeguards",
    desc: "An in-depth analysis of how ambient AI deployment, FDA regulatory changes, shadow AI risks, and the EHR vendor AI consolidation are creating a governance crisis that hospital executives can no longer defer.",
    pages: "Full article", date: "June 2, 2026",
  },
  {
    emoji: "🔐", tag: "HIPAA & COMPLIANCE", lock: true,
    title: "The HIPAA Security Rule Overhaul: Complete Compliance Guide for Hospital Leaders",
    desc: "Every proposed change vs. current requirements. OCR enforcement pattern analysis. Cost modeling by hospital size. A 240-day compliance roadmap. Strategic guidance for CISOs, compliance officers, and boards.",
    pages: "Premium article", date: "June 2, 2026",
  },
  {
    emoji: "💰", tag: "HOSPITAL FINANCE", lock: true,
    title: "Hospital Margins 2026: Financial Survival Guide for Health System CFOs",
    desc: "Strata and Kaufman Hall data analysis, One Big Beautiful Bill Medicaid impact scenarios, drug cost trend analysis, CMS site-neutral payment modeling, and a payer mix stress-testing framework.",
    pages: "Premium article", date: "June 2, 2026",
  },
  {
    emoji: "🤖", tag: "HEALTH POLICY · AI", lock: true,
    title: "AI Prior Authorization Wars: WISeR, $2B in Disputed Claims, and Hospital Revenue Strategy",
    desc: "State-by-state WISeR model impact analysis, public CMS-0057-F PA metrics breakdown, BCBS $2B coding AI analysis, denial management infrastructure recommendations, and False Claims Act exposure assessment.",
    pages: "Premium article", date: "June 2, 2026",
  },
];

const AD_PACKAGES = [
  {
    emoji: "📧", name: "Newsletter Sponsor", price: "$3,500/mo", highlight: false,
    desc: "Dedicated placement in our weekly AI Healthcare Brief, reaching verified healthcare professionals across the U.S.",
    features: ["Featured sponsor mention", "Logo in header/footer", "One-click CTA button", "Monthly analytics report", "Audience: C-suite and directors"],
  },
  {
    emoji: "⭐", name: "Premier Partner", price: "$9,500/mo", highlight: true,
    desc: "Top-tier brand presence across newsletter, website, and research content. Maximum visibility to decision-makers.",
    features: ["Exclusive newsletter slot", "Sponsored research brief", "Website banner + logo", "Podcast guest opportunity", "Quarterly strategy call", "Full audience analytics"],
  },
  {
    emoji: "📄", name: "Sponsored Report", price: "$14,000", highlight: false,
    desc: "Commission a co-branded research report distributed to our full audience — the most credible form of thought leadership.",
    features: ["Custom research topic", "Editorial team writes it", "Full distribution blast", "Gated lead-gen option", "Press release support", "12-month content library"],
  },
];

const NEWSLETTER_EDITIONS = [
  {
    emoji: "⚡", name: "The AI Healthcare Brief", freq: "Every Tuesday",
    desc: "The flagship: 5 curated insights, 3 news items, 1 deep analysis, and a data point you can use in your next board meeting.",
  },
  {
    emoji: "💰", name: "Hospital Finance Intelligence", freq: "Every Thursday",
    desc: "Operating margin trends, payer mix shifts, capital allocation strategy, and M&A activity — with CFO-level clarity.",
  },
  {
    emoji: "🏛️", name: "Health Policy Radar", freq: "Every Monday",
    desc: "CMS rules, congressional legislation, state policy, and regulatory signals decoded for administrators and policy professionals.",
  },
];

const NEWSLETTER_TOPICS = [
  "5 AI tools getting real traction in health systems right now",
  "This week in health policy: what administrators need to know",
  "Hospital margin recovery: Q1 2026 data is in",
  "The ambient documentation tool comparison every CIO needs",
  "Why one health system abandoned its AI vendor",
  "CMS final rule breakdown: the 3 changes that matter most",
  "Digital health funding report: who raised, who did not",
  "EHR optimization strategies driving measurable ROI",
  "The health IT consolidation trend nobody is talking about",
  "AI diagnostic tools: FDA clearance pipeline update",
  "Value-based care winners and losers: data from 1,200 ACOs",
  "Physician sentiment on AI: new survey data",
  "Hospital M&A activity: this month analyzed",
  "The startup that just signed 3 top-10 health systems",
  "Health equity metrics: where AI is helping and where it is not",
  "Revenue cycle automation ROI: real numbers from health CFOs",
  "Telehealth utilization data: the post-pandemic reality",
  "Medicare Advantage market dynamics: what is shifting",
  "The new CMS interoperability enforcement timeline",
  "Cybersecurity incident report: what healthcare can learn",
];

const CONTENT_IDEAS = [
  "The $8.3B ambient clinical documentation market: who is winning",
  "How Mayo Clinic AI strategy differs from every other health system",
  "Prior authorization automation: why it is harder than vendors admit",
  "The real interoperability problem — hint: it is not FHIR",
  "Nursing shortage + AI: augmentation or replacement?",
  "Why 70% of hospital AI pilots never reach production",
  "The CFO guide to evaluating health tech vendors",
  "Predictive analytics in population health: evidence review",
  "Digital front door strategy: what actually works in 2026",
  "AI in radiology: radiologist perspectives vs vendor claims",
  "Value-based care contract structures decoded",
  "The cybersecurity crisis in hospital networks",
  "Telehealth reimbursement parity: state-by-state tracker",
  "Health equity and AI: addressing bias in clinical algorithms",
  "Hospital-at-home: financial model analysis",
  "EHR market consolidation: Epic, Oracle Cerner, and the rest",
  "Mental health tech: the gap between funding and outcomes",
  "Genomics data integration in clinical workflows",
  "AI-powered prior auth: real ROI from early adopters",
  "Revenue cycle management automation benchmarks",
  "Health system M&A: what the consolidation wave means",
  "Ambient AI documentation: 6-month outcomes data",
  "The new CMO: part clinician, part technology strategist",
  "Wearable data in clinical care: adoption barriers",
  "NLP in clinical coding: accuracy rates by specialty",
  "Patient experience AI: separating signal from noise",
  "Rural hospital survival guide: technology as lifeline",
  "Health IT vendor landscape 2026: up and struggling",
  "The hidden cost of EHR inefficiency on physician burnout",
  "Pharmaceutical AI in drug discovery: timeline reality check",
];

const CALENDAR = [
  { month: "Jan", theme: "State of AI in Healthcare", tag: "Annual Report" },
  { month: "Feb", theme: "Hospital Finance Outlook", tag: "Market Analysis" },
  { month: "Mar", theme: "Digital Health M&A Review", tag: "Investment Report" },
  { month: "Apr", theme: "CMS Rule Deep-Dive", tag: "Policy Brief" },
  { month: "May", theme: "Clinical AI Evidence Review", tag: "Research Brief" },
  { month: "Jun", theme: "Health IT Vendor Landscape", tag: "Market Map" },
  { month: "Jul", theme: "Mid-Year Health Tech Investment", tag: "VC Report" },
  { month: "Aug", theme: "EHR Optimization Benchmarks", tag: "Data Report" },
  { month: "Sep", theme: "Value-Based Care Performance", tag: "ACO Analysis" },
  { month: "Oct", theme: "Open Enrollment and MA Strategy", tag: "Payer Report" },
  { month: "Nov", theme: "Health Policy Outlook 2027", tag: "Policy Forecast" },
  { month: "Dec", theme: "Healthcare AI Year in Review", tag: "Annual Wrap" },
];

const STATS = [
  { num: "New", label: "Independent Publication" },
  { num: "Daily", label: "AI Healthcare Coverage" },
  { num: "Free", label: "To Start Reading" },
  { num: "100%", label: "Editorial Independence" },
];

const TESTIMONIALS = [];

const BREAKING_NEWS = [
  { tag: "HIPAA & COMPLIANCE", title: "HHS OCR settles four ransomware HIPAA investigations in April 2026, collecting $1.165M in penalties covering 427,000 exposed patient records", time: "April 23, 2026" },
  { tag: "HEALTH INFORMATICS", title: "ONC issues first-ever information blocking nonconformity notices to certified EHR developers; nearly 500 million records now exchanged through TEFCA", time: "February 11, 2026" },
  { tag: "HEALTH POLICY", title: "CMS WISeR Model launches January 1, 2026 — AI-assisted prior authorization now active in Arizona, New Jersey, Ohio, Oklahoma, Texas, and Washington", time: "January 1, 2026" },
  { tag: "HOSPITAL FINANCE", title: "Strata data: hospital operating margins turned negative in January 2026 at -0.6%, with drug costs rising 7.6% and supply costs 7.8% year-over-year", time: "April 2026" },
  { tag: "AI IN HEALTHCARE", title: "FDA published revised Clinical Decision Support guidance on January 6, 2026, removing many AI tools from premarket device oversight requirements", time: "January 6, 2026" },
];

// ─── SMALL REUSABLE COMPONENTS ────────────────────────────────────────────────

function SuccessMsg({ text = "You are subscribed! Check your inbox to confirm." }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
      borderRadius: 8, padding: "16px 20px",
      color: "#10b981", fontSize: 14, fontWeight: 500, marginTop: 16,
    }}>
      ✅ {text}
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────

function NavBar({ page, setPage }) {
  const links = ["Home", "About", "Newsletter", "Research", "Premium", "Advertising", "Contact"];
  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => setPage("Home")}>
          <div className="logo-mark">AI</div>
          <div className="logo-text">
            AI Health Intelligence
            <div className="logo-sub">Healthcare AI Intelligence</div>
          </div>
        </button>
        <div className="nav-links">
          {links.map((l) => (
            <button key={l} className={`nav-link ${page === l ? "active" : ""}`} onClick={() => setPage(l)}>
              {l}
            </button>
          ))}
        </div>
        <button className="nav-cta" onClick={() => setPage("Newsletter")}>Subscribe Free</button>
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
        <div className="ticker-label">BREAKING</div>
        <div className="ticker-track" style={{ flex: 1, overflow: "hidden" }}>
          <div className="ticker-inner">
            {items.map((item, i) => (
              <div key={i} className="ticker-item">
                <span className="ticker-dot" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NEWSLETTER SIGNUP ────────────────────────────────────────────────────────

function NewsletterSignup({ dark = true }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setDone(true);
    setLoading(false);
  };

  if (done) return <SuccessMsg />;

  return (
    <form onSubmit={submit} className="hero-form"
      style={!dark ? { background: "rgba(10,22,40,0.06)", borderColor: "rgba(10,22,40,0.12)" } : {}}>
      <input className="hero-input" type="email" placeholder="Enter your work email"
        value={email} onChange={(e) => setEmail(e.target.value)}
        style={!dark ? { color: "#1e293b" } : {}} required />
      <button className="hero-btn" type="submit" disabled={loading}>
        {loading ? "..." : "Get Free Access →"}
      </button>
    </form>
  );
}

// ─── FULL SIGNUP FORM ─────────────────────────────────────────────────────────

function FullSignupForm() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setDone(true);
    setLoading(false);
  };

  if (done) return <SuccessMsg text="Welcome aboard! Check your inbox to confirm your subscription." />;

  return (
    <form onSubmit={submit}>
      <div className="form-group">
        <label className="form-label">Your name</label>
        <input className="form-input" placeholder="Dr. Sarah Chen" required />
      </div>
      <div className="form-group">
        <label className="form-label">Work email</label>
        <input className="form-input" type="email" placeholder="sarah@healthsystem.org" required />
      </div>
      <div className="form-group">
        <label className="form-label">Your role</label>
        <select className="form-select">
          <option value="">Select your role</option>
          <option>CEO / President</option>
          <option>CMO / CNO / CMIO</option>
          <option>CFO / Finance Executive</option>
          <option>CIO / CISO / IT Director</option>
          <option>Hospital Administrator</option>
          <option>Health Informatics Professional</option>
          <option>Healthcare Consultant</option>
          <option>Researcher / Academic</option>
          <option>Investor / Venture Capital</option>
          <option>Healthcare Policy Professional</option>
          <option>Digital Health Startup</option>
          <option>Other</option>
        </select>
      </div>
      <button type="submit" disabled={loading}
        className="btn btn-primary"
        style={{ width: "100%", justifyContent: "center", padding: "15px", fontSize: 15, marginTop: 8 }}>
        {loading ? "Subscribing..." : "Subscribe Free →"}
      </button>
      <p className="form-disclaimer">
        🔒 Independent publication. Unsubscribe anytime. No spam.
      </p>
    </form>
  );
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setDone(true);
    setLoading(false);
  };

  if (done) return <SuccessMsg text="Message received! We will respond within one business day." />;

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" style={{ color: "var(--text)" }}>First Name</label>
          <input className="form-input contact-input" placeholder="Sarah" required />
        </div>
        <div className="form-group">
          <label className="form-label" style={{ color: "var(--text)" }}>Last Name</label>
          <input className="form-input contact-input" placeholder="Chen" required />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label" style={{ color: "var(--text)" }}>Work Email</label>
        <input className="form-input contact-input" type="email" placeholder="sarah@healthsystem.org" required />
      </div>
      <div className="form-group">
        <label className="form-label" style={{ color: "var(--text)" }}>Organization</label>
        <input className="form-input contact-input" placeholder="Regional Health System" />
      </div>
      <div className="form-group">
        <label className="form-label" style={{ color: "var(--text)" }}>Inquiry Type</label>
        <select className="form-select" style={{ background: "var(--off-white)", borderColor: "var(--border)", color: "var(--text)" }}>
          <option>Editorial / Story Tip</option>
          <option>Advertising / Partnership</option>
          <option>Enterprise Subscription</option>
          <option>Speaking / Podcast</option>
          <option>General Inquiry</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label" style={{ color: "var(--text)" }}>Message</label>
        <textarea className="form-textarea" placeholder="Tell us what is on your mind..." required />
      </div>
      <button type="submit" disabled={loading}
        className="btn btn-primary"
        style={{ width: "100%", justifyContent: "center", padding: "15px", fontSize: 15 }}>
        {loading ? "Sending..." : "Send Message →"}
      </button>
    </form>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer({ setPage }) {
  const cols = {
    "Content": ["AI in Healthcare", "Hospital Finance", "Health Policy", "Health Informatics", "Digital Health"],
    "Product": ["Newsletter", "Premium Intelligence", "Research Reports"],
    "Company": ["About", "Advertising", "Contact"],
  };
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <button className="nav-logo" onClick={() => setPage("Home")} style={{ marginBottom: 0 }}>
              <div className="logo-mark">AI</div>
              <div className="logo-text">
                AI Health Intelligence
                <div className="logo-sub">Healthcare AI Intelligence</div>
              </div>
            </button>
            <p>
              An independent publication covering AI, digital health, informatics, finance,
              and health policy for healthcare professionals across the U.S.
            </p>
            <div className="footer-socials">
              {["in", "X", "✉"].map((s, i) => (
                <a key={i} href="#" className="social-btn">{s}</a>
              ))}
            </div>
          </div>
          {Object.entries(cols).map(([col, items]) => (
            <div key={col} className="footer-col">
              <h5>{col}</h5>
              {items.map((item) => (
                <span key={item} className="footer-link"
                  onClick={() => setPage(item === "Newsletter" || item === "Premium Intelligence" || item === "Research Reports"
                    ? item.split(" ")[0] : item)}>
                  {item}
                </span>
              ))}
            </div>
          ))}
          <div className="footer-col">
            <h5>Subscribe</h5>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
              Free to subscribe. Independent healthcare AI coverage.
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => setPage("Newsletter")}>Subscribe Free</button>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">
            2026 AI Health Intelligence. All rights reserved. An independent publication.
          </div>
          <div className="footer-links">
            {["Privacy Policy", "Terms of Service", "Editorial Standards"].map((l) => (
              <a key={l} href="#" className="footer-policy">{l}</a>
            ))}
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
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-inner">
            <div className="hero-badge">
              <span className="badge-dot" />
              The Intelligence Layer for Healthcare&apos;s Digital Transformation
            </div>
            <h1 className="hero-h1">
              AI Health Intelligence<br />
              <em>Healthcare AI. Policy. Finance.</em>
            </h1>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#00d4ff,#0891b2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#0a1628", flexShrink: 0, border: "2px solid rgba(0,212,255,0.4)" }}>AI</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 600 }}>AI Health Intelligence</div>
                  <div style={{ color: "#00d4ff", fontSize: 11, letterSpacing: "0.5px" }}>Independent Healthcare AI Publication</div>
                </div>
              </div>
            </div>
            <p className="hero-sub">
              An independent publication covering artificial intelligence, digital health,
              health informatics, healthcare finance, and health policy — for healthcare
              professionals, researchers, administrators, investors, and policymakers.
            </p>
            <NewsletterSignup />
            <div className="hero-trust">
              <span className="trust-item"><span className="trust-icon">✓</span> Independent publication</span>
              <span className="trust-item"><span className="trust-icon">✓</span> Evidence-based analysis</span>
              <span className="trust-item"><span className="trust-icon">✓</span> Free to start</span>
              <span className="trust-item"><span className="trust-icon">✓</span> Unsubscribe anytime</span>
            </div>
          </div>
        </div>
        <div className="hero-stats">
          {STATS.map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <Ticker />

      {/* FEATURED ARTICLES */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header section-header-row">
            <div>
              <span className="section-tag">Latest Analysis — June 2, 2026</span>
              <h2 className="section-h2">Current Intelligence from AI Health Intelligence</h2>
            </div>
            <button className="link-more" onClick={() => setPage("Research")}>All articles →</button>
          </div>
          <div className="card-grid card-grid-3">
            {/* Featured article — free to read */}
            <div className="card card-featured" onClick={() => setPage("Article1")} style={{ cursor: "pointer" }}>
              <div className="card-img">⚖️</div>
              <div className="card-body">
                <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
                  <div className="card-category" style={{ marginBottom: 0 }}>AI IN HEALTHCARE · HEALTH POLICY</div>
                  <span style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, letterSpacing: "0.5px" }}>FREE</span>
                </div>
                <div className="card-title">The Governance Reckoning: Why Healthcare&apos;s AI Boom Is Outrunning Its Safeguards</div>
                <div className="card-excerpt">Hospitals are deploying AI at unprecedented speed. The compliance infrastructure to manage it has not kept pace. From ambient documentation to shadow AI, the gap between adoption and oversight is now a material institutional risk — with real financial, regulatory, and patient safety consequences.</div>
                <div className="card-meta">
                  <span className="card-date">June 2, 2026</span>
                  <span className="card-read">12 min read · Click to read free</span>
                </div>
              </div>
            </div>
            {/* Premium article cards */}
            {ARTICLES.filter((a) => !a.featured).slice(0, 4).map((a) => (
              <div key={a.id} className="card" onClick={() => setPage("Newsletter")} style={{ cursor: "pointer" }}>
                <div className="card-img" style={{ height: 140, position: "relative" }}>
                  <span style={{ fontSize: 40 }}>{a.emoji}</span>
                  <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(245,158,11,0.9)", color: "#0a1628", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, letterSpacing: "0.5px" }}>PREMIUM</div>
                </div>
                <div className="card-body">
                  <div className="card-category">{a.category}</div>
                  <div className="card-title" style={{ fontSize: 17 }}>{a.title}</div>
                  <div className="card-excerpt" style={{ fontSize: 13, marginBottom: 14 }}>{a.excerpt}</div>
                  <div className="card-meta">
                    <span className="card-date">{a.date}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#f59e0b" }}>Subscribe to read →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section section-dark">
        <div className="section-inner">
          <div className="section-header text-center" style={{ marginBottom: 48 }}>
            <span className="section-tag">Coverage Areas</span>
            <h2 className="section-h2">Five Intelligence Verticals</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              Comprehensive coverage across every dimension of healthcare&apos;s technology and policy transformation.
            </p>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map((c) => (
              <div key={c.name} className="cat-card" onClick={() => setPage("Research")}>
                <span className="cat-icon">{c.emoji}</span>
                <div className="cat-name">{c.name}</div>
                <div className="cat-count">{c.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT THE PUBLICATION */}
      <section className="section section-alt">
        <div className="section-inner">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "center", maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ background: "var(--navy)", borderRadius: "var(--radius-lg)", padding: 40, textAlign: "center", border: "1px solid rgba(0,212,255,0.15)" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,var(--cyan),var(--teal))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "var(--navy)", margin: "0 auto 20px", border: "3px solid rgba(0,212,255,0.3)", boxShadow: "0 0 30px rgba(0,212,255,0.15)" }}>AI</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: "var(--white)", fontWeight: 700, marginBottom: 4 }}>AI Health Intelligence</div>
              <div style={{ fontSize: 12, color: "var(--cyan)", fontWeight: 600, marginBottom: 20 }}>Independent Publication</div>
              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "16px 0" }} />
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                Health Policy &amp; Management<br />
                Health Informatics<br />
                Hospital Finance<br />
                Digital Health &amp; AI
              </div>
            </div>
            <div>
              <span className="section-tag">About This Publication</span>
              <h2 className="section-h2" style={{ marginBottom: 16 }}>Built by a Researcher.<br />Written for Decision Makers.</h2>
              <p style={{ color: "var(--text-light)", lineHeight: 1.85, marginBottom: 16, fontSize: 15 }}>
                AI Health Intelligence is an independent publication covering the intersection of
                artificial intelligence, health policy, hospital finance, health informatics, and
                digital health in the United States.
              </p>
              <p style={{ color: "var(--text-light)", lineHeight: 1.85, marginBottom: 24, fontSize: 15 }}>
                Our mission is to bridge the gap between academic research and operational
                decision-making — providing healthcare professionals with independent, evidence-based
                intelligence they can act on.
              </p>
              <div style={{ borderLeft: "3px solid var(--cyan)", paddingLeft: 18, fontStyle: "italic", color: "var(--navy)", fontSize: 15, lineHeight: 1.7, fontFamily: "'Playfair Display',serif", marginBottom: 28 }}>
                No vendor sponsorship of editorial content. No inflated numbers. Just honest, useful healthcare intelligence.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["AI in Healthcare", "Health Policy", "Health Informatics", "Hospital Finance", "Digital Health"].map((tag) => (
                  <span key={tag} style={{ padding: "5px 14px", borderRadius: "100px", fontSize: 12, fontWeight: 600, background: "rgba(0,145,178,0.08)", color: "var(--teal)", border: "1px solid rgba(0,145,178,0.15)" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="section">
        <div className="section-inner">
          <div className="newsletter-box">
            <div className="newsletter-box-inner">
              <div>
                <div className="nl-tag">The AI Healthcare Brief</div>
                <h2 className="nl-h2">Healthcare AI Intelligence Delivered to Your Inbox</h2>
                <p className="nl-sub">
                  Curated from top healthcare publications. Independent analysis on AI, policy,
                  finance, and digital health. Delivered straight to your inbox — free to start.
                </p>
                <div className="nl-benefits">
                  {["5 key AI and health tech developments", "1 deep-dive policy or financial analysis", "Hospital finance and market data", "Curated research summaries", "Exclusive premium intelligence"].map((b) => (
                    <div key={b} className="nl-benefit"><span className="nl-benefit-icon">✓</span> {b}</div>
                  ))}
                </div>
              </div>
              <div className="nl-form-card">
                <div className="nl-form-title">Start Reading Free</div>
                <div className="nl-form-sub">Free to subscribe. No credit card required.</div>
                <FullSignupForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BREAKING NEWS */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-header section-header-row">
            <div>
              <span className="section-tag">Latest Intelligence</span>
              <h2 className="section-h2">This Week in Healthcare AI</h2>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setPage("Research")}>View all</button>
          </div>
          {BREAKING_NEWS.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
              <span className="tag-pill tag-pill-blue" style={{ flexShrink: 0, minWidth: 140, textAlign: "center" }}>{item.tag}</span>
              <span style={{ flex: 1, fontWeight: 500, color: "var(--navy)", fontSize: 15 }}>{item.title}</span>
              <span style={{ fontSize: 12, color: "var(--muted)", flexShrink: 0 }}>{item.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* WHY THIS PUBLICATION */}
      <section className="section section-dark">
        <div className="section-inner text-center">
          <span className="section-tag">Our Commitment</span>
          <h2 className="section-h2" style={{ color: "var(--white)", marginBottom: 20 }}>
            Built on Independence and Evidence
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 18, maxWidth: 640, margin: "0 auto 60px", lineHeight: 1.7 }}>
            AI Health Intelligence is a new, independent publication. We make no claims about subscriber
            counts or reader ratings we have not earned. What we do commit to is honest,
            evidence-based healthcare intelligence — every edition.
          </p>
          <div className="card-grid card-grid-3">
            {[
              { emoji: "🔬", title: "Evidence-First", text: "Every claim is sourced and verified. We distinguish between peer-reviewed evidence, preliminary data, and vendor claims — always." },
              { emoji: "⚖️", title: "Editorially Independent", text: "No payment for editorial coverage. Sponsorship and advertising is strictly separated from editorial content, with full transparency." },
              { emoji: "🎯", title: "Operationally Relevant", text: "Complex AI research, policy language, and financial data translated into intelligence you can use in your strategic planning today." },
            ].map((v) => (
              <div key={v.title} className="card card-dark" style={{ padding: 36, cursor: "default" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{v.emoji}</div>
                <div style={{ fontWeight: 700, color: "var(--white)", fontSize: 17, marginBottom: 12 }}>{v.title}</div>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7 }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── PAGE: ABOUT ──────────────────────────────────────────────────────────────

function AboutPage() {
  const values = [
    { emoji: "🔬", title: "Evidence-First Journalism", text: "Every claim we publish is sourced, cited, and verified. We distinguish between peer-reviewed evidence, preliminary data, and vendor claims — always." },
    { emoji: "⚖️", title: "Editorial Independence", text: "We accept no payment for editorial coverage. Our sponsorship and advertising model is strictly separated from our editorial operation, with full transparency." },
    { emoji: "🎯", title: "Operational Relevance", text: "We translate complex AI research, policy language, and financial data into intelligence you can actually use in strategic planning and board presentations." },
    { emoji: "🌐", title: "Systems Thinking", text: "Healthcare is an interconnected system. We cover AI, finance, policy, and informatics together because decisions in one area always affect the others." },
    { emoji: "🤝", title: "Audience First", text: "Our readers are sophisticated professionals. We write for healthcare executives and clinicians at the top of their fields — not for general audiences." },
    { emoji: "📈", title: "Long-term Perspective", text: "We resist the hype cycle. Our analysis looks beyond press releases to examine actual implementation outcomes, financial realities, and policy consequences." },
  ];

  return (
    <>
      {/* HERO */}
      <div style={{ background: "var(--navy)", padding: "100px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div style={{ maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <span className="page-hero-tag">Founded by Ferdousi Zaman, DrPH Candidate</span>
          <h1 className="page-hero-h1">Healthcare Intelligence<br />for a Critical Decade</h1>
          <p className="page-hero-sub" style={{ margin: "0 auto" }}>
            AI Health Intelligence is an independent publication founded by Ferdousi Zaman to help
            healthcare professionals, researchers, policymakers, and organizations understand emerging
            trends in artificial intelligence, digital health, health informatics, healthcare finance,
            and health policy.
          </p>
        </div>
      </div>

      {/* FOUNDER BIOGRAPHY */}
      <section className="section">
        <div className="section-inner" style={{ maxWidth: 1100 }}>
          <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 64, alignItems: "start", background: "var(--white)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            {/* Headshot card */}
            <div style={{ background: "var(--navy)", padding: 48, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", minHeight: 500, justifyContent: "center" }}>
              <div style={{ width: 140, height: 140, borderRadius: "50%", background: "linear-gradient(135deg,var(--cyan) 0%,var(--teal) 60%,var(--navy-light) 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 800, color: "var(--navy)", border: "4px solid rgba(0,212,255,0.35)", boxShadow: "0 0 40px rgba(0,212,255,0.2)", marginBottom: 24, fontFamily: "'Playfair Display',serif" }}>FZ</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "var(--white)", fontWeight: 700, marginBottom: 6 }}>Ferdousi Zaman</div>
              <div style={{ fontSize: 13, color: "var(--cyan)", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 4 }}>DrPH Candidate</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 28, lineHeight: 1.5 }}>Health Policy and Management</div>
              {[{ label: "Role", val: "Founder and Editor-in-Chief" }, { label: "Focus", val: "AI, Health Policy, Informatics" }, { label: "Based", val: "United States" }].map((r) => (
                <div key={r.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-sm)", padding: "10px 14px", textAlign: "left", border: "1px solid rgba(255,255,255,0.08)", width: "100%", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 2 }}>{r.label}</div>
                  <div style={{ fontSize: 13, color: "var(--white)", fontWeight: 500 }}>{r.val}</div>
                </div>
              ))}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,119,181,0.2)", border: "1px solid rgba(0,119,181,0.4)", borderRadius: "var(--radius-sm)", padding: "10px 20px", color: "#60a5fa", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                <span style={{ fontSize: 16 }}>in</span> Connect on LinkedIn
              </a>
            </div>

            {/* Biography */}
            <div style={{ padding: "48px 48px 48px 0" }}>
              <span className="section-tag">Meet the Founder</span>
              <h2 className="section-h2" style={{ marginBottom: 24 }}>Ferdousi Zaman, DrPH Candidate</h2>
              <p style={{ color: "var(--text-light)", lineHeight: 1.85, marginBottom: 18, fontSize: 15 }}>
                <strong style={{ color: "var(--navy)" }}>Ferdousi Zaman</strong> is a Doctor of Public Health (DrPH) candidate specializing in
                Health Policy and Management. Her academic and professional work sits at the intersection
                of artificial intelligence, health informatics, hospital finance, digital health, and U.S.
                health policy — the five disciplines that will define how American healthcare evolves over
                the next decade.
              </p>
              <p style={{ color: "var(--text-light)", lineHeight: 1.85, marginBottom: 18, fontSize: 15 }}>
                Ferdousi founded <strong style={{ color: "var(--navy)" }}>AI Health Intelligence</strong> after recognizing a persistent gap
                in the information landscape: healthcare professionals making consequential decisions about
                AI adoption, digital transformation, and policy compliance had no single, independent,
                evidence-grounded source of intelligence they could rely on.
              </p>
              <p style={{ color: "var(--text-light)", lineHeight: 1.85, marginBottom: 28, fontSize: 15 }}>
                As Founder, Editor, and Publisher, Ferdousi brings her research expertise in health policy
                analysis, population health systems, and healthcare technology governance to every edition
                of the newsletter. Her commitment is to independent, evidence-first journalism that
                translates complex developments into intelligence healthcare professionals can immediately apply.
              </p>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>Research and Editorial Focus</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["AI in Healthcare", "Health Policy", "Health Informatics", "Hospital Finance", "Digital Health", "Population Health", "Healthcare AI Ethics", "Health Systems"].map((tag) => (
                    <span key={tag} style={{ padding: "5px 14px", borderRadius: "100px", fontSize: 12, fontWeight: 600, background: "rgba(0,145,178,0.08)", color: "var(--teal)", border: "1px solid rgba(0,145,178,0.15)" }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div style={{ borderLeft: "3px solid var(--cyan)", paddingLeft: 20, background: "rgba(0,212,255,0.04)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", padding: "20px 20px 20px 24px" }}>
                <p style={{ color: "var(--navy)", fontSize: 15, lineHeight: 1.7, fontStyle: "italic", fontFamily: "'Playfair Display',serif" }}>
                  My mission is simple: give healthcare professionals the intelligence they need to make
                  better decisions in the era of AI. Independent. Evidence-based. Always relevant to the
                  decisions you are making today.
                </p>
                <div style={{ marginTop: 12, fontSize: 13, color: "var(--muted)" }}>
                  — Ferdousi Zaman, Founder and Editor-in-Chief
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-header text-center">
            <span className="section-tag">Our Principles</span>
            <h2 className="section-h2">What We Stand For</h2>
          </div>
          <div className="values-grid">
            {values.map((v) => (
              <div key={v.title} className="value-card">
                <span className="value-icon">{v.emoji}</span>
                <div className="value-title">{v.title}</div>
                <p className="value-text">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="section">
        <div className="section-inner" style={{ maxWidth: 1000 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <span className="section-tag">Why We Exist</span>
              <h2 className="section-h2">The Gap in Healthcare Intelligence</h2>
              <p style={{ color: "var(--text-light)", lineHeight: 1.8, marginBottom: 16 }}>
                Healthcare is undergoing the most consequential technological transformation in its
                history. Yet the information available to healthcare professionals is fragmented,
                vendor-influenced, and rarely translated into operational intelligence.
              </p>
              <p style={{ color: "var(--text-light)", lineHeight: 1.8 }}>
                <strong style={{ color: "var(--navy)" }}>AI Health Intelligence fills that gap.</strong> Founded
                by Ferdousi Zaman, DrPH Candidate in Health Policy and Management, this is an
                independent editorial operation with no vendor partnerships and no incentive other
                than delivering the most useful healthcare technology intelligence in the U.S.
              </p>
            </div>
            <div style={{ background: "var(--navy)", borderRadius: "var(--radius-lg)", padding: 48 }}>
              {[{ value: "100%", label: "Editorial Independence" }, { value: "New", label: "Publication — Growing Daily" }, { value: "Free", label: "To Start Reading" }, { value: "0", label: "Vendor Sponsorships of Editorial" }].map((s) => (
                <div key={s.label} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "18px 0" }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: "var(--cyan)", fontWeight: 800 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── PAGE: NEWSLETTER ─────────────────────────────────────────────────────────

function NewsletterPage() {
  return (
    <>
      <div style={{ background: "var(--navy)", padding: "100px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div style={{ maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <span className="page-hero-tag">Newsletter Suite</span>
          <h1 className="page-hero-h1">Three Newsletters.<br />One Intelligence Platform.</h1>
          <p style={{ color: "var(--cyan)", fontSize: 13, fontWeight: 600, margin: "16px auto 12px" }}>
            Independent Healthcare AI · Policy · Finance · Informatics · Digital Health
          </p>
          <p className="page-hero-sub" style={{ margin: "0 auto" }}>
            Covering AI, finance, and policy — each edition designed for a different moment in your week
            and a different decision you need to make. Free to subscribe.
          </p>
        </div>
      </div>

      {/* EDITIONS */}
      <section className="section section-dark">
        <div className="section-inner">
          <div className="nl-editions">
            {NEWSLETTER_EDITIONS.map((e) => (
              <div key={e.name} className="nl-edition">
                <span className="nl-edition-icon">{e.emoji}</span>
                <div className="nl-edition-name">{e.name}</div>
                <div className="nl-edition-freq">{e.freq}</div>
                <p className="nl-edition-desc">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header text-center">
            <span className="section-tag">Subscription Plans</span>
            <h2 className="section-h2">Choose Your Level of Intelligence</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>Start free. Upgrade when you are ready for deeper analysis. No commitment required.</p>
          </div>
          <div className="plans-grid">
            <div className="plan-card">
              <div className="plan-name">Free</div>
              <div><span className="plan-price">$0</span><span className="plan-period">/month</span></div>
              <p className="plan-desc">The essential weekly briefing. Everything you need to stay informed.</p>
              <div className="plan-features">
                {["Weekly AI Healthcare Brief", "Daily news digest", "Public research summaries", "Breaking news alerts"].map((f) => (
                  <div key={f} className="plan-feature"><span className="plan-feature-icon">✓</span>{f}</div>
                ))}
                {["Premium reports", "Market intelligence", "Finance deep-dives"].map((f) => (
                  <div key={f} className="plan-feature plan-feature-x"><span className="plan-feature-icon">—</span><span style={{ color: "var(--muted)" }}>{f}</span></div>
                ))}
              </div>
              <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Get Started Free</button>
            </div>
            <div className="plan-card featured">
              <div className="plan-badge">Most Popular</div>
              <div className="plan-name">Professional</div>
              <div><span className="plan-price">$29</span><span className="plan-period">/month</span></div>
              <p className="plan-desc">Full access to all newsletters, research, and premium analysis.</p>
              <div className="plan-features">
                {["Everything in Free", "All three newsletters", "Monthly market reports", "Hospital finance analysis", "Policy deep-dives", "Quarterly trend reports", "Research brief library"].map((f) => (
                  <div key={f} className="plan-feature"><span className="plan-feature-icon">✓</span>{f}</div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Start 14-Day Free Trial</button>
            </div>
            <div className="plan-card">
              <div className="plan-name">Enterprise</div>
              <div><span className="plan-price">$299</span><span className="plan-period">/month</span></div>
              <p className="plan-desc">Team access, custom research, and white-glove intelligence for organizations.</p>
              <div className="plan-features">
                {["Everything in Professional", "Up to 25 team seats", "Custom research briefs", "Quarterly strategy calls", "Executive briefing decks", "Dedicated analyst support"].map((f) => (
                  <div key={f} className="plan-feature"><span className="plan-feature-icon">✓</span>{f}</div>
                ))}
              </div>
              <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-header text-center">
            <span className="section-tag">Content Preview</span>
            <h2 className="section-h2">Newsletter Topics We Are Publishing</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginTop: 40 }}>
            {NEWSLETTER_TOPICS.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 20px", background: "var(--white)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                <span style={{ color: "var(--cyan-dim)", fontFamily: "'DM Mono',monospace", fontSize: 12, flexShrink: 0, marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── PAGE: RESEARCH ───────────────────────────────────────────────────────────

function ResearchPage() {
  const [tab, setTab] = useState("All");
  const tabs = ["All", "AI in Healthcare", "Hospital Finance", "Health Policy", "Health Informatics", "Digital Health"];
  return (
    <>
      <div style={{ background: "linear-gradient(180deg,var(--navy) 0%,#0d1f3c 100%)", padding: "100px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,var(--cyan),transparent)" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span className="page-hero-tag">Research and Analysis</span>
          <h1 className="page-hero-h1">Deep Intelligence.<br />Actionable Insights.</h1>
          <p className="page-hero-sub">
            Original research, systematic reviews, market analysis, and policy breakdowns —
            written for healthcare professionals who need to make decisions, not just read about them.
          </p>
        </div>
      </div>
      <section className="section">
        <div className="section-inner">
          <div className="topic-tabs">
            {tabs.map((t) => (
              <button key={t} className={`topic-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>

          {/* Published articles note */}
          <div style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 10, padding: "16px 24px", marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "var(--cyan)", fontSize: 18 }}>📅</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--navy)" }}>Published June 2, 2026 — First Edition</div>
              <div style={{ fontSize: 13, color: "var(--text-light)" }}>AI Health Intelligence is a new publication. All articles below are real, sourced, and evidence-based. No placeholder content.</div>
            </div>
          </div>

          {REPORTS.map((r, i) => (
            <div key={i} className="report-card">
              <div className="report-cover" style={{ fontSize: 48 }}>{r.emoji}</div>
              <div className="report-body">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span className="report-tag">{r.tag}</span>
                  {r.lock
                    ? <span className="tag-pill tag-pill-gold">Premium</span>
                    : <span className="tag-pill tag-pill-green">Free to Read</span>}
                </div>
                <div className="report-title">{r.title}</div>
                <p className="report-desc">{r.desc}</p>
                <div className="report-meta">
                  <span className="report-pages">📄 {r.pages} · {r.date}</span>
                  {r.lock
                    ? <button className="btn btn-primary btn-sm" onClick={() => {}}>🔒 Subscribe to Read</button>
                    : <button className="btn btn-outline btn-sm" onClick={() => {}}>Read Free Article →</button>}
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 60 }}>
            <div className="section-header">
              <span className="section-tag">Article Pipeline</span>
              <h2 className="section-h2">Research Topics in Our Pipeline</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
              {CONTENT_IDEAS.map((idea, i) => (
                <div key={i} style={{ padding: "14px 20px", background: "var(--off-white)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ color: "var(--cyan-dim)", fontFamily: "'DM Mono',monospace", fontSize: 11, flexShrink: 0, marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.5 }}>{idea}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── PAGE: PREMIUM ────────────────────────────────────────────────────────────

function PremiumPage({ setPage }) {
  const perks = [
    { emoji: "📊", title: "Monthly Market Intelligence Reports", desc: "30-50 page deep-dive reports on critical healthcare AI, finance, and policy topics. Sourced from primary data, expert interviews, and proprietary analysis." },
    { emoji: "💰", title: "Hospital Finance Intelligence", desc: "Operating margin analysis, payer mix data, labor cost benchmarks, and capital allocation strategy — updated monthly with current publicly available financial data." },
    { emoji: "🏛️", title: "Policy Decoder Series", desc: "CMS rules, congressional legislation, and federal health IT mandates decoded in plain English with specific operational implications." },
    { emoji: "📈", title: "Digital Health Investment Tracker", desc: "Quarterly analysis of venture investment flows across healthcare AI segments. Know which categories are attracting capital and where smart money is moving." },
    { emoji: "🔬", title: "Clinical AI Evidence Reviews", desc: "Systematic reviews of peer-reviewed literature on clinical AI tools — summarizing what actually works and where validation gaps remain." },
    { emoji: "📅", title: "12-Month Content Calendar Access", desc: "See our complete editorial schedule, request topics, and access premium archives. Your personal healthcare intelligence library." },
  ];
  return (
    <>
      <div style={{ background: "linear-gradient(135deg,#0a1628 0%,#1a2f5c 50%,#0f2a4a 100%)", padding: "100px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 50%,rgba(0,212,255,0.08) 0%,transparent 50%),radial-gradient(circle at 70% 50%,rgba(245,158,11,0.06) 0%,transparent 50%)" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="premium-badge">⭐ Premium Intelligence</div>
          <h1 className="page-hero-h1">The Intelligence Layer<br />Decision-Makers Actually Need</h1>
          <p className="page-hero-sub" style={{ margin: "0 auto 40px" }}>
            Exclusive market reports, financial analysis, policy deconstruction, and trend intelligence
            for healthcare professionals who need to stay ahead.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-lg" onClick={() => setPage("Newsletter")}>Start 14-Day Free Trial</button>
            <button className="btn btn-outline-white btn-lg" onClick={() => setPage("Research")}>View Sample Report</button>
          </div>
        </div>
      </div>

      <section className="section section-dark">
        <div className="section-inner">
          <div className="section-header text-center">
            <span className="section-tag">Premium Benefits</span>
            <h2 className="section-h2">What You Get as a Premium Member</h2>
          </div>
          <div className="perks-grid">
            {perks.map((p) => (
              <div key={p.title} className="perk-card">
                <span className="perk-icon">{p.emoji}</span>
                <div className="perk-title">{p.title}</div>
                <p className="perk-desc">{p.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 80, background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "var(--radius-lg)", padding: 64, textAlign: "center" }}>
            <h2 style={{ color: "var(--white)", fontSize: 36, marginBottom: 16 }}>Professional Plan: $29/month</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 18, marginBottom: 36, maxWidth: 520, margin: "0 auto 36px" }}>Full access to all reports, newsletters, and premium analysis. Cancel anytime.</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn btn-primary btn-lg" onClick={() => setPage("Newsletter")}>Start Free Trial</button>
              <button className="btn btn-outline-white" onClick={() => setPage("Contact")}>Contact Us</button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-header text-center">
            <span className="section-tag">Editorial Calendar</span>
            <h2 className="section-h2">12-Month Premium Content Calendar</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>Our research and publishing roadmap for 2026.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 48 }}>
            {CALENDAR.map((m) => (
              <div key={m.month} style={{ background: "var(--off-white)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: 24 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "var(--cyan-dim)", marginBottom: 8 }}>{m.month}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--navy)", marginBottom: 8, lineHeight: 1.4 }}>{m.theme}</div>
                <span className="tag-pill tag-pill-blue">{m.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── PAGE: ADVERTISING ────────────────────────────────────────────────────────

function AdvertisingPage({ setPage }) {
  const audienceCols = [
    { label: "Target Audience", items: ["Healthcare Executives", "Hospital Administrators", "Health Informatics Professionals", "Healthcare Consultants", "Researchers and Academics", "Healthcare Policy Professionals"] },
    { label: "Coverage Topics", items: ["AI in Healthcare", "Hospital Finance and Operations", "Health Policy and CMS", "Health Informatics and EHR", "Digital Health and Telehealth", "FDA and Research"] },
    { label: "What We Offer", items: ["Newsletter Sponsorship", "Sponsored Research Reports", "Co-branded Content", "Event Partnerships", "Contact us for current reach data", "All packages negotiable"] },
  ];
  return (
    <>
      <div style={{ background: "var(--navy)", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <span className="page-hero-tag">Advertising and Partnerships</span>
          <h1 className="page-hero-h1">Reach Healthcare<br />Professionals and Decision Makers</h1>
          <p className="page-hero-sub">
            Partner with AI Health Intelligence to position your brand in front of healthcare
            executives, administrators, and investors across the U.S.
            Contact us to discuss current reach and audience data.
          </p>
        </div>
      </div>

      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-header text-center">
            <span className="section-tag">Our Audience</span>
            <h2 className="section-h2">Premium Audience. Verified Reach.</h2>
          </div>
          <div className="stats-bar">
            {[
              { num: "100%", label: "Editorial Independence" },
              { num: "Free", label: "Subscriber Entry Point" },
              { num: "Daily", label: "AI Healthcare Coverage" },
              { num: "0", label: "Paid Editorial Placements" },
            ].map((s) => (
              <div key={s.label} className="stat-bar-item">
                <div className="stat-bar-num">{s.num}</div>
                <div className="stat-bar-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginTop: 48 }}>
            {audienceCols.map((col) => (
              <div key={col.label} style={{ background: "var(--white)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: 32 }}>
                <h4 style={{ color: "var(--navy)", fontSize: 16, marginBottom: 20 }}>{col.label}</h4>
                {col.items.map((item) => (
                  <div key={item} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: 14, color: "var(--text)" }}>{item}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-header text-center">
            <span className="section-tag">Sponsorship Packages</span>
            <h2 className="section-h2">Partnership Opportunities</h2>
          </div>
          <div className="ad-packages">
            {AD_PACKAGES.map((p) => (
              <div key={p.name} className={`ad-package ${p.highlight ? "highlight" : ""}`}>
                {p.highlight && <div className="plan-badge">Best Value</div>}
                <span className="ad-pkg-icon">{p.emoji}</span>
                <div className="ad-pkg-name">{p.name}</div>
                <div className="ad-pkg-price">{p.price}</div>
                <p className="ad-pkg-desc">{p.desc}</p>
                <div className="ad-pkg-features">
                  {p.features.map((f) => (
                    <div key={f} className="ad-pkg-feature"><span style={{ color: "var(--green)" }}>✓</span> {f}</div>
                  ))}
                </div>
                <button className="btn btn-primary" style={{ marginTop: 28, width: "100%", justifyContent: "center" }} onClick={() => setPage("Contact")}>
                  Inquire Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="section-inner text-center">
          <h2 className="section-h2">Ready to Reach Healthcare&apos;s Decision Makers?</h2>
          <p className="section-sub" style={{ margin: "16px auto 40px", color: "rgba(255,255,255,0.55)" }}>
            Contact us to discuss partnership opportunities and current audience data.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => setPage("Contact")}>Start a Conversation →</button>
        </div>
      </section>
    </>
  );
}

// ─── PAGE: CONTACT ────────────────────────────────────────────────────────────

function ContactPage() {
  const methods = [
    { emoji: "👩‍💼", label: "Founder and Editor", val: "Ferdousi Zaman, DrPH Candidate · ferdousi@aihealthintelligence.com" },
    { emoji: "📧", label: "Editorial", val: "editorial@aihealthintelligence.com" },
    { emoji: "🤝", label: "Partnerships and Advertising", val: "partnerships@aihealthintelligence.com" },
    { emoji: "💼", label: "Enterprise Sales", val: "enterprise@aihealthintelligence.com" },
    { emoji: "📍", label: "Location", val: "United States (Remote-first)" },
  ];
  return (
    <>
      <div style={{ background: "var(--navy)", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <span className="page-hero-tag">Get in Touch</span>
          <h1 className="page-hero-h1">Get in Touch</h1>
          <p className="page-hero-sub">Partnerships, subscriptions, editorial inquiries, and speaking requests — we respond to every message.</p>
        </div>
      </div>

      <section className="section">
        <div className="section-inner">
          <div className="contact-grid">
            <div>
              <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 24, color: "var(--navy)", marginBottom: 16 }}>
                We Would Love to Hear from You
              </h3>
              <p style={{ color: "var(--text-light)", lineHeight: 1.7, marginBottom: 32 }}>
                Whether you are interested in a partnership, have a story tip, want to discuss a
                subscription, or just want to connect — every inquiry receives a personal response.
              </p>
              <div className="contact-methods">
                {methods.map((m) => (
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
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── PAGE: FREE ARTICLE — THE GOVERNANCE RECKONING ───────────────────────────

function Article1Page({ setPage }) {
  const A = {
    title: "The Governance Reckoning: Why Healthcare's AI Boom Is Outrunning Its Safeguards",
    sub: "Hospitals Are Deploying AI at Unprecedented Speed. The Compliance Infrastructure to Manage It Has Not Kept Pace. That Gap Is Now a Material Risk.",
    author: "AI Health Intelligence Editorial Team",
    date: "June 2, 2026",
    category: "AI IN HEALTHCARE · HEALTH POLICY",
    read: "12 min read",
  };
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Article header */}
      <div style={{ background: "var(--navy)", padding: "60px 24px 48px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <button onClick={() => setPage("Home")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer", marginBottom: 24 }}>← Back</button>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--cyan)" }}>{A.category}</span>
            <span style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>FREE ARTICLE</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,4vw,44px)", color: "white", lineHeight: 1.2, marginBottom: 18 }}>{A.title}</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: 28, fontWeight: 300 }}>{A.sub}</p>
          <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>By {A.author}</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>·</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{A.date}</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>·</span>
            <span style={{ fontSize: 13, color: "var(--cyan)" }}>{A.read}</span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", padding: "48px", lineHeight: 1.85, color: "#1e293b", fontSize: 16 }}>

          {/* Executive Summary */}
          <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "24px 28px", marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#0369a1", marginBottom: 10 }}>Executive Summary</div>
            <p style={{ margin: 0, color: "#0c4a6e", lineHeight: 1.75 }}>The first half of 2026 has produced a paradox at the center of American healthcare: artificial intelligence tools are being adopted faster than at any point in the industry's history, while the institutional structures required to govern, audit, and safely oversee those tools remain years behind. Major electronic health record vendors have embedded AI into clinical workflows at scale. Large health systems are projecting hundreds of millions in AI-driven cost savings. The FDA has relaxed oversight of a significant class of clinical decision support software. And yet, a parallel set of developments — documented safety failures, a surge in unauthorized AI use by clinical staff, mounting state-level regulation, and a nascent but serious payer-provider AI conflict — suggests the industry is approaching a governance crossroads it can no longer defer.</p>
          </div>

          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "#0a1628", margin: "36px 0 16px", paddingBottom: 12, borderBottom: "2px solid #f1f5f9" }}>The FDA's January 2026 Regulatory Shift</h2>
          <p style={{ marginBottom: 18 }}>On January 6, 2026, the FDA published revised final guidance on Clinical Decision Support Software. FDA Commissioner Martin Makary announced the changes at the Consumer Electronics Show, framing them as necessary for the agency to "adapt with the times." The practical effect is significant: software that provides recommendations a clinician can independently review falls outside the agency's medical device oversight. In plain terms, a large class of AI tools that provide diagnostic suggestions, clinical summaries, and treatment recommendations can now reach hospitals without premarket FDA review.</p>
          <p style={{ marginBottom: 18 }}>The guidance creates a meaningful opening for AI developers and a meaningful compliance question for hospitals. Tools that previously existed in a regulatory gray zone are now clearly outside FDA purview — but that designation does not eliminate the hospital's responsibility for ensuring those tools are clinically valid, bias-tested, and integrated safely.</p>

          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "#0a1628", margin: "36px 0 16px", paddingBottom: 12, borderBottom: "2px solid #f1f5f9" }}>EHR Vendors Move to Consolidate the AI Market</h2>
          <p style={{ marginBottom: 18 }}>The ambient documentation market has been reshaped by a single structural shift: Epic and Oracle Health are embedding AI natively into their platforms. As of mid-2025, Epic's ambient documentation integration — primarily through its DAX Copilot partnership — had been deployed across 62.6 percent of Epic hospitals. Epic subsequently launched native AI Charting in February 2026, directly threatening standalone ambient scribe vendors including Abridge and Ambience. Epic is launching more than 150 AI features built directly into its platform in 2026.</p>
          <p style={{ marginBottom: 18 }}>For hospital technology leaders, this dynamic has real procurement implications. Point-solution AI vendors that built businesses on top of EHR platforms now face competitive pressure from the platforms themselves. The clinical evidence underlying ambient documentation is real and accumulating. At Aultman Health System in Northeast Ohio, deployment of ambient AI within Oracle Cerner resulted in clinicians saving 30 to 60 minutes per day on documentation, with some reporting capacity to see three to five additional patients daily.</p>

          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "#0a1628", margin: "36px 0 16px", paddingBottom: 12, borderBottom: "2px solid #f1f5f9" }}>The Financial Stakes and the Billing War</h2>
          <p style={{ marginBottom: 18 }}>HCA Healthcare projected $400 million in 2026 cost savings from AI-driven revenue management. UnitedHealth Group projects nearly $1 billion in AI savings, with $1.5 billion in AI investment planned for 2026. These projections reflect AI being justified primarily on financial grounds, not clinical outcome grounds.</p>
          <p style={{ marginBottom: 18 }}>But the financial dynamics have a counterweight. Blue Cross Blue Shield has released an analysis suggesting that AI-enabled coding practices may be responsible for more than $2 billion in additional claims spending nationwide. Centene raised concerns that hospitals are using AI revenue software to aggressively trigger reimbursement. The result is an AI arms race on both sides of the claims process — hospitals maximizing capture, payers denying claims — with patients caught between competing algorithms.</p>

          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "#0a1628", margin: "36px 0 16px", paddingBottom: 12, borderBottom: "2px solid #f1f5f9" }}>The Shadow AI Crisis</h2>
          <p style={{ marginBottom: 18 }}>The most urgent operational challenge facing hospital executives in 2026 is not AI deployment. It is shadow AI — the use of generative AI tools by clinical staff outside institutional oversight, without IT review, security assessment, or HIPAA-compliant Business Associate Agreements.</p>
          <p style={{ marginBottom: 18 }}>A 2025 IBM study identified that 97 percent of organizations that had experienced an AI-related security incident lacked proper AI access controls, and 63 percent of organizations surveyed lacked AI governance policies. A mid-sized health system discovered through a security audit that 23 percent of clinicians were regularly using ChatGPT for documentation tasks. The average healthcare security breach cost $7.4 million in 2025.</p>

          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "#0a1628", margin: "36px 0 16px", paddingBottom: 12, borderBottom: "2px solid #f1f5f9" }}>Health Policy: Federal Deregulation, State Complexity</h2>
          <p style={{ marginBottom: 18 }}>The regulatory environment governing healthcare AI in 2026 is simultaneously more permissive at the federal level and more demanding at the state level. The FDA's January guidance reduces federal oversight of clinical decision support software. The White House AI Action Plan, released March 20, 2026, preserves state authority to regulate AI in areas of reserved policy power — meaning state healthcare AI laws proliferate.</p>
          <p style={{ marginBottom: 18 }}>Texas enacted the Responsible Artificial Intelligence Governance Act, effective January 1, 2026, requiring patients to be informed when AI supports healthcare services and prohibiting AI tools from independently diagnosing or making treatment decisions without clinician involvement. At least 25 states have issued guidance based on the NAIC model bulletin on AI in insurance.</p>

          {/* Key Takeaways box */}
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "28px", margin: "36px 0" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#64748b", marginBottom: 16 }}>Key Takeaways</div>
            {[
              "The FDA's January 2026 guidance removes a large class of AI clinical decision support tools from premarket review — but does not eliminate hospital liability for their safe deployment.",
              "EHR vendors including Epic and Oracle Health are embedding AI natively, threatening standalone vendors and potentially stranding recent AI contracts.",
              "UnitedHealth projects $1B in AI savings; HCA $400M. The BCBS $2B coding claims analysis signals regulatory scrutiny of AI revenue cycle tools.",
              "Shadow AI is a current HIPAA breach risk: 63% of organizations lack AI governance policies; 23% of clinicians in one audit used ChatGPT for documentation.",
              "Federal deregulation plus state AI law proliferation creates a patchwork compliance environment that multi-state systems must map explicitly.",
              "The measure of AI success is shifting from adoption to governance: can your AI tools be audited, monitored, and trusted?"
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                <span style={{ color: "#00a8cc", fontWeight: 700, flexShrink: 0 }}>→</span>
                <span style={{ fontSize: 15, color: "#334155", lineHeight: 1.6 }}>{t}</span>
              </div>
            ))}
          </div>

          {/* Sources */}
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 28, marginTop: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#94a3b8", marginBottom: 14 }}>Sources</div>
            <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>
              FDA: Revised Clinical Decision Support Software guidance, January 6, 2026 · STAT News: Epic launches AI Charting, February 2026 · HIT Consultant: Aultman Health Nabla deployment, January 2026 · Reuters/Maryland Daily Record: HCA $400M, UnitedHealth $1B AI savings projections, March 2026 · PYMNTS: Healthcare Billing Wars AI analysis, March 2026 · IBM: 2025 AI security incident study · Wolters Kluwer: Shadow AI in healthcare report 2026 · Censinet: Texas RAIGA, December 2025 · KFF: AI in prior authorization, April 2026 · Manatt Health: Health AI Policy Tracker, April 2026
            </div>
          </div>
        </div>

        {/* Premium upsell */}
        <div style={{ marginTop: 32, background: "var(--navy)", borderRadius: 16, padding: "40px", textAlign: "center", border: "1px solid rgba(0,212,255,0.2)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>Premium Intelligence</div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "white", marginBottom: 12 }}>Read the Full Analysis Suite</h3>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, marginBottom: 28, maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.65 }}>Four additional premium articles are published today: HIPAA Security Rule compliance guide, hospital margins financial framework, AI prior authorization strategy, and shadow AI governance playbook.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => setPage("Newsletter")}>Subscribe — $29/month</button>
            <button className="btn btn-outline-white" onClick={() => setPage("Research")}>View all articles</button>
          </div>
        </div>
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
    About: <AboutPage />,
    Newsletter: <NewsletterPage />,
    Research: <ResearchPage />,
    Premium: <PremiumPage setPage={setPage} />,
    Advertising: <AdvertisingPage setPage={setPage} />,
    Contact: <ContactPage />,
    Article1: <Article1Page setPage={setPage} />,
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
