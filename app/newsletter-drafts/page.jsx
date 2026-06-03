import { getAllDrafts } from "@/lib/draft-store";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Daily Intelligence Editions | AI Health Intelligence",
  description: "Expert-level daily healthcare AI, policy, finance, and compliance intelligence for hospital executives, policymakers, and healthcare leaders.",
};

export default function NewsletterArchivePage() {
  let published = [];
  try {
    const all = getAllDrafts();
    published = all.filter((d) => d.status === "published");
  } catch (e) {
    published = [];
  }

  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f1f5f9; font-family: 'DM Sans', sans-serif; color: #1e293b; }
        .wrap { max-width: 860px; margin: 0 auto; padding: 40px 24px 80px; }
        .hero { background: #0a1628; border-radius: 16px; padding: 52px; margin-bottom: 32px; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; top: -80px; right: -80px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(0,212,255,0.12), transparent 70%); }
        .tag { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #00d4ff; display: block; margin-bottom: 12px; position: relative; z-index: 1; }
        h1 { font-family: 'Playfair Display', serif; font-size: clamp(26px,5vw,40px); color: white; margin-bottom: 14px; position: relative; z-index: 1; line-height: 1.2; }
        .sub { color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.7; position: relative; z-index: 1; max-width: 560px; }
        .audience { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 20px; position: relative; z-index: 1; }
        .audience span { background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.2); color: #00d4ff; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 100px; }
        .section-label { font-size: 12px; font-weight: 700; color: #64748b; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 14px; }
        .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 12px; transition: all 0.2s; overflow: hidden; }
        .card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-color: #00a8cc; }
        .card a { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 22px 28px; text-decoration: none; color: inherit; }
        .card-date { font-size: 17px; font-weight: 700; color: #0a1628; margin-bottom: 4px; font-family: 'Playfair Display', serif; }
        .card-meta { font-size: 13px; color: #94a3b8; }
        .badge { padding: 4px 12px; border-radius: 100px; font-size: 11px; font-weight: 700; background: #dcfce7; color: #166534; flex-shrink: 0; }
        .read-btn { background: #0a1628; color: white; font-size: 13px; font-weight: 600; padding: 8px 18px; border-radius: 7px; white-space: nowrap; flex-shrink: 0; }
        .empty { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 60px; text-align: center; }
        .empty-icon { font-size: 48px; margin-bottom: 20px; }
        .empty h3 { font-family: 'Playfair Display', serif; font-size: 22px; color: #0a1628; margin-bottom: 12px; }
        .empty p { color: #64748b; font-size: 15px; line-height: 1.65; max-width: 420px; margin: 0 auto 24px; }
        .what-inside { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px 32px; margin-bottom: 24px; }
        .what-inside h3 { font-family: 'Playfair Display', serif; font-size: 18px; color: #0a1628; margin-bottom: 16px; }
        .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .feature { display: flex; gap: 10px; align-items: flex-start; }
        .feature-icon { font-size: 18px; flex-shrink: 0; margin-top: 2px; }
        .feature-text { font-size: 13px; color: #334155; line-height: 1.55; }
        .feature-title { font-weight: 600; color: #0a1628; display: block; margin-bottom: 2px; }
        .back { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #64748b; text-decoration: none; margin-bottom: 28px; padding: 8px 14px; background: white; border: 1px solid #e2e8f0; border-radius: 6px; }
        .back:hover { color: #0a1628; }
        .disclaimer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 32px; line-height: 1.7; }
        @media(max-width:600px) { .hero { padding: 36px 28px; } .feature-grid { grid-template-columns: 1fr; } .card a { flex-wrap: wrap; } }
      `}</style>

      <div className="wrap">
        <a href="/" className="back">← AI Health Intelligence</a>

        <div className="hero">
          <span className="tag">Daily Intelligence Editions</span>
          <h1>AI Health Intelligence Daily</h1>
          <p className="sub">
            Expert-level analysis of healthcare AI, hospital finance, HIPAA compliance, health policy, 
            and informatics — published every day at 10 PM EST. Written for decision-makers, not general audiences.
          </p>
          <div className="audience">
            {["Hospital Executives", "Health Policy Leaders", "HIPAA Officers", "Healthcare Investors", "Informatics Professionals", "Public Health Researchers"].map((a) => (
              <span key={a}>{a}</span>
            ))}
          </div>
        </div>

        {/* What's inside */}
        <div className="what-inside">
          <h3>What Every Edition Contains</h3>
          <div className="feature-grid">
            {[
              { icon: "🔍", title: "Strategic Analysis", text: "Not just what happened — what it means for your organization, budget, and compliance program" },
              { icon: "💰", title: "Financial Implications", text: "Reimbursement changes, margin impacts, AI investment analysis, and revenue cycle intelligence" },
              { icon: "🏛️", title: "Policy Intelligence", text: "CMS rules, ONC updates, HHS enforcement, and legislative developments decoded for operators" },
              { icon: "🔐", title: "HIPAA & Compliance Alerts", text: "OCR enforcement actions, Security Rule updates, and actionable compliance guidance" },
              { icon: "⚡", title: "What To Do", text: "Concrete action items for executives, CISOs, CFOs, and compliance officers — not just observations" },
              { icon: "📊", title: "Data Point of the Day", text: "One key statistic analyzed for strategic significance — the number that matters most today" },
            ].map((f) => (
              <div key={f.title} className="feature">
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-text">
                  <span className="feature-title">{f.title}</span>
                  {f.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editions list */}
        {published.length > 0 ? (
          <div>
            <div className="section-label">Published Editions — All Free</div>
            {published
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((d) => (
                <div key={d.slug} className="card">
                  <a href={`/newsletter-drafts/${d.slug}`}>
                    <div>
                      <div className="card-date">
                        {new Date(d.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      </div>
                      <div className="card-meta">{d.articleCount || 0} source articles analyzed · Expert intelligence brief</div>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span className="badge">Published</span>
                      <span className="read-btn">Read Edition →</span>
                    </div>
                  </a>
                </div>
              ))}
          </div>
        ) : (
          <div className="empty">
            <div className="empty-icon">📡</div>
            <h3>First Edition Coming Tonight</h3>
            <p>
              Our system publishes a new expert intelligence brief every day at <strong>10 PM EST</strong>. 
              The first edition will appear here automatically tonight — analyzing today's most significant 
              healthcare AI, policy, finance, and compliance developments.
            </p>
            <a href="/newsletter" style={{ display: "inline-block", background: "#0a1628", color: "white", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 8, textDecoration: "none" }}>
              Subscribe for Free Updates →
            </a>
          </div>
        )}

        <p className="disclaimer">
          All content is provided for educational and informational purposes only.<br />
          AI Health Intelligence is an independent publication. Nothing herein constitutes legal, medical, or financial advice.<br />
          © {year} AI Health Intelligence. All rights reserved.
        </p>
      </div>
    </>
  );
}
