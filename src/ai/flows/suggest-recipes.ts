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
    .describe('The type of meal (Breakfast, Lunch, Dinner, Snacks, or Brunch).'),
  dietaryPreference: z
    .string()
    .describe(
      'Dietary preference (e.g., Vegetarian, Vegan, Non-Veg, Keto, Jain, High-protein, etc.).'
    ),
  allergies: z
    .string()
    .describe('Any allergies or ingredients the user dislikes.'),
  availableIngredients: z
    .string()
    .describe('Ingredients available at home.'),
  cookingTimePreference: z
    .string()
    .describe('Preferred cooking time (e.g., Under 30 minutes).'),
  goal: z.string().describe('User goal (e.g., Healthy, balanced meal, weight loss, high protein).'),
});

export type SuggestRecipesInput = z.infer<typeof SuggestRecipesInputSchema>;

const SuggestRecipesOutputSchema = z.object({
  recipes: z.array(
    z.object({
      title: z.string().describe('The title of the recipe.'),
      ingredients: z.string().describe('A list of ingredients required for the recipe.'),
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
  prompt: `You are a smart and friendly meal planner and recipe recommender.

Based on the user's preferences, allergies, available ingredients, cooking time and meal type, recommend 3 recipes that match their needs.

Meal type: {{{mealType}}}
Dietary Preference: {{{dietaryPreference}}}
Allergies/Dislikes: {{{allergies}}}
Available Ingredients: {{{availableIngredients}}}
Cooking Time Preference: {{{cookingTimePreference}}}
Goal: {{{goal}}}

Filter recipes accordingly and include:
   - Recipe Title
   - Ingredients
   - Steps/Instructions
   - Time to Cook
   - Nutrition Info (Calories, Protein, Carbs, Fats)

Give your response in clean JSON format with keys: title, ingredients, instructions, time_to_cook, nutrition.`,
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
