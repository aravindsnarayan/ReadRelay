// Environment variable validation utilities for ReadRelay

export interface EnvironmentConfig {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_APP_URL?: string;
  NODE_ENV?: string;
  GOOGLE_BOOKS_API_KEY?: string;
  SENTRY_DSN?: string;
}

// Required environment variables
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

// Optional environment variables with defaults
const OPTIONAL_ENV_VARS = {
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  NODE_ENV: 'development',
} as const;

// Validate environment variables
export const validateEnvironment = (): EnvironmentConfig => {
  const errors: string[] = [];
  const config: Partial<EnvironmentConfig> = {};

  // Check required variables
  for (const varName of REQUIRED_ENV_VARS) {
    const value = process.env[varName];
    if (!value) {
      errors.push(`Missing required environment variable: ${varName}`);
    } else {
      config[varName] = value;
    }
  }

  // Set optional variables with defaults
  for (const [varName, defaultValue] of Object.entries(OPTIONAL_ENV_VARS)) {
    config[varName as keyof typeof OPTIONAL_ENV_VARS] =
      process.env[varName] || defaultValue;
  }

  // Set other optional variables if present
  if (process.env.GOOGLE_BOOKS_API_KEY) {
    config.GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
  }
  if (process.env.SENTRY_DSN) {
    config.SENTRY_DSN = process.env.SENTRY_DSN;
  }

  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors.join('\n')}\n\nPlease ensure all required environment variables are set in your .env.local file.`
    );
  }

  return config as EnvironmentConfig;
};

// Check if we're in development
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

// Check if we're in production
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

// Get app URL with fallback
export const getAppUrl = (): string => {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

// Get Supabase configuration with validation
export const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase configuration. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.'
    );
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid URL');
  }

  // Basic validation for anon key (should be a long string)
  if (key.length < 50) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (too short)'
    );
  }

  return { url, key };
};

// Validate environment on module load (only in Node.js environment)
let environmentValidated = false;

export const ensureEnvironmentValidated = () => {
  if (!environmentValidated && typeof window === 'undefined') {
    try {
      validateEnvironment();
      environmentValidated = true;
    } catch (error) {
      // Only log in development, throw in production
      if (isDevelopment()) {
        console.warn('Environment validation warning:', error);
      } else {
        throw error;
      }
    }
  }
};

// Export types
export type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number];
export type OptionalEnvVar = keyof typeof OPTIONAL_ENV_VARS;
