import { NextResponse } from "next/server";
import { getDraft, updateDraftStatus, deleteDraft, saveDraft } from "@/lib/draft-store";

export const dynamic = "force-dynamic";

function isAuthorized(request) {
  return request.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

export async function GET(request, context) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  var draft = getDraft(context.params.slug);
  if (!draft) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ draft: draft });
}

export async function PATCH(request, context) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  var body = await request.json();
  var draft = getDraft(context.params.slug);
  if (!draft) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (body.status) {
    updateDraftStatus(context.params.slug, body.status);
  }
  if (body.content !== undefined) {
    var updated = Object.assign({}, draft, {
      content: body.content,
      updatedAt: new Date().toISOString(),
    });
    if (body.status) updated.status = body.status;
    saveDraft(updated);
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request, context) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  var deleted = deleteDraft(context.params.slug);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
