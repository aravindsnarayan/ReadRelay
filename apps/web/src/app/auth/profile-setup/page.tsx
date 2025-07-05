'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@readrelay/ui/components/base/Button';
import { Input } from '@readrelay/ui/components/base/Input';
import { TextArea } from '@readrelay/ui/components/forms/TextArea';
import { Text, Heading } from '@readrelay/ui/components/base/Typography';
import {
  profileSchema,
  safeValidateInput,
  type ProfileInput,
} from '@readrelay/shared';
import {
  updateUserProfile as updateProfile,
  getCurrentUser,
  getUserProfile,
} from '@readrelay/shared/api/auth';

export default function ProfileSetupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<ProfileInput>>({
    username: '',
    full_name: '',
    bio: '',
    location_text: '',
    preferred_meeting_locations: [],
    notification_preferences: {
      email: true,
      push: true,
      sms: false,
    },
    privacy_settings: {
      location_visible: true,
      phone_visible: false,
    },
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Load current user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // Try to get existing profile first
          const profileResult = await getUserProfile();
          if (profileResult.success && profileResult.profile) {
            setFormData(prev => ({
              ...prev,
              username: profileResult.profile?.username || '',
              full_name: profileResult.profile?.full_name || '',
              bio: profileResult.profile?.bio || '',
              location_text: profileResult.profile?.location_text || '',
            }));
          } else {
            // If no profile exists, use user metadata
            const metadata = user.user_metadata || {};
            setFormData(prev => ({
              ...prev,
              username: metadata.username || '',
              full_name: metadata.full_name || '',
            }));
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleFieldChange = (field: keyof ProfileInput, value: unknown) => {
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

  const handleLocationPermission = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setFormData(prev => ({
            ...prev,
            location_latitude: position.coords.latitude,
            location_longitude: position.coords.longitude,
          }));
        },
        error => {
          // eslint-disable-next-line no-console
          console.error('Error getting location:', error);
          // Continue without location
        }
      );
    }
  };

  const validateStep = (step: number): boolean => {
    const stepFields =
      step === 1 ? ['username', 'full_name'] : ['location_text'];

    let hasErrors = false;
    const errors: Record<string, string> = {};

    stepFields.forEach(field => {
      if (step === 1 && ['username', 'full_name'].includes(field)) {
        if (!formData[field as keyof ProfileInput]) {
          errors[field] =
            field === 'username'
              ? 'Username is required'
              : 'Full name is required';
          hasErrors = true;
        }
      }
    });

    setValidationErrors(errors);
    return !hasErrors;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(2);
      handleLocationPermission();
    }
  };

  const handleSkip = () => {
    router.push('/books');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setSubmitError(null);
    setValidationErrors({});

    // Validate form data with partial schema since some fields are optional
    const validation = safeValidateInput(profileSchema.partial(), formData);
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
      // Ensure all required fields are properly typed
      const profileData = {
        ...validation.data,
        notification_preferences: validation.data.notification_preferences
          ? {
              email: validation.data.notification_preferences.email ?? true,
              push: validation.data.notification_preferences.push ?? true,
              sms: validation.data.notification_preferences.sms ?? false,
            }
          : undefined,
        privacy_settings: validation.data.privacy_settings
          ? {
              location_visible:
                validation.data.privacy_settings.location_visible ?? true,
              phone_visible:
                validation.data.privacy_settings.phone_visible ?? false,
            }
          : undefined,
      };

      const result = await updateProfile(profileData);

      if (result.success) {
        router.push('/books');
      } else {
        setSubmitError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="text-4xl mb-4">👋</div>
          <Heading level={1} className="text-3xl font-bold text-gray-900">
            Complete Your Profile
          </Heading>
          <Text color="secondary" className="mt-2">
            Help others get to know you better
          </Text>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of 2</span>
              <span>{Math.round((currentStep / 2) * 100)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 2) * 100}%` }}
              />
            </div>
          </div>

          {currentStep === 1 ? (
            <div className="space-y-6">
              <div>
                <Input
                  label="Username"
                  type="text"
                  value={formData.username || ''}
                  onChange={value => handleFieldChange('username', value)}
                  error={validationErrors.username}
                  placeholder="Choose a username"
                  required
                />
                <Text color="secondary" className="mt-1 text-sm">
                  This will be visible to other users
                </Text>
              </div>

              <div>
                <Input
                  label="Full name"
                  type="text"
                  value={formData.full_name || ''}
                  onChange={value => handleFieldChange('full_name', value)}
                  error={validationErrors.full_name}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <TextArea
                  label="Bio (optional)"
                  value={formData.bio || ''}
                  onChange={value => handleFieldChange('bio', value)}
                  error={validationErrors.bio}
                  placeholder="Tell others about yourself and your reading interests"
                  rows={3}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handleSkip}>
                  Skip for now
                </Button>
                <Button onClick={handleNext}>Next →</Button>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Input
                  label="Location (optional)"
                  type="text"
                  value={formData.location_text || ''}
                  onChange={value => handleFieldChange('location_text', value)}
                  error={validationErrors.location_text}
                  placeholder="City, State or general area"
                />
                <Text color="secondary" className="mt-1 text-sm">
                  This helps others find books near them
                </Text>
              </div>

              <div>
                <Input
                  label="Preferred meeting locations (optional)"
                  type="text"
                  value={formData.preferred_meeting_locations?.join(', ') || ''}
                  onChange={value =>
                    handleFieldChange(
                      'preferred_meeting_locations',
                      value ? value.split(',').map(loc => loc.trim()) : []
                    )
                  }
                  placeholder="Coffee shop, library, park (comma-separated)"
                />
              </div>

              <div>
                <Text className="text-sm font-medium text-gray-700 mb-4">
                  Notification Preferences
                </Text>
                <div className="space-y-3">
                  {['email', 'push', 'sms'].map(type => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={type}
                        checked={
                          formData.notification_preferences?.[
                            type as keyof typeof formData.notification_preferences
                          ] || false
                        }
                        onChange={e =>
                          handleFieldChange('notification_preferences', {
                            email:
                              formData.notification_preferences?.email ?? true,
                            push:
                              formData.notification_preferences?.push ?? true,
                            sms:
                              formData.notification_preferences?.sms ?? false,
                            ...formData.notification_preferences,
                            [type]: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={type}
                        className="ml-2 text-sm text-gray-700 capitalize"
                      >
                        {type} notifications
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <Text color="error">{submitError}</Text>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  ← Previous
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={handleSkip}>
                    Skip
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Complete Setup'}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
