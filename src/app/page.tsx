
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChefHat, ShoppingCart, BrainCircuit, Home } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { landingPageConfig } from "@/config/landing-page";

export default function LandingPage() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  const { carouselImages } = landingPageConfig;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 py-4 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2">
          <ChefHat className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">QuickBite AI</h1>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
              <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative py-16 md:py-24">
           <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://placehold.co/1920x1080.png')",
              zIndex: -1,
            }}
            data-ai-hint="food background"
          >
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm"></div>
          </div>
          <div className="container mx-auto px-4 text-center relative">
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
                                    <ShoppingCart className="w-6 h-6 text-primary"/>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">List Your Ingredients</h4>
                                    <p className="text-muted-foreground">Tell us what you have in your fridge and pantry. The more you add, the better the suggestions!</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-primary/10 p-2 rounded-full mt-1">

                                    <BrainCircuit className="w-6 h-6 text-primary"/>
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
                        <Carousel 
                          plugins={[plugin.current]}
                          className="w-full max-w-lg mx-auto"
                          onMouseEnter={plugin.current.stop}
                          onMouseLeave={plugin.current.reset}
                        >
                          <CarouselContent>
                            {carouselImages.map((image, index) => (
                              <CarouselItem key={index}>
                                <Card className="overflow-hidden">
                                  <CardContent className="flex aspect-video items-center justify-center p-0">
                                      <Image
                                        src={image.src}
                                        alt={image.alt}
                                        data-ai-hint={image.hint}
                                        width={600}
                                        height={400}
                                        className="object-cover w-full h-full"
                                      />
                                  </CardContent>
                                </Card>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="hidden sm:flex" />
                          <CarouselNext className="hidden sm:flex" />
                        </Carousel>
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
