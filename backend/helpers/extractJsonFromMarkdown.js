import JSON5 from 'json5';

export default function extractJsonFromMarkdown(raw) {
  if (typeof raw !== "string") {
    throw new Error("Expected a string input to extractJsonFromMarkdown");
  }

  const cleaned = raw
    .replace(/```json\s*/, "")
    .replace(/```$/, "")
    .trim();

  return JSON5.parse(cleaned); // handles unquoted keys, single quotes, etc.
}
