
import { chunkText, extractPdfText } from "@/lib/prepare-pdf";
import { pineconeIndex } from "../src/lib/vector-store";
import { embedText } from "@/lib/embed-text";
import 'dotenv/config';

async function main() {
  console.log("Extracting PDF...");
  const text = await extractPdfText("./src/lib/docs/taskflow-kb.pdf");

  console.log("Chunking...");
  const chunks = chunkText(text);

  console.log("Embedding + Uploading...");
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    const vector = await embedText(chunk);

    await pineconeIndex.upsert([
      {
        id: `chunk-${i}`,
        values: vector,
        metadata: { text: chunk }
      }
    ]);

    console.log(`Stored chunk ${i + 1}/${chunks.length}`);
  }

  console.log("Done!");
}

main();
