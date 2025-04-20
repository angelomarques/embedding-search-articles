import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";
import { Message } from "@/types";
import { findRelevantArticles } from "@/utils/embeddings";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const maxDuration = 35; // This function can run for a maximum of 5 seconds

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { input } = body;

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "Input must be a string" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
    });

    await connectDB();
    const articles = await Article.find({}).select("-embedding");

    // Find relevant articles
    const relevantArticles = await findRelevantArticles(input, articles);

    // Generate response using the relevant articles
    //   const model = ai.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Based on the following articles, answer the question: "${input}"

${relevantArticles
  .map(
    (article) => `
Title: ${article.title}
Author: ${article.author}
Content: ${article.content}
`
  )
  .join("\n")}

Please provide a clear answer and cite the specific articles you used.`;

    //   const result = await model.generateContent(prompt);
    //   const response = await result.response;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    const text = response.text ?? "";

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: text,
      role: "assistant",
      references: relevantArticles.map((article) => ({
        articleId: article._id,
        excerpt: article.content.substring(0, 200) + "...",
        title: article.title,
        author: article.author,
      })),
    };

    return NextResponse.json({ response: assistantMessage });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
