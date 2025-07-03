import { NextRequest, NextResponse } from 'next/server';
import { getBook, updateBook, deleteBook } from '@readrelay/shared/api/books';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/books/[id] - Get single book
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const result = await getBook(params.id);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 404 });
    }
  } catch (error) {
    console.error('Book GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

// PUT /api/books/[id] - Update book
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const body = await request.json();
    const result = await updateBook(params.id, body);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Book PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

// DELETE /api/books/[id] - Delete book
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const result = await deleteBook(params.id);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Book DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete book' },
      { status: 500 }
    );
  }
} 