import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import mammoth from "mammoth";

// Configure pdfjs worker using bundler-provided asset URL
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function extractTextFromFile(file) {
  if (!file) return "";
  const name = (file.name || "").toLowerCase();
  if (name.endsWith(".pdf")) return await extractFromPdf(file);
  if (name.endsWith(".docx")) return await extractFromDocx(file);
  // Fallback: plain text or .doc or unknown
  try {
    return await file.text();
  } catch {
    return "";
  }
}

async function extractFromPdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it) => it.str).join(" ") + "\n";
    }
    text = text.trim();
    if (text) return text;
    // Fallback: try reading as plain text (may yield binary glyphs)
    return (await file.text()) || "";
  } catch (e) {
    console.warn("PDF extract failed:", e?.message || e);
    try {
      return (await file.text()) || "";
    } catch {
      return "";
    }
  }
}

async function extractFromDocx(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return (value || "").trim();
  } catch (e) {
    console.warn("DOCX extract failed:", e?.message || e);
    return "";
  }
}
