'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Text } from '@readrelay/ui/components/base/Typography';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  redirectTo = '/auth/login',
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Redirect to login with return URL
        const returnUrl = new URL(redirectTo, window.location.origin);
        returnUrl.searchParams.set('redirect', pathname);
        router.push(returnUrl.toString());
      } else if (!requireAuth && user) {
        // Redirect authenticated users away from auth pages
        router.push('/dashboard');
      }
    }
  }, [user, loading, requireAuth, router, pathname, redirectTo]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <Text className="text-lg">Loading...</Text>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if ((requireAuth && !user) || (!requireAuth && user)) {
    return null;
  }

  return <>{children}</>;
}

// Higher-order component wrapper
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: { requireAuth?: boolean; redirectTo?: string } = {}
) {
  const { requireAuth = true, redirectTo = '/auth/login' } = options;

  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute requireAuth={requireAuth} redirectTo={redirectTo}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
}
