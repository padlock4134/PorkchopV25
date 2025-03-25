import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { setUserData, getUserData } from '../utils/localStorage';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  rewards: {
    points: number;
    badges?: string[];
  };
  requirements: string[];
  tips: string[];
  emoji: string;
  color: string;
  startDate: string;
  endDate: string;
}

export interface ChallengeEntry {
  challengeId: string;
  userId: string;
  submittedAt: string;
  photo: string;
  description: string;
}

interface ChallengeContextType {
  activeChallenges: Challenge[];
  joinedChallenges: string[];
  joinChallenge: (challengeId: string) => Promise<void>;
  leaveChallenge: (challengeId: string) => Promise<void>;
  submitChallengeEntry: (challengeId: string, entry: { photo: string; description: string }) => Promise<void>;
  challengeEntries: ChallengeEntry[];
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

// Sample challenges for development
const sampleChallenges: Challenge[] = [
  {
    id: 'weekly-knife-skills',
    title: 'Weekly Knife Skills Challenge',
    description: 'Master your knife skills with this weekly challenge. Practice different cutting techniques and share your progress.',
    difficulty: 'beginner',
    duration: '1 week',
    rewards: {
      points: 100,
      badges: ['knife-master']
    },
    requirements: [
      'Practice at least 3 different cutting techniques',
      'Share a photo of your cuts',
      'Document your learning process'
    ],
    tips: [
      'Start with basic cuts like dicing and slicing',
      'Keep your knives sharp',
      'Practice proper knife grip'
    ],
    emoji: '🔪',
    color: 'bg-blue-500',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week from now
  },
  {
    id: 'perfect-pasta',
    title: 'Perfect Pasta Challenge',
    description: 'Create the perfect homemade pasta from scratch. Share your recipe and photos of the process.',
    difficulty: 'intermediate',
    duration: '2 weeks',
    rewards: {
      points: 200,
      badges: ['pasta-master']
    },
    requirements: [
      'Make pasta from scratch',
      'Share photos of the process',
      'Include your recipe'
    ],
    tips: [
      'Use 00 flour for best results',
      'Rest your dough properly',
      'Roll pasta sheets evenly'
    ],
    emoji: '🍝',
    color: 'bg-yellow-500',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 2 weeks from now
  }
];

export const ChallengeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>(sampleChallenges);
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);
  const [challengeEntries, setChallengeEntries] = useState<ChallengeEntry[]>([]);

  // Load challenge data when user changes
  useEffect(() => {
    if (user) {
      const userJoinedChallenges = getUserData<string[]>(user.id, 'joinedChallenges', []);
      const userChallengeEntries = getUserData<ChallengeEntry[]>(user.id, 'challengeEntries', []);
      
      setJoinedChallenges(userJoinedChallenges);
      setChallengeEntries(userChallengeEntries);
    } else {
      // Reset state when user logs out
      setJoinedChallenges([]);
      setChallengeEntries([]);
    }
  }, [user]);

  // Save challenge data when it changes
  useEffect(() => {
    if (user) {
      setUserData(user.id, 'joinedChallenges', joinedChallenges);
      setUserData(user.id, 'challengeEntries', challengeEntries);
    }
  }, [user, joinedChallenges, challengeEntries]);

  const joinChallenge = async (challengeId: string): Promise<void> => {
    if (!user) {
      throw new Error('You must be logged in to join challenges');
    }

    if (!joinedChallenges.includes(challengeId)) {
      setJoinedChallenges(prev => [...prev, challengeId]);
    }
  };

  const leaveChallenge = async (challengeId: string): Promise<void> => {
    if (!user) {
      throw new Error('You must be logged in to leave challenges');
    }

    setJoinedChallenges(prev => prev.filter(id => id !== challengeId));
  };

  const submitChallengeEntry = async (challengeId: string, entry: { photo: string; description: string }): Promise<void> => {
    if (!user) {
      throw new Error('You must be logged in to submit entries');
    }

    if (!joinedChallenges.includes(challengeId)) {
      throw new Error('You must join the challenge before submitting an entry');
    }

    const newEntry: ChallengeEntry = {
      challengeId,
      userId: user.id,
      submittedAt: new Date().toISOString(),
      photo: entry.photo,
      description: entry.description
    };

    setChallengeEntries(prev => [...prev, newEntry]);
  };

  return (
    <ChallengeContext.Provider
      value={{
        activeChallenges,
        joinedChallenges,
        joinChallenge,
        leaveChallenge,
        submitChallengeEntry,
        challengeEntries
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
};