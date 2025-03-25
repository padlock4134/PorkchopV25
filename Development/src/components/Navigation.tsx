import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import ChefFreddieLogo from './ChefFreddieLogo';

export default function Navigation(){
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Determine if the current route is an auth page
  const isAuthPage = ['/login', '/signup'].includes(router.pathname);

  // Don't show navigation on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="bg-white shadow-