import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Article from '@/models/Article';

export async function GET() {
  try {
    await connectDB();
    const articles = await Article.find({}).select('-embedding');
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
} 