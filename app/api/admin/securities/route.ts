import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Helper to verify admin role
async function verifyAdmin(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", userId)
        .single();
    return profile?.role === "admin";
}

// GET - List all security guards
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!(await verifyAdmin(supabase, authData.user.id))) {
            return NextResponse.json({ error: "Forbidden: admin role required" }, { status: 403 });
        }

        const { data: securities, error } = await supabase
            .from("profiles")
            .select("user_id, username, room_number, role, created_at")
            .eq("role", "security")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching securities:", error);
            return NextResponse.json({ error: "Failed to fetch security accounts" }, { status: 500 });
        }

        return NextResponse.json({ securities: securities || [] });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST - Promote a user to security role
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!(await verifyAdmin(supabase, authData.user.id))) {
            return NextResponse.json({ error: "Forbidden: admin role required" }, { status: 403 });
        }

        const body = await request.json();
        const { username } = body;

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        // Find the user by username
        const { data: targetProfile, error: findError } = await supabase
            .from("profiles")
            .select("user_id, username, role")
            .eq("username", username.trim())
            .single();

        if (findError || !targetProfile) {
            return NextResponse.json(
                { error: `No user found with username "${username}"` },
                { status: 404 }
            );
        }

        if (targetProfile.role === "security") {
            return NextResponse.json(
                { error: `${username} is already a security guard` },
                { status: 409 }
            );
        }

        if (targetProfile.role === "admin") {
            return NextResponse.json(
                { error: "Cannot change an admin's role" },
                { status: 403 }
            );
        }

        // Promote to security
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ role: "security" })
            .eq("user_id", targetProfile.user_id);

        if (updateError) {
            console.error("Error promoting user:", updateError);
            return NextResponse.json({ error: "Failed to promote user" }, { status: 500 });
        }

        return NextResponse.json({
            message: `${username} has been promoted to security guard`,
            profile: { ...targetProfile, role: "security" },
        });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE - Revoke security role (demote back to user)
export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!(await verifyAdmin(supabase, authData.user.id))) {
            return NextResponse.json({ error: "Forbidden: admin role required" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Verify target is actually a security guard
        const { data: targetProfile } = await supabase
            .from("profiles")
            .select("role, username")
            .eq("user_id", userId)
            .single();

        if (!targetProfile || targetProfile.role !== "security") {
            return NextResponse.json(
                { error: "This user is not a security guard" },
                { status: 404 }
            );
        }

        // Demote to user
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ role: "user" })
            .eq("user_id", userId);

        if (updateError) {
            console.error("Error demoting user:", updateError);
            return NextResponse.json({ error: "Failed to revoke security role" }, { status: 500 });
        }

        return NextResponse.json({
            message: `${targetProfile.username} has been demoted to regular user`,
        });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
