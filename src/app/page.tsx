
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChefHat, Rocket, Zap } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ChefHat className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">QuickBite AI</h1>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
              Turn Your Ingredients into Delicious Meals, Instantly.
            </h2>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
              Don&apos;t let your ingredients go to waste. With QuickBite AI, discover amazing recipes you can make right now. Just tell us what you have, and our AI chef will do the rest.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </section>

        <section className="bg-card">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-3xl font-bold mb-4">How It Works</h3>
                        <p className="text-muted-foreground mb-8">
                            Creating meals with QuickBite AI is as easy as 1-2-3.
                        </p>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="bg-primary/10 p-2 rounded-full mt-1">
                                    <Zap className="w-6 h-6 text-primary"/>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">List Your Ingredients</h4>
                                    <p className="text-muted-foreground">Tell us what you have in your fridge and pantry. The more you add, the better the suggestions!</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-primary/10 p-2 rounded-full mt-1">
                                    <Rocket className="w-6 h-6 text-primary"/>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Get AI-Powered Recipes</h4>
                                    <p className="text-muted-foreground">Our smart AI analyzes your ingredients and instantly generates creative and tasty recipes just for you.</p>
                                </div>
                            </li>
                             <li className="flex items-start gap-4">
                                <div className="bg-primary/10 p-2 rounded-full mt-1">
                                    <ChefHat className="w-6 h-6 text-primary"/>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Cook and Enjoy</h4>
                                    <p className="text-muted-foreground">Follow the simple, step-by-step instructions to create a delicious meal and impress your family and friends.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <Image
                          src="https://placehold.co/600x400.png"
                          alt="AI generated food collage"
                          data-ai-hint="food collage"
                          width={600}
                          height={400}
                          className="rounded-lg shadow-xl w-full"
                        />
                    </div>
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-card border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} QuickBite AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
