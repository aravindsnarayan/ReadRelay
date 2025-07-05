'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@readrelay/ui/components/base/Button';
import { Input } from '@readrelay/ui/components/base/Input';
import { Text, Heading } from '@readrelay/ui/components/base/Typography';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  updatePasswordSchema,
  safeValidateInput,
  type UpdatePasswordInput,
} from '@readrelay/shared';
import { updatePassword } from '@readrelay/shared/api/auth';

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState<UpdatePasswordInput>({
    current_password: '',
    new_password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFieldChange = (
    field: keyof UpdatePasswordInput | 'confirmPassword',
    value: string
  ) => {
    if (field === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

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

    // Validate password confirmation
    if (formData.new_password !== confirmPassword) {
      setValidationErrors({ confirmPassword: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    // Validate form data
    const validation = safeValidateInput(updatePasswordSchema, formData);
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
      const result = await updatePassword(validation.data);

      if (result.success) {
        setSuccess(true);
        setFormData({ current_password: '', new_password: '' });
        setConfirmPassword('');
      } else {
        setSubmitError(result.error || 'Failed to update password');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <Heading level={1} className="text-3xl font-bold text-gray-900">
                Password Updated
              </Heading>
              <Text color="secondary" className="mt-2">
                Your password has been successfully updated
              </Text>
            </div>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
              <div className="text-center space-y-4">
                <Text>
                  Your password has been changed successfully. You can continue
                  using ReadRelay with your new password.
                </Text>

                <div className="space-y-2">
                  <Link href="/profile">
                    <Button className="w-full">Back to Profile</Button>
                  </Link>

                  <Button
                    variant="outline"
                    onClick={() => setSuccess(false)}
                    className="w-full"
                  >
                    Change Password Again
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <Heading level={1} className="text-3xl font-bold text-gray-900">
              Change Password
            </Heading>
            <Text color="secondary" className="mt-2">
              Update your account password
            </Text>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Input
                  label="Current Password"
                  type="password"
                  value={formData.current_password}
                  onChange={value =>
                    handleFieldChange('current_password', value)
                  }
                  error={validationErrors.current_password}
                  placeholder="Enter your current password"
                  required
                />
              </div>

              <div>
                <Input
                  label="New Password"
                  type="password"
                  value={formData.new_password}
                  onChange={value => handleFieldChange('new_password', value)}
                  error={validationErrors.new_password}
                  placeholder="Enter your new password"
                  required
                />
                <Text color="secondary" className="mt-1 text-sm">
                  Password must be at least 6 characters long
                </Text>
              </div>

              <div>
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={value =>
                    handleFieldChange('confirmPassword', value)
                  }
                  error={validationErrors.confirmPassword}
                  placeholder="Confirm your new password"
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
                  {isLoading ? 'Updating Password...' : 'Update Password'}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/profile">
                  <Button variant="outline" className="w-full">
                    Back to Profile
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
