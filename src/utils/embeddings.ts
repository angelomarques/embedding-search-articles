import { GoogleGenAI } from "@google/genai";
import { Article } from "../types";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const result = await ai.models.embedContent({
    model: "text-embedding-004",
    contents: text,
    // config: {
    //   taskType: "QUESTION_ANSWERING",
    // },
    config: { outputDimensionality: 700 },
  });
  return result.embeddings ? result.embeddings[0].values || [] : [];
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function findRelevantArticles(
  query: string,
  articles: Article[],
  topK: number = 3
): Promise<Article[]> {
  const queryEmbedding = await generateEmbedding(query);

  // Generate embeddings for articles if they don't have them
  const articlesWithEmbeddings = await Promise.all(
    articles.map(async (article) => {
      if (!article.embedding) {
        article.embedding = await generateEmbedding(article.content);
      }
      return article;
    })
  );

  // Calculate similarity scores
  const articlesWithScores = articlesWithEmbeddings.map((article) => ({
    article,
    score: cosineSimilarity(queryEmbedding, article.embedding!),
  }));

  // Sort by similarity score and return top K articles
  return articlesWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => item.article);
}
