import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useChefFreddie } from '../context/ChefFreddieContext';
import { useAuth } from '../context/AuthContext';
import { useAchievements, Achievement } from '../context/AchievementsContext';
import Link from 'next/link';

const Achievements: NextPage = () => {
  const { showChefFreddie, setCurrentRoute } = useChefFreddie();
  const { user } = useAuth();
  const { achievements, stats } = useAchievements();
  const [activeCategory, setActiveCategory] = useState<Achievement['category'] | 'all'>('all');
  
  // Set current route and show Chef Freddie
  useEffect(() => {
    setCurrentRoute('/achievements');
    showChefFreddie();
  }, [setCurrentRoute, showChefFreddie]);

  const filteredAchievements = activeCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);

  const getCategoryName = (category: Achievement['category']) => {
    switch (category) {
      case 'recipe': return 'Recipe Achievements';
      case 'skill': return 'Skill Achievements';
      case 'community': return 'Community Achievements';
      case 'challenge': return 'Challenge Achievements';
      default: return 'All Achievements';
    }
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'recipe': return '📝';
      case 'skill': return '🔪';
      case 'community': return '👥';
      case 'challenge': return '🏆';
      default: return '🏅';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-butcher-800 mb-2">Cooking Achievements</h1>
            <p className="text-butcher-600">
              Track your cooking journey and earn badges as you master new skills and recipes.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex rounded-md shadow-sm">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-vintage-300 text-sm font-medium rounded-md text-butcher-700 bg-white hover:bg-vintage-50"
              >
                ← Back to Dashboard
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-vintage p-6">
          <p className="text-sm font-medium text-butcher-500 truncate">Total Achievements</p>
          <p className="mt-1 text-3xl font-semibold text-butcher-900">{stats.totalAchievements}</p>
        </div>
        <div className="bg-white rounded-lg shadow-vintage p-6">
          <p className="text-sm font-medium text-butcher-500 truncate">Unlocked</p>
          <p className="mt-1 text-3xl font-semibold text-butcher-900">{stats.unlockedAchievements}</p>
        </div>
        <div className="bg-white rounded-lg shadow-vintage p-6">
          <p className="text-sm font-medium text-butcher-500 truncate">Completion</p>
          <p className="mt-1 text-3xl font-semibold text-butcher-900">{stats.completionPercentage}%</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-satriales-500 h-2.5 rounded-full" 
              style={{ width: `${stats.completionPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-vintage p-6">
          <p className="text-sm font-medium text-butcher-500 truncate">Achievement Points</p>
          <p className="mt-1 text-3xl font-semibold text-butcher-900">{stats.totalPoints}</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
        <h2 className="text-lg font-semibold text-butcher-800 mb-4">Achievement Categories</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-butcher-600 text-white'
                : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
            }`}
          >
            All Achievements
          </button>
          {(['recipe', 'skill', 'community', 'challenge'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                activeCategory === category
                  ? 'bg-butcher-600 text-white'
                  : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
              }`}
            >
              <span className="mr-2">{getCategoryIcon(category)}</span>
              {getCategoryName(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements List */}
      <div className="bg-white rounded-lg shadow-vintage overflow-hidden mb-8">
        <div className="border-b border-vintage-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-butcher-800">
            {activeCategory === 'all' ? 'All Achievements' : getCategoryName(activeCategory)}
            <span className="ml-2 text-sm font-normal text-butcher-500">
              ({filteredAchievements.length})
            </span>
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`rounded-lg overflow-hidden border ${
                  achievement.unlocked 
                    ? 'border-satriales-200 bg-white' 
                    : 'border-vintage-200 bg-vintage-50'
                }`}
              >
                <div className={`p-4 ${achievement.unlocked ? 'bg-satriales-50' : 'bg-vintage-100'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{achievement.icon}</span>
                      <h3 className="font-semibold text-butcher-800">{achievement.title}</h3>
                    </div>
                    {achievement.unlocked && (
                      <span className="bg-satriales-500 text-white text-xs px-2 py-1 rounded-full">
                        Unlocked
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-butcher-600 mb-3">{achievement.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-butcher-500 mb-1">
                      <span>Progress</span>
                      <span>{achievement.currentProgress} / {achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${achievement.unlocked ? 'bg-satriales-500' : 'bg-butcher-400'}`}
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {achievement.reward && (
                    <div className="flex items-center text-xs text-butcher-500 mb-2">
                      <span className="mr-1">🎁</span>
                      <span>Reward: {achievement.reward}</span>
                    </div>
                  )}
                  
                  {achievement.dateEarned && (
                    <div className="text-xs text-butcher-500">
                      Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Levels */}
      <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
        <h2 className="text-xl font-semibold text-butcher-800 mb-4">Achievement Levels</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {['Novice', 'Apprentice', 'Chef', 'Master Chef', 'Legendary'].map((level, index) => {
            const pointsRequired = (index + 1) * 500;
            const isUnlocked = stats.totalPoints >= pointsRequired;
            const isNext = stats.totalPoints < pointsRequired && (index === 0 || stats.totalPoints >= (index * 500));
            
            return (
              <div 
                key={level} 
                className={`p-4 rounded-lg text-center ${
                  isUnlocked 
                    ? 'bg-satriales-50 border border-satriales-200' 
                    : isNext
                      ? 'bg-vintage-50 border border-vintage-200 border-dashed'
                      : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center bg-white border-2 border-vintage-200">
                  <span className="text-2xl">
                    {isUnlocked ? '✅' : index === 0 ? '👨‍🍳' : index === 1 ? '👨‍🍳' : index === 2 ? '👨‍🍳' : index === 3 ? '👨‍🍳' : '👑'}
                  </span>
                </div>
                <h3 className={`font-semibold ${isUnlocked ? 'text-satriales-700' : 'text-butcher-700'}`}>
                  {level}
                </h3>
                <p className="text-xs text-butcher-500 mt-1">{pointsRequired} points</p>
                {isNext && (
                  <div className="mt-2 text-xs text-butcher-600">
                    <span className="font-medium">Next level!</span>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-satriales-500 h-1.5 rounded-full" 
                        style={{ width: `${(stats.totalPoints / pointsRequired) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
