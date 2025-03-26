import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useChefFreddie } from '../context/ChefFreddieContext';
import { useAuth } from '../context/AuthContext';
import { useAchievementTracker } from '../utils/achievementTracker';
import Link from 'next/link';

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  participants: number;
  daysLeft: number;
  prize: string;
  imageUrl?: string;
  tags: string[];
  completed?: boolean;
  submittedAt?: string;
}

const Challenges: NextPage = () => {
  const { showChefFreddie, setCurrentRoute } = useChefFreddie();
  const { user } = useAuth();
  const { trackChallengeCompleted } = useAchievementTracker();
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [upcomingChallenges, setUpcomingChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<Challenge[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'my'>('active');
  
  // Set current route and show Chef Freddie
  useEffect(() => {
    setCurrentRoute('/challenges');
    showChefFreddie();
    
    // Mock data for challenges
    const mockActiveChallenges: Challenge[] = [
      {
        id: 1,
        title: 'Weekly Challenge: Italian Classics',
        description: 'Create your best Italian dish and share with the community. Dishes will be judged on presentation, creativity, and adherence to Italian culinary traditions.',
        difficulty: 'Medium',
        participants: 128,
        daysLeft: 3,
        prize: 'Featured Chef Badge',
        imageUrl: '/images/challenges/italian.jpg',
        tags: ['Italian', 'Weekly', 'Community']
      },
      {
        id: 2,
        title: 'Mystery Box Challenge',
        description: 'Create a dish using all the mystery ingredients: fennel, pork belly, star anise, and blood oranges. Show us your creativity!',
        difficulty: 'Hard',
        participants: 76,
        daysLeft: 5,
        prize: 'Premium Recipe Collection',
        imageUrl: '/images/challenges/mystery-box.jpg',
        tags: ['Mystery', 'Creative', 'Limited Ingredients']
      },
      {
        id: 3,
        title: 'Budget-Friendly Feast',
        description: 'Create a gourmet meal for under $15 that could feed a family of four. Prove that delicious doesn\'t have to be expensive!',
        difficulty: 'Easy',
        participants: 210,
        daysLeft: 2,
        prize: 'Butcher Shop Discount',
        imageUrl: '/images/challenges/budget.jpg',
        tags: ['Budget', 'Family', 'Value']
      }
    ];
    
    const mockUpcomingChallenges: Challenge[] = [
      {
        id: 4,
        title: 'Seasonal Spring Harvest',
        description: 'Create a dish that celebrates the best of spring produce. Focus on fresh, seasonal ingredients.',
        difficulty: 'Medium',
        participants: 0,
        daysLeft: 10,
        prize: 'Seasonal Cookbook',
        imageUrl: '/images/challenges/spring.jpg',
        tags: ['Seasonal', 'Vegetarian-Friendly', 'Fresh']
      },
      {
        id: 5,
        title: 'One-Pot Wonders',
        description: 'Create an impressive dish using just one pot or pan. Minimize cleanup while maximizing flavor!',
        difficulty: 'Easy',
        participants: 0,
        daysLeft: 14,
        prize: 'Professional Cookware Set',
        imageUrl: '/images/challenges/one-pot.jpg',
        tags: ['Simple', 'Practical', 'Weeknight']
      }
    ];
    
    // Set mock data
    setActiveChallenges(mockActiveChallenges);
    setUpcomingChallenges(mockUpcomingChallenges);
    
    // Load user challenges from localStorage if user is logged in
    if (user) {
      const userChallengesKey = `user_challenges_${user.id}`;
      const savedChallenges = localStorage.getItem(userChallengesKey);
      
      if (savedChallenges) {
        try {
          const parsedChallenges = JSON.parse(savedChallenges);
          setUserChallenges(parsedChallenges);
          
          // Update participant count for active challenges
          const updatedActiveChallenges = mockActiveChallenges.map(challenge => {
            if (parsedChallenges.some((userChallenge: Challenge) => userChallenge.id === challenge.id)) {
              // User is already participating, don't increment
              return challenge;
            }
            return challenge;
          });
          
          setActiveChallenges(updatedActiveChallenges);
        } catch (error) {
          console.error('Error parsing saved challenges:', error);
          setUserChallenges([]);
        }
      } else {
        // Default to empty if no saved challenges
        setUserChallenges([]);
      }
    } else {
      // Default for non-logged in users
      setUserChallenges([]);
    }
  }, [setCurrentRoute, showChefFreddie, user]);

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to join a challenge
  const joinChallenge = (challenge: Challenge) => {
    // Check if user is already participating in this challenge
    if (userChallenges.some(c => c.id === challenge.id)) {
      alert('You are already participating in this challenge!');
      return;
    }
    
    // Add challenge to user's challenges
    setUserChallenges([...userChallenges, challenge]);
    
    // Update participant count
    const updatedActiveChallenges = activeChallenges.map(c => {
      if (c.id === challenge.id) {
        return {
          ...c,
          participants: c.participants + 1
        };
      }
      return c;
    });
    
    setActiveChallenges(updatedActiveChallenges);
    
    // Save to localStorage if user is logged in
    if (user) {
      const userChallengesKey = `user_challenges_${user.id}`;
      localStorage.setItem(userChallengesKey, JSON.stringify([...userChallenges, challenge]));
    }
    
    // Show success message
    alert(`You've successfully joined the "${challenge.title}" challenge!`);
    
    // Switch to My Challenges tab
    setActiveTab('my');
    
    // Track achievement for joining a challenge
    if (trackChallengeCompleted) {
      trackChallengeCompleted();
    }
  };
  
  // Function to submit a challenge entry
  const submitChallengeEntry = (challengeId: number) => {
    // In a real app, this would open a form to submit photos, description, etc.
    // For now, we'll just simulate a successful submission
    
    // Mark challenge as completed
    const updatedUserChallenges = userChallenges.map(challenge => {
      if (challenge.id === challengeId) {
        // Track achievement for completing a challenge
        trackChallengeCompleted();
        
        return {
          ...challenge,
          completed: true,
          submittedAt: new Date().toISOString()
        };
      }
      return challenge;
    });
    
    setUserChallenges(updatedUserChallenges);
    
    // Save to localStorage if user is logged in
    if (user) {
      const userChallengesKey = `user_challenges_${user.id}`;
      localStorage.setItem(userChallengesKey, JSON.stringify(updatedUserChallenges));
    }
    
    // Show success message (in a real app)
    alert('Challenge submission successful! Your entry has been received.');
  };

  const renderChallengesList = (challenges: Challenge[]) => {
    if (challenges.length === 0) {
      return (
        <div className="text-center py-10 bg-vintage-50 rounded-lg">
          <span className="text-4xl mb-4 block">🍽️</span>
          <h3 className="text-lg font-medium text-butcher-800 mb-2">No challenges found</h3>
          <p className="text-butcher-600">Check back soon for new cooking challenges!</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="bg-white rounded-lg shadow-vintage overflow-hidden">
            <div className="h-48 bg-vintage-100 relative">
              {challenge.imageUrl ? (
                <img 
                  src={challenge.imageUrl} 
                  alt={challenge.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-butcher-200">
                  <span className="text-4xl">🏆</span>
                </div>
              )}
              <div className="absolute top-0 right-0 m-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
              </div>
              {challenge.daysLeft <= 3 && (
                <div className="absolute bottom-0 left-0 m-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                  {challenge.daysLeft} days left!
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-butcher-800 mb-2">{challenge.title}</h3>
              <p className="text-sm text-butcher-600 mb-4 line-clamp-3">{challenge.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {challenge.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-vintage-100 text-butcher-700 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between text-sm text-butcher-500 mb-4">
                <span>👥 {challenge.participants} participants</span>
                <span>🏆 {challenge.prize}</span>
              </div>
              
              <button 
                className={`w-full py-2 px-4 rounded-md transition-colors ${
                  activeTab === 'my' 
                    ? 'bg-butcher-600 text-white hover:bg-butcher-700' 
                    : userChallenges.some(c => c.id === challenge.id)
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-butcher-600 text-white hover:bg-butcher-700'
                }`}
                onClick={() => {
                  if (activeTab === 'my') {
                    // If it's in "My Challenges" tab, allow submission
                    if (!challenge.completed) {
                      submitChallengeEntry(challenge.id);
                    } else {
                      alert('You have already submitted an entry for this challenge!');
                    }
                  } else if (userChallenges.some(c => c.id === challenge.id)) {
                    // If already joined, switch to My Challenges tab
                    setActiveTab('my');
                  } else {
                    // Otherwise, join the challenge
                    joinChallenge(challenge);
                  }
                }}
              >
                {activeTab === 'my' 
                  ? (challenge.completed ? 'Submitted ✓' : 'Submit Entry') 
                  : (userChallenges.some(c => c.id === challenge.id) ? 'Already Joined ✓' : 'Join Challenge')}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-butcher-800 mb-2">Recipe Challenges</h1>
            <p className="text-butcher-600">
              Put your cooking skills to the test, compete with other chefs, and win exclusive prizes!
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

      {/* Challenge Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-vintage p-6">
          <p className="text-sm font-medium text-butcher-500 truncate">Active Challenges</p>
          <p className="mt-1 text-3xl font-semibold text-butcher-900">{activeChallenges.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-vintage p-6">
          <p className="text-sm font-medium text-butcher-500 truncate">Your Challenges</p>
          <p className="mt-1 text-3xl font-semibold text-butcher-900">{userChallenges.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-vintage p-6">
          <p className="text-sm font-medium text-butcher-500 truncate">Upcoming Challenges</p>
          <p className="mt-1 text-3xl font-semibold text-butcher-900">{upcomingChallenges.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-vintage overflow-hidden mb-8">
        <div className="border-b border-vintage-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-satriales-500 text-satriales-600'
                  : 'border-transparent text-butcher-500 hover:text-butcher-700 hover:border-butcher-300'
              }`}
            >
              Active Challenges
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-satriales-500 text-satriales-600'
                  : 'border-transparent text-butcher-500 hover:text-butcher-700 hover:border-butcher-300'
              }`}
            >
              Upcoming Challenges
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'my'
                  ? 'border-satriales-500 text-satriales-600'
                  : 'border-transparent text-butcher-500 hover:text-butcher-700 hover:border-butcher-300'
              }`}
            >
              My Challenges
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'active' && renderChallengesList(activeChallenges)}
          {activeTab === 'upcoming' && renderChallengesList(upcomingChallenges)}
          {activeTab === 'my' && renderChallengesList(userChallenges)}
        </div>
      </div>

      {/* How Challenges Work */}
      <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
        <h2 className="text-xl font-semibold text-butcher-800 mb-4">How Challenges Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-vintage-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">1️⃣</span>
              <h3 className="text-lg font-medium text-butcher-800">Join a Challenge</h3>
            </div>
            <p className="text-sm text-butcher-600">
              Browse active challenges and join the ones that interest you. Each challenge has specific requirements and a deadline.
            </p>
          </div>
          <div className="bg-vintage-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">2️⃣</span>
              <h3 className="text-lg font-medium text-butcher-800">Create Your Dish</h3>
            </div>
            <p className="text-sm text-butcher-600">
              Cook your dish following the challenge guidelines. Take photos of your creation and write a description.
            </p>
          </div>
          <div className="bg-vintage-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">3️⃣</span>
              <h3 className="text-lg font-medium text-butcher-800">Submit & Win</h3>
            </div>
            <p className="text-sm text-butcher-600">
              Submit your entry before the deadline. Community voting and chef judges will determine winners who receive exclusive prizes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
