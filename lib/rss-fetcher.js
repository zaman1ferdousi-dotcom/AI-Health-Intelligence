// lib/rss-fetcher.js
// Fetches recent healthcare AI articles from curated RSS feeds
// No API key required — all free public feeds

const RSS_FEEDS = [
  // Healthcare AI & Technology
  {
    url: "https://www.healthcareitnews.com/feed",
    source: "Healthcare IT News",
    category: "Health IT",
  },
  {
    url: "https://www.modernhealthcare.com/rss/news.rss",
    source: "Modern Healthcare",
    category: "Healthcare",
  },
  {
    url: "https://medcitynews.com/feed/",
    source: "MedCity News",
    category: "Digital Health",
  },
  {
    url: "https://www.beckershospitalreview.com/rss/rss.html",
    source: "Becker's Hospital Review",
    category: "Hospital Finance",
  },
  {
    url: "https://www.fiercehealthcare.com/rss/xml",
    source: "Fierce Healthcare",
    category: "Healthcare",
  },
  {
    url: "https://www.statnews.com/feed/",
    source: "STAT News",
    category: "Health Research",
  },
  {
    url: "https://www.cms.gov/newsroom/rss",
    source: "CMS Newsroom",
    category: "Health Policy",
  },
  {
    url: "https://www.hhs.gov/rss/news.xml",
    source: "HHS News",
    category: "Health Policy",
  },
  {
    url: "https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml",
    source: "FDA Press Releases",
    category: "FDA",
  },
  {
    url: "https://hitconsultant.net/feed/",
    source: "HIT Consultant",
    category: "Health IT",
  },
  {
    url: "https://www.mobihealthnews.com/rss.xml",
    source: "MobiHealthNews",
    category: "Digital Health",
  },
  {
    url: "https://www.healthdatamanagement.com/rss",
    source: "Health Data Management",
    category: "Health Informatics",
  },
];

// Keywords to filter for relevance
const RELEVANT_KEYWORDS = [
  "artificial intelligence", "AI", "machine learning", "deep learning",
  "EHR", "electronic health record", "Epic", "Oracle Cerner",
  "CMS", "Medicare", "Medicaid", "reimbursement", "value-based",
  "FDA", "clearance", "approval", "digital health", "telehealth",
  "health informatics", "interoperability", "FHIR", "HL7",
  "hospital finance", "operating margin", "revenue cycle",
  "ambient documentation", "clinical decision support",
  "predictive analytics", "natural language processing",
  "health data", "patient data", "cybersecurity", "HIPAA",
  "digital therapeutics", "remote patient monitoring", "RPM",
  "health technology", "health IT", "health policy",
];

function isRelevant(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  return RELEVANT_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
}

function cleanText(text) {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text, maxLen = 300) {
  const cleaned = cleanText(text);
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.slice(0, maxLen).replace(/\s+\S*$/, "") + "...";
}

// Fetch a single RSS feed with timeout
async function fetchFeed(feedConfig) {
  const { url, source, category } = feedConfig;
  const articles = [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "AI-Health-Intelligence-Newsletter/1.0" },
    });
    clearTimeout(timeout);

    if (!response.ok) return articles;

    const xml = await response.text();

    // Parse items using regex (no external parser needed)
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    const titleRegex = /<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i;
    const linkRegex = /<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i;
    const descRegex = /<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i;
    const pubDateRegex = /<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i;
    const guidRegex = /<guid[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/guid>/i;

    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const title = cleanText((titleRegex.exec(itemXml) || [])[1] || "");
      const link = cleanText((linkRegex.exec(itemXml) || [])[1] || "");
      const description = truncate((descRegex.exec(itemXml) || [])[1] || "");
      const pubDate = cleanText((pubDateRegex.exec(itemXml) || [])[1] || "");
      const guid = cleanText((guidRegex.exec(itemXml) || [])[1] || link);

      if (!title || !link) continue;

      // Filter: only articles from last 48 hours
      if (pubDate) {
        const date = new Date(pubDate);
        const age = Date.now() - date.getTime();
        if (age > 48 * 60 * 60 * 1000) continue; // older than 48h
      }

      // Filter for relevance
      if (!isRelevant(title, description)) continue;

      articles.push({ title, link, description, pubDate, source, category, guid });
    }
  } catch (err) {
    console.error(`Feed error [${source}]:`, err.message);
  }

  return articles;
}

// Main export: fetch all feeds and return deduplicated articles
export async function fetchHealthcareArticles() {
  console.log(`Fetching ${RSS_FEEDS.length} RSS feeds...`);

  const results = await Promise.allSettled(RSS_FEEDS.map(fetchFeed));

  const allArticles = [];
  const seenGuids = new Set();

  for (const result of results) {
    if (result.status === "fulfilled") {
      for (const article of result.value) {
        if (!seenGuids.has(article.guid)) {
          seenGuids.add(article.guid);
          allArticles.push(article);
        }
      }
    }
  }

  // Sort by date descending
  allArticles.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });

  console.log(`Fetched ${allArticles.length} relevant articles`);
  return allArticles.slice(0, 30); // cap at 30 for AI processing
}
