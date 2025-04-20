import { api } from "@/lib/api";

export function createArticle(data: any) {
  return api.post("/api/articles", data);
}
