import { embed } from 'ai';

export async function embedText(text: string) {
const { embedding } = await embed({
  model: "openai/text-embedding-3-small",
  value: text,
});

  return embedding;
}
