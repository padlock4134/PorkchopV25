// Core cooking-related topics and their related terms
const CORE_TOPICS = {
  ingredients: [
    'ingredient', 'substitute', 'replacement', 'alternative', 'spice', 'herb',
    'vegetable', 'meat', 'dairy', 'fruit', 'grain', 'seasoning'
  ],
  techniques: [
    'cook', 'bake', 'roast', 'grill', 'fry', 'sauté', 'boil', 'steam',
    'knife', 'cut', 'chop', 'dice', 'mince', 'slice', 'technique'
  ],
  recipes: [
    'recipe', 'dish', 'meal', 'cuisine', 'cook', 'prepare', 'make',
    'instruction', 'step', 'method', 'procedure'
  ],
  equipment: [
    'pan', 'pot', 'knife', 'utensil', 'tool', 'appliance', 'equipment',
    'oven', 'stove', 'grill', 'cooker', 'thermometer'
  ],
  foodSafety: [
    'safety', 'temperature', 'storage', 'preserve', 'spoil', 'fresh',
    'contamination', 'bacteria', 'clean', 'sanitize'
  ],
  mealPlanning: [
    'plan', 'schedule', 'prep', 'preparation', 'menu', 'grocery',
    'shopping', 'list', 'ingredient', 'quantity', 'portion'
  ],
  dietary: [
    'diet', 'nutrition', 'vegetarian', 'vegan', 'gluten', 'allergy',
    'restriction', 'health', 'calorie', 'protein', 'carb', 'fat'
  ]
};

// Related topics that are acceptable in context
const RELATED_TOPICS = {
  foodHistory: [
    'history', 'origin', 'traditional', 'cultural', 'authentic',
    'heritage', 'background', 'story'
  ],
  localFood: [
    'local', 'farm', 'market', 'fresh', 'seasonal', 'producer',
    'supplier', 'butcher', 'vendor', 'shop'
  ],
  foodScience: [
    'science', 'reaction', 'temperature', 'chemical', 'physical',
    'process', 'method', 'experiment'
  ],
  kitchenOrg: [
    'organize', 'storage', 'container', 'pantry', 'kitchen',
    'space', 'layout', 'arrangement'
  ]
};

// Check if text contains any terms from a given array
const containsTerms = (text: string, terms: string[]): boolean => {
  const normalizedText = text.toLowerCase();
  return terms.some(term => normalizedText.includes(term.toLowerCase()));
};

// Calculate topic relevance score
const calculateTopicScore = (text: string): number => {
  let score = 0;
  const normalizedText = text.toLowerCase();

  // Check core topics (higher weight)
  Object.values(CORE_TOPICS).forEach(terms => {
    terms.forEach(term => {
      if (normalizedText.includes(term.toLowerCase())) {
        score += 2;
      }
    });
  });

  // Check related topics (lower weight)
  Object.values(RELATED_TOPICS).forEach(terms => {
    terms.forEach(term => {
      if (normalizedText.includes(term.toLowerCase())) {
        score += 1;
      }
    });
  });

  return score;
};

// Get category of the topic
const getTopicCategory = (text: string): string | undefined => {
  const normalizedText = text.toLowerCase();

  // Check core topics first
  for (const [category, terms] of Object.entries(CORE_TOPICS)) {
    if (containsTerms(normalizedText, terms)) {
      return category;
    }
  }

  // Then check related topics
  for (const [category, terms] of Object.entries(RELATED_TOPICS)) {
    if (containsTerms(normalizedText, terms)) {
      return category;
    }
  }

  return undefined;
};

// Generate a cooking-related redirect based on detected off-topic content
const generateRedirect = (text: string): string => {
  const normalizedText = text.toLowerCase();
  
  // Default redirects for common off-topic scenarios
  const redirects = {
    weather: "Speaking of weather, it can actually affect cooking! Would you like to know how humidity impacts baking?",
    sports: "That reminds me of athlete nutrition. Would you like some healthy recipe suggestions?",
    technology: "You know, there's some fascinating technology in modern kitchen equipment. Would you like to learn about smart cooking tools?",
    default: "Let me share an interesting cooking tip that might help you in the kitchen!"
  };

  // Try to find a relevant redirect
  for (const [topic, response] of Object.entries(redirects)) {
    if (normalizedText.includes(topic)) {
      return response;
    }
  }

  return redirects.default;
};

interface TopicAnalysis {
  isOnTopic: boolean;
  confidence: number;
  category?: string;
  suggestedRedirect?: string;
}

export const analyzeTopic = (text: string): TopicAnalysis => {
  const score = calculateTopicScore(text);
  const category = getTopicCategory(text);
  
  // Determine if the topic is relevant
  const isOnTopic = score > 0;
  
  // Calculate confidence based on score
  const confidence = Math.min(score / 5, 1); // Normalize to 0-1 range

  return {
    isOnTopic,
    confidence,
    category,
    suggestedRedirect: isOnTopic ? undefined : generateRedirect(text)
  };
};
