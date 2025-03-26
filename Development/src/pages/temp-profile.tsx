import type { NextPage } from 'next';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const TempProfile: NextPage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main profile page
    router.push('/profile');
  }, [router]);
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
      <h1 className="text-3xl font-bold text-butcher-800 mb-4">Redirecting to Profile...</h1>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-butcher-600 mx-auto"></div>
    </div>
  );
};

export default TempProfile;
