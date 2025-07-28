"use client";

import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query, where, type Timestamp } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, User, Users, ClipboardList, Utensils, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSearches, setLoadingSearches] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "Unknown User", // Added fallback
          email: doc.data().email || "N/A",        // Added fallback
          signupDate: (doc.data().signupDate as Timestamp)?.toDate() || null,
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch searches when a user is selected
  useEffect(() => {
    const fetchSearchesForUser = async () => {
      if (!selectedUser) {
        setSearches([]);
        return;
      }

      setLoadingSearches(true);
      try {
        const q = query(collection(db, "recipe_searches"), where("userId", "==", selectedUser.id));
        const searchesSnapshot = await getDocs(q);
        const searchesList = searchesSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            userId: doc.data().userId,
            userInput: doc.data().userInput,
            createdAt: (doc.data().createdAt as Timestamp)?.toDate() || null,
            recipeCount: doc.data().generatedRecipes?.length || 0,
          }))
          .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)); // Safe sorting
        setSearches(searchesList);
      } catch (error) {
        console.error("Error fetching searches:", error);
      } finally {
        setLoadingSearches(false);
      }
    };

    fetchSearchesForUser();
  }, [selectedUser]);

  const totalSearches = searches.length;
  const avgRecipesPerSearch =
    totalSearches > 0
      ? (searches.reduce((acc, s) => acc + s.recipeCount, 0) / totalSearches).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedUserName = selectedUser?.name?.split(" ")[0];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

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
            <CardTitle className="text-sm font-medium">
              {selectedUserName ? `${selectedUserName}'s Searches` : "Total Searches"}
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingSearches ? <Loader2 className="h-6 w-6 animate-spin" /> : totalSearches}
            </div>
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
              {loadingSearches ? <Loader2 className="h-6 w-6 animate-spin" /> : avgRecipesPerSearch}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedUserName ? `For ${selectedUserName}` : "For all searches"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Select a user to view their activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {users.map((user, index) => (
                  <div key={user.id}>
                    <button
                      className={cn(
                        "flex items-start gap-4 w-full text-left p-3 rounded-lg transition-colors",
                        selectedUser?.id === user.id ? "bg-accent" : "hover:bg-accent/50"
                      )}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="bg-secondary p-3 rounded-full">
                        <User className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{user.name || "Unknown User"}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined: {user.signupDate ? user.signupDate.toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </button>
                    {index < users.length - 1 && <Separator className="my-1" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Searches */}
        <Card>
          <CardHeader>
            <CardTitle>Recipe Search Activity</CardTitle>
            <CardDescription>
              {selectedUser
                ? `Showing recent searches for ${selectedUser.name || selectedUser.email}.`
                : "Select a user to see their searches."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {loadingSearches ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !selectedUser ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Please select a user from the list to view their search history.
                  </p>
                </div>
              ) : searches.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {selectedUser.name || "This user"} hasn't made any recipe searches yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searches.map((search, index) => (
                    <div key={search.id}>
                      <div className="flex items-start gap-4">
                        <div className="bg-secondary p-3 rounded-full">
                          <Utensils className="h-5 w-5 text-secondary-foreground" />
                        </div>
                        <div className="flex-1 text-sm">
                          <p className="font-semibold">{selectedUser.name || selectedUser.email}</p>
                          <p className="text-muted-foreground text-xs">
                            {search.createdAt ? search.createdAt.toLocaleString() : "N/A"}
                          </p>
                          <div className="mt-2 p-3 bg-muted/50 rounded-md text-xs space-y-1">
                            <p>
                              <b>Ingredients:</b> {search.userInput.availableIngredients}
                            </p>
                            <p>
                              <b>Meal:</b> {search.userInput.mealType} | <b>Diet:</b>{" "}
                              {search.userInput.dietaryPreference}
                            </p>
                            <p>
                              <b>Generated:</b> {search.recipeCount} recipes
                            </p>
                          </div>
                        </div>
                      </div>
                      {index < searches.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
