
"use client";

import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query, where, type Timestamp } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, User, Users, ClipboardList, Utensils } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const db = getFirestore(app);

interface UserData {
  id: string;
  name: string;
  email: string;
  signupDate: Date | null;
}

interface RecipeSearch {
  id: string;
  userId: string;
  userInput: {
    mealType: string;
    dietaryPreference: string;
    allergies: string;
    availableIngredients: string;
    cookingTimePreference: string;
  };
  createdAt: Date | null;
  recipeCount: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searches, setSearches] = useState<RecipeSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          email: doc.data().email,
          signupDate: (doc.data().signupDate as Timestamp)?.toDate() || null,
        }));
        setUsers(usersList);

        // Fetch all recipe searches
        const searchesSnapshot = await getDocs(collection(db, "recipe_searches"));
        const searchesList = searchesSnapshot.docs.map(doc => ({
          id: doc.id,
          userId: doc.data().userId,
          userInput: doc.data().userInput,
          createdAt: (doc.data().createdAt as Timestamp)?.toDate() || null,
          recipeCount: doc.data().generatedRecipes?.length || 0,
        }));
        setSearches(searchesList);

      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUserById = (id: string) => users.find(u => u.id === id);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{searches.length}</div>
            <p className="text-xs text-muted-foreground">Recipe searches made</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Recipes/Search</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {searches.length > 0
                ? (searches.reduce((acc, s) => acc + s.recipeCount, 0) / searches.length).toFixed(1)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Average recipes generated</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>A list of all registered users.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {users.map((user, index) => (
                  <div key={user.id}>
                    <div className="flex items-start gap-4">
                       <div className="bg-secondary p-3 rounded-full">
                         <User className="h-5 w-5 text-secondary-foreground" />
                       </div>
                       <div className="flex-1">
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined: {user.signupDate ? user.signupDate.toLocaleDateString() : "N/A"}
                          </p>
                       </div>
                    </div>
                    {index < users.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Searches */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Recipe Searches</CardTitle>
            <CardDescription>Latest recipe generation activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {searches.sort((a,b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)).map((search, index) => (
                  <div key={search.id}>
                    <div className="flex items-start gap-4">
                       <div className="bg-secondary p-3 rounded-full">
                          <Utensils className="h-5 w-5 text-secondary-foreground" />
                       </div>
                       <div className="flex-1 text-sm">
                          <p className="font-semibold">
                            {getUserById(search.userId)?.name || "Unknown User"}
                          </p>
                          <p className="text-muted-foreground text-xs">
                             {search.createdAt ? search.createdAt.toLocaleString() : "N/A"}
                          </p>
                          <div className="mt-2 p-3 bg-muted/50 rounded-md text-xs space-y-1">
                            <p><b>Ingredients:</b> {search.userInput.availableIngredients}</p>
                            <p><b>Meal:</b> {search.userInput.mealType} | <b>Diet:</b> {search.userInput.dietaryPreference}</p>
                             <p><b>Generated:</b> {search.recipeCount} recipes</p>
                          </div>
                       </div>
                    </div>
                    {index < searches.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
