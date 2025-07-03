import { NextRequest, NextResponse } from 'next/server';
import { getBookByISBN } from '@readrelay/shared/api/books';

interface RouteParams {
  params: {
    isbn: string;
  };
}

// GET /api/books/isbn/[isbn] - Get book data by ISBN
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { isbn } = params;

    // Validate ISBN format
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    if (!/^\d{10}(\d{3})?$/.test(cleanISBN)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ISBN format' },
        { status: 400 }
      );
    }

    // Use our enhanced getBookByISBN with rate limiting and fallback
    const result = await getBookByISBN(cleanISBN);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 404 });
    }
  } catch (error) {
    console.error('ISBN lookup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to lookup ISBN' },
      { status: 500 }
    );
  }
} 