import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiresSubscription = false }) => {
  const { user } = useAuth();

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If subscription is required and user is not subscribed or trial has ended, redirect to pricing
  if (requiresSubscription) {
    const isSubscribed = user.subscriptionStatus === 'active';
    const isInTrial = user.subscriptionStatus === 'trial';
    const trialValid = isInTrial && user.trialEndDate && new Date(user.trialEndDate) > new Date();
    
    if (!isSubscribed && !trialValid) {
      return <Navigate to="/pricing" />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;