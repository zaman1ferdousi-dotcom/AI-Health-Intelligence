import { NextResponse } from "next/server";
import { getAllDrafts } from "@/lib/draft-store";
import { fetchHealthcareArticles } from "@/lib/rss-fetcher";
import { generateNewsletter } from "@/lib/newsletter-generator";
import { saveDraft } from "@/lib/draft-store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request) {
  const password = request.headers.get("x-admin-password");
  return password === process.env.ADMIN_PASSWORD;
}

// GET — list all editions
export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const drafts = getAllDrafts().map((d) => ({
    slug: d.slug,
    date: d.date,
    title: d.title,
    status: d.status,
    articleCount: d.articleCount,
    savedAt: d.savedAt,
    error: d.error,
  }));

  return NextResponse.json({ drafts });
}

// POST — manually generate and auto-publish
export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const articles = await fetchHealthcareArticles();
    const content = await generateNewsletter(articles, new Date().toISOString());
    const today = new Date().toISOString().split("T")[0];

    const draft = saveDraft({
      date: new Date().toISOString(),
      title: `AI Health Intelligence Daily — ${today}`,
      content,
      articles: articles.map((a) => ({
        title: a.title,
        source: a.source,
        link: a.link,
        category: a.category,
        pubDate: a.pubDate,
      })),
      articleCount: articles.length,
      status: "published",
    });

    return NextResponse.json({ success: true, slug: draft.slug, articleCount: articles.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
