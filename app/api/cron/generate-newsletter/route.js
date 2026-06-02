import { NextResponse } from "next/server";
import { fetchHealthcareArticles } from "@/lib/rss-fetcher";
import { generateNewsletter } from "@/lib/newsletter-generator";
import { saveDraft, getTodaysDraft } from "@/lib/draft-store";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(request) {
  var authHeader = request.headers.get("authorization");
  var cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== "Bearer " + cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  var today = new Date().toISOString().split("T")[0];
  console.log("[Cron] Starting newsletter generation for " + today);

  try {
    var existing = getTodaysDraft();
    var forceParam = request.nextUrl && request.nextUrl.searchParams.get("force");

    if (existing && !forceParam) {
      console.log("[Cron] Draft already exists for " + today + ", skipping");
      return NextResponse.json({
        success: true,
        message: "Draft already exists for " + today,
        slug: today,
        skipped: true,
      });
    }

    console.log("[Cron] Fetching RSS feeds...");
    var articles = await fetchHealthcareArticles();

    if (articles.length === 0) {
      saveDraft({
        date: new Date().toISOString(),
        title: "AI Health Intelligence Daily — " + today,
        content: "# No articles found today\n\nNo relevant articles were found in the RSS feeds. Please check the feeds or add content manually.",
        articles: [],
        articleCount: 0,
        status: "draft",
        error: "No articles found",
      });
      return NextResponse.json({ success: true, slug: today, articleCount: 0 });
    }

    console.log("[Cron] Generating newsletter from " + articles.length + " articles...");
    var content = await generateNewsletter(articles, new Date().toISOString());

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

    console.log("[Cron] Draft saved: " + draft.slug);
    return NextResponse.json({
      success: true,
      message: "Newsletter draft generated for " + today,
      slug: draft.slug,
      articleCount: articles.length,
    });

  } catch (error) {
    console.error("[Cron] Error:", error.message);
    try {
      saveDraft({
        date: new Date().toISOString(),
        title: "AI Health Intelligence Daily — " + today + " [ERROR]",
        content: "# Generation Error\n\n**Error:** " + error.message + "\n\nPlease check your API keys and try again.",
        articles: [],
        articleCount: 0,
        status: "error",
        error: error.message,
      });
    } catch (e) {
      console.error("[Cron] Could not save error draft:", e.message);
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
