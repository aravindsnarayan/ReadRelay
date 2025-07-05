import { NextRequest, NextResponse } from 'next/server';
import {
  createBook,
  searchBooks,
  getUserBooks,
} from '@readrelay/shared/api/books';

// GET /api/books - Search books or get user's books
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const userId = searchParams.get('userId');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // If userId is provided, get user's books
    if (userId) {
      const result = await getUserBooks(userId);
      return NextResponse.json(result);
    }

    // If location parameters are provided, search by location
    if (lat && lng) {
      const { searchBooksByLocation } = await import(
        '@readrelay/shared/api/books'
      );
      const result = await searchBooksByLocation(
        { latitude: parseFloat(lat), longitude: parseFloat(lng) },
        radius ? parseInt(radius) : 10,
        limit,
        offset
      );
      return NextResponse.json(result);
    }

    // Otherwise search books
    const searchParams_books = {
      query: query || undefined,
      limit,
      offset,
    };

    const result = await searchBooks(searchParams_books);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Books API GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// POST /api/books - Create new book
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.author) {
      return NextResponse.json(
        { success: false, error: 'Title and author are required' },
        { status: 400 }
      );
    }

    const result = await createBook(body);

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Books API POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create book' },
      { status: 500 }
    );
  }
}
