import { NextResponse } from "next/server";
import { fetchHealthcareArticles } from "@/lib/rss-fetcher";
import { generateNewsletter } from "@/lib/newsletter-generator";
import { saveDraft, getTodaysDraft } from "@/lib/draft-store";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];
  console.log(`[Cron] Starting newsletter generation for ${today}`);

  try {
    const existing = getTodaysDraft();
    if (existing && !request.nextUrl?.searchParams.get("force")) {
      console.log(`[Cron] Already published for ${today}, skipping`);
      return NextResponse.json({
        success: true,
        message: `Newsletter already published for ${today}`,
        slug: today,
        skipped: true,
      });
    }

    console.log("[Cron] Fetching RSS feeds...");
    const articles = await fetchHealthcareArticles();

    if (articles.length === 0) {
      console.warn("[Cron] No articles found");
      saveDraft({
        date: new Date().toISOString(),
        title: `AI Health Intelligence Daily — ${today}`,
        content: "# No articles found today\n\nThe RSS fetcher returned no relevant articles for today. Please check the feeds.",
        articles: [],
        articleCount: 0,
        status: "published",
        error: "No articles found",
      });
      return NextResponse.json({ success: true, slug: today, articleCount: 0 });
    }

    console.log(`[Cron] Generating newsletter from ${articles.length} articles...`);
    const content = await generateNewsletter(articles, new Date().toISOString());

    // Auto-publish immediately — no manual review step
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

    console.log(`[Cron] ✅ Auto-published: ${draft.slug}`);

    return NextResponse.json({
      success: true,
      message: `Newsletter auto-published for ${today}`,
      slug: draft.slug,
      articleCount: articles.length,
    });
  } catch (error) {
    console.error("[Cron] ❌ Error:", error.message);
    try {
      saveDraft({
        date: new Date().toISOString(),
        title: `AI Health Intelligence Daily — ${today} [ERROR]`,
        content: `# Generation Error\n\n**Error:** ${error.message}\n\nPlease check your API keys and generate manually from the admin dashboard.`,
        articles: [],
        articleCount: 0,
        status: "error",
        error: error.message,
      });
    } catch (e) {}
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
