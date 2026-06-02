import { NextResponse } from "next/server";
import { getAllDrafts, saveDraft } from "@/lib/draft-store";
import { fetchHealthcareArticles } from "@/lib/rss-fetcher";
import { generateNewsletter } from "@/lib/newsletter-generator";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request) {
  return request.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  var drafts = getAllDrafts().map(function(d) {
    return {
      slug: d.slug,
      date: d.date,
      title: d.title,
      status: d.status,
      articleCount: d.articleCount,
      savedAt: d.savedAt,
      error: d.error,
    };
  });
  return NextResponse.json({ drafts: drafts });
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    var articles = await fetchHealthcareArticles();
    var content = await generateNewsletter(articles, new Date().toISOString());
    var today = new Date().toISOString().split("T")[0];
    var draft = saveDraft({
      date: new Date().toISOString(),
      title: "AI Health Intelligence Daily — " + today,
      content: content,
      articles: articles.map(function(a) {
        return { title: a.title, source: a.source, link: a.link, category: a.category, pubDate: a.pubDate };
      }),
      articleCount: articles.length,
      status: "draft",
    });
    return NextResponse.json({ success: true, slug: draft.slug, articleCount: articles.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
