import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { Package } from "lucide-react";

async function ProtectedNav() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Get profile info
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, room_number")
    .eq("user_id", data.user.id)
    .single();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="w-full max-w-lg mx-auto flex items-center justify-between px-4 h-14">
        <Link href="/protected" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm">HOM</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium">{profile?.username || data.user.email}</p>
            <p className="text-[10px] text-muted-foreground">Room {profile?.room_number || "—"}</p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}

function NavFallback() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="w-full max-w-lg mx-auto flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm">HOM</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20 h-4 bg-muted/50 rounded animate-pulse" />
        </div>
      </div>
    </nav>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Suspense fallback={<NavFallback />}>
        <ProtectedNav />
      </Suspense>

      {/* Content */}
      <div className="flex-1 w-full max-w-lg mx-auto px-4 py-6">
        {children}
      </div>
    </main>
  );
}
