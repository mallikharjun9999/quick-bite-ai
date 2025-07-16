
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Loader2, Soup, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getRecipeSuggestions, SuggestRecipesOutput, SuggestRecipesInput } from "@/ai/flows/suggest-recipes";
import { RecipeCard, RecipeCardSkeleton } from "@/components/recipe-card";

const db = getFirestore(app);

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [recipes, setRecipes] = useState<SuggestRecipesOutput | null>(null);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIngredients(data.ingredients || []);
        setRecipes(data.recipes || null);
      }
      setIsSyncing(false);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user || isSyncing) return;
    const userDocRef = doc(db, "users", user.uid);
    // Debounce this call if it becomes too frequent
    setDoc(userDocRef, { ingredients, recipes }, { merge: true });
  }, [ingredients, recipes, user, isSyncing]);

  const handleAddIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter((ing) => ing !== ingredientToRemove));
  };

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) {
      toast({
        variant: "destructive",
        title: "No Ingredients",
        description: "Please add some ingredients first.",
      });
      return;
    }
    setIsLoadingRecipes(true);
    setRecipes(null);
    try {
      const input: SuggestRecipesInput = {
        availableIngredients: ingredients.join(", "),
        mealType: "Any",
        dietaryPreference: "None",
        allergies: "None",
        cookingTimePreference: "Any",
        goal: "A delicious meal"
      };
      const result = await getRecipeSuggestions(input);
      setRecipes(result);
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <aside className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Your Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="e.g., Chicken, Tomato"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
              />
              <Button onClick={handleAddIngredient}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {ingredients.map((ing) => (
                <div key={ing} className="flex items-center gap-1 bg-secondary pl-3 pr-1 py-1 rounded-full text-sm">
                  {ing}
                  <button onClick={() => handleRemoveIngredient(ing)} className="bg-muted hover:bg-muted/80 rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
             {ingredients.length > 0 && (
                <Button onClick={handleGenerateRecipes} className="w-full" disabled={isLoadingRecipes}>
                  {isLoadingRecipes ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Recipes
                </Button>
              )}
          </CardContent>
        </Card>
      </aside>
      <section className="lg:col-span-2">
        <div className="space-y-6">
          {isLoadingRecipes && (
              <>
                <h2 className="text-2xl font-bold font-headline animate-pulse">Finding delicious recipes...</h2>
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
                <p className="text-muted-foreground max-w-sm">Add your ingredients and click &quot;Generate Recipes&quot; to see what you can make!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
