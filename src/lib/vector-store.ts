import { Pinecone } from "@pinecone-database/pinecone";
import 'dotenv/config';

console.log("Connecting to Pinecone", process.env.PINECONE_API_KEY);
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export const pineconeIndex = pinecone.index("taskflow-chatbot");
