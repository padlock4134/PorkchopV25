import { useAchievements } from '../context/AchievementsContext';

// Helper functions to track and update achievements
export const useAchievementTracker = () => {
  const { updateAchievementProgress, unlockAchievement, achievements } = useAchievements();

  // Recipe-related achievement trackers
  const trackRecipeCreation = () => {
    // Recipe Master (ID: 1) - Create 10 original recipes
    const recipeMaster = achievements.find(a => a.id === 1);
    if (recipeMaster && !recipeMaster.unlocked) {
      updateAchievementProgress(1, recipeMaster.currentProgress + 1);
    }

    // First Recipe (ID: 4) - Create your first recipe
    unlockAchievement(4);
  };

  const trackRecipeSaved = () => {
    // Recipe Collector (ID: 5) - Save 15 recipes to your cookbook
    const recipeCollector = achievements.find(a => a.id === 5);
    if (recipeCollector && !recipeCollector.unlocked) {
      updateAchievementProgress(5, recipeCollector.currentProgress + 1);
    }
  };

  const trackIngredientUsed = (ingredientsList: string[]) => {
    // Flavor Explorer (ID: 2) - Use 20 different ingredients across your recipes
    const flavorExplorer = achievements.find(a => a.id === 2);
    if (flavorExplorer && !flavorExplorer.unlocked) {
      // Get unique ingredients count
      const uniqueIngredients = new Set(ingredientsList);
      updateAchievementProgress(2, uniqueIngredients.size);
    }
  };

  const trackCuisineCreated = (cuisine: string) => {
    // Global Chef (ID: 3) - Create recipes from 5 different cuisines
    const globalChef = achievements.find(a => a.id === 3);
    if (globalChef && !globalChef.unlocked) {
      // We would need to track cuisines in localStorage or context
      const userCuisines = JSON.parse(localStorage.getItem('user_cuisines') || '[]');
      if (!userCuisines.includes(cuisine)) {
        userCuisines.push(cuisine);
        localStorage.setItem('user_cuisines', JSON.stringify(userCuisines));
        updateAchievementProgress(3, userCuisines.length);
      }
    }
  };

  // Tutorial-related achievement trackers
  const trackTutorialCompleted = (tutorialId: number | string, category?: string) => {
    // Technique Master (ID: 7) - Complete 5 cooking technique tutorials
    if (category === 'technique' || category === 'cooking-science') {
      const techniqueMaster = achievements.find(a => a.id === 7);
      if (techniqueMaster && !techniqueMaster.unlocked) {
        updateAchievementProgress(7, techniqueMaster.currentProgress + 1);
      }
    }

    // Knife Skills (ID: 6) - Complete the knife skills tutorial
    if (tutorialId === 7 || tutorialId === '7') { // ID for the knife skills tutorial
      unlockAchievement(6);
    }

    // Butcher Apprentice (ID: 8) - Complete the meat cutting tutorial
    if (tutorialId === 4 || tutorialId === '4') { // ID for the meat cutting tutorial
      unlockAchievement(8);
    }
  };

  // Community-related achievement trackers
  const trackRecipeShared = () => {
    // Social Chef (ID: 9) - Share 3 recipes on social media
    const socialChef = achievements.find(a => a.id === 9);
    if (socialChef && !socialChef.unlocked) {
      updateAchievementProgress(9, socialChef.currentProgress + 1);
    }
  };

  const trackRecipeReviewed = () => {
    // Recipe Reviewer (ID: 10) - Rate and review 5 recipes
    const recipeReviewer = achievements.find(a => a.id === 10);
    if (recipeReviewer && !recipeReviewer.unlocked) {
      updateAchievementProgress(10, recipeReviewer.currentProgress + 1);
    }
  };

  // Challenge-related achievement trackers
  const trackChallengeCompleted = () => {
    // Challenge Accepted (ID: 11) - Complete your first weekly cooking challenge
    unlockAchievement(11);
    
    // Challenge Champion (ID: 12) - Complete 5 weekly cooking challenges
    const challengeChampion = achievements.find(a => a.id === 12);
    if (challengeChampion && !challengeChampion.unlocked) {
      updateAchievementProgress(12, challengeChampion.currentProgress + 1);
    }
  };

  return {
    trackRecipeCreation,
    trackRecipeSaved,
    trackIngredientUsed,
    trackCuisineCreated,
    trackTutorialCompleted,
    trackRecipeShared,
    trackRecipeReviewed,
    trackChallengeCompleted
  };
};

// Achievement notification component (to be used when an achievement is unlocked)
export const createAchievementNotification = (title: string, description: string) => {
  // This function would create a notification in the UI
  // It could be implemented with a toast notification library
  console.log(`Achievement Unlocked: ${title} - ${description}`);
  
  // Example implementation with a custom event
  const event = new CustomEvent('achievementUnlocked', {
    detail: { title, description }
  });
  document.dispatchEvent(event);
};
