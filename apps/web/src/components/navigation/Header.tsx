'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@readrelay/ui/components/base/Button';
import { Text } from '@readrelay/ui/components/base/Typography';
import { useAuth } from '@/providers/AuthProvider';

export function Header() {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsProfileMenuOpen(false);
  };

  // Don't show header on auth pages
  if (pathname.startsWith('/auth/')) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <Text className="text-xl font-bold text-gray-900">ReadRelay</Text>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/books"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/books'
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Browse Books
              </Link>
              {user && (
                <>
                  <Link
                    href="/books/add"
                    className={`text-sm font-medium transition-colors ${
                      pathname === '/books/add'
                        ? 'text-primary-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Add Book
                  </Link>
                  <Link
                    href="/messages"
                    className={`text-sm font-medium transition-colors ${
                      pathname === '/messages'
                        ? 'text-primary-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Messages
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-sm">👤</span>
                      </div>
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {profile?.full_name || profile?.username || 'Profile'}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      View Profile
                    </Link>
                    <Link
                      href="/profile/change-password"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Change Password
                    </Link>
                    <Link
                      href={`/books?owner=${user.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      My Books
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t border-gray-200 bg-gray-50">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/books"
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/books'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Browse Books
            </Link>
            <Link
              href="/books/add"
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/books/add'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Add Book
            </Link>
            <Link
              href="/messages"
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/messages'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Messages
            </Link>
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </header>
  );
}
