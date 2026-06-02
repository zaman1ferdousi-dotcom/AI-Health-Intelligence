export async function generateNewsletter(articles, date) {
  var apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  var dateStr = new Date(date).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  var articleList = articles.map(function(a, i) {
    return "[" + (i + 1) + "] TITLE: " + a.title + "\nSOURCE: " + a.source + " (" + a.category + ")\nSUMMARY: " + a.description + "\nLINK: " + a.link + "\nDATE: " + a.pubDate;
  }).join("\n\n");

  var year = new Date().getFullYear();

  var prompt = "You are the Editor-in-Chief of AI Health Intelligence, an independent healthcare AI publication.\n\nToday is " + dateStr + ". Below are " + articles.length + " recent healthcare news items. Write today's AI Health Intelligence Daily newsletter.\n\nSTRICT RULES:\n- Do NOT copy text verbatim. Write everything in your own words.\n- Each story summary: 2-3 sentences only.\n- Always include the source link for every story.\n- Group stories by category.\n- Select 8-12 most important stories.\n- Add a 3-4 sentence Editor's Note at the top.\n- Do not use any made-up statistics or numbers not in the source articles.\n\nTODAY'S ARTICLES:\n" + articleList + "\n\nWrite the newsletter in this EXACT Markdown format:\n\n# AI Health Intelligence Daily\n## " + dateStr + "\n*Independent Healthcare AI Intelligence*\n\n---\n\n**EDITOR'S NOTE**\n[3-4 sentences about today's key healthcare AI theme]\n\n---\n\n## 🤖 AI IN HEALTHCARE\n### [Story Title]\n[2-3 sentence original summary]\n📌 [Source Name] → [URL]\n\n## 🏛️ HEALTH POLICY & CMS\n[stories in same format]\n\n## 💰 HOSPITAL FINANCE & OPERATIONS\n[stories in same format]\n\n## 💾 HEALTH INFORMATICS & EHR\n[stories in same format]\n\n## 📱 DIGITAL HEALTH\n[stories in same format]\n\n## 🔬 RESEARCH & FDA\n[stories in same format]\n\n---\n\n**WHAT TO WATCH THIS WEEK**\n[2-3 bullet points about upcoming trends]\n\n---\n\n*AI Health Intelligence Daily — Independent healthcare AI, policy, finance, and informatics coverage.*\n*© " + year + " AI Health Intelligence. All rights reserved.*";

  var response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    var err = await response.text();
    throw new Error("Anthropic API error " + response.status + ": " + err);
  }

  var data = await response.json();
  var content = data.content[0] && data.content[0].text;
  if (!content) throw new Error("No content returned from Anthropic API");
  return content;
}
