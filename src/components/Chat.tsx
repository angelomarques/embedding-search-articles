"use client";

import { useState, useEffect } from "react";
import { Message, Article } from "../types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { findRelevantArticles } from "../utils/embeddings";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""
);

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        body: JSON.stringify({ input }),
      });
      const data = await response.json();
      const assistantMessage = data.response;

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error while processing your request.",
        role: "assistant",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="p-4 mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.role === "user" ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.references && message.references.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">References:</h4>
                  {message.references.map((ref) => (
                    <div
                      key={ref.articleId}
                      className="text-sm text-gray-600 mb-2"
                    >
                      <p className="font-medium">
                        {ref.title} by {ref.author}
                      </p>
                      <p className="italic">{ref.excerpt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <p>Thinking...</p>
            </div>
          )}
        </div>
      </Card>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the articles..."
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          Send
        </Button>
      </form>
    </div>
  );
}
