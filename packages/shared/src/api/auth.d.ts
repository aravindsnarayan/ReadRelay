import {
  type ProfileInput,
  type ProfileUpdateInput,
  type LoginInput,
  type RegisterInput,
  type ResetPasswordInput,
  type UpdatePasswordInput,
} from '../utils/validation';
import type { Profile } from '../types/database';
import type { User, Session } from '@supabase/supabase-js';
export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
  session?: Session;
}
export interface ProfileResult {
  success: boolean;
  error?: string;
  profile?: Profile;
}
export declare const loginUser: (
  credentials: LoginInput
) => Promise<AuthResult>;
export declare const registerUser: (
  userData: RegisterInput
) => Promise<AuthResult>;
export declare const logoutUser: () => Promise<AuthResult>;
export declare const resetPassword: (
  email: ResetPasswordInput
) => Promise<AuthResult>;
export declare const updatePassword: (
  passwords: UpdatePasswordInput
) => Promise<AuthResult>;
export declare const getCurrentUser: () => Promise<User | null>;
export declare const getUserSession: () => Promise<Session | null>;
export declare const getUserProfile: (
  userId?: string
) => Promise<ProfileResult>;
export declare const createUserProfile: (
  profileData: ProfileInput
) => Promise<ProfileResult>;
export declare const updateUserProfile: (
  profileData: ProfileUpdateInput
) => Promise<ProfileResult>;
export declare const checkUsernameAvailability: (
  username: string,
  excludeUserId?: string
) => Promise<boolean>;
export declare const onAuthStateChange: (
  callback: (user: User | null) => void
) => {
  data: {
    subscription: import('@supabase/supabase-js').Subscription;
  };
};
export declare const uploadAvatarImage: (file: File) => Promise<{
  success: boolean;
  url?: string;
  error?: string;
}>;
//# sourceMappingURL=auth.d.ts.map
