import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
  const [showNotification, setShowNotification] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  // Calculate days remaining in trial
  useEffect(() => {
    if (trialEndDate && subscriptionStatus === 'trial') {
      const end = new Date(trialEndDate);
      const now = new Date();
      const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setDaysRemaining(days > 0 ? days : 0);
      setShowNotification(days <= 7 && days > 0); // Show notification in last week
    } else {
      setDaysRemaining(null);
      setShowNotification(false);
    }
  }, [trialEndDate, subscriptionStatus]);

  // Check if the user is subscribed (either active premium or in trial)
  const isSubscribed = subscriptionStatus === 'active' || (subscriptionStatus === 'trial' && (daysRemaining ?? 0) > 0);

  // Update subscription info when user changes
  useEffect(() => {
    if (user) {
      setSubscriptionTier(user.subscriptionTier || 'free');
      setSubscriptionStatus(user.subscriptionStatus || 'trial');
      setTrialEndDate(user.trialEndDate || null);
    } else {
      setSubscriptionTier('free');
      setSubscriptionStatus('trial');
      setTrialEndDate(null);
    }
  }, [user]);

  const updateSubscription = async (
    tier: 'free' | 'premium',
    status: 'active' | 'canceled' | 'trial' | 'expired'
  ) => {
    setSubscriptionTier(tier);
    setSubscriptionStatus(status);
  };

  const dismissNotification = () => {
    setShowNotification(false);
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
        dismissNotification,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};