'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@readrelay/ui/components/base/Button';
import { Input } from '@readrelay/ui/components/base/Input';
import { Text, Heading } from '@readrelay/ui/components/base/Typography';
import {
  resetPasswordSchema,
  safeValidateInput,
  type ResetPasswordInput,
} from '@readrelay/shared';
import { resetPassword } from '@readrelay/shared/api/auth';

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState<ResetPasswordInput>({
    email: '',
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFieldChange = (
    field: keyof ResetPasswordInput,
    value: string
  ) => {
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
    const validation = safeValidateInput(resetPasswordSchema, formData);
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
      const result = await resetPassword(validation.data);

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError(result.error || 'Failed to send reset email');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="text-4xl mb-4">📧</div>
            <Heading level={1} className="text-3xl font-bold text-gray-900">
              Check your email
            </Heading>
            <Text color="secondary" className="mt-2">
              We&apos;ve sent a password reset link to {formData.email}
            </Text>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
            <div className="text-center space-y-4">
              <Text>
                Click the link in your email to reset your password. If you
                don&apos;t see the email, check your spam folder.
              </Text>

              <div className="space-y-2">
                <Text color="secondary" className="text-sm">
                  Didn&apos;t receive the email?
                </Text>
                <Button
                  variant="outline"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full"
                >
                  Try again
                </Button>
              </div>

              <div className="pt-4">
                <Link href="/auth/login">
                  <Button variant="ghost" className="w-full">
                    Back to login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <Heading level={1} className="text-3xl font-bold text-gray-900">
            Reset your password
          </Heading>
          <Text color="secondary" className="mt-2">
            Enter your email address and we&apos;ll send you a link to reset
            your password
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

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <Text color="error">{submitError}</Text>
              </div>
            )}

            <div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Sending...' : 'Send reset link'}
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
                  Remember your password?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/auth/login">
                <Button variant="outline" className="w-full">
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
