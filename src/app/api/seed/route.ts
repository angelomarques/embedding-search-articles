import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Article from '@/models/Article';
import { generateEmbedding } from '@/utils/embeddings';

const initialArticles = [
  {
    title: 'The Future of Artificial Intelligence',
    author: 'Dr. Sarah Johnson',
    content: 'Artificial Intelligence is rapidly transforming our world. From healthcare to transportation, AI systems are becoming increasingly sophisticated. The key to successful AI implementation lies in understanding its limitations and potential. Machine learning algorithms, particularly deep learning, have shown remarkable success in pattern recognition tasks. However, ethical considerations and responsible development must remain at the forefront of AI advancement.',
  },
  {
    title: 'Sustainable Energy Solutions',
    author: 'Michael Chen',
    content: 'The transition to renewable energy sources is crucial for combating climate change. Solar and wind power technologies have made significant advancements in recent years. Energy storage solutions, particularly battery technology, are improving efficiency and reducing costs. The integration of smart grids and renewable energy sources is creating more resilient and sustainable power systems.',
  },
  {
    title: 'The Impact of Quantum Computing',
    author: 'Prof. Emily Rodriguez',
    content: 'Quantum computing represents a paradigm shift in computational capabilities. Unlike classical computers that use bits, quantum computers use qubits that can exist in multiple states simultaneously. This property enables quantum computers to solve certain problems exponentially faster than classical computers. Applications range from cryptography to drug discovery and materials science.',
  }
];

export async function POST() {
  try {
    await connectDB();

    // Clear existing articles
    await Article.deleteMany({});

    // Generate embeddings and insert new articles
    const articlesWithEmbeddings = await Promise.all(
      initialArticles.map(async (article) => {
        const embedding = await generateEmbedding(article.content);
        return {
          ...article,
          embedding,
        };
      })
    );

    await Article.insertMany(articlesWithEmbeddings);

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
} 