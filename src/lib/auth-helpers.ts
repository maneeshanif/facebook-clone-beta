// Helper functions for authentication

/**
 * Get the correct redirect URL based on the environment
 */
export function getRedirectUrl(): string {
  // In production, use the actual domain
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_URL) {
    return `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;
  }
  
  // In development, use localhost
  return 'http://localhost:3000/auth/callback';
}
