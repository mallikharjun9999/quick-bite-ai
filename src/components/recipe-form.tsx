
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, X, Loader2, Sparkles } from "lucide-react";
import { Textarea } from "./ui/textarea";

const recipeFormSchema = z.object({
  mealType: z.string().min(1, "Please select a meal type."),
  dietaryPreference: z.string().min(1, "Please select a dietary preference."),
  allergies: z.string().optional(),
  availableIngredients: z.array(z.string()).nonempty("Please add at least one ingredient or type 'none'."),
  cookingTimePreference: z.string().min(1, "Please select a cooking time."),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;

interface RecipeFormProps {
  onSubmit: (values: RecipeFormValues) => void;
  isLoading: boolean;
}

export function RecipeForm({ onSubmit, isLoading }: RecipeFormProps) {
  const [newIngredient, setNewIngredient] = useState("");

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      mealType: "Lunch",
      dietaryPreference: "Vegetarian",
      allergies: "None",
      availableIngredients: [],
      cookingTimePreference: "30 mins",
    },
  });
  
  const ingredients = form.watch("availableIngredients");

  const handleAddIngredient = () => {
    const trimmedIngredient = newIngredient.trim();
    if (trimmedIngredient) {
      if (trimmedIngredient.toLowerCase() === 'none') {
        form.setValue("availableIngredients", ['none'], { shouldValidate: true });
        setNewIngredient("");
        return;
      }
      
      const currentIngredients = Array.isArray(ingredients) ? ingredients.filter(i => i.toLowerCase() !== 'none') : [];
      if (!currentIngredients.map(i => i.toLowerCase()).includes(trimmedIngredient.toLowerCase())) {
        form.setValue("availableIngredients", [...currentIngredients, trimmedIngredient], { shouldValidate: true });
        setNewIngredient("");
      }
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    if (Array.isArray(ingredients)) {
        form.setValue("availableIngredients", ingredients.filter((ing) => ing !== ingredientToRemove), { shouldValidate: true });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="mealType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="What are you planning for?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Breakfast">Breakfast</SelectItem>
                  <SelectItem value="Lunch">Lunch</SelectItem>
                  <SelectItem value="Dinner">Dinner</SelectItem>
                  <SelectItem value="Snacks">Snacks</SelectItem>
                  <SelectItem value="Brunch">Brunch</SelectItem>
                   <SelectItem value="Any">Any</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dietaryPreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dietary Preference</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Any dietary preferences?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="Vegan">Vegan</SelectItem>
                  <SelectItem value="Non-Veg">Non-Veg</SelectItem>
                  <SelectItem value="Keto">Keto</SelectItem>
                  <SelectItem value="Low-carb">Low-carb</SelectItem>
                  <SelectItem value="High-protein">High-protein</SelectItem>
                  <SelectItem value="Jain">Jain</SelectItem>
                  <SelectItem value="Gluten-Free">Gluten-Free</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies / Dislikes</FormLabel>
              <FormControl>
                <Textarea placeholder='e.g., Peanuts, Shellfish, or "None"' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="availableIngredients"
          render={() => (
            <FormItem>
              <FormLabel>Available Ingredients at Home</FormLabel>
              <div className="flex gap-2">
                <Input
                    placeholder='e.g., Chicken, Tomato, or "None"'
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddIngredient();
                        }
                    }}
                />
                <Button type="button" onClick={handleAddIngredient}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 min-h-[2.5rem]">
                {Array.isArray(ingredients) && ingredients.map((ing) => (
                  <div key={ing} className="flex items-center gap-1 bg-secondary pl-3 pr-1 py-1 rounded-full text-sm">
                    {ing}
                    <button type="button" onClick={() => handleRemoveIngredient(ing)} className="bg-muted hover:bg-muted/80 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cookingTimePreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Cooking Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="How much time do you have?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="15 mins">15 mins</SelectItem>
                  <SelectItem value="30 mins">30 mins</SelectItem>
                  <SelectItem value="45 mins">45 mins</SelectItem>
                  <SelectItem value="60 mins">60 mins</SelectItem>
                  <SelectItem value="Any">Any</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Find Recipes
        </Button>
      </form>
    </Form>
  );
}
