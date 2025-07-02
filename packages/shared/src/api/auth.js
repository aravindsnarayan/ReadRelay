import { supabase } from '../lib/supabase';
import { validateInput } from '../utils/validation';
import { profileSchema, profileUpdateSchema, loginSchema, registerSchema, resetPasswordSchema, updatePasswordSchema, } from '../utils/validation';
// Login user
export const loginUser = async (credentials) => {
    try {
        // Validate input
        const validatedCredentials = validateInput(loginSchema, credentials);
        const { data, error } = await supabase.auth.signInWithPassword({
            email: validatedCredentials.email,
            password: validatedCredentials.password,
        });
        if (error) {
            return { success: false, error: error.message };
        }
        if (!data.user) {
            return { success: false, error: 'Login failed - no user data returned' };
        }
        // Get user profile (but don't need to return it in login response)
        await getUserProfile();
        return {
            success: true,
            user: data.user,
            session: data.session || undefined,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Login failed',
        };
    }
};
// Register new user
export const registerUser = async (userData) => {
    try {
        // Validate input
        const validatedData = validateInput(registerSchema, userData);
        // Check if username is available
        const usernameAvailable = await checkUsernameAvailability(validatedData.username);
        if (!usernameAvailable) {
            return { success: false, error: 'Username is already taken' };
        }
        // Sign up user
        const { data, error } = await supabase.auth.signUp({
            email: validatedData.email,
            password: validatedData.password,
            options: {
                data: {
                    username: validatedData.username,
                    full_name: validatedData.full_name,
                },
            },
        });
        if (error) {
            return { success: false, error: error.message };
        }
        if (!data.user) {
            return {
                success: false,
                error: 'Registration failed - no user data returned',
            };
        }
        return {
            success: true,
            user: data.user,
            session: data.session || undefined,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Registration failed',
        };
    }
};
// Logout user
export const logoutUser = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Logout failed',
        };
    }
};
// Reset password
export const resetPassword = async (email) => {
    try {
        // Validate input
        const validatedEmail = validateInput(resetPasswordSchema, email);
        const { error } = await supabase.auth.resetPasswordForEmail(validatedEmail.email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Password reset failed',
        };
    }
};
// Update password
export const updatePassword = async (passwords) => {
    try {
        // Validate input
        const validatedPasswords = validateInput(updatePasswordSchema, passwords);
        // Verify current password by attempting to sign in
        const { data: user } = await supabase.auth.getUser();
        if (!user.user?.email) {
            return { success: false, error: 'User not authenticated' };
        }
        // Update password
        const { error } = await supabase.auth.updateUser({
            password: validatedPasswords.new_password,
        });
        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Password update failed',
        };
    }
};
// Get current user
export const getCurrentUser = async () => {
    try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            throw error;
        }
        return data.user;
    }
    catch (error) {
        return null;
    }
};
// Get user session
export const getUserSession = async () => {
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            throw error;
        }
        return data.session;
    }
    catch (error) {
        return null;
    }
};
// Get user profile
export const getUserProfile = async (userId) => {
    try {
        let targetUserId = userId;
        if (!targetUserId) {
            const user = await getCurrentUser();
            if (!user) {
                return { success: false, error: 'User not authenticated' };
            }
            targetUserId = user.id;
        }
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', targetUserId)
            .maybeSingle();
        if (error) {
            return { success: false, error: error.message };
        }
        if (!data) {
            return { success: false, error: 'Profile not found' };
        }
        return { success: true, profile: data };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get profile',
        };
    }
};
// Create user profile
export const createUserProfile = async (profileData) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }
        // Validate input
        const validatedData = validateInput(profileSchema, profileData);
        // Check if username is available
        const usernameAvailable = await checkUsernameAvailability(validatedData.username);
        if (!usernameAvailable) {
            return { success: false, error: 'Username is already taken' };
        }
        const profileInsert = {
            id: user.id,
            username: validatedData.username,
            full_name: validatedData.full_name,
            bio: validatedData.bio,
            location_text: validatedData.location_text,
            location_latitude: validatedData.location_latitude,
            location_longitude: validatedData.location_longitude,
            preferred_meeting_locations: validatedData.preferred_meeting_locations,
            phone: validatedData.phone,
            notification_preferences: validatedData.notification_preferences,
            privacy_settings: validatedData.privacy_settings,
        };
        const { data, error } = await supabase
            .from('profiles')
            .insert(profileInsert)
            .select()
            .single();
        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true, profile: data };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create profile',
        };
    }
};
// Update user profile
export const updateUserProfile = async (profileData) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }
        // Validate input
        const validatedData = validateInput(profileUpdateSchema, profileData);
        // Check if username is available (if changing)
        if (validatedData.username) {
            const usernameAvailable = await checkUsernameAvailability(validatedData.username, user.id);
            if (!usernameAvailable) {
                return { success: false, error: 'Username is already taken' };
            }
        }
        const profileUpdate = {
            username: validatedData.username,
            full_name: validatedData.full_name,
            bio: validatedData.bio,
            location_text: validatedData.location_text,
            location_latitude: validatedData.location_latitude,
            location_longitude: validatedData.location_longitude,
            preferred_meeting_locations: validatedData.preferred_meeting_locations,
            phone: validatedData.phone,
            notification_preferences: validatedData.notification_preferences,
            privacy_settings: validatedData.privacy_settings,
        };
        const { data, error } = await supabase
            .from('profiles')
            .update(profileUpdate)
            .eq('id', user.id)
            .select()
            .single();
        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true, profile: data };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update profile',
        };
    }
};
// Check username availability
export const checkUsernameAvailability = async (username, excludeUserId) => {
    try {
        let query = supabase.from('profiles').select('id').eq('username', username);
        if (excludeUserId) {
            query = query.neq('id', excludeUserId);
        }
        const { data, error } = await query.maybeSingle();
        if (error) {
            throw error;
        }
        return !data; // Username is available if no record found
    }
    catch (error) {
        return false; // Assume not available on error
    }
};
// Auth state change listener
export const onAuthStateChange = (callback) => {
    return supabase.auth.onAuthStateChange((_event, session) => {
        callback(session?.user || null);
    });
};
// Upload avatar image
export const uploadAvatarImage = async (file) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        const { error: uploadError } = await supabase.storage
            .from('book-covers')
            .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });
        if (uploadError) {
            return { success: false, error: uploadError.message };
        }
        const { data: urlData } = supabase.storage
            .from('book-covers')
            .getPublicUrl(filePath);
        // Update profile with new avatar URL
        const updateResult = await updateUserProfile({
            avatar_url: urlData.publicUrl,
        });
        if (!updateResult.success) {
            return { success: false, error: updateResult.error };
        }
        return { success: true, url: urlData.publicUrl };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to upload avatar',
        };
    }
};
