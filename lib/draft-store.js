// lib/draft-store.js
// Stores newsletter drafts as JSON in the /tmp directory (Vercel serverless)
// For production, upgrade to Vercel KV or a database

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

const STORE_DIR = "/tmp/newsletter-drafts";

function ensureDir() {
  if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true });
  }
}

function dateToSlug(date) {
  return new Date(date).toISOString().split("T")[0]; // "2026-06-01"
}

function slugPath(slug) {
  return join(STORE_DIR, `${slug}.json`);
}

// Save a draft
export function saveDraft(draft) {
  ensureDir();
  const slug = dateToSlug(draft.date);
  const data = {
    ...draft,
    slug,
    savedAt: new Date().toISOString(),
    status: draft.status || "draft", // "draft" | "published"
  };
  writeFileSync(slugPath(slug), JSON.stringify(data, null, 2), "utf8");
  console.log(`Draft saved: ${slug}`);
  return data;
}

// Get a single draft by slug (date string like "2026-06-01")
export function getDraft(slug) {
  ensureDir();
  const path = slugPath(slug);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

// Get today's draft
export function getTodaysDraft() {
  return getDraft(dateToSlug(new Date()));
}

// Get all drafts (sorted newest first)
export function getAllDrafts() {
  ensureDir();
  try {
    const files = readdirSync(STORE_DIR)
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse();
    return files
      .map((f) => {
        try {
          return JSON.parse(readFileSync(join(STORE_DIR, f), "utf8"));
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

// Update draft status
export function updateDraftStatus(slug, status) {
  const draft = getDraft(slug);
  if (!draft) return null;
  draft.status = status;
  draft.updatedAt = new Date().toISOString();
  writeFileSync(slugPath(slug), JSON.stringify(draft, null, 2), "utf8");
  return draft;
}

// Delete a draft
export function deleteDraft(slug) {
  const { unlinkSync } = require("fs");
  const path = slugPath(slug);
  if (existsSync(path)) {
    unlinkSync(path);
    return true;
  }
  return false;
}
