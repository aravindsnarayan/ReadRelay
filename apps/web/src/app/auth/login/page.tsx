'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@readrelay/ui/components/base/Button';
import { Input } from '@readrelay/ui/components/base/Input';
import { Text, Heading } from '@readrelay/ui/components/base/Typography';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  loginSchema,
  safeValidateInput,
  type LoginInput,
} from '@readrelay/shared';
import { loginUser as login } from '@readrelay/shared/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFieldChange = (field: keyof LoginInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Clear submit error
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setSubmitError(null);
    setValidationErrors({});

    // Validate form data
    const validation = safeValidateInput(loginSchema, formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach(error => {
        if (error.path.length > 0) {
          errors[error.path[0]] = error.message;
        }
      });
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(validation.data);

      if (result.success) {
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setSubmitError(result.error || 'Failed to login');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <Heading level={1} className="text-3xl font-bold text-gray-900">
              Welcome back to ReadRelay
            </Heading>
            <Text color="secondary" className="mt-2">
              Sign in to your account to continue sharing books
            </Text>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Input
                  label="Email address"
                  type="email"
                  value={formData.email}
                  onChange={value => handleFieldChange('email', value)}
                  error={validationErrors.email}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Input
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={value => handleFieldChange('password', value)}
                  error={validationErrors.password}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <Text color="error">{submitError}</Text>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Link
                  href="/auth/reset-password"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Forgot your password?
                </Link>
              </div>

              <div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Don&apos;t have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/auth/register">
                  <Button variant="outline" className="w-full">
                    Create new account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
