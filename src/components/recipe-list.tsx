import { type SuggestRecipesOutput } from "@/ai/flows/suggest-recipes";
import { RecipeCard, RecipeCardSkeleton } from "@/components/recipe-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Soup } from "lucide-react";

type RecipeListProps = {
  recipes: SuggestRecipesOutput | null;
  isLoading: boolean;
  error: string | null;
};

export function RecipeList({ recipes, isLoading, error }: RecipeListProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-headline animate-pulse">Finding delicious recipes...</h2>
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (!recipes) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg min-h-[400px] h-full bg-card">
            <Soup className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ready to cook?</h3>
            <p className="text-muted-foreground max-w-sm">Fill out the form to get personalized recipe suggestions from our AI chef.</p>
        </div>
    );
  }

  if (recipes.recipes.length === 0) {
    return <p>No recipes found. Please try adjusting your preferences.</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-headline">Your Delicious Suggestions</h2>
      {recipes.recipes.map((recipe, index) => (
        <RecipeCard key={index} recipe={recipe} />
      ))}
    </div>
  );
}
