import { api } from "@/lib/api";
import { Article } from "@/types";

export async function getArticles() {
  const { data } = await api.get<Article[]>("/api/articles");

  return data;
}
