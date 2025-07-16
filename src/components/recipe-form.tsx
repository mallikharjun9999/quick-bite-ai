"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRecipeSuggestions } from "@/app/actions";
import { type SuggestRecipesOutput } from "@/ai/flows/suggest-recipes";
import type { Dispatch, SetStateAction } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  mealType: z.string({ required_error: "Please select a meal type." }),
  dietaryPreference: z.string().min(1, "Please enter your dietary preference."),
  allergies: z.string().optional(),
  availableIngredients: z.string().optional(),
  cookingTimePreference: z.string({ required_error: "Please select a cooking time." }),
  goal: z.string().min(1, "Please enter your goal."),
});

type RecipeFormProps = {
  setRecipes: Dispatch<SetStateAction<SuggestRecipesOutput | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
  isLoading: boolean;
};

export function RecipeForm({ setRecipes, setIsLoading, setError, isLoading }: RecipeFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mealType: "Lunch",
      dietaryPreference: "Vegetarian",
      allergies: "Garlic, Mushroom",
      availableIngredients: "Paneer, Tomato, Capsicum, Onion",
      cookingTimePreference: "Under 30 minutes",
      goal: "Healthy, balanced meal",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setRecipes(null);
    try {
      const result = await getRecipeSuggestions(values);
      setRecipes(result);
      toast({
        title: "Success!",
        description: "We found some delicious recipes for you.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setError(errorMessage);
       toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

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
                    <SelectValue placeholder="Select a meal type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Breakfast">Breakfast</SelectItem>
                  <SelectItem value="Lunch">Lunch</SelectItem>
                  <SelectItem value="Dinner">Dinner</SelectItem>
                  <SelectItem value="Snacks">Snacks</SelectItem>
                  <SelectItem value="Brunch">Brunch</SelectItem>
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
              <FormControl>
                <Input placeholder="e.g., Vegetarian, Vegan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies or Dislikes</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Peanuts, Soy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="availableIngredients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredients at Home</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Tomato, Onion, Cheese" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cookingTimePreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Cooking Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a cooking time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Under 15 minutes">Under 15 mins</SelectItem>
                  <SelectItem value="Under 30 minutes">Under 30 mins</SelectItem>
                  <SelectItem value="Under 1 hour">Under 1 hour</SelectItem>
                  <SelectItem value="More than 1 hour">1 hour+</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Goal</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Weight loss, High protein" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading || form.formState.isSubmitting} className="w-full !mt-6">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Finding Recipes...' : 'Suggest Recipes'}
        </Button>
      </form>
    </Form>
  );
}
