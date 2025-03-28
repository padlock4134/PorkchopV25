import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import ChefFreddieLogo from '../components/ChefFreddieLogo';
import { GoogleLogin } from '@react-oauth/google';

export default function SignUp() {
  const router = useRouter();
  const { signup, loginWithGoogle, isLoading, error: contextError } = useAuth();
  const [localError, setLocalError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.firstName, formData.lastName);
      // Navigate directly to dashboard after signup
      router.push('/dashboard');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to create account');
    }
  };

  // Use either local error or context error
  const displayError = localError || contextError;

  return (
    <div className="min-h-screen bg-vintage-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-24 h-24">
            <ChefFreddieLogo />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-serif font-extrabold text-butcher-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-butcher-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-satriales-600 hover:text-satriales-500"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-vintage rounded-lg sm:px-10">
          {/* Google Sign In Button */}
          <div className="mb-6">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  loginWithGoogle(credentialResponse.credential)
                    .then(() => router.push('/dashboard'))
                    .catch((err) => setLocalError(err.message));
                }
              }}
              onError={() => setLocalError('Google sign in failed')}
              useOneTap
              theme="outline"
              shape="rectangular"
              text="signup_with"
              size="large"
              width="100%"
            />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-butcher-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-butcher-500">Or sign up with email</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-butcher-700"
              >
                First Name
              </label>
              <div className="mt-1">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="appearance-none block w-full px-3 py-2 border border-butcher-300 rounded-md shadow-sm placeholder-butcher-400 focus:outline-none focus:ring-satriales-500 focus:border-satriales-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-butcher-700"
              >
                Last Name
              </label>
              <div className="mt-1">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="appearance-none block w-full px-3 py-2 border border-butcher-300 rounded-md shadow-sm placeholder-butcher-400 focus:outline-none focus:ring-satriales-500 focus:border-satriales-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-butcher-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="appearance-none block w-full px-3 py-2 border border-butcher-300 rounded-md shadow-sm placeholder-butcher-400 focus:outline-none focus:ring-satriales-500 focus:border-satriales-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-butcher-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="appearance-none block w-full px-3 py-2 border border-butcher-300 rounded-md shadow-sm placeholder-butcher-400 focus:outline-none focus:ring-satriales-500 focus:border-satriales-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-butcher-700"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="appearance-none block w-full px-3 py-2 border border-butcher-300 rounded-md shadow-sm placeholder-butcher-400 focus:outline-none focus:ring-satriales-500 focus:border-satriales-500 sm:text-sm"
                />
              </div>
            </div>

            {displayError && (
              <div className="text-red-600 text-sm">{displayError}</div>
            )}

            <div className="flex justify-between">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-satriales-600 hover:bg-satriales-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-satriales-500"
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
            
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-porkchop-600 hover:bg-porkchop-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-porkchop-500"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}