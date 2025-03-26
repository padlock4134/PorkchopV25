import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if we have a user in localStorage even if the context user is null
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      
      if (user || storedUser) {
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        // Only redirect if we're sure there's no user data
        setIsLoading(false);
        setIsAuthenticated(false);
        router.push('/login');
      }
    };
    
    checkAuth();
  }, []);  // Remove router and user dependencies to prevent re-running

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
