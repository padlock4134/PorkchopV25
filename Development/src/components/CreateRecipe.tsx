import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../utils/recipeData';
import { useChefFreddie } from '../context/ChefFreddieContext';

interface SelectedItems {
  proteins: string[];
  vegetables: string[];
  grainsAndSpices: string[];
  pantry: string[];
  cookware: string[];
}

const CreateRecipe: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [matchedRecipes, setMatchedRecipes] = useState<Recipe[]>([]);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    proteins: [],
    vegetables: [],
    grainsAndSpices: [],
    pantry: [],
    cookware: [],
  });
  const [recipes] = useState<Recipe[]>([]);

  const {
    currentRecipe,
    setCurrentRecipe,
  } = useChefFreddie();

  const ingredients = {
    proteins: [
      // Beef
      { id: 'ground-beef', name: 'Ground Beef', category: 'Beef' },
      { id: 'steak', name: 'Steak', category: 'Beef' },
      { id: 'beef-ribs-roasts', name: 'Ribs/Roasts', category: 'Beef' },
      { id: 'beef-tips-chunks', name: 'Tips/Chunks', category: 'Beef' },
      // Poultry
      { id: 'chicken-breast', name: 'Breast', category: 'Poultry' },
      { id: 'whole-chicken', name: 'Whole', category: 'Poultry' },
      { id: 'chicken-thighs-legs', name: 'Thighs & Legs', category: 'Poultry' },
      { id: 'ground-poultry', name: 'Ground', category: 'Poultry' },
      // Seafood
      { id: 'white-fish', name: 'White Fish', category: 'Seafood' },
      { id: 'fatty-fish', name: 'Fatty Fish', category: 'Seafood' },
      { id: 'mollusks', name: 'Mollusks', category: 'Seafood' },
      { id: 'shellfish', name: 'Shellfish', category: 'Seafood' },
      // Pork
      { id: 'pork-chops-loin', name: 'Chops/Loin', category: 'Pork' },
      { id: 'cured-pork', name: 'Cured', category: 'Pork' },
      { id: 'pork-shoulder-ribs', name: 'Shoulder/Ribs', category: 'Pork' },
      { id: 'ground-sausage', name: 'Ground/Sausage', category: 'Pork' },
      // Plant Based
      { id: 'beans', name: 'Beans', category: 'Plant Based' },
      { id: 'lentils', name: 'Lentils', category: 'Plant Based' },
      { id: 'tofu', name: 'Tofu', category: 'Plant Based' },
      { id: 'meat-alternatives', name: 'Meat Alternatives', category: 'Plant Based' }
    ],
    vegetables: [
      // Leafy Greens
      { id: 'cooking-greens', name: 'Cooking Greens', category: 'Leafy Greens' },
      { id: 'fresh-herbs', name: 'Fresh Herbs', category: 'Leafy Greens' },
      { id: 'lettuce', name: 'Lettuce', category: 'Leafy Greens' },
      { id: 'sprouts', name: 'Sprouts', category: 'Leafy Greens' },
      // Roots
      { id: 'onions', name: 'Onions', category: 'Roots' },
      { id: 'potatoes', name: 'Potatoes', category: 'Roots' },
      { id: 'carrots-parsnips', name: 'Carrots & Parsnips', category: 'Roots' },
      { id: 'root-aromatics', name: 'Root Aromatics', category: 'Roots' },
      // Curcubits
      { id: 'squashes', name: 'Squashes', category: 'Curcubits' },
      { id: 'cucumber', name: 'Cucumber', category: 'Curcubits' },
      { id: 'melons', name: 'Melons', category: 'Curcubits' },
      { id: 'gourds', name: 'Gourds', category: 'Curcubits' },
      // Nightshades
      { id: 'hot-peppers', name: 'Hot Peppers', category: 'Nightshades' },
      { id: 'sweet-peppers', name: 'Sweet Peppers', category: 'Nightshades' },
      { id: 'tomatoes', name: 'Tomatoes', category: 'Nightshades' },
      { id: 'eggplant', name: 'Eggplant', category: 'Nightshades' },
      // Alliums
      { id: 'garlic', name: 'Garlic', category: 'Alliums' },
      { id: 'shallots', name: 'Shallots', category: 'Alliums' },
      { id: 'leeks', name: 'Leeks', category: 'Alliums' },
      { id: 'chives', name: 'Chives', category: 'Alliums' }
    ],
    grainsAndSpices: [
      // Spices
      { id: 'hot-spices', name: 'Hot Spices', category: 'Spices' },
      { id: 'warm-spices', name: 'Warm Spices', category: 'Spices' },
      { id: 'salts', name: 'Salts', category: 'Spices' },
      { id: 'peppers', name: 'Peppers', category: 'Spices' },
      // Herbs
      { id: 'dried-leaves', name: 'Dried Leaves', category: 'Herbs' },
      { id: 'herb-blends', name: 'Blends', category: 'Herbs' },
      { id: 'mediterranean-herbs', name: 'Mediterranean', category: 'Herbs' },
      { id: 'asian-herbs', name: 'Asian', category: 'Herbs' },
      // Grains
      { id: 'pasta', name: 'Pasta', category: 'Grains' },
      { id: 'rice', name: 'Rice', category: 'Grains' },
      { id: 'flour', name: 'Flour', category: 'Grains' },
      { id: 'other-grains', name: 'Other', category: 'Grains' },
      // Aromatics
      { id: 'ginger', name: 'Ginger', category: 'Aromatics' },
      { id: 'lemongrass', name: 'Lemongrass', category: 'Aromatics' },
      { id: 'galangal', name: 'Galangal', category: 'Aromatics' },
      { id: 'turmeric', name: 'Turmeric', category: 'Aromatics' },
      // Seeds
      { id: 'sesame', name: 'Sesame', category: 'Seeds' },
      { id: 'fennel', name: 'Fennel', category: 'Seeds' },
      { id: 'coriander', name: 'Coriander', category: 'Seeds' },
      { id: 'cumin', name: 'Cumin', category: 'Seeds' }
    ],
    pantry: [
      // Dairy
      { id: 'milk', name: 'Milk', category: 'Dairy' },
      { id: 'soft-cheese', name: 'Soft Cheeses', category: 'Dairy' },
      { id: 'hard-cheese', name: 'Hard Cheeses', category: 'Dairy' },
      { id: 'cultured-dairy', name: 'Cultured Dairy', category: 'Dairy' },
      // Oils & Fats
      { id: 'lard', name: 'Lard', category: 'Oils & Fats' },
      { id: 'olive-oil', name: 'Olive Oil', category: 'Oils & Fats' },
      { id: 'vegetable-oil', name: 'Vegetable Oil', category: 'Oils & Fats' },
      { id: 'other-oils', name: 'Other Oils', category: 'Oils & Fats' },
      // Nuts & Seeds
      { id: 'nut-products', name: 'Nut Products', category: 'Nuts & Seeds' },
      { id: 'tree-nuts', name: 'Tree Nuts', category: 'Nuts & Seeds' },
      { id: 'ground-seeds', name: 'Ground Seeds', category: 'Nuts & Seeds' },
      { id: 'seed-products', name: 'Seed Products', category: 'Nuts & Seeds' },
      // Broths
      { id: 'meat-broth', name: 'Meat Broths', category: 'Broths' },
      { id: 'vegetable-broth', name: 'Vegetable Broths', category: 'Broths' },
      { id: 'seafood-broth', name: 'Seafood Broths', category: 'Broths' },
      { id: 'other-broths', name: 'Other Broths', category: 'Broths' },
      // Stocks
      { id: 'meat-stock', name: 'Meat Stocks', category: 'Stocks' },
      { id: 'vegetable-stock', name: 'Vegetable Stocks', category: 'Stocks' },
      { id: 'seafood-stock', name: 'Seafood Stocks', category: 'Stocks' },
      { id: 'other-stocks', name: 'Other Stocks', category: 'Stocks' }
    ],
    cookware: [
      // Stovetop
      { id: 'pots', name: 'Pots', category: 'Stovetop' },
      { id: 'pans', name: 'Pans', category: 'Stovetop' },
      { id: 'cast-iron', name: 'Cast Iron', category: 'Stovetop' },
      { id: 'skillets', name: 'Skillets', category: 'Stovetop' },
      // Oven
      { id: 'baking-dishes', name: 'Baking Dishes', category: 'Oven' },
      { id: 'other-oven', name: 'Other', category: 'Oven' },
      // Utensils
      { id: 'cutting-tools', name: 'Cutting Tools', category: 'Utensils' },
      { id: 'mixing-tools', name: 'Mixing Tools', category: 'Utensils' },
      { id: 'measuring-tools', name: 'Measuring Tools', category: 'Utensils' },
      { id: 'straining-tools', name: 'Straining Tools', category: 'Utensils' },
      // Outdoor
      { id: 'grill', name: 'Grill', category: 'Outdoor' },
      // Other
      { id: 'other-cookware', name: 'Other', category: 'Other' }
    ]
  };

  const steps = [
    { title: 'Select Proteins', category: 'proteins' },
    { title: 'Select Vegetables', category: 'vegetables' },
    { title: 'Select Herbs & Spices', category: 'grainsAndSpices' },
    { title: 'Select Pantry Items', category: 'pantry' },
    { title: 'Review & Match' }
  ];

  const getItemsByCategory = (items: typeof ingredients.proteins) => {
    const categories: { [key: string]: typeof items } = {};
    items.forEach(item => {
      const category = item.category || 'Other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });
    return categories;
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        const matches = recipes
          .map(recipe => {
            const proteinMatches = recipe.proteinTags.filter(tag => 
              selectedItems.proteins.includes(tag)
            ).length;
            const veggieMatches = recipe.veggieTags.filter(tag => 
              selectedItems.vegetables.includes(tag)
            ).length;
            const herbMatches = recipe.herbTags.filter(tag => 
              selectedItems.grainsAndSpices.includes(tag)
            ).length;
            const pantryMatches = recipe.pantryTags.filter(tag => 
              selectedItems.pantry.includes(tag)
            ).length;

            const totalMatches = proteinMatches + veggieMatches + herbMatches + pantryMatches;
            const totalTags = recipe.proteinTags.length + recipe.veggieTags.length + 
              recipe.herbTags.length + recipe.pantryTags.length;

            return {
              ...recipe,
              matchPercentage: (totalMatches / totalTags) * 100
            };
          })
          .filter(recipe => (recipe.matchPercentage ?? 0) > 0)
          .sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0));

        setMatchedRecipes(matches);
      } catch (err) {
        console.error('Error matching recipes:', err);
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const toggleCard = (recipeId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId]
    }));
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    if (currentRecipe?.id === recipe.id) {
      setCurrentRecipe(null);
    } else {
      setCurrentRecipe(recipe);
    }
  };

  const handleClearAll = () => {
    setSelectedItems({
      proteins: [],
      vegetables: [],
      grainsAndSpices: [],
      pantry: [],
      cookware: [],
    });
  };

  const handleItemSelect = (category: keyof SelectedItems, item: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter(i => i !== item)
        : [...prev[category], item]
    }));
  };

  return (
    <div className="min-h-screen bg-vintage-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-vintage rounded-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-butcher-800">{steps[currentStep].title}</h2>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-medium text-satriales-600 hover:text-satriales-700 transition-colors"
            >
              Clear All
            </button>
          </div>

          {currentStep < steps.length - 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const category = steps[currentStep].category as keyof typeof ingredients;
                const items = ingredients[category];
                const categorizedItems = getItemsByCategory(items);
                
                return Object.entries(categorizedItems).map(([subCategory, subItems]) => (
                  <div key={`${category}-${subCategory}`} className="bg-vintage-50 rounded-lg shadow-vintage p-6">
                    <h3 className="text-lg font-medium text-butcher-700 mb-4 border-b border-butcher-200 pb-2">
                      {subCategory}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {subItems.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleItemSelect(category, item.id)}
                          className={`
                            ${selectedItems[category].includes(item.id)
                              ? 'bg-satriales-100 border-satriales-500 text-satriales-700'
                              : 'bg-white border-butcher-200 text-butcher-700 hover:bg-vintage-50'
                            }
                            px-3 py-2 text-sm font-medium border rounded-md transition-colors duration-200
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-satriales-500
                          `}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedRecipes.map(matchedRecipe => (
                <div
                  key={matchedRecipe.id}
                  className={`
                    bg-white shadow-vintage rounded-lg overflow-hidden transform transition-all duration-300
                    hover:shadow-vintage-lg hover:-translate-y-1
                    ${currentRecipe?.id === matchedRecipe.id ? 'ring-2 ring-satriales-500' : ''}
                  `}
                >
                  <div className="relative">
                    <img
                      src={matchedRecipe.imageUrl}
                      alt={matchedRecipe.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-0 right-0 m-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-satriales-100 text-satriales-800">
                        {Math.round(matchedRecipe.matchPercentage || 0)}% Match
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-butcher-800 mb-2">
                      {matchedRecipe.title}
                    </h3>
                    <p className="text-butcher-600 mb-4 line-clamp-2">
                      {matchedRecipe.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center text-sm text-butcher-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {matchedRecipe.cookingTime} mins
                        </span>
                        <span className="flex items-center text-sm text-butcher-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0M7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {matchedRecipe.servings} servings
                        </span>
                      </div>
                      <button
                        onClick={() => handleRecipeSelect(matchedRecipe)}
                        className="px-4 py-2 text-sm font-medium text-satriales-600 hover:text-satriales-700"
                      >
                        {currentRecipe?.id === matchedRecipe.id ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`
                px-4 py-2 rounded-md text-sm font-medium
                ${currentStep === 0
                  ? 'bg-butcher-100 text-butcher-400 cursor-not-allowed'
                  : 'bg-butcher-500 text-white hover:bg-butcher-600'}
              `}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className={`
                px-4 py-2 rounded-md text-sm font-medium
                ${currentStep === steps.length - 1
                  ? 'bg-butcher-100 text-butcher-400 cursor-not-allowed'
                  : 'bg-satriales-600 text-white hover:bg-satriales-700'}
              `}
            >
              {currentStep === steps.length - 2 ? 'Find Matches' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;