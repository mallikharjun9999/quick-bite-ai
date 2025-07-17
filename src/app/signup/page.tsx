
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChefHat, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FirebaseError } from "firebase/app";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(name, email, password);
      toast({
        title: "Account Created!",
        description: "Welcome to QuickBite AI!",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to sign up:", error);
      let description = "An unknown error occurred. Please try again.";
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/email-already-in-use') {
        description = "This email is already registered. Please login instead.";
      } else if (firebaseError.code === 'auth/weak-password') {
        description = "Your password is too weak. Please choose a stronger password.";
      }
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://img.freepik.com/free-photo/vegetables-set-left-black-slate_1220-685.jpg?w=360')" }}
    >
       <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
       <div className="absolute top-4 right-4 z-10">
        <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
            <Link href="/">Home</Link>
        </Button>
      </div>
      <Card className="mx-auto max-w-sm w-full z-10 bg-card/90 backdrop-blur-md border-black/20 text-foreground">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <ChefHat className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl text-foreground">QuickBite AI</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
                Create an account to start generating recipes.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="bg-background/80"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-background/80"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-background/80"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create an account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline text-primary font-semibold">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
