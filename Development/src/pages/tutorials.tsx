import React from 'react';
import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useChefFreddie } from '../context/ChefFreddieContext';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useAchievementTracker } from '../utils/achievementTracker';
import TutorialImage from '../components/TutorialImage';
import Link from 'next/link';

interface Tutorial {
  id: string | number;
  title: string;
  description: string;
  category: string;
  level: 'basic' | 'intermediate' | 'advanced';
  duration: string;
  tags: string[];
  imageUrl?: string;
  views: number;
  likes: number;
  completed?: boolean;
  progress?: number;
  videoUrl?: string;
  instructor: string;
}

const Tutorials: NextPage = () => {
  const router = useRouter();
  const { showChefFreddie, setCurrentRoute } = useChefFreddie();
  const { user } = useAuth();
  const { trackTutorialCompleted } = useAchievementTracker();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [featuredTutorial, setFeaturedTutorial] = useState<Tutorial | null>(null);
  const [activeCategory, setActiveCategory] = useState<Tutorial['category'] | 'all'>('all');
  const [activeLevel, setActiveLevel] = useState<Tutorial['level'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  // Set current route and show Chef Freddie
  useEffect(() => {
    setCurrentRoute('/tutorials');
    showChefFreddie();

    // Mock data for tutorials
    const mockTutorials: Tutorial[] = [
      {
        id: 1,
        title: 'Understanding Salt Types & Usage',
        description: 'Explore different salt varieties and learn when to use each type. From kosher salt to fleur de sel, discover how each salt affects your cooking and how to properly season dishes.',
        duration: '20 min',
        level: 'basic',
        category: 'ingredient-focused',
        tags: ['Salt', 'Seasoning', 'Flavor Development'],
        views: 1245,
        likes: 328,
        completed: true,
        progress: 100,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        instructor: 'John Doe'
      },
      {
        id: 2,
        title: 'Mastering Cast Iron Cookware',
        description: 'Learn how to properly season, use, and maintain cast iron pans. Discover techniques for achieving the perfect sear and preventing sticking without losing that valuable seasoning.',
        duration: '25 min',
        level: 'intermediate',
        category: 'equipment-mastery',
        tags: ['Cast Iron', 'Cookware', 'Maintenance'],
        views: 987,
        likes: 245,
        completed: false,
        progress: 60,
        instructor: 'Jane Doe'
      },
      {
        id: 3,
        title: 'The Science of Caramelization',
        description: 'Understand the chemical process behind caramelization and how it develops flavor. Learn optimal temperatures and techniques to achieve perfect caramelization without burning.',
        duration: '30 min',
        level: 'advanced',
        category: 'cooking-science',
        tags: ['Caramelization', 'Food Science', 'Flavor Development'],
        views: 756,
        likes: 189,
        completed: false,
        progress: 0,
        instructor: 'Bob Smith'
      },
      {
        id: 4,
        title: 'Butchering a Whole Chicken',
        description: 'Master the art of breaking down a whole chicken into eight perfect pieces. Learn to identify joints, use the proper knife techniques, and maximize yield while minimizing waste.',
        duration: '35 min',
        level: 'intermediate',
        category: 'meat-cutting',
        tags: ['Chicken', 'Butchery', 'Knife Skills'],
        views: 632,
        likes: 154,
        completed: false,
        progress: 0,
        instructor: 'Alice Johnson'
      },
      {
        id: 5,
        title: 'Kitchen Knife Safety Fundamentals',
        description: 'Essential safety practices every cook should know. Learn proper knife handling, cutting board techniques, and how to create a safe workflow in your kitchen.',
        duration: '15 min',
        level: 'basic',
        category: 'preparation-safety',
        tags: ['Safety', 'Knife Skills', 'Kitchen Setup'],
        views: 845,
        likes: 210,
        completed: false,
        progress: 25,
        instructor: 'Mike Brown'
      },
      {
        id: 6,
        title: 'Wok Cooking Techniques',
        description: 'Master the art of wok cooking with authentic stir-fry techniques. Learn about wok hei, proper heat control, and the sequence for adding ingredients to achieve restaurant-quality results.',
        duration: '40 min',
        level: 'advanced',
        category: 'global-techniques',
        tags: ['Chinese Cooking', 'Wok', 'Stir-Fry'],
        views: 523,
        likes: 132,
        completed: false,
        progress: 0,
        instructor: 'Emily Chen'
      },
      {
        id: 7,
        title: 'Precision Knife Cuts for Vegetables',
        description: 'Learn professional vegetable cutting techniques including julienne, brunoise, batonnet, and chiffonade. Master consistent sizing for even cooking and beautiful presentation.',
        duration: '30 min',
        level: 'intermediate',
        category: 'veggie-prep',
        tags: ['Knife Skills', 'Vegetables', 'Precision Cutting'],
        views: 912,
        likes: 267,
        completed: false,
        progress: 0,
        instructor: 'David Lee'
      },
      {
        id: 8,
        title: 'Understanding Meat Grades & Selection',
        description: 'Learn how to select quality meats by understanding grading systems, marbling, and cuts. Discover what to look for when buying beef, pork, and poultry for different cooking methods.',
        duration: '25 min',
        level: 'basic',
        category: 'ingredient-focused',
        tags: ['Meat Selection', 'Quality', 'Shopping'],
        views: 478,
        likes: 119,
        completed: false,
        progress: 0,
        instructor: 'Sarah Taylor'
      },
      {
        id: 9,
        title: 'The Science of Emulsions',
        description: 'Understand the principles behind stable emulsions in cooking. Learn to create perfect mayonnaise, vinaigrettes, and hollandaise sauce by mastering the science of emulsification.',
        duration: '35 min',
        level: 'advanced',
        category: 'cooking-science',
        tags: ['Emulsions', 'Sauces', 'Food Science'],
        views: 562,
        likes: 143,
        completed: false,
        progress: 0,
        instructor: 'Kevin White'
      },
      {
        id: 10,
        title: 'French Knife Cuts Masterclass',
        description: 'Master the classic French knife cuts essential for professional cooking. Learn precise techniques for brunoise, julienne, paysanne, and more with step-by-step demonstrations.',
        duration: '45 min',
        level: 'advanced',
        category: 'veggie-prep',
        tags: ['French Cuisine', 'Knife Skills', 'Precision'],
        views: 689,
        likes: 178,
        completed: false,
        progress: 0,
        instructor: 'Olivia Martin'
      },
      {
        id: 11,
        title: 'Sous Vide Equipment Guide',
        description: 'Everything you need to know about sous vide cooking equipment. Compare immersion circulators, containers, and vacuum sealers to find the best setup for your kitchen and budget.',
        duration: '20 min',
        level: 'basic',
        category: 'equipment-mastery',
        tags: ['Sous Vide', 'Equipment', 'Modern Cooking'],
        views: 723,
        likes: 195,
        completed: false,
        progress: 0,
        instructor: 'Ava Davis'
      },
      {
        id: 12,
        title: 'Breaking Down Primal Cuts of Beef',
        description: 'Learn to identify and break down primal cuts of beef into portion-sized steaks and roasts. Master the techniques for separating muscles, removing silverskin, and maximizing yield.',
        duration: '50 min',
        level: 'advanced',
        category: 'meat-cutting',
        tags: ['Beef', 'Butchery', 'Primal Cuts'],
        views: 412,
        likes: 98,
        completed: false,
        progress: 0,
        instructor: 'Ethan Hall'
      }
    ];

    // Set mock data
    setTutorials(mockTutorials);

    // Set featured tutorial
    setFeaturedTutorial(mockTutorials[0]);
  }, [setCurrentRoute, showChefFreddie]);

  // Filter tutorials based on category, level, and search
  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = activeCategory === 'all' || tutorial.category === activeCategory;
    const matchesLevel = activeLevel === 'all' || tutorial.level === activeLevel;
    const matchesSearch = searchQuery === '' || 
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesLevel && matchesSearch;
  });

  const getCategoryName = (category: Tutorial['category']) => {
    switch(category) {
      case 'ingredient-focused': return 'Ingredient Focused Content';
      case 'equipment-mastery': return 'Kitchen Equipment Mastery';
      case 'cooking-science': return 'Cooking Science Explanations';
      case 'global-techniques': return 'Global Cooking Techniques';
      case 'preparation-safety': return 'Preparation and Safety';
      case 'meat-cutting': return 'Meat Cutting Specialties';
      case 'veggie-prep': return 'Veggie Dicing/Chopping/Mincing';
      default: return category;
    }
  };

  const getLevelColor = (level: Tutorial['level']) => {
    switch(level) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to open video modal
  const openVideoModal = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setShowVideoModal(true);
    
    // Track tutorial progress
    const updatedTutorials = tutorials.map(t => {
      if (t.id === tutorial.id) {
        // If progress is less than 100%, increment it
        if (t.progress && t.progress < 100) {
          const newProgress = Math.min(100, t.progress + 25);
          
          // If the tutorial is now completed, track the achievement
          if (newProgress === 100 && (!t.completed || t.progress < 100)) {
            trackTutorialCompleted(t.id, t.category);
          }
          
          return {
            ...t,
            progress: newProgress,
            completed: newProgress === 100
          };
        }
        return t;
      }
      return t;
    });
    
    setTutorials(updatedTutorials);
    
    // Save progress to localStorage
    if (user) {
      localStorage.setItem(`tutorial_progress_${user.id}`, JSON.stringify(updatedTutorials));
    }
  };

  // Function to mark tutorial as completed
  const markAsCompleted = (tutorialId: string | number) => {
    const updatedTutorials = tutorials.map(t => {
      if (t.id === tutorialId) {
        // If not already completed, track the achievement
        if (!t.completed) {
          trackTutorialCompleted(t.id, t.category);
        }
        
        return {
          ...t,
          progress: 100,
          completed: true
        };
      }
      return t;
    });
    
    setTutorials(updatedTutorials);
    
    // Save progress to localStorage
    if (user) {
      localStorage.setItem(`tutorial_progress_${user.id}`, JSON.stringify(updatedTutorials));
    }
  };

  // Function to close video modal
  const closeVideoModal = () => {
    setShowVideoModal(false);
    setSelectedTutorial(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-butcher-800 mb-2">Cooking Tutorials</h1>
            <p className="text-butcher-600">
              Learn essential cooking techniques and master new skills with our expert-led tutorials.
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

      {/* Featured Tutorial */}
      {featuredTutorial && (
        <div className="bg-white rounded-lg shadow-vintage overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-2/5 h-64 md:h-auto relative">
              <TutorialImage 
                title={featuredTutorial.title}
                category={featuredTutorial.category}
                className="rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
              />
              <div className="absolute top-0 left-0 m-4">
                <span className="bg-butcher-600 text-white px-3 py-1 rounded-md text-sm font-medium">
                  Featured Tutorial
                </span>
              </div>
            </div>
            <div className="p-6 md:w-3/5">
              <div className="flex flex-wrap items-center mb-2">
                <h2 className="text-xl font-bold text-butcher-800 mr-3">{featuredTutorial.title}</h2>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(featuredTutorial.level)}`}>
                  {featuredTutorial.level}
                </span>
              </div>
              <p className="text-butcher-600 mb-4">{featuredTutorial.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {featuredTutorial.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-vintage-100 text-butcher-700 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center text-sm text-butcher-500 mb-6">
                <span className="flex items-center mr-4">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {featuredTutorial.views} views
                </span>
                <span className="flex items-center mr-4">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  {featuredTutorial.likes} likes
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {featuredTutorial.duration}
                </span>
              </div>
              <button 
                className="px-6 py-3 bg-satriales-500 text-white rounded-lg hover:bg-satriales-600 transition-colors"
                onClick={() => openVideoModal(featuredTutorial)}
              >
                Watch Tutorial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="md:w-1/3">
            <label htmlFor="search" className="sr-only">Search tutorials</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-butcher-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-vintage-300 rounded-md leading-5 bg-white placeholder-butcher-400 focus:outline-none focus:ring-satriales-500 focus:border-satriales-500 sm:text-sm"
                placeholder="Search tutorials"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div>
              <label htmlFor="category" className="sr-only">Category</label>
              <select
                id="category"
                name="category"
                className="block w-full pl-3 pr-10 py-2 text-base border border-vintage-300 focus:outline-none focus:ring-satriales-500 focus:border-satriales-500 sm:text-sm rounded-md"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value as any)}
              >
                <option value="all">All Categories</option>
                <option value="ingredient-focused">Ingredient Focused Content</option>
                <option value="equipment-mastery">Kitchen Equipment Mastery</option>
                <option value="cooking-science">Cooking Science Explanations</option>
                <option value="global-techniques">Global Cooking Techniques</option>
                <option value="preparation-safety">Preparation and Safety</option>
                <option value="meat-cutting">Meat Cutting Specialties</option>
                <option value="veggie-prep">Veggie Dicing/Chopping/Mincing</option>
              </select>
            </div>
            <div>
              <label htmlFor="level" className="sr-only">Level</label>
              <select
                id="level"
                name="level"
                className="block w-full pl-3 pr-10 py-2 text-base border border-vintage-300 focus:outline-none focus:ring-satriales-500 focus:border-satriales-500 sm:text-sm rounded-md"
                value={activeLevel}
                onChange={(e) => setActiveLevel(e.target.value as any)}
              >
                <option value="all">All Levels</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
        <h2 className="text-lg font-semibold text-butcher-800 mb-6">
          {activeCategory === 'all' 
            ? activeLevel === 'all' 
              ? 'All Tutorials' 
              : `${activeLevel} Tutorials`
            : activeLevel === 'all' 
              ? `${getCategoryName(activeCategory)} Tutorials`
              : `${activeLevel} ${getCategoryName(activeCategory)} Tutorials`
          }
          <span className="ml-2 text-sm font-normal text-butcher-500">
            ({filteredTutorials.length})
          </span>
        </h2>
        
        {filteredTutorials.length === 0 ? (
          <div className="text-center py-10 bg-vintage-50 rounded-lg">
            <span className="text-4xl mb-4 block">🔍</span>
            <h3 className="text-lg font-medium text-butcher-800 mb-2">No tutorials found</h3>
            <p className="text-butcher-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tutorial) => (
              <div key={tutorial.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-vintage-100 overflow-hidden">
                <div className="h-48 bg-vintage-100 relative">
                  <TutorialImage 
                    title={tutorial.title}
                    category={tutorial.category}
                  />
                  <div className="absolute bottom-0 right-0 bg-butcher-600 text-white px-2 py-1 text-xs font-medium">
                    {tutorial.duration}
                  </div>
                  <div className="absolute top-0 right-0 m-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(tutorial.level)}`}>
                      {tutorial.level}
                    </span>
                  </div>
                  {tutorial.completed && (
                    <div className="absolute top-0 left-0 m-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Completed
                    </div>
                  )}
                  {!tutorial.completed && tutorial.progress && tutorial.progress > 0 && (
                    <div className="absolute top-0 left-0 m-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {tutorial.progress}% Complete
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-butcher-800 mb-2">{tutorial.title}</h3>
                  <p className="text-sm text-butcher-600 mb-4 line-clamp-2">{tutorial.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tutorial.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-vintage-100 text-butcher-700 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-xs text-butcher-500 mb-4">
                    <span className="flex items-center mr-3">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      {tutorial.views}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      {tutorial.likes}
                    </span>
                  </div>
                  
                  {tutorial.progress !== undefined && (
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-satriales-500 h-1.5 rounded-full" 
                          style={{ width: `${tutorial.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <button 
                    className="w-full px-4 py-2 bg-satriales-500 text-white rounded-lg hover:bg-satriales-600 transition-colors"
                    onClick={() => openVideoModal(tutorial)}
                  >
                    {tutorial.completed ? 'Watch Again' : tutorial.progress && tutorial.progress > 0 ? 'Continue' : 'Start Tutorial'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Learning Paths */}
      <div className="bg-white rounded-lg shadow-vintage p-6">
        <h2 className="text-xl font-semibold text-butcher-800 mb-4">Learning Paths</h2>
        <p className="text-butcher-600 mb-6">
          Follow these curated learning paths to master specific cooking skills from beginner to advanced.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-vintage-50 rounded-lg p-5 border border-vintage-200">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">🔪</span>
              <h3 className="text-lg font-medium text-butcher-800">Knife Skills Path</h3>
            </div>
            <p className="text-sm text-butcher-600 mb-4">
              Master essential knife techniques from basic to advanced. Includes safety, maintenance, and precision cutting.
            </p>
            <div className="flex justify-between text-xs text-butcher-500 mb-3">
              <span>3 tutorials</span>
              <span>1/3 completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
              <div className="bg-satriales-500 h-1.5 rounded-full" style={{ width: '33%' }}></div>
            </div>
            <button className="w-full px-4 py-2 bg-butcher-600 text-white rounded-lg hover:bg-butcher-700 transition-colors">
              Continue Path
            </button>
          </div>
          
          <div className="bg-vintage-50 rounded-lg p-5 border border-vintage-200">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">🥩</span>
              <h3 className="text-lg font-medium text-butcher-800">Butchery Mastery</h3>
            </div>
            <p className="text-sm text-butcher-600 mb-4">
              Learn professional butchery techniques for different meats. From basic cuts to advanced preparation.
            </p>
            <div className="flex justify-between text-xs text-butcher-500 mb-3">
              <span>4 tutorials</span>
              <span>0/4 completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
              <div className="bg-satriales-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <button className="w-full px-4 py-2 bg-butcher-600 text-white rounded-lg hover:bg-butcher-700 transition-colors">
              Start Path
            </button>
          </div>
          
          <div className="bg-vintage-50 rounded-lg p-5 border border-vintage-200">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">👨‍🍳</span>
              <h3 className="text-lg font-medium text-butcher-800">Cooking Fundamentals</h3>
            </div>
            <p className="text-sm text-butcher-600 mb-4">
              Essential cooking techniques every home chef should know. From basic preparation to advanced methods.
            </p>
            <div className="flex justify-between text-xs text-butcher-500 mb-3">
              <span>5 tutorials</span>
              <span>1/5 completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
              <div className="bg-satriales-500 h-1.5 rounded-full" style={{ width: '20%' }}></div>
            </div>
            <button className="w-full px-4 py-2 bg-butcher-600 text-white rounded-lg hover:bg-butcher-700 transition-colors">
              Continue Path
            </button>
          </div>
        </div>
      </div>

      {/* Tutorial Video Modal */}
      {showVideoModal && selectedTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-butcher-800">{selectedTutorial.title}</h3>
              <button 
                onClick={closeVideoModal}
                className="p-1.5 rounded-full bg-vintage-100 hover:bg-vintage-200 text-butcher-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* Video Player */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden mb-6">
                {selectedTutorial.videoUrl ? (
                  <iframe 
                    src={selectedTutorial.videoUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-center p-8">
                      <div className="text-4xl text-gray-400 mb-4">🎬</div>
                      <p className="text-butcher-600">Video content will be available soon!</p>
                      <p className="text-butcher-400 text-sm mt-2">The tutorial video is being prepared and will be added shortly.</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Tutorial Details */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-butcher-800 mb-2">About this Tutorial</h4>
                <p className="text-butcher-600 mb-4">{selectedTutorial.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-butcher-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    {selectedTutorial.duration}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    {selectedTutorial.views} views
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    {selectedTutorial.likes} likes
                  </div>
                  <div>
                    <span className="font-medium">Instructor:</span> {selectedTutorial.instructor}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {selectedTutorial.category}
                  </div>
                </div>
              </div>
              
              {/* Tutorial Resources */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-butcher-800 mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-porkchop-600 hover:text-porkchop-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <a href="#" className="hover:underline">Tutorial PDF Guide</a>
                  </li>
                  <li className="flex items-center text-porkchop-600 hover:text-porkchop-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <a href="#" className="hover:underline">Recipe Ingredients List</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Video Modal */}
      {showVideoModal && selectedTutorial && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-butcher-900">
                      {selectedTutorial.title}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-butcher-500">
                        Instructor: {selectedTutorial.instructor} • {selectedTutorial.duration}
                      </p>
                    </div>
                    
                    <div className="mt-4 aspect-video">
                      {selectedTutorial.videoUrl ? (
                        <iframe 
                          className="w-full h-full rounded-lg"
                          src={selectedTutorial.videoUrl}
                          title={selectedTutorial.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-vintage-100 rounded-lg">
                          <p className="text-butcher-600">Video coming soon!</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-butcher-800">Description</h4>
                      <p className="mt-1 text-sm text-butcher-600">{selectedTutorial.description}</p>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-butcher-800">Resources</h4>
                      <ul className="mt-1 text-sm text-butcher-600 list-disc list-inside">
                        <li>Downloadable PDF Guide</li>
                        <li>Practice Exercises</li>
                        <li>Related Recipes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-vintage-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-butcher-600 text-base font-medium text-white hover:bg-butcher-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-butcher-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => markAsCompleted(selectedTutorial.id)}
                >
                  Mark as Completed
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-vintage-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-butcher-700 hover:bg-vintage-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-butcher-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeVideoModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutorials;
