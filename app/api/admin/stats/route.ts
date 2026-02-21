import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check admin role
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("user_id", authData.user.id)
            .single();

        if (!profile || profile.role !== "admin") {
            return NextResponse.json({ error: "Forbidden: admin role required" }, { status: 403 });
        }

        // Count orders by status
        const { data: orders, error } = await supabase
            .from("orders")
            .select("status");

        if (error) {
            return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
        }

        const stats = {
            total: orders?.length || 0,
            expected: orders?.filter(o => o.status === "expected").length || 0,
            verified: orders?.filter(o => o.status === "verified").length || 0,
            collected: orders?.filter(o => o.status === "collected").length || 0,
        };

        // Count users by role
        const { data: profiles } = await supabase
            .from("profiles")
            .select("role");

        const userStats = {
            totalUsers: profiles?.filter(p => p.role === "user").length || 0,
            totalSecurity: profiles?.filter(p => p.role === "security").length || 0,
            totalAdmin: profiles?.filter(p => p.role === "admin").length || 0,
        };

        return NextResponse.json({ stats, userStats });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
