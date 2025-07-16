
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Soup } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type SuggestRecipesOutput, type SuggestRecipesInput } from "@/ai/flows/suggest-recipes";
import { getRecipeSuggestions } from "@/app/actions";
import { RecipeCard, RecipeCardSkeleton } from "@/components/recipe-card";
import { RecipeForm, type RecipeFormValues } from "@/components/recipe-form";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "@/lib/firebase";

const db = getFirestore(app);

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [recipes, setRecipes] = useState<SuggestRecipesOutput | null>(null);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);

  const handleGenerateRecipes = async (values: RecipeFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Logged In",
        description: "You must be logged in to generate recipes.",
      });
      return;
    }

    if (values.availableIngredients.length === 0) {
       toast({
        variant: "destructive",
        title: "No Ingredients",
        description: "Please add some ingredients or type 'none'.",
      });
      return;
    }
    
    setIsLoadingRecipes(true);
    setRecipes(null);

    try {
      const input: SuggestRecipesInput = {
        availableIngredients: values.availableIngredients.join(", ") || "None",
        mealType: values.mealType,
        dietaryPreference: values.dietaryPreference,
        allergies: values.allergies || "None",
        cookingTimePreference: values.cookingTimePreference,
        goal: "A delicious meal that fits my preferences."
      };
      
      const result = await getRecipeSuggestions(input);
      setRecipes(result);

      // Save the search and results to Firestore
      await addDoc(collection(db, "recipe_searches"), {
        userId: user.uid,
        userInput: input,
        generatedRecipes: result.recipes,
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: "Recipes Generated!",
        description: "Your delicious suggestions are ready.",
      });

    } catch (error) {
       toast({
        variant: "destructive",
        title: "Failed to get recipes",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <aside className="lg:col-span-1 lg:sticky top-20">
        <Card>
          <CardHeader>
            <CardTitle>Find a Recipe</CardTitle>
            <CardDescription>Fill out your preferences and see what you can make!</CardDescription>
          </CardHeader>
          <CardContent>
            <RecipeForm 
              onSubmit={handleGenerateRecipes}
              isLoading={isLoadingRecipes}
            />
          </CardContent>
        </Card>
      </aside>
      <section className="lg:col-span-2">
        <div className="space-y-6">
          {isLoadingRecipes && (
              <>
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary"/>
                    <h2 className="text-2xl font-bold font-headline animate-pulse">Finding delicious recipes...</h2>
                </div>
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
              </>
          )}

          { !isLoadingRecipes && recipes && recipes.recipes.length > 0 && (
              <>
                <h2 className="text-3xl font-bold font-headline">Your Delicious Suggestions</h2>
                {recipes.recipes.map((recipe, index) => (
                  <RecipeCard key={index} recipe={recipe} />
                ))}
              </>
          )}

          {!isLoadingRecipes && (!recipes || recipes.recipes.length === 0) && (
             <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg min-h-[400px] h-full bg-card">
                <Soup className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to cook?</h3>
                <p className="text-muted-foreground max-w-sm">Fill out the form to see what you can make!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
