
'use server';

import { suggestRecipes, type SuggestRecipesInput } from "@/ai/flows/suggest-recipes";

export async function getRecipeSuggestions(input: SuggestRecipesInput) {
  try {
    const result = await suggestRecipes(input);
    if (!result || !result.recipes || result.recipes.length === 0) {
      throw new Error("We couldn't find any recipes matching your criteria. Please try being less specific.");
    }
    return result;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    // Re-throwing a more generic error to the client
    throw new Error("Failed to generate recipe suggestions. The AI chef might be busy. Please try again later.");
  }
}
