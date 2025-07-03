import { type Coordinates } from '../utils/location';
import { type BookInput, type BookUpdateInput, type BookSearchInput } from '../utils/validation';
import type { Book, Profile } from '../types/database';
export interface BookResult {
    success: boolean;
    error?: string;
    book?: Book;
}
export interface BooksResult {
    success: boolean;
    error?: string;
    books?: Array<Book & {
        distance_km?: number;
        owner?: Partial<Profile>;
    }>;
    total?: number;
    hasMore?: boolean;
}
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
export declare const createBook: (bookData: BookInput) => Promise<BookResult>;
export declare const getBook: (bookId: string) => Promise<BookResult>;
export declare const updateBook: (bookId: string, bookData: BookUpdateInput) => Promise<BookResult>;
export declare const deleteBook: (bookId: string) => Promise<{
    success: boolean;
    error?: string;
}>;
export declare const searchBooks: (searchParams: BookSearchInput) => Promise<BooksResult>;
export declare const searchBooksByLocation: (center: Coordinates, radiusKm?: number, limit?: number, offset?: number) => Promise<BooksResult>;
export declare const getUserBooks: (userId?: string) => Promise<BooksResult>;
export declare const uploadBookCover: (bookId: string, file: File) => Promise<{
    success: boolean;
    url?: string;
    error?: string;
}>;
export declare const getBookByISBN: (isbn: string, retryCount?: number) => Promise<{
    success: boolean;
    book?: ExternalBookData;
    error?: string;
}>;
export declare const searchExternalBooks: (query: string, limit?: number) => Promise<{
    success: boolean;
    books?: ExternalBookData[];
    error?: string;
}>;
export declare const getSimilarBooks: (bookId: string, limit?: number) => Promise<BooksResult>;
//# sourceMappingURL=books.d.ts.map