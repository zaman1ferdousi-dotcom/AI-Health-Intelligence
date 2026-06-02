// lib/markdown.js
// Converts the AI-generated Markdown newsletter to HTML
// No external library needed

export function markdownToHtml(md) {
  if (!md) return "";

  let html = md
    // H1
    .replace(/^# (.+)$/gm, '<h1 class="nl-h1">$1</h1>')
    // H2
    .replace(/^## (.+)$/gm, '<h2 class="nl-h2">$1</h2>')
    // H3
    .replace(/^### (.+)$/gm, '<h3 class="nl-h3">$1</h3>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="nl-divider" />')
    // Bullet points
    .replace(/^- (.+)$/gm, '<li class="nl-li">$1</li>')
    // Numbered list
    .replace(/^\d+\. (.+)$/gm, '<li class="nl-li">$1</li>')
    // 📌 source links — convert "📌 Source → URL" pattern
    .replace(
      /📌 (.+?) → (https?:\/\/[^\s\n]+)/g,
      '<p class="nl-source">📌 <strong>$1</strong> → <a href="$2" target="_blank" rel="noopener noreferrer" class="nl-link">Read full article →</a></p>'
    )
    // Regular links
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="nl-link">$1</a>'
    )
    // Paragraphs (double newline)
    .replace(/\n\n/g, "</p><p class='nl-p'>")
    // Single newlines to <br>
    .replace(/\n/g, "<br />");

  // Wrap in paragraph
  html = `<p class="nl-p">${html}</p>`;

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li class="nl-li">[\s\S]*?<\/li>)/g, (match) => {
    if (!match.startsWith("<ul")) {
      return `<ul class="nl-ul">${match}</ul>`;
    }
    return match;
  });

  // Clean up empty paragraphs
  html = html.replace(/<p class='nl-p'><\/p>/g, "");
  html = html.replace(/<p class='nl-p'><br \/><\/p>/g, "");

  return html;
}
