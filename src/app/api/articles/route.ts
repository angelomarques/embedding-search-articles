import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    // select author, title, fileurl
    const articles = await Article.find({}).select("author title url");
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await connectDB();

    await Article.create(body);

    return NextResponse.json(body);
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
