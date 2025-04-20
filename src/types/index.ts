export interface Article {
  _id: string;
  title: string;
  author: string;
  content: string;
  embedding?: number[];
  url?: string;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  references?: {
    articleId: string;
    excerpt: string;
    title: string;
    author: string;
  }[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}
