import { supabase } from '../lib/supabase';
import { validateInput } from '../utils/validation';
import { calculateDistance } from '../utils/location';
import { bookSchema, bookUpdateSchema, bookSearchSchema, } from '../utils/validation';
import { getCurrentUser } from './auth';
// Create new book
export const createBook = async (bookData) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }
        const validatedData = validateInput(bookSchema, bookData);
        const bookInsert = {
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
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create book',
        };
    }
};
// Get book by ID
export const getBook = async (bookId) => {
    try {
        const { data, error } = await supabase
            .from('books')
            .select(`
        *,
        owner:profiles!books_owner_id_fkey(*)
      `)
            .eq('id', bookId)
            .maybeSingle();
        if (error) {
            return { success: false, error: error.message };
        }
        if (!data) {
            return { success: false, error: 'Book not found' };
        }
        return { success: true, book: data };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get book',
        };
    }
};
// Update book
export const updateBook = async (bookId, bookData) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }
        const validatedData = validateInput(bookUpdateSchema, bookData);
        const { data, error } = await supabase
            .from('books')
            .update(validatedData)
            .eq('id', bookId)
            .eq('owner_id', user.id)
            .select()
            .single();
        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true, book: data };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update book',
        };
    }
};
// Delete book
export const deleteBook = async (bookId) => {
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
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete book',
        };
    }
};
// Search books
export const searchBooks = async (searchParams) => {
    try {
        const validatedParams = validateInput(bookSearchSchema, searchParams);
        let query = supabase.from('books').select(`
        *,
        owner:profiles!books_owner_id_fkey(
          id, username, full_name, location_text, privacy_settings
        )
      `, { count: 'exact' });
        // Text search
        if (validatedParams.query) {
            query = query.or(`title.ilike.%${validatedParams.query}%,author.ilike.%${validatedParams.query}%,description.ilike.%${validatedParams.query}%`);
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
            query = query.eq('availability_status', validatedParams.availability_status);
        }
        else {
            // Only show available books by default
            query = query.eq('availability_status', 'available');
        }
        // Apply location filter if provided
        // Note: Location-based search is handled by separate searchBooksByLocation function
        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(validatedParams.offset || 0, (validatedParams.offset || 0) + (validatedParams.limit || 20) - 1);
        if (error) {
            return { success: false, error: error.message };
        }
        const hasMore = count
            ? (validatedParams.offset || 0) + (validatedParams.limit || 20) < count
            : false;
        return {
            success: true,
            books: (data || []),
            total: count || 0,
            hasMore,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to search books',
        };
    }
};
// Search books by location
export const searchBooksByLocation = async (center, radiusKm = 10, limit = 20, offset = 0) => {
    try {
        const { data, error, count } = await supabase
            .from('books')
            .select(`
        *,
        owner:profiles!books_owner_id_fkey(id, username, full_name, location_latitude, location_longitude)
      `, { count: 'exact' })
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
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error
                ? error.message
                : 'Failed to search books by location',
        };
    }
};
// Get user's books
export const getUserBooks = async (userId) => {
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
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get user books',
        };
    }
};
// Upload book cover image
export const uploadBookCover = async (bookId, file) => {
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
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to upload book cover',
        };
    }
};
// Get book by ISBN from external API (Google Books)
export const getBookByISBN = async (isbn) => {
    try {
        const googleBooksResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
        const googleData = await googleBooksResponse.json();
        if (googleData.items && googleData.items.length > 0) {
            const book = googleData.items[0].volumeInfo;
            return {
                success: true,
                book: {
                    title: book.title,
                    author: book.authors?.[0] || 'Unknown Author',
                    isbn,
                    description: book.description,
                    cover_image_url: book.imageLinks?.thumbnail,
                    publication_year: book.publishedDate
                        ? parseInt(book.publishedDate.split('-')[0])
                        : undefined,
                    publisher: book.publisher,
                    genre: book.categories?.[0],
                    language: book.language,
                },
            };
        }
        return { success: false, error: 'Book not found' };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch book data',
        };
    }
};
// Search books from external API (Google Books)
export const searchExternalBooks = async (query, limit = 10) => {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${limit}`);
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
        const books = data.items.map((item) => {
            const bookInfo = item.volumeInfo;
            return {
                title: bookInfo.title || '',
                author: bookInfo.authors ? bookInfo.authors.join(', ') : '',
                isbn: bookInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')
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
        });
        return { success: true, books };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error
                ? error.message
                : 'Failed to search external books',
        };
    }
};
// Get similar books
export const getSimilarBooks = async (bookId, limit = 10) => {
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
            .select(`
        *,
        owner:profiles!books_owner_id_fkey(
          id, username, full_name, location_text, privacy_settings
        )
      `)
            .neq('id', bookId)
            .eq('availability_status', 'available');
        // Filter by author or genre
        if (sourceBook.author) {
            query = query.or(`author.ilike.%${sourceBook.author}%,genre.ilike.%${sourceBook.genre || ''}%`);
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
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get similar books',
        };
    }
};
