import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/books/add',
  '/profile',
  '/dashboard',
  '/messages',
  '/exchanges',
];

// Routes that should redirect authenticated users (auth pages)
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/reset-password'];

// Routes that are public and don't require authentication (for future use)
// const PUBLIC_ROUTES = [
//   '/',
//   '/books',
//   '/api',
// ];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: Record<string, unknown>) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  try {
    // Get the current session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Auth error in middleware:', error);
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    // Allow all API routes to pass through
    if (pathname.startsWith('/api/')) {
      return response;
    }

    // Check if route is protected
    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
      pathname.startsWith(route)
    );

    // Check if route is an auth route
    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

    // If user is not authenticated and trying to access protected route
    if (isProtectedRoute && !session) {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If user is authenticated and trying to access auth routes, redirect to books
    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL('/books', request.url));
    }

    // Special handling for profile setup
    if (pathname === '/auth/profile-setup') {
      if (!session) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      // Allow access to profile setup even if authenticated
      return response;
    }

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Middleware error:', error);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
