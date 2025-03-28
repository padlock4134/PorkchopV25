// This is a temporary mock client ID for development
// Use environment variable for Google Client ID
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '123456789-example.apps.googleusercontent.com';

if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
  console.warn('Google Client ID is not set in environment variables');
}
