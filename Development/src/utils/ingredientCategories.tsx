// src/utils/ingredientCategories.ts

const ingredientCategories = {
    // Top level categories
    protein: {
      name: "Protein",
      subcategories: {
        beef: {
          name: "Beef",
          types: [
            { id: "steaks", name: "Steaks" },
            { id: "ground", name: "Ground" },
            { id: "ribs-roasts", name: "Ribs/Roasts" },
            { id: "tips-chunks", name: "Tips/Chunks" }
          ]
        },
        pork: {
          name: "Pork",
          types: [
            { id: "chops-loin", name: "Chops/Loin" },
            { id: "cured", name: "Cured" },
            { id: "shoulders-ribs", name: "Shoulders/Ribs" },
            { id: "ground-pork", name: "Ground Pork" }
          ]
        },
        poultry: {
          name: "Poultry",
          types: [
            { id: "breast", name: "Breast" },
            { id: "wings", name: "Wings" },
            { id: "whole", name: "Whole" },
            { id: "thighs-legs", name: "Thighs/Legs" }
          ]
        },
        seafood: {
          name: "Seafood",
          types: [
            { id: "white-fish", name: "White Fish" },
            { id: "fatty-fish", name: "Fatty Fish" },
            { id: "shellfish", name: "Shellfish" },
            { id: "mollusks", name: "Mollusks" }
          ]
        },
        nonMeat: {
          name: "Non Meat",
          types: [
            { id: "beans", name: "Beans" },
            { id: "lentils", name: "Lentils" },
            { id: "dairy-nuts", name: "Dairy/Nuts" },
            { id: "tofu", name: "Tofu" }
          ]
        }
      }
    },
    
    veggies: {
      name: "Veggies",
      subcategories: {
        leafy: {
          name: "Leafy",
          types: [
            { id: "fresh-herbs", name: "Fresh Herbs" },
            { id: "cooking-greens", name: "Cooking Greens" },
            { id: "lettuces", name: "Lettuces" },
            { id: "cabbage-family", name: "Cabbage Family" }
          ]
        },
        roots: {
          name: "Roots",
          types: [
            { id: "onions", name: "Onions" },
            { id: "potatoes", name: "Potatoes" },
            { id: "carrots", name: "Carrots" },
            { id: "radishes-turnips", name: "Radishes/Turnips" }
          ]
        },
        cucurbits: {
          name: "Cucurbits",
          types: [
            { id: "squash", name: "Squash" },
            { id: "cucumbers", name: "Cucumbers" },
            { id: "melons", name: "Melons" },
            { id: "zucchini", name: "Zucchini" }
          ]
        },
        nightshades: {
          name: "Nightshades",
          types: [
            { id: "sweet-peppers", name: "Peppers (Sweet)" },
            { id: "hot-peppers", name: "Peppers (Hot)" },
            { id: "tomatoes", name: "Tomatoes" },
            { id: "eggplant", name: "Eggplant" }
          ]
        }
      }
    },
    
    spicesAndGrains: {
      name: "Spices & Grains",
      subcategories: {
        herbs: {
          name: "Herbs",
          types: [
            { id: "dried-leaves", name: "Dried Leaves" },
            { id: "fresh-leaves", name: "Fresh Leaves" },
            { id: "herb-blends", name: "Herb Blends" },
            { id: "infusions", name: "Infusions" }
          ]
        },
        spice: {
          name: "Spice",
          types: [
            { id: "hot-spices", name: "Hot Spices" },
            { id: "warm-spices", name: "Warm Spices" },
            { id: "aromatic-spices", name: "Aromatic Spices" },
            { id: "exotic-spices", name: "Exotic Spices" }
          ]
        },
        grain: {
          name: "Grain",
          types: [
            { id: "rice", name: "Rice" },
            { id: "pasta", name: "Pasta" },
            { id: "flour", name: "Flour" },
            { id: "other-grains", name: "Other" }
          ]
        },
        legumes: {
          name: "Legumes",
          types: [
            { id: "beans", name: "Beans" },
            { id: "lentils", name: "Lentils" },
            { id: "peas", name: "Peas" },
            { id: "chickpeas", name: "Chickpeas" }
          ]
        }
      }
    },
    
    pantry: {
      name: "Pantry",
      subcategories: {
        dairy: {
          name: "Dairy",
          types: [
            { id: "cultivated", name: "Cultivated" },
            { id: "hard-cheese", name: "Hard Cheese" },
            { id: "soft-cheese", name: "Soft Cheese" },
            { id: "milk", name: "Milk" }
          ]
        },
        oilsAndFats: {
          name: "Oils & Fats",
          types: [
            { id: "olive-oil", name: "Olive Oil" },
            { id: "vegetable-oil", name: "Vegetable Oil" },
            { id: "specialty-oil", name: "Specialty Oil" },
            { id: "lards", name: "Lards" }
          ]
        },
        nutsAndSeeds: {
          name: "Nuts & Seeds",
          types: [
            { id: "nut-products", name: "Nut Products" },
            { id: "seeds", name: "Seeds" },
            { id: "tree-nuts", name: "Tree Nuts" },
            { id: "nut-butters", name: "Nut Butters" }
          ]
        },
        brothsAndStocks: {
          name: "Broths & Stocks",
          types: [
            { id: "broths", name: "Broths" },
            { id: "stocks", name: "Stocks" },
            { id: "bouillon", name: "Bouillon" },
            { id: "flavor-bases", name: "Flavor Bases" }
          ]
        }
      }
    },
    
    cookware: {
      name: "Cookware",
      subcategories: {
        stovetop: {
          name: "Stovetop",
          types: [
            { id: "cast-iron", name: "Cast Iron" },
            { id: "frying-pan", name: "Frying Pan" },
            { id: "pot", name: "Pot" },
            { id: "skillet", name: "Skillet" }
          ]
        },
        oven: {
          name: "Oven",
          types: [
            { id: "baking-sheet", name: "Baking Sheet" },
            { id: "dutch-oven", name: "Dutch Oven" },
            { id: "roasting-pan", name: "Roasting Pan" },
            { id: "casserole-dish", name: "Casserole Dish" }
          ]
        },
        utensils: {
          name: "Utensils",
          types: [
            { id: "knife", name: "Knife" },
            { id: "cutting-board", name: "Cutting Board" },
            { id: "spatula", name: "Spatula" },
            { id: "tongs", name: "Tongs" }
          ]
        },
        outdoor: {
          name: "Outdoor",
          types: [
            { id: "grill", name: "Grill" },
            { id: "smoker", name: "Smoker" },
            { id: "fire-pit", name: "Fire Pit" },
            { id: "griddle", name: "Griddle" }
          ]
        }
      }
    }
  };
  
  export default ingredientCategories;