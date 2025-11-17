import { embedText } from "./embed-text";
import { pineconeIndex } from "./vector-store";

export async function retrieveRelevantChunks(query: string, topK = 5) {

  const queryEmbedding = await embedText(query);

  const results = await pineconeIndex.query({
    topK,
    vector: queryEmbedding,
    includeMetadata: true,
  });

  return results.matches || [];
}

//helper
export function formatRetrievedChunks(matches: any[]) {
  return matches
    .map((m) => m.metadata?.text || "")
    .join("\n\n");
}