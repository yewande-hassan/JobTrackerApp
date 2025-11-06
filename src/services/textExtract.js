// Heavy libraries (pdfjs, mammoth) are dynamically imported to keep initial bundle small.
let _pdfjsLib = null;
let _pdfWorkerUrl = null;
async function ensurePdfJs() {
  if (_pdfjsLib) return _pdfjsLib;
  const [pdfjsLib, workerUrl] = await Promise.all([
    import("pdfjs-dist"),
    import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
  ]);
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl.default || workerUrl;
  _pdfjsLib = pdfjsLib;
  _pdfWorkerUrl = workerUrl.default || workerUrl;
  return _pdfjsLib;
}

let _mammoth = null;
async function ensureMammoth() {
  if (_mammoth) return _mammoth;
  const mod = await import("mammoth");
  _mammoth = mod.default || mod;
  return _mammoth;
}

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
    const pdfjsLib = await ensurePdfJs();
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
    const mammoth = await ensureMammoth();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return (value || "").trim();
  } catch (e) {
    console.warn("DOCX extract failed:", e?.message || e);
    return "";
  }
}
