/**
 * Strip HTML tags from content and return plain text excerpt
 * @param {string} html - HTML content string
 * @param {number} maxLength - Maximum length of excerpt
 * @returns {string} Plain text excerpt
 */
export function stripHtml(html, maxLength = 150) {
  if (!html) return '';
  const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
