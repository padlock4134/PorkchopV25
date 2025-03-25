import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import useTrialStatus from '../hooks/useTrialStatus';

interface SubscriptionContextType {
  isSubscribed: boolean;
  subscriptionTier: 'free' | 'premium';
  subscriptionStatus: 'active' | 'canceled' | 'trial' | 'expired';
  daysRemaining: number | null;
  trialEndDate: string | null;
  updateSubscription: (tier: 'free' | 'premium', status: 'active' | 'canceled' | 'trial' | 'expired') => Promise<void>;
  showNotification: boolean;
  dismissNotification: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'premium'>('free');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'canceled' | 'trial' | 'expired'>('trial');
  const [trialEndDate, setTrialEndDate] = useState<string | null>(null);
  
  // Use the existing useTrialStatus hook
  const {
    isInTrial,
    daysRemaining,
    showNotification,
    dismissNotification
  } = useTrialStatus(subscriptionStatus, trialEndDate);

  // Check if the user is subscribed (either active premium or in trial)
  const isSubscribed = subscriptionStatus === 'active' || (subscriptionStatus === 'trial' && (daysRemaining ?? 0) > 0);

  // Update subscription info when user changes
  useEffect(() => {
    if (user) {
      // Get subscription info from user object
      setSubscriptionTier(user.subscriptionTier || 'free');
      setSubscriptionStatus(user.subscriptionStatus || 'trial');
      setTrialEndDate(user.trialEndDate || null);
    } else {
      // Reset subscription info when user is logged out
      setSubscriptionTier('free');
      setSubscriptionStatus('trial');
      setTrialEndDate(null);
    }
  }, [user]);

  // Function to update subscription (would call an API in a real app)
  const updateSubscription = async (tier: 'free' | 'premium', status: 'active' | 'canceled' | 'trial' | 'expired') => {
    setSubscriptionTier(tier);
    setSubscriptionStatus(status);
    
    // Update user object in localStorage to persist subscription changes
    if (user) {
      const updatedUser = {
        ...user,
        subscriptionTier: tier,
        subscriptionStatus: status
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        subscriptionTier,
        subscriptionStatus,
        daysRemaining,
        trialEndDate,
        updateSubscription,
        showNotification,
        dismissNotification
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};