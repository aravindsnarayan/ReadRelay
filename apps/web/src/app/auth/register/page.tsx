'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@readrelay/ui/components/base/Button';
import { Input } from '@readrelay/ui/components/base/Input';
import { Text, Heading } from '@readrelay/ui/components/base/Typography';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  registerSchema,
  safeValidateInput,
  type RegisterInput,
} from '@readrelay/shared';
import { registerUser as register } from '@readrelay/shared/api/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterInput>({
    email: '',
    password: '',
    username: '',
    full_name: '',
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFieldChange = (field: keyof RegisterInput, value: string) => {
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
    const validation = safeValidateInput(registerSchema, formData);
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
      const result = await register(validation.data);

      if (result.success) {
        // Redirect to profile setup or books page
        router.push('/auth/profile-setup');
      } else {
        setSubmitError(result.error || 'Failed to create account');
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
              Join ReadRelay
            </Heading>
            <Text color="secondary" className="mt-2">
              Create your account to start sharing books with your community
            </Text>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Input
                  label="Full name"
                  type="text"
                  value={formData.full_name}
                  onChange={value => handleFieldChange('full_name', value)}
                  error={validationErrors.full_name}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Input
                  label="Username"
                  type="text"
                  value={formData.username}
                  onChange={value => handleFieldChange('username', value)}
                  error={validationErrors.username}
                  placeholder="Choose a username"
                  required
                />
                <Text color="secondary" className="mt-1 text-sm">
                  Username can only contain letters, numbers, and underscores
                </Text>
              </div>

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
                  placeholder="Create a password"
                  required
                />
                <Text color="secondary" className="mt-1 text-sm">
                  Password must be at least 6 characters long
                </Text>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <Text color="error">{submitError}</Text>
                </div>
              )}

              <div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Creating account...' : 'Create account'}
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
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    Sign in instead
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
