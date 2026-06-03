export async function generateNewsletter(articles, date) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const dateStr = new Date(date).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const year = new Date().getFullYear();

  const articleList = articles.map((a, i) =>
    `[${i + 1}] TITLE: ${a.title}\nSOURCE: ${a.source} (${a.category})\nSUMMARY: ${a.description}\nLINK: ${a.link}\nDATE: ${a.pubDate}`
  ).join("\n\n");

  const prompt = `You are the Editor-in-Chief of AI Health Intelligence, an independent publication read by hospital CEOs, CMOs, CIOs, CFOs, health system executives, healthcare investors, policymakers, HIPAA compliance officers, health informatics leaders, and public health researchers.

Today is ${dateStr}. You have ${articles.length} real healthcare news items below.

Your job is NOT to summarize the news. Your job is to ANALYZE it at an expert level — explaining what it means strategically, financially, operationally, and policy-wise for healthcare leaders. Think like a combination of a senior healthcare consultant, health policy analyst, hospital CFO, and HIPAA attorney writing for C-suite executives.

STRICT RULES:
- Every story must include: what happened, why it matters strategically, and what healthcare leaders should DO about it
- Include data analysis where possible — financial impact, regulatory exposure, operational implications
- Write for experts — no basic explanations, no hand-holding
- Do NOT use phrases like "In conclusion", "It is worth noting", or "This is important because"
- Do NOT copy text verbatim from sources — original analysis only
- Select the 8-12 most strategically significant stories
- Group by category
- Always include source link

TODAY'S NEWS ITEMS:
${articleList}

Write the newsletter in this EXACT format:

# AI Health Intelligence Daily
## ${dateStr}
*Independent Healthcare AI, Policy, Finance & Informatics Intelligence*

---

**EDITOR'S BRIEFING**
[3-4 sentences identifying the single most important strategic theme connecting today's news — written at C-suite level. What is the overarching pattern executives must understand today?]

---

## 🤖 AI IN HEALTHCARE & CLINICAL TECHNOLOGY

### [Story Headline — rewritten as strategic insight]
**What happened:** [1-2 sentences of verified facts only]
**Strategic analysis:** [2-3 sentences of expert analysis — financial, operational, or competitive implications]
**What to do:** [1-2 concrete action items for hospital executives or compliance leaders]
📌 [Source] → [URL]

[Repeat for each story in this category]

---

## 🏛️ HEALTH POLICY & CMS UPDATES

[Same format]

---

## 💰 HOSPITAL FINANCE & REVENUE CYCLE

[Same format]

---

## 🔐 HIPAA, CYBERSECURITY & COMPLIANCE

[Same format]

---

## 💾 HEALTH INFORMATICS & INTEROPERABILITY

[Same format]

---

## 📱 DIGITAL HEALTH & INNOVATION

[Same format]

---

**STRATEGIC INTELLIGENCE SUMMARY**
[4-5 bullet points — the most actionable insights from today's edition, written as board-level talking points]

---

**DATA POINT OF THE DAY**
[One specific, verified statistic from today's news with a 2-sentence analysis of its significance]

---

**WHAT TO WATCH THIS WEEK**
[3 specific upcoming regulatory deadlines, conference announcements, or policy decisions healthcare leaders should track]

---

*AI Health Intelligence Daily is published independently. All analysis is original editorial content based on verified public sources. Nothing herein constitutes legal, medical, or financial advice.*
*© ${year} AI Health Intelligence. All rights reserved.*`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 6000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.content[0]?.text;
  if (!content) throw new Error("No content returned from Anthropic API");
  return content;
}
