import { supabase } from '../lib/supabase';
import { validateInput } from '../utils/validation';
import { calculateDistance, type Coordinates } from '../utils/location';
import {
  bookSchema,
  bookUpdateSchema,
  bookSearchSchema,
  type BookInput,
  type BookUpdateInput,
  type BookSearchInput,
} from '../utils/validation';
import type { Book, BookInsert, BookUpdate, Profile } from '../types/database';
import { getCurrentUser } from './auth';

// Book result types
export interface BookResult {
  success: boolean;
  error?: string;
  book?: Book;
}

export interface BooksResult {
  success: boolean;
  error?: string;
  books?: Array<Book & { distance_km?: number; owner?: Partial<Profile> }>;
  total?: number;
  hasMore?: boolean;
}

// External book data structure
export interface ExternalBookData {
  title: string;
  author: string;
  isbn: string;
  description?: string;
  cover_image_url?: string;
  publication_year?: number;
  publisher?: string;
  genre?: string;
  language?: string;
}

// Google Books API types
interface GoogleBooksVolumeInfo {
  title?: string;
  authors?: string[];
  description?: string;
  publisher?: string;
  publishedDate?: string;
  categories?: string[];
  language?: string;
  imageLinks?: {
    thumbnail?: string;
  };
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
}

interface GoogleBooksItem {
  volumeInfo: GoogleBooksVolumeInfo;
}

// Create new book
export const createBook = async (bookData: BookInput): Promise<BookResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const validatedData = validateInput(bookSchema, bookData);

    const bookInsert: BookInsert = {
      ...validatedData,
      owner_id: user.id,
      availability_status: 'available',
    };

    const { data, error } = await supabase
      .from('books')
      .insert(bookInsert)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, book: data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create book',
    };
  }
};

// Get book by ID
export const getBook = async (bookId: string): Promise<BookResult> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select(
        `
        *,
        owner:profiles!books_owner_id_fkey(*)
      `
      )
      .eq('id', bookId)
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'Book not found' };
    }

    return { success: true, book: data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get book',
    };
  }
};

// Update book
export const updateBook = async (
  bookId: string,
  bookData: BookUpdateInput
): Promise<BookResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const validatedData = validateInput(bookUpdateSchema, bookData);

    const { data, error } = await supabase
      .from('books')
      .update(validatedData as BookUpdate)
      .eq('id', bookId)
      .eq('owner_id', user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, book: data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update book',
    };
  }
};

// Delete book
export const deleteBook = async (
  bookId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId)
      .eq('owner_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete book',
    };
  }
};

// Search books
export const searchBooks = async (
  searchParams: BookSearchInput
): Promise<BooksResult> => {
  try {
    const validatedParams = validateInput(bookSearchSchema, searchParams);

    let query = supabase.from('books').select(
      `
        *,
        owner:profiles!books_owner_id_fkey(
          id, username, full_name, location_text, privacy_settings
        )
      `,
      { count: 'exact' }
    );

    // Text search
    if (validatedParams.query) {
      query = query.or(
        `title.ilike.%${validatedParams.query}%,author.ilike.%${validatedParams.query}%,description.ilike.%${validatedParams.query}%`
      );
    }

    // Filter by author
    if (validatedParams.author) {
      query = query.ilike('author', `%${validatedParams.author}%`);
    }

    // Filter by genre
    if (validatedParams.genre) {
      query = query.ilike('genre', `%${validatedParams.genre}%`);
    }

    // Filter by condition
    if (validatedParams.condition) {
      query = query.eq('condition', validatedParams.condition);
    }

    // Filter by exchange type
    if (validatedParams.exchange_type) {
      query = query.eq('exchange_type', validatedParams.exchange_type);
    }

    // Filter by availability
    if (validatedParams.availability_status) {
      query = query.eq(
        'availability_status',
        validatedParams.availability_status
      );
    } else {
      // Only show available books by default
      query = query.eq('availability_status', 'available');
    }

    // Apply location filter if provided
    // Note: Location-based search is handled by separate searchBooksByLocation function

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(
        validatedParams.offset || 0,
        (validatedParams.offset || 0) + (validatedParams.limit || 20) - 1
      );

    if (error) {
      return { success: false, error: error.message };
    }

    const hasMore = count
      ? (validatedParams.offset || 0) + (validatedParams.limit || 20) < count
      : false;

    return {
      success: true,
      books: (data || []) as Array<
        Book & { distance_km?: number; owner?: Partial<Profile> }
      >,
      total: count || 0,
      hasMore,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search books',
    };
  }
};

// Search books by location
export const searchBooksByLocation = async (
  center: Coordinates,
  radiusKm: number = 10,
  limit: number = 20,
  offset: number = 0
): Promise<BooksResult> => {
  try {
    const { data, error, count } = await supabase
      .from('books')
      .select(
        `
        *,
        owner:profiles!books_owner_id_fkey(id, username, full_name, location_latitude, location_longitude)
      `,
        { count: 'exact' }
      )
      .eq('availability_status', 'available')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return { success: false, error: error.message };
    }

    // Calculate distances for each book based on owner location
    const booksWithDistance = (data || [])
      .map(book => {
        if (book.owner?.location_latitude && book.owner?.location_longitude) {
          const distance = calculateDistance(center, {
            latitude: book.owner.location_latitude,
            longitude: book.owner.location_longitude,
          });
          return { ...book, distance_km: distance };
        }
        return { ...book, distance_km: undefined };
      })
      .filter(book => !book.distance_km || book.distance_km <= radiusKm)
      .sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));

    const hasMore = count ? offset + limit < count : false;

    return {
      success: true,
      books: booksWithDistance,
      total: count || 0,
      hasMore,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to search books by location',
    };
  }
};

// Get user's books
export const getUserBooks = async (userId?: string): Promise<BooksResult> => {
  try {
    let targetUserId = userId;

    if (!targetUserId) {
      const user = await getCurrentUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }
      targetUserId = user.id;
    }

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('owner_id', targetUserId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, books: data || [] };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get user books',
    };
  }
};

// Upload book cover image
export const uploadBookCover = async (
  bookId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${bookId}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('book-covers')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from('book-covers')
      .getPublicUrl(data.path);

    // Update book with cover URL
    const updateResult = await updateBook(bookId, {
      cover_image_url: urlData.publicUrl,
    });

    if (!updateResult.success) {
      return { success: false, error: updateResult.error };
    }

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to upload book cover',
    };
  }
};

// Enhanced Google Books API with rate limiting and error handling
export const getBookByISBN = async (
  isbn: string,
  retryCount: number = 0
): Promise<{ success: boolean; book?: ExternalBookData; error?: string }> => {
  try {
    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const googleBooksResponse = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    // Handle rate limiting with exponential backoff
    if (googleBooksResponse.status === 429) {
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
        // eslint-disable-next-line no-console
        console.warn(`Rate limit exceeded, retrying in ${delay}ms (attempt ${retryCount + 1}/3)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return getBookByISBN(isbn, retryCount + 1);
      }
      return { 
        success: false, 
        error: 'Rate limit exceeded. Please try again later.' 
      };
    }

    if (!googleBooksResponse.ok) {
      // Try fallback to Open Library API
      if (retryCount === 0) {
        // eslint-disable-next-line no-console
        console.warn('Google Books API failed, trying Open Library fallback');
        return getBookByISBNFromOpenLibrary(isbn);
      }
      return { 
        success: false, 
        error: `Google Books API error: ${googleBooksResponse.status}` 
      };
    }

    const googleData = await googleBooksResponse.json();

    if (googleData.items && googleData.items.length > 0) {
      const book = googleData.items[0].volumeInfo;
      return {
        success: true,
        book: {
          title: book.title || '',
          author: book.authors?.[0] || 'Unknown Author',
          isbn,
          description: book.description || '',
          // Request higher resolution cover image
          cover_image_url: book.imageLinks?.thumbnail?.replace('zoom=1', 'zoom=2') || 
                          book.imageLinks?.smallThumbnail?.replace('zoom=1', 'zoom=2'),
          publication_year: book.publishedDate
            ? parseInt(book.publishedDate.split('-')[0])
            : undefined,
          publisher: book.publisher || '',
          genre: book.categories?.[0] || '',
          language: book.language || 'en',
        },
      };
    }

    // If no results from Google Books, try Open Library as fallback
    return getBookByISBNFromOpenLibrary(isbn);

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Request timeout. Please try again.' };
    }
    
    // Try fallback API on network errors
    if (retryCount === 0) {
      // eslint-disable-next-line no-console
      console.warn('Google Books API network error, trying Open Library fallback');
      return getBookByISBNFromOpenLibrary(isbn);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch book data',
    };
  }
};

// Fallback to Open Library API
const getBookByISBNFromOpenLibrary = async (
  isbn: string
): Promise<{ success: boolean; book?: ExternalBookData; error?: string }> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { success: false, error: 'Book not found in any database' };
    }

    const data = await response.json();
    const bookKey = `ISBN:${isbn}`;
    
    if (data[bookKey]) {
      const book = data[bookKey];
      return {
        success: true,
        book: {
          title: book.title || '',
          author: book.authors?.[0]?.name || 'Unknown Author',
          isbn,
          description: book.description || '',
          cover_image_url: book.cover?.large || book.cover?.medium || book.cover?.small || '',
          publication_year: book.publish_date ? parseInt(book.publish_date) : undefined,
          publisher: book.publishers?.[0]?.name || '',
          genre: book.subjects?.[0]?.name || '',
          language: 'en', // Open Library doesn't always provide language
        },
      };
    }

    return { success: false, error: 'Book not found' };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Request timeout. Please try again.' };
    }
    return { 
      success: false, 
      error: 'Book not found in any database' 
    };
  }
};

// Search books from external API (Google Books)
export const searchExternalBooks = async (
  query: string,
  limit: number = 10
): Promise<{
  success: boolean;
  books?: ExternalBookData[];
  error?: string;
}> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${limit}`
    );

    if (!response.ok) {
      return {
        success: false,
        error: 'Failed to search books from Google Books',
      };
    }

    const data = await response.json();

    if (!data.items) {
      return { success: true, books: [] };
    }

    const books: ExternalBookData[] = data.items.map(
      (item: GoogleBooksItem) => {
        const bookInfo = item.volumeInfo;
        return {
          title: bookInfo.title || '',
          author: bookInfo.authors ? bookInfo.authors.join(', ') : '',
          isbn:
            bookInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')
              ?.identifier || '',
          description: bookInfo.description || '',
          publisher: bookInfo.publisher || '',
          publication_year: bookInfo.publishedDate
            ? parseInt(bookInfo.publishedDate)
            : undefined,
          cover_image_url: bookInfo.imageLinks?.thumbnail || '',
          genre: bookInfo.categories ? bookInfo.categories[0] : '',
          language: bookInfo.language || 'en',
        };
      }
    );

    return { success: true, books };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to search external books',
    };
  }
};

// Get similar books
export const getSimilarBooks = async (
  bookId: string,
  limit: number = 10
): Promise<BooksResult> => {
  try {
    // Get the source book first
    const { data: sourceBook, error: sourceError } = await supabase
      .from('books')
      .select('author, genre, tags')
      .eq('id', bookId)
      .single();

    if (sourceError || !sourceBook) {
      return { success: false, error: 'Source book not found' };
    }

    let query = supabase
      .from('books')
      .select(
        `
        *,
        owner:profiles!books_owner_id_fkey(
          id, username, full_name, location_text, privacy_settings
        )
      `
      )
      .neq('id', bookId)
      .eq('availability_status', 'available');

    // Filter by author or genre
    if (sourceBook.author) {
      query = query.or(
        `author.ilike.%${sourceBook.author}%,genre.ilike.%${sourceBook.genre || ''}%`
      );
    }

    const { data, error } = await query.limit(limit);

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      books: data || [],
      total: data?.length || 0,
      hasMore: false,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get similar books',
    };
  }
};
