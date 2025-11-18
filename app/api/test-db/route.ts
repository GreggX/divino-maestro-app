import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/mongodb';

export async function GET() {
  try {
    const mongoose = await connectDB();
    const client = mongoose.connection.getClient();
    const db = client.db();

    // Test if db.collection works
    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      success: true,
      dbName: db.databaseName,
      collectionsCount: collections.length,
      collections: collections.map(c => c.name),
      hasCollectionMethod: typeof db.collection === 'function',
      dbType: db.constructor.name,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
