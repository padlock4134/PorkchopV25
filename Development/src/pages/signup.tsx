import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import ChefFreddieLogo from '../components/ChefFreddieLogo';

export default function SignUp() {
  const router = useRouter();
  const { signup, isLoading, error: contextError } = useAuth();
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
          </form>
        </div>
      </div>
    </div>
  );
}