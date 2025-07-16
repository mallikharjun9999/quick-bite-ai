
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting recipes based on user preferences.
 *
 * The flow takes into account meal type, dietary preferences, allergies, available ingredients,
 * cooking time preference, and user goals to recommend suitable recipes.
 *
 * @interface SuggestRecipesInput - The input type for the suggestRecipes function.
 * @interface SuggestRecipesOutput - The output type for the suggestRecipes function.
 * @function suggestRecipes - A function that handles the recipe suggestion process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRecipesInputSchema = z.object({
  mealType: z
    .string()
    .describe('The type of meal (e.g., Breakfast, Lunch, Dinner, Snacks, Brunch).'),
  dietaryPreference: z
    .string()
    .describe(
      'Dietary preference (e.g., Vegetarian, Vegan, Non-Veg, Keto, Low-carb, High-protein, Jain, Gluten-Free, or None).'
    ),
  allergies: z
    .string()
    .describe('Any allergies or ingredients the user dislikes (e.g., "Peanuts, Shellfish" or "None").'),
  availableIngredients: z
    .string()
    .describe('A comma-separated list of ingredients available to the user. Can be "None".'),
  cookingTimePreference: z
    .string()
    .describe('Preferred cooking time (e.g., "15 mins", "30 mins", "45 mins", "60 mins", or "Any").'),
  goal: z.string().describe('User goal (e.g., "Healthy meal", "Quick dinner", "High protein", "A delicious meal").'),
});

export type SuggestRecipesInput = z.infer<typeof SuggestRecipesInputSchema>;

const SuggestRecipesOutputSchema = z.object({
  recipes: z.array(
    z.object({
      title: z.string().describe('The title of the recipe.'),
      ingredients: z.string().describe('A comma-separated list of ingredients required for the recipe.'),
      instructions: z.string().describe('Step-by-step instructions for preparing the recipe.'),
      time_to_cook: z.string().describe('The estimated cooking time for the recipe.'),
      nutrition: z
        .object({
          calories: z.string().describe('The number of calories per serving.'),
          protein: z.string().describe('The amount of protein per serving.'),
          carbs: z.string().describe('The amount of carbohydrates per serving.'),
          fats: z.string().describe('The amount of fat per serving.'),
        })
        .describe('Nutritional information for the recipe.'),
    })
  ),
});

export type SuggestRecipesOutput = z.infer<typeof SuggestRecipesOutputSchema>;

export async function suggestRecipes(input: SuggestRecipesInput): Promise<SuggestRecipesOutput> {
  return suggestRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipesPrompt',
  input: {schema: SuggestRecipesInputSchema},
  output: {schema: SuggestRecipesOutputSchema},
  prompt: `You are a smart and friendly AI chef named QuickBite. Your goal is to help users create delicious meals from the ingredients they already have.

Based on the user's available ingredients and preferences, recommend up to 3 creative and tasty recipes.

Available Ingredients: {{{availableIngredients}}}
Meal type: {{{mealType}}}
Dietary Preference: {{{dietaryPreference}}}
Allergies/Dislikes: {{{allergies}}}
Cooking Time Preference: {{{cookingTimePreference}}}
Goal: {{{goal}}}

For each recipe, provide:
   - A creative and appealing Recipe Title.
   - A comma-separated list of all Ingredients required.
   - Numbered, step-by-step Instructions.
   - The total Time to Cook.
   - Nutritional Info (Calories, Protein, Carbs, Fats).

Return your response as a clean JSON object. Make the recipes sound delicious and easy to follow. If the user provides very few or "none" ingredients, be creative and suggest recipes that fit their other preferences.`,
});

const suggestRecipesFlow = ai.defineFlow(
  {
    name: 'suggestRecipesFlow',
    inputSchema: SuggestRecipesInputSchema,
    outputSchema: SuggestRecipesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
