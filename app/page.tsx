import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { InstallPrompt } from "@/components/install-prompt";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/protected");
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeSwitcher />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full gradient-primary opacity-10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full gradient-primary opacity-10 blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-md mx-auto animate-fade-in">
          {/* Logo */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <Package className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Hostel Order
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(250,80%,55%)] to-[hsl(310,65%,55%)]">
              Manager
            </span>
          </h1>

          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Secure your packages. No more missing deliveries at the hostel.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full gradient-primary text-white hover:opacity-90 transition-opacity">
              <Link href="/auth/sign-up">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-muted-foreground border-t border-border/50">
        Built for hostel safety 🏠
      </footer>

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </main>
  );
}
