import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LogoutButton } from "@/components/logout-button";

async function SecurityNav() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
        redirect("/auth/login");
    }

    // Check role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, username")
        .eq("user_id", data.user.id)
        .single();

    if (!profile || profile.role !== "security") {
        redirect("/protected");
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
            <div className="w-full max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-sm">Security Panel</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:block">
                        {profile?.username || data.user.email}
                    </span>
                    <ThemeSwitcher />
                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
}

function NavFallback() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
            <div className="w-full max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-sm">Security Panel</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-20 h-4 bg-muted/50 rounded animate-pulse" />
                    <ThemeSwitcher />
                </div>
            </div>
        </nav>
    );
}

export default function SecurityLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Suspense fallback={<NavFallback />}>
                <SecurityNav />
            </Suspense>
            <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
                {children}
            </div>
        </main>
    );
}
