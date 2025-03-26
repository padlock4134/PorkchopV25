import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useChefFreddie } from '../context/ChefFreddieContext';
import { useSavedRecipes } from '../context/SavedRecipesContext';
import Link from 'next/link';
import { Recipe } from '../utils/recipeData';
import { useRouter } from 'next/router';

const MyCookbook: NextPage = () => {
  const router = useRouter();
  const { showChefFreddie, setCurrentRoute } = useChefFreddie();
  const { 
    savedRecipes, 
    collections, 
    createCollection, 
    removeFromSaved, 
    removeFromCollection,
    getRecipeCollections,
    addToCollection
  } = useSavedRecipes();
  
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCollection, setActiveCollection] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const [recipeToRemove, setRecipeToRemove] = useState<Recipe | null>(null);
  // Add state to track which cards are flipped
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  // Add state for collection assignment
  const [showAssignCollectionModal, setShowAssignCollectionModal] = useState(false);
  const [recipeToAssign, setRecipeToAssign] = useState<Recipe | null>(null);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  
  // Set current route and show Chef Freddie
  useEffect(() => {
    setCurrentRoute('/my-cookbook');
    showChefFreddie();
  }, [setCurrentRoute, showChefFreddie]);

  // Filter recipes based on search term and active collection
  const filteredRecipes = savedRecipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeCollection === 'all') {
      return matchesSearch;
    } else {
      const recipeCollections = getRecipeCollections(recipe.id);
      return matchesSearch && recipeCollections.some(c => c.id === activeCollection);
    }
  });

  // Sort recipes based on sort option
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortOption) {
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'time-asc':
        return a.cookingTime - b.cookingTime;
      case 'time-desc':
        return b.cookingTime - a.cookingTime;
      case 'difficulty':
        const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
               difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      case 'newest':
      default:
        // Assuming newer recipes have higher IDs or we could use a timestamp
        return parseInt(b.id) - parseInt(a.id);
    }
  });

  // Handle creating a new collection
  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName.trim(), newCollectionDesc.trim());
      setNewCollectionName('');
      setNewCollectionDesc('');
      setShowCollectionModal(false);
    }
  };

  // Handle removing a recipe
  const confirmRemoveRecipe = (recipe: Recipe) => {
    setRecipeToRemove(recipe);
  };

  const handleRemoveRecipe = () => {
    if (recipeToRemove) {
      removeFromSaved(recipeToRemove.id);
      setRecipeToRemove(null);
    }
  };

  // Toggle card flip
  const toggleCardFlip = (recipeId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId]
    }));
  };

  // Function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Open the assign collection modal
  const openAssignCollectionModal = (recipe: Recipe) => {
    setRecipeToAssign(recipe);
    // Initialize with collections this recipe is already in
    const recipeCollections = getRecipeCollections(recipe.id);
    setSelectedCollections(recipeCollections.map(c => c.id));
    setShowAssignCollectionModal(true);
  };

  // Handle collection selection toggle
  const toggleCollectionSelection = (collectionId: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  // Save collection assignments
  const saveCollectionAssignments = () => {
    if (!recipeToAssign) return;
    
    // Get current collections for this recipe
    const currentCollections = getRecipeCollections(recipeToAssign.id).map(c => c.id);
    
    // Add to newly selected collections
    selectedCollections.forEach(collectionId => {
      if (!currentCollections.includes(collectionId)) {
        addToCollection(collectionId, recipeToAssign.id);
      }
    });
    
    // Remove from unselected collections
    currentCollections.forEach(collectionId => {
      if (!selectedCollections.includes(collectionId)) {
        removeFromCollection(collectionId, recipeToAssign.id);
      }
    });
    
    // Reset state
    setShowAssignCollectionModal(false);
    setRecipeToAssign(null);
    setSelectedCollections([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-butcher-800">My Cookbook</h1>
            <p className="text-butcher-600">
              {savedRecipes.length} saved recipe{savedRecipes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowCollectionModal(true)}
              className="px-4 py-2 bg-porkchop-100 text-porkchop-700 rounded-lg hover:bg-porkchop-200 transition-colors"
            >
              New Collection
            </button>
            <Link 
              href="/create-recipe"
              className="px-4 py-2 bg-butcher-600 text-white rounded-lg hover:bg-butcher-700 transition-colors"
            >
              Create Recipe
            </Link>
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search your recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-porkchop-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-porkchop-500"
              >
                <option value="newest">Newest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="time-asc">Cooking Time (Low to High)</option>
                <option value="time-desc">Cooking Time (High to Low)</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Collections Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-butcher-700 mb-4">Collections</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeCollection === 'all' 
                  ? 'bg-porkchop-500 text-white' 
                  : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
              }`}
              onClick={() => setActiveCollection('all')}
            >
              All Recipes
            </button>
            {collections.map(collection => (
              <button
                key={collection.id}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeCollection === collection.id 
                    ? 'bg-porkchop-500 text-white' 
                    : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
                }`}
                onClick={() => setActiveCollection(collection.id)}
              >
                {collection.name} ({collection.recipeIds.length})
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collections.map(collection => (
              <div key={collection.id} className="bg-porkchop-50 p-4 rounded-lg border border-porkchop-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-porkchop-800">{collection.name}</h3>
                    <p className="text-sm text-porkchop-600 mb-2">{collection.description}</p>
                    <p className="text-xs text-porkchop-500">{collection.recipeIds.length} recipes</p>
                  </div>
                  {collection.id !== 'favorites' && (
                    <button 
                      onClick={() => setActiveCollection(collection.id)}
                      className="text-xs text-porkchop-600 hover:text-porkchop-800"
                    >
                      View →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Saved Recipes Section */}
        <div>
          <h2 className="text-xl font-semibold text-butcher-700 mb-4">
            {activeCollection === 'all' 
              ? 'All Saved Recipes' 
              : `${collections.find(c => c.id === activeCollection)?.name || 'Collection'}`}
          </h2>
          
          {sortedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedRecipes.map(recipe => (
                <div 
                  key={recipe.id} 
                  className={`
                    recipe-card-container
                    h-[320px] relative perspective-1000 cursor-pointer
                  `}
                  onClick={() => toggleCardFlip(recipe.id)}
                >
                  {/* Card Front */}
                  <div 
                    className={`
                      absolute inset-0 backface-hidden transition-transform duration-500 ease-in-out
                      bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md
                      ${flippedCards[recipe.id] ? 'rotate-y-180' : ''}
                    `}
                  >
                    <div className="h-40 bg-gray-100 rounded mb-3 flex items-center justify-center relative">
                      {recipe.imageUrl ? (
                        <img 
                          src={recipe.imageUrl} 
                          alt={recipe.title} 
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder-recipe.jpg';
                          }}
                        />
                      ) : (
                        <span className="text-3xl">🍽️</span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmRemoveRecipe(recipe);
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        title="Remove from cookbook"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <div className="absolute bottom-2 left-0 right-0 px-2">
                        <div className="flex justify-between">
                          <span className={`
                            text-xs px-2 py-0.5 rounded-full
                            ${getDifficultyColor(recipe.difficulty)}
                          `}>
                            {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                          </span>
                          {recipe.cuisine && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-porkchop-100 text-porkchop-700">
                              🌍 {recipe.cuisine}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <h3 className="font-medium text-butcher-800 mb-1">{recipe.title}</h3>
                    <p className="text-sm text-butcher-600 mb-2 line-clamp-2">{recipe.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2 text-xs text-butcher-500">
                        <span>⏱️ {recipe.cookingTime} mins</span>
                        <span>👥 {recipe.servings}</span>
                      </div>
                      <div className="text-xs text-porkchop-600">
                        Tap to flip →
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Back */}
                  <div 
                    className={`
                      absolute inset-0 backface-hidden transition-transform duration-500 ease-in-out
                      bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md
                      rotate-y-180 ${flippedCards[recipe.id] ? 'rotate-y-0' : ''}
                    `}
                  >
                    <div className="h-full flex flex-col">
                      <h3 className="font-medium text-butcher-800 mb-2">{recipe.title}</h3>
                      
                      <div className="flex-1 overflow-y-auto mb-3">
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-butcher-700 mb-1">Main Ingredients:</h4>
                          <ul className="text-xs text-butcher-600 space-y-1">
                            {recipe.ingredients.slice(0, 4).map((ingredient, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-porkchop-500 mt-1 mr-1.5"></span>
                                <span>
                                  {typeof ingredient === 'string' 
                                    ? ingredient 
                                    : `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`
                                  }
                                </span>
                              </li>
                            ))}
                            {recipe.ingredients.length > 4 && (
                              <li className="text-xs text-porkchop-600">+ {recipe.ingredients.length - 4} more</li>
                            )}
                          </ul>
                        </div>
                        
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-butcher-700 mb-1">Tags:</h4>
                          <div className="flex flex-wrap gap-1">
                            {recipe.cuisine && (
                              <span className="text-xs bg-porkchop-100 text-porkchop-700 px-2 py-0.5 rounded-full">
                                🌍 {recipe.cuisine}
                              </span>
                            )}
                            {[...recipe.proteinTags || [], ...recipe.herbTags?.slice(0, 2) || []].slice(0, 4).map((tag, idx) => (
                              <span key={idx} className="text-xs bg-vintage-100 text-butcher-700 px-2 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-butcher-700 mb-1">Collections:</h4>
                          <div className="flex flex-wrap gap-1">
                            {getRecipeCollections(recipe.id).map(collection => (
                              <span key={collection.id} className="text-xs bg-porkchop-100 text-porkchop-700 px-2 py-0.5 rounded-full">
                                {collection.name}
                              </span>
                            ))}
                            {getRecipeCollections(recipe.id).length === 0 && (
                              <span className="text-xs text-butcher-500">Not in any collection</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-auto flex justify-between items-center">
                        <div className="text-xs text-porkchop-600">
                          ← Tap to flip back
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              openAssignCollectionModal(recipe);
                            }}
                            className="text-xs px-3 py-1 bg-porkchop-500 text-white rounded-lg hover:bg-porkchop-600 transition-colors"
                          >
                            Assign to Collection
                          </button>
                          <Link 
                            href={`/recipe/${recipe.id}`}
                            className="text-xs px-3 py-1 bg-porkchop-500 text-white rounded-lg hover:bg-porkchop-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Recipe
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
              {searchTerm ? (
                <p className="text-gray-500">No recipes found matching "{searchTerm}".</p>
              ) : activeCollection !== 'all' ? (
                <p className="text-gray-500">This collection is empty.</p>
              ) : (
                <>
                  <p className="text-gray-500">You haven't saved any recipes yet.</p>
                  <Link 
                    href="/create-recipe"
                    className="mt-2 inline-block text-porkchop-600 hover:text-porkchop-800"
                  >
                    Create your first recipe →
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Recipe Suggestions */}
        {savedRecipes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-butcher-700 mb-4">Recipe Suggestions</h2>
            <div className="bg-vintage-50 p-4 rounded-lg border border-vintage-200">
              <p className="text-butcher-600 mb-4">
                Based on your saved recipes, you might enjoy these similar dishes:
              </p>
              <button 
                onClick={() => router.push('/recipe-matches')}
                className="px-4 py-2 bg-porkchop-600 text-white rounded-lg hover:bg-porkchop-700 transition-colors"
              >
                View Recipe Matches
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <Link href="/dashboard" className="text-porkchop-600 hover:text-porkchop-800">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* New Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-butcher-800 mb-4">Create New Collection</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="collection-name" className="block text-sm font-medium text-butcher-700 mb-1">
                  Collection Name
                </label>
                <input
                  id="collection-name"
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-porkchop-500"
                  placeholder="e.g., Weeknight Dinners"
                />
              </div>
              <div>
                <label htmlFor="collection-desc" className="block text-sm font-medium text-butcher-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="collection-desc"
                  value={newCollectionDesc}
                  onChange={(e) => setNewCollectionDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-porkchop-500"
                  placeholder="Quick meals for busy weeknights"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowCollectionModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCollection}
                  className="px-4 py-2 bg-porkchop-600 text-white rounded-md hover:bg-porkchop-700 transition-colors"
                  disabled={!newCollectionName.trim()}
                >
                  Create Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Collection Modal */}
      {showAssignCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-butcher-800 mb-4">Assign to Collection</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-butcher-700 mb-1">
                  Select Collections
                </label>
                <div className="flex flex-wrap gap-2">
                  {collections.map(collection => (
                    <button
                      key={collection.id}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedCollections.includes(collection.id)
                          ? 'bg-porkchop-500 text-white'
                          : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
                      }`}
                      onClick={() => toggleCollectionSelection(collection.id)}
                    >
                      {collection.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAssignCollectionModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCollectionAssignments}
                  className="px-4 py-2 bg-porkchop-600 text-white rounded-md hover:bg-porkchop-700 transition-colors"
                >
                  Save Assignments
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Recipe Confirmation Modal */}
      {recipeToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-butcher-800 mb-2">Remove Recipe?</h3>
            <p className="text-butcher-600 mb-4">
              Are you sure you want to remove "{recipeToRemove.title}" from your cookbook?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setRecipeToRemove(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveRecipe}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for card flip effect */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
      `}</style>
    </div>
  );
};

export default MyCookbook;
