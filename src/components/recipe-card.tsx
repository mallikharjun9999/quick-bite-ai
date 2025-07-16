"use client";

import { useState } from "react";
import { type SuggestRecipesOutput } from "@/ai/flows/suggest-recipes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heart, Clock, Flame, Dna, Wheat, Droplet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Recipe = SuggestRecipesOutput["recipes"][0];

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const nutritionItems = [
    { icon: Flame, label: "Calories", value: recipe.nutrition.calories },
    { icon: Dna, label: "Protein", value: recipe.nutrition.protein },
    { icon: Wheat, label: "Carbs", value: recipe.nutrition.carbs },
    { icon: Droplet, label: "Fats", value: recipe.nutrition.fats },
  ];

  const formattedInstructions = recipe.instructions
    .split(/\d+\.\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const formattedIngredients = recipe.ingredients
    .split(/, | and /)
    .map(s => s.trim())
    .filter(s => s.length > 0);


  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <div>
                <CardTitle className="text-2xl font-headline text-foreground">{recipe.title}</CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.time_to_cook}</span>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
                aria-label="Save to favorites"
                className="shrink-0 group"
            >
                <Heart className={cn(
                    "w-6 h-6 transition-all text-muted-foreground group-hover:text-red-500",
                    isFavorite && "fill-red-500 text-red-500"
                )} />
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="ingredients" className="w-full">
          <AccordionItem value="ingredients">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">Ingredients</AccordionTrigger>
            <AccordionContent>
                <ul className="list-disc list-inside space-y-1 text-base pl-2 text-foreground/80">
                    {formattedIngredients.map((item, i) => <li key={i}>{item.charAt(0).toUpperCase() + item.slice(1)}</li>)}
                </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="instructions" className="border-b-0">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">Instructions</AccordionTrigger>
            <AccordionContent>
                <ol className="list-decimal list-inside space-y-3 text-base pl-2 text-foreground/80">
                    {formattedInstructions.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <div className="bg-secondary p-4">
        <h4 className="font-semibold mb-4 text-md">Nutrition Info</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4 w-full">
          {nutritionItems.map(item => (
            item.value && <div key={item.label} className="flex items-center gap-2 text-sm">
                <div className="bg-primary/20 p-2 rounded-full">
                    <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <p className="font-bold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function RecipeCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
             <div className="p-4 bg-secondary">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                    <div className="flex items-center gap-2"><Skeleton className="w-10 h-10 rounded-full" /><div className="space-y-1"><Skeleton className="h-4 w-12" /><Skeleton className="h-3 w-8" /></div></div>
                    <div className="flex items-center gap-2"><Skeleton className="w-10 h-10 rounded-full" /><div className="space-y-1"><Skeleton className="h-4 w-12" /><Skeleton className="h-3 w-8" /></div></div>
                    <div className="flex items-center gap-2"><Skeleton className="w-10 h-10 rounded-full" /><div className="space-y-1"><Skeleton className="h-4 w-12" /><Skeleton className="h-3 w-8" /></div></div>
                    <div className="flex items-center gap-2"><Skeleton className="w-10 h-10 rounded-full" /><div className="space-y-1"><Skeleton className="h-4 w-12" /><Skeleton className="h-3 w-8" /></div></div>
                </div>
            </div>
        </Card>
    )
}
