export interface FamousChef {
  name: string;
  specialty: string;
  quotes: string[];
  avatar?: string; // Optional URL to chef's image
  emoji: string; // Fallback emoji if no avatar is available
}

export const famousChefs: FamousChef[] = [
  {
    name: "Julia Child",
    specialty: "French cuisine and culinary education",
    emoji: "👩‍🍳",
    quotes: [
      "The only real stumbling block is fear of failure. In cooking you've got to have a what-the-hell attitude.",
      "Find something you're passionate about and keep tremendously interested in it.",
      "People who love to eat are always the best people.",
      "Cooking is like love. It should be entered into with abandon or not at all."
    ]
  },
  {
    name: "Gordon Ramsay",
    specialty: "Modern European cuisine with a focus on British",
    emoji: "👨‍🍳",
    quotes: [
      "The minute you start compromising for the sake of massaging somebody's ego, that's it, game over.",
      "If you want to become a great chef, you have to work with great chefs.",
      "I don't like looking back. I'm always constantly looking forward. I'm not the one to sort of sit and cry over spilled milk.",
      "Put your head down and work hard. Never wait for things to happen, make them happen for yourself through hard graft and not giving up."
    ]
  },
  {
    name: "Anthony Bourdain",
    specialty: "World cuisine and culinary storytelling",
    emoji: "🌍",
    quotes: [
      "Your body is not a temple, it's an amusement park. Enjoy the ride.",
      "Skills can be taught. Character you either have or you don't have.",
      "Good food is very often, even most often, simple food.",
      "Context and memory play powerful roles in all the truly great meals in one's life."
    ]
  },
  {
    name: "Ina Garten",
    specialty: "American comfort food and entertaining",
    emoji: "🏡",
    quotes: [
      "Food is not about impressing people. It's about making them feel comfortable.",
      "It's about getting the best ingredients and not doing too much to them.",
      "Cooking is one of the great gifts you can give to those you love.",
      "If it's not fun, you're not doing it right."
    ]
  },
  {
    name: "Massimo Bottura",
    specialty: "Modern Italian cuisine",
    emoji: "🇮🇹",
    quotes: [
      "In my refrigerator, there is no food. Only ideas.",
      "Cooking is an act of love. It's a way of sharing and a way of giving.",
      "The most important ingredient is passion.",
      "Tradition is not static; it's dynamic like a river that flows."
    ]
  },
  {
    name: "René Redzepi",
    specialty: "Nordic cuisine and foraging",
    emoji: "🌿",
    quotes: [
      "The perfect meal is one that's in season and that you've anticipated.",
      "Deliciousness is the most important thing in food.",
      "We need to redefine what luxury is. Luxury shouldn't be about gold and marble. It should be about mud and grass.",
      "Time is an ingredient."
    ]
  },
  {
    name: "Alice Waters",
    specialty: "California cuisine and farm-to-table movement",
    emoji: "🌱",
    quotes: [
      "Good food should be a right, not a privilege.",
      "Let things taste of what they are.",
      "The act of eating is very political. You buy from the right people, you support the right network of farmers and suppliers who care about the land and what they put in the food.",
      "Teaching kids how to feed themselves and how to live in a community responsibly is the center of education."
    ]
  },
  {
    name: "Thomas Keller",
    specialty: "French and American cuisine with precision",
    emoji: "🔪",
    quotes: [
      "It's all about finesse. The great challenge is to be able to create a dish that has complexity but appears to be very simple.",
      "A recipe has no soul. You, as the cook, must bring soul to the recipe.",
      "Respect for food is respect for life, for who we are and what we do.",
      "The ability to simplify means to eliminate the unnecessary so that the necessary may speak."
    ]
  },
  {
    name: "Dominique Crenn",
    specialty: "Artistic French cuisine",
    emoji: "🎨",
    quotes: [
      "Food is memories, food is culture, food is love, food is what brings people together.",
      "I cook from my heart. I want to create emotions.",
      "Being a chef is about feeding people, not just filling them up.",
      "The kitchen is a place where you can be artistic and playful but also very methodical."
    ]
  },
  {
    name: "José Andrés",
    specialty: "Spanish cuisine and humanitarian cooking",
    emoji: "🇪🇸",
    quotes: [
      "Food is the universal language that brings people together.",
      "The business of feeding people is the most amazing business in the world.",
      "We have the duty to show that nobody is alone, and we need to make sure that we all feed each other.",
      "Simple ingredients prepared in a simple way - that's the best way to take your everyday cooking to a higher level."
    ]
  },
  {
    name: "Nigella Lawson",
    specialty: "Home cooking and food writing",
    emoji: "📝",
    quotes: [
      "Cooking is not about being the best or most perfect cook, but rather it is about sharing the table with family and friends.",
      "I think cooking should be about fun and family.",
      "I'm not a chef. I'm not even a trained or professional cook. My qualification is as an eater.",
      "There is a way of cooking that is a way of loving others."
    ]
  },
  {
    name: "David Chang",
    specialty: "Asian fusion and culinary innovation",
    emoji: "🍜",
    quotes: [
      "I'm not afraid to fail. I'm not afraid to take risks. I'm not afraid to eat something that I've never had before.",
      "The perfect meal is a delicious one that's shared with friends and family.",
      "Cooking is not an exercise in following rules. It's about learning to trust yourself.",
      "Food should be fun. It should be an adventure."
    ]
  }
];

/**
 * Returns a random chef from the list of famous chefs
 */
export function getRandomChef(): FamousChef {
  return famousChefs[Math.floor(Math.random() * famousChefs.length)];
}

/**
 * Returns a random quote from a specific chef
 */
export function getRandomQuoteFromChef(chef: FamousChef): string {
  return chef.quotes[Math.floor(Math.random() * chef.quotes.length)];
}

/**
 * Returns a random chef with a random quote
 */
export function getRandomChefWithQuote(): { chef: FamousChef, quote: string } {
  const chef = getRandomChef();
  const quote = getRandomQuoteFromChef(chef);
  return { chef, quote };
}
