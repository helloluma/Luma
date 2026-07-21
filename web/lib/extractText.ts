// Client-side text extraction for uploaded files, so Luma can verify the claims
// inside a dropped document. Text/markdown/csv/json are read directly; PDFs are
// parsed with pdf.js. Images carry no extractable text (reading them needs the
// vision-enabled engine, a later/funded capability) and return "".

export function isImage(file: File): boolean {
  return file.type.startsWith("image/");
}

function isTextLike(file: File): boolean {
  const n = file.name.toLowerCase();
  return (
    file.type.startsWith("text/") ||
    n.endsWith(".txt") ||
    n.endsWith(".md") ||
    n.endsWith(".markdown") ||
    n.endsWith(".csv") ||
    n.endsWith(".json")
  );
}

function isPdf(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

async function extractPdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  // Worker is copied into /public at build setup time.
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const data = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(
      content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" "),
    );
  }
  return pages.join("\n\n").trim();
}

/** Extract plain text from a single file. Returns "" when there is nothing to read. */
export async function extractText(file: File): Promise<string> {
  try {
    if (isTextLike(file)) return (await file.text()).trim();
    if (isPdf(file)) return await extractPdf(file);
    return ""; // images and unsupported types
  } catch {
    return "";
  }
}

/**
 * Extract and concatenate text from many files, labeling each block with its
 * filename. Returns the combined text (may be "" if nothing was readable).
 */
export async function extractAll(files: File[]): Promise<string> {
  const blocks: string[] = [];
  for (const file of files) {
    const text = await extractText(file);
    if (text) blocks.push(`--- ${file.name} ---\n${text}`);
  }
  return blocks.join("\n\n").trim();
}
