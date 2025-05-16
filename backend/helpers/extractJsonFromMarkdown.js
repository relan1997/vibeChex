export default function extractJsonFromMarkdown(raw) {
  if (typeof raw !== "string") {
    throw new Error("Expected a string input to extractJsonFromMarkdown");
  }

  const cleaned = raw.replace(/^```json\n/, "").replace(/\n```$/, "");
  return JSON.parse(cleaned);
}