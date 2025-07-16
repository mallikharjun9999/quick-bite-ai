"use client";

import { useState } from "react";
import { RecipeForm } from "@/components/recipe-form";
import { RecipeList } from "@/components/recipe-list";
import { type SuggestRecipesOutput } from "@/ai/flows/suggest-recipes";
import { Leaf } from "lucide-react";

export default function Home() {
  const [recipes, setRecipes] = useState<SuggestRecipesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-headline text-foreground">
            Veggie Delights
          </h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-2 font-headline">Find Your Next Meal</h2>
                <p className="text-muted-foreground mb-6">
                  Fill in your preferences and let our AI chef suggest some delicious recipes for you!
                </p>
                <RecipeForm
                  isLoading={isLoading}
                  setRecipes={setRecipes}
                  setIsLoading={setIsLoading}
                  setError={setError}
                />
              </div>
            </div>
          </aside>
          <section className="lg:col-span-2">
            <RecipeList recipes={recipes} isLoading={isLoading} error={error} />
          </section>
        </div>
      </main>

      <footer className="bg-card border-t py-6 mt-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Veggie Delights. Powered by GenAI.</p>
          </div>
      </footer>
    </div>
  );
}
