'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@readrelay/ui/components/base/Button';
import { Input } from '@readrelay/ui/components/base/Input';
import { TextArea } from '@readrelay/ui/components/forms/TextArea';
import { Text, Heading } from '@readrelay/ui/components/base/Typography';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/providers/AuthProvider';
import {
  profileSchema,
  safeValidateInput,
  type ProfileInput,
} from '@readrelay/shared';
import {
  updateUserProfile,
  uploadAvatarImage,
} from '@readrelay/shared/api/auth';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, refreshAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileInput>>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Load profile data when component mounts or profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location_text: profile.location_text || '',
        phone: profile.phone || '',
        preferred_meeting_locations: profile.preferred_meeting_locations || [],
        notification_preferences: (profile.notification_preferences as any) || {
          email: true,
          push: true,
          sms: false,
        },
        privacy_settings: (profile.privacy_settings as any) || {
          location_visible: true,
          phone_visible: false,
        },
      });
    }
  }, [profile]);

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

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setSubmitError('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setSubmitError('Image must be smaller than 5MB');
        return;
      }

      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = e => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    setIsUploadingAvatar(true);
    setSubmitError(null);

    try {
      const result = await uploadAvatarImage(avatarFile);

      if (result.success) {
        await refreshAuth(); // Refresh to get updated profile with new avatar
        setAvatarFile(null);
        setAvatarPreview(null);
      } else {
        setSubmitError(result.error || 'Failed to upload avatar');
      }
    } catch (error) {
      setSubmitError('Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setSubmitError(null);
    setValidationErrors({});

    // Validate form data
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

      const result = await updateUserProfile(profileData);

      if (result.success) {
        await refreshAuth(); // Refresh to get updated profile
        setIsEditing(false);
      } else {
        setSubmitError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    setSubmitError(null);
    setValidationErrors({});

    // Reset form data to current profile
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location_text: profile.location_text || '',
        phone: profile.phone || '',
        preferred_meeting_locations: profile.preferred_meeting_locations || [],
        notification_preferences: (profile.notification_preferences as any) || {
          email: true,
          push: true,
          sms: false,
        },
        privacy_settings: (profile.privacy_settings as any) || {
          location_visible: true,
          phone_visible: false,
        },
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
                    {avatarPreview || profile?.avatar_url ? (
                      <img
                        src={avatarPreview || profile?.avatar_url || ''}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-2xl">👤</span>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2">
                      <label className="bg-primary-500 text-white p-1 rounded-full cursor-pointer hover:bg-primary-600 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        <span className="text-xs">📷</span>
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <Heading
                    level={1}
                    className="text-2xl font-bold text-gray-900"
                  >
                    {profile?.full_name || 'Your Profile'}
                  </Heading>
                  <Text color="secondary">
                    @{profile?.username || user?.email}
                  </Text>
                </div>
              </div>

              <div className="flex gap-2">
                {avatarFile && isEditing && (
                  <Button
                    onClick={handleAvatarUpload}
                    disabled={isUploadingAvatar}
                    size="sm"
                    variant="outline"
                  >
                    {isUploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
                  </Button>
                )}

                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleSubmit(new Event('click') as any)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Heading level={2} className="text-lg font-semibold mb-4">
                  Profile Information
                </Heading>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                    <Text color="error">{submitError}</Text>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={formData.full_name || ''}
                      onChange={value => handleFieldChange('full_name', value)}
                      error={validationErrors.full_name}
                      disabled={!isEditing}
                      required
                    />

                    <Input
                      label="Username"
                      value={formData.username || ''}
                      onChange={value => handleFieldChange('username', value)}
                      error={validationErrors.username}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <TextArea
                    label="Bio"
                    value={formData.bio || ''}
                    onChange={value => handleFieldChange('bio', value)}
                    error={validationErrors.bio}
                    placeholder="Tell others about yourself and your reading interests"
                    rows={3}
                    disabled={!isEditing}
                  />

                  <Input
                    label="Phone (optional)"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={value => handleFieldChange('phone', value)}
                    error={validationErrors.phone}
                    disabled={!isEditing}
                  />
                </form>
              </div>

              {/* Location Settings */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Heading level={2} className="text-lg font-semibold mb-4">
                  Location Settings
                </Heading>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      label="Location"
                      value={formData.location_text || ''}
                      onChange={value =>
                        handleFieldChange('location_text', value)
                      }
                      error={validationErrors.location_text}
                      placeholder="City, State or general area"
                      disabled={!isEditing}
                      className="flex-1"
                    />
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleLocationPermission}
                        className="mt-6"
                      >
                        📍 Use Current
                      </Button>
                    )}
                  </div>

                  <Text color="secondary" className="text-sm">
                    This helps others find books near them. Your exact location
                    is never shared.
                  </Text>

                  <Input
                    label="Preferred Meeting Locations"
                    value={
                      formData.preferred_meeting_locations?.join(', ') || ''
                    }
                    onChange={value =>
                      handleFieldChange(
                        'preferred_meeting_locations',
                        value ? value.split(',').map(loc => loc.trim()) : []
                      )
                    }
                    placeholder="Coffee shop, library, park (comma-separated)"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Settings Sidebar */}
            <div className="space-y-6">
              {/* Privacy Settings */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Heading level={2} className="text-lg font-semibold mb-4">
                  Privacy Settings
                </Heading>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Text className="font-medium">Location Visible</Text>
                      <Text color="secondary" className="text-sm">
                        Show your general location to other users
                      </Text>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        formData.privacy_settings?.location_visible ?? true
                      }
                      onChange={e =>
                        handleFieldChange('privacy_settings', {
                          ...formData.privacy_settings,
                          location_visible: e.target.checked,
                        })
                      }
                      disabled={!isEditing}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Text className="font-medium">Phone Visible</Text>
                      <Text color="secondary" className="text-sm">
                        Show your phone number to other users
                      </Text>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        formData.privacy_settings?.phone_visible ?? false
                      }
                      onChange={e =>
                        handleFieldChange('privacy_settings', {
                          ...formData.privacy_settings,
                          phone_visible: e.target.checked,
                        })
                      }
                      disabled={!isEditing}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Heading level={2} className="text-lg font-semibold mb-4">
                  Notification Settings
                </Heading>

                <div className="space-y-4">
                  {['email', 'push', 'sms'].map(type => (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <Text className="font-medium capitalize">
                          {type} Notifications
                        </Text>
                        <Text color="secondary" className="text-sm">
                          Receive {type} notifications for messages and updates
                        </Text>
                      </div>
                      <input
                        type="checkbox"
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
                        disabled={!isEditing}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Heading level={2} className="text-lg font-semibold mb-4">
                  Account
                </Heading>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/profile/change-password')}
                    className="w-full"
                  >
                    Change Password
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => router.push('/books?owner=' + user?.id)}
                    className="w-full"
                  >
                    View My Books
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
