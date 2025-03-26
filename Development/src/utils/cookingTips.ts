// src/utils/cookingTips.ts

export const cookingTips = [
  "Always read the entire recipe before you start cooking.",
  "Keep your knives sharp - dull knives are more dangerous than sharp ones.",
  "Pat meat dry before searing for a better crust.",
  "Rest meat after cooking to allow juices to redistribute.",
  "Taste as you go and adjust seasoning accordingly.",
  "Add salt to pasta water - it should taste like the sea.",
  "Mise en place (prepare all ingredients before cooking) saves time and reduces stress.",
  "Don't overcrowd the pan when sautéing - it causes steaming instead of browning.",
  "Use a meat thermometer for perfect doneness every time.",
  "Let refrigerated ingredients come to room temperature before cooking.",
  "Save pasta water - the starchy liquid helps sauce cling to pasta.",
  "Toast spices before using them to enhance their flavor.",
  "Add acid (lemon, vinegar) to brighten flavors in a dish.",
  "Invest in a good cutting board and care for it properly.",
  "Season from a height for more even distribution.",
  "Don't flip meat too often - let it develop a crust first.",
  "Use the right size pot or pan for the job.",
  "Clean as you go to make post-cooking cleanup easier.",
  "Let your pan heat up before adding oil or ingredients.",
  "Store herbs in water like flowers to keep them fresh longer.",
  "Save vegetable scraps for homemade stock.",
  "Don't store tomatoes in the refrigerator - it ruins their flavor.",
  "Properly heated oil should shimmer but not smoke.",
  "Add garlic later in the cooking process to prevent burning.",
  "Finish pasta in the sauce for better flavor integration.",
  "Use a kitchen scale for baking - it's much more accurate than volume measurements.",
  "Don't press down on burgers while cooking - it pushes out the juices.",
  "Let cookie dough rest in the refrigerator for deeper flavor.",
  "Bloom gelatin in cold water, not hot.",
  "Roast vegetables at high heat for caramelization.",
  "Don't rinse pasta after cooking (except for cold pasta salads).",
];

export const getRandomTip = (): string => {
  return cookingTips[Math.floor(Math.random() * cookingTips.length)];
};

export const getDailyTip = (): string => {
  // Get a tip based on the half-day (changes every 12 hours)
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  // Calculate half-days since the start of the year (each day has 2 half-days)
  const halfDayOfYear = (dayOfYear * 2) + (now.getHours() >= 12 ? 1 : 0);
  
  // Use modulo to cycle through the tips
  const tipIndex = halfDayOfYear % cookingTips.length;
  return cookingTips[tipIndex];
};
