'use client';

import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';

const featuredBooks = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover_url:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    genre: 'Fiction',
    condition: 'good',
    location: '2.3 km away',
    owner: 'Sarah Chen',
    rating: 4.8,
    description: "A beautiful exploration of life's infinite possibilities.",
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    cover_url:
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    genre: 'Self-Help',
    condition: 'excellent',
    location: '1.8 km away',
    owner: 'Mike Rodriguez',
    rating: 4.9,
    description: 'Transform your life with small, powerful changes.',
  },
  {
    id: '3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    cover_url:
      'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    genre: 'Sci-Fi',
    condition: 'good',
    location: '3.1 km away',
    owner: 'Emma Wilson',
    rating: 4.7,
    description: 'A thrilling space adventure about saving humanity.',
  },
  {
    id: '4',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    cover_url:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    genre: 'Romance',
    condition: 'good',
    location: '0.9 km away',
    owner: 'Lisa Park',
    rating: 4.6,
    description: 'A captivating story of love, ambition, and secrets.',
  },
];

export function FeaturedBooks() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Popular Books in Your Area
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover what your neighbors are reading and sharing. These books
            are currently available for exchange near you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map(book => (
            <div key={book.id} className="group">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden book-card-hover">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={book.cover_url}
                    alt={book.title}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${
                        book.condition === 'excellent'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      }
                    `}
                    >
                      {book.condition}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    by {book.author}
                  </p>

                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {book.rating}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      •
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {book.genre}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {book.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {book.location}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      by {book.owner}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Browse All Books
          </button>
        </div>
      </div>
    </section>
  );
}
