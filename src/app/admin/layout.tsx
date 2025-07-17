
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChefHat, Loader2, LogOut, Shield } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://t4.ftcdn.net/jpg/02/32/48/35/360_F_232483527_B9KZazS7LsGexMg0icM1gUNghIcqJDvL.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="bg-card/80 border-b border-black/20 backdrop-blur-sm sticky top-0 z-20">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <Shield className="w-7 h-7 text-primary" />
              <h1 className="text-xl font-bold text-card-foreground">Admin Panel</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost">
                  <Link href="/">Home</Link>
              </Button>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.email} (Admin)
              </span>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
