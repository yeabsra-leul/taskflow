import fs from "fs";
import {PDFParse} from "pdf-parse";

export async function extractPdfText(path: string) {
    const buffer = fs.readFileSync(path);
    const parser = new PDFParse({data: buffer});
	const result = await parser.getText();

    return result.text;
}


export function chunkText(text: string, size = 800, overlap = 120) {
  const chunks = [];

  let i = 0;
  while (i < text.length) {
    const chunk = text.slice(i, i + size);
    chunks.push(chunk);
    i += size - overlap;
  }

  return chunks;
}
