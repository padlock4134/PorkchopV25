import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  progress: number; // percentage
  maxProgress: number;
  currentProgress: number;
  unlocked: boolean;
  category: 'recipe' | 'skill' | 'community' | 'challenge';
  reward?: string;
  dateEarned?: string;
}

interface AchievementsContextType {
  achievements: Achievement[];
  updateAchievementProgress: (id: number, progress: number) => void;
  unlockAchievement: (id: number) => void;
  getAchievementById: (id: number) => Achievement | undefined;
  stats: {
    totalAchievements: number;
    unlockedAchievements: number;
    completionPercentage: number;
    totalPoints: number;
  };
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};

// Initial achievements data
const initialAchievements: Achievement[] = [
  // Recipe Achievements
  {
    id: 1,
    title: 'Recipe Master',
    description: 'Create 10 original recipes',
    icon: '🏆',
    progress: 0,
    maxProgress: 10,
    currentProgress: 0,
    unlocked: false,
    category: 'recipe',
    reward: 'Recipe Master Badge'
  },
  {
    id: 2,
    title: 'Flavor Explorer',
    description: 'Use 20 different ingredients across your recipes',
    icon: '🌶️',
    progress: 0,
    maxProgress: 20,
    currentProgress: 0,
    unlocked: false,
    category: 'recipe',
    reward: 'Flavor Explorer Badge'
  },
  {
    id: 3,
    title: 'Global Chef',
    description: 'Create recipes from 5 different cuisines',
    icon: '🌎',
    progress: 0,
    maxProgress: 5,
    currentProgress: 0,
    unlocked: false,
    category: 'recipe',
    reward: 'Global Chef Badge'
  },
  {
    id: 4,
    title: 'Meal Planner',
    description: 'Create a complete weekly meal plan',
    icon: '📅',
    progress: 0,
    maxProgress: 1,
    currentProgress: 0,
    unlocked: false,
    category: 'recipe',
    reward: 'Meal Planner Badge'
  },
  {
    id: 5,
    title: 'Recipe Collector',
    description: 'Save 15 recipes to your cookbook',
    icon: '📚',
    progress: 0,
    maxProgress: 15,
    currentProgress: 0,
    unlocked: false,
    category: 'recipe',
    reward: 'Recipe Collector Badge'
  },
  
  // Skill Achievements
  {
    id: 6,
    title: 'Knife Skills',
    description: 'Complete the knife skills tutorial',
    icon: '🔪',
    progress: 0,
    maxProgress: 1,
    currentProgress: 0,
    unlocked: false,
    category: 'skill',
    reward: 'Knife Skills Badge'
  },
  {
    id: 7,
    title: 'Technique Master',
    description: 'Complete 5 cooking technique tutorials',
    icon: '👨‍🍳',
    progress: 0,
    maxProgress: 5,
    currentProgress: 0,
    unlocked: false,
    category: 'skill',
    reward: 'Technique Master Badge'
  },
  {
    id: 8,
    title: 'Butcher Apprentice',
    description: 'Complete the meat cutting tutorial',
    icon: '🥩',
    progress: 0,
    maxProgress: 1,
    currentProgress: 0,
    unlocked: false,
    category: 'skill',
    reward: 'Butcher Apprentice Badge'
  },
  
  // Community Achievements
  {
    id: 9,
    title: 'Social Chef',
    description: 'Share 3 recipes on social media',
    icon: '📱',
    progress: 0,
    maxProgress: 3,
    currentProgress: 0,
    unlocked: false,
    category: 'community',
    reward: 'Social Chef Badge'
  },
  {
    id: 10,
    title: 'Recipe Reviewer',
    description: 'Rate and review 5 recipes',
    icon: '⭐',
    progress: 0,
    maxProgress: 5,
    currentProgress: 0,
    unlocked: false,
    category: 'community',
    reward: 'Recipe Reviewer Badge'
  },
  
  // Challenge Achievements
  {
    id: 11,
    title: 'Challenge Accepted',
    description: 'Complete your first weekly cooking challenge',
    icon: '🏅',
    progress: 0,
    maxProgress: 1,
    currentProgress: 0,
    unlocked: false,
    category: 'challenge',
    reward: 'Challenge Accepted Badge'
  },
  {
    id: 12,
    title: 'Challenge Champion',
    description: 'Complete 5 weekly cooking challenges',
    icon: '🏆',
    progress: 0,
    maxProgress: 5,
    currentProgress: 0,
    unlocked: false,
    category: 'challenge',
    reward: 'Challenge Champion Badge'
  }
];

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [stats, setStats] = useState({
    totalAchievements: initialAchievements.length,
    unlockedAchievements: 0,
    completionPercentage: 0,
    totalPoints: 0
  });

  // Load achievements from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedAchievements = localStorage.getItem(`achievements_${user.id}`);
      
      if (savedAchievements) {
        const parsedAchievements = JSON.parse(savedAchievements);
        setAchievements(parsedAchievements);
        
        // Update stats
        const unlockedCount = parsedAchievements.filter((a: Achievement) => a.unlocked).length;
        setStats({
          totalAchievements: parsedAchievements.length,
          unlockedAchievements: unlockedCount,
          completionPercentage: Math.round((unlockedCount / parsedAchievements.length) * 100),
          totalPoints: unlockedCount * 10 // Simple point system: 10 points per achievement
        });
      }
    }
  }, [user]);

  // Save achievements to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`achievements_${user.id}`, JSON.stringify(achievements));
      
      // Update stats
      const unlockedCount = achievements.filter(a => a.unlocked).length;
      setStats({
        totalAchievements: achievements.length,
        unlockedAchievements: unlockedCount,
        completionPercentage: Math.round((unlockedCount / achievements.length) * 100),
        totalPoints: unlockedCount * 10
      });
    }
  }, [user, achievements]);

  // Update the progress of an achievement
  const updateAchievementProgress = (id: number, progress: number) => {
    setAchievements(prevAchievements => {
      return prevAchievements.map(achievement => {
        if (achievement.id === id) {
          const newCurrentProgress = Math.min(achievement.maxProgress, progress);
          const newProgress = Math.round((newCurrentProgress / achievement.maxProgress) * 100);
          const newUnlocked = newCurrentProgress >= achievement.maxProgress;
          
          // If newly unlocked, set the date earned
          const dateEarned = newUnlocked && !achievement.unlocked 
            ? new Date().toISOString() 
            : achievement.dateEarned;
          
          return {
            ...achievement,
            currentProgress: newCurrentProgress,
            progress: newProgress,
            unlocked: newUnlocked,
            dateEarned
          };
        }
        return achievement;
      });
    });
  };

  // Directly unlock an achievement
  const unlockAchievement = (id: number) => {
    setAchievements(prevAchievements => {
      return prevAchievements.map(achievement => {
        if (achievement.id === id && !achievement.unlocked) {
          return {
            ...achievement,
            currentProgress: achievement.maxProgress,
            progress: 100,
            unlocked: true,
            dateEarned: new Date().toISOString()
          };
        }
        return achievement;
      });
    });
  };

  // Get an achievement by ID
  const getAchievementById = (id: number) => {
    return achievements.find(achievement => achievement.id === id);
  };

  const value = {
    achievements,
    updateAchievementProgress,
    unlockAchievement,
    getAchievementById,
    stats
  };

  return (
    <AchievementsContext.Provider value={value}>
      {children}
    </AchievementsContext.Provider>
  );
};
