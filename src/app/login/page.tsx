
"use client";

import { useState } from "react";
import Link from "next/link";
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: "Login Successful!",
        description: "Welcome back!",
      });
      // The redirect is now handled within the login function in useAuth
    } catch (error: unknown) {
      console.error("Failed to log in:", error);
      let description = "An unknown error occurred. Please try again.";
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/invalid-credential' || firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/user-not-found') {
        description = "Invalid email or password. Please check your credentials and try again.";
      }
       toast({
        variant: "destructive",
        title: "Login Failed",
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
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
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
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
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
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-primary font-semibold">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
