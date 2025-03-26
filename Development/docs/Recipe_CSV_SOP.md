# Standard Operating Procedure (SOP)
# Creating and Managing Recipe CSV Files for PorkChop V25

## Purpose
This SOP outlines the process for creating, formatting, and managing recipe CSV files for the PorkChop V25 application to ensure proper recipe tagging and functionality of the "What's In My Fridge" feature.

## Scope
This procedure applies to all recipe data management for the PorkChop V25 application, including adding new recipes, updating existing recipes, and ensuring proper ingredient tagging.

## Responsibilities
- Application developers and content managers are responsible for following this SOP when adding or modifying recipe data.
- Quality assurance personnel should verify that all recipe CSV files conform to this standard.

## Prerequisites
- Basic understanding of CSV file format
- Familiarity with the PorkChop V25 application structure
- Access to a spreadsheet application (Excel, Google Sheets) or text editor

## Procedure

### 1. CSV File Structure
All recipe CSV files must include the following columns in this exact order:

1. `id` - Unique identifier (UUID format)
2. `name` - Recipe name
3. `description` - Brief description of the recipe
4. `image_url` - Path to the recipe image (e.g., `/assets/images/RecipeName.png`)
5. `ingredients` - JSON array of ingredients as strings
6. `steps` - JSON array of cooking instructions
7. `cook_time` - Cooking time in minutes (numeric)
8. `prep_time` - Preparation time in minutes (numeric)
9. `servings` - Number of servings (numeric)
10. `required_cookware` - JSON array of required cookware
11. `protein_tags` - JSON array of protein ingredients
12. `veggie_tags` - JSON array of vegetable ingredients
13. `herb_tags` - JSON array of herbs and spices
14. `pantry_tags` - JSON array of pantry ingredients (optional)
15. `created_at` - Creation timestamp (format: `YYYY-MM-DD HH:MM:SS.SSSSSS+00`)
16. `updated_at` - Update timestamp (same format)
17. `cuisine_type` - Type of cuisine (optional)

### 2. Creating a New Recipe Entry

#### 2.1 Generate a Unique ID
- Generate a UUID for each new recipe (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
- Online UUID generators can be used (e.g., https://www.uuidgenerator.net/)

#### 2.2 Format Ingredient Lists
- Format as a JSON array with each ingredient as a string
- Example: `["1 lb ground beef", "2 cloves garlic, minced", "1 onion, diced"]`
- Ensure double quotes around each ingredient and escape inner quotes if needed

#### 2.3 Format Cooking Steps
- Format as a JSON array with each step as a string
- Example: `["Preheat oven to 350°F", "Mix ingredients in a bowl", "Bake for 30 minutes"]`
- Keep steps concise but clear

#### 2.4 Format Required Cookware
- Format as a JSON array of cookware items
- Example: `["skillet", "mixing bowl", "baking sheet"]`
- Use consistent naming conventions

#### 2.5 Ingredient Tagging (Critical for "What's In My Fridge" Feature)
Format each tag category as a JSON array:

- **Protein Tags**: Meats, fish, tofu, beans, eggs
  - Example: `["chicken", "bacon"]`
  
- **Veggie Tags**: Vegetables and fruits
  - Example: `["onion", "bell pepper", "tomato"]`
  
- **Herb Tags**: Herbs, spices, aromatics
  - Example: `["garlic", "basil", "thyme"]`
  
- **Pantry Tags**: Oils, vinegars, dry goods, condiments
  - Example: `["olive oil", "soy sauce", "rice"]`

**Important Notes on Tagging:**
- Use singular form (e.g., "onion" not "onions")
- Use generic terms (e.g., "beef" not "ground beef")
- Be consistent with naming across all recipes
- Tags should match the ingredient selector buttons in the application

#### 2.6 Timestamps
- Use the format: `YYYY-MM-DD HH:MM:SS.SSSSSS+00`
- Example: `2025-03-25 21:28:16.000000+00`
- Both `created_at` and `updated_at` should be included

### 3. Saving and Deploying CSV Files

#### 3.1 File Naming and Location
- Save files in the `data/csv/` directory
- Primary recipe file should be named `recipes_rows.csv`
- Backup files should include date (e.g., `recipes_rows_backup_20250325.csv`)

#### 3.2 Character Encoding
- Save all CSV files with UTF-8 encoding to support special characters

#### 3.3 Testing
- After creating or updating CSV files, test the application to ensure:
  - Recipes load correctly
  - "What's In My Fridge" feature correctly identifies recipes based on selected ingredients
  - Recipe suggestions display properly

### 4. Example Recipe Entry

```
id,name,description,image_url,ingredients,steps,cook_time,prep_time,servings,required_cookware,protein_tags,veggie_tags,herb_tags,pantry_tags,created_at,updated_at,cuisine_type
e1234567-e123-45e1-b234-567890abcdef,Garlic Butter Steak,Juicy steak with a flavorful garlic butter sauce,/assets/images/GarlicButterSteak.png,"[""1 lb ribeye steak"", ""4 cloves garlic, minced"", ""3 tbsp butter"", ""1 tbsp olive oil"", ""1 tsp fresh thyme leaves"", ""salt and pepper to taste""]","[""Season steak with salt and pepper on both sides"", ""Heat olive oil in a cast iron skillet over high heat"", ""Add steak and sear for 3-4 minutes per side for medium-rare"", ""Reduce heat to medium-low, add butter, garlic, and thyme"", ""Spoon the garlic butter over the steak continuously for 1-2 minutes"", ""Remove steak, let rest for 5 minutes before slicing"", ""Serve with remaining garlic butter sauce""]",15,10,2,"[""cast iron skillet""]","[""beef"", ""steak""]",[],["garlic"", ""thyme""],["butter"", ""olive oil"", ""salt"", ""pepper""],2025-03-25 21:28:16.000000+00,2025-03-25 21:28:16.000000+00,American
```

## Troubleshooting

### Common Issues and Solutions

1. **Recipe not appearing in application:**
   - Verify CSV format is correct with no missing commas or quotation marks
   - Check that JSON arrays are properly formatted with escaped quotes
   - Ensure all required fields are present

2. **Recipe not showing up in "What's In My Fridge" results:**
   - Verify that ingredient tags match exactly with the selector buttons
   - Check that protein_tags, veggie_tags, and herb_tags are correctly categorized
   - Ensure tags are in singular form and use consistent naming

3. **CSV parsing errors:**
   - Look for special characters that might need escaping
   - Check for missing or extra commas
   - Verify that all JSON arrays are properly formatted

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-25 | PorkChop Team | Initial SOP creation |
