import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Security guard marks a verified order as collected (package handed over)
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check that the user has 'security' role
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("user_id", authData.user.id)
            .single();

        if (!profile || profile.role !== "security") {
            return NextResponse.json({ error: "Forbidden: security role required" }, { status: 403 });
        }

        const body = await request.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json(
                { error: "Order ID is required" },
                { status: 400 }
            );
        }

        // Verify the order exists and is in 'verified' status
        const { data: order, error: findError } = await supabase
            .from("orders")
            .select("id, status")
            .eq("id", orderId)
            .eq("status", "verified")
            .single();

        if (findError || !order) {
            return NextResponse.json(
                { error: "No verified order found with this ID" },
                { status: 404 }
            );
        }

        // Mark as collected
        const now = new Date().toISOString();
        const { data: updatedOrder, error: updateError } = await supabase
            .from("orders")
            .update({
                status: "collected",
                collected_at: now,
            })
            .eq("id", orderId)
            .select()
            .single();

        if (updateError) {
            console.error("Error collecting order:", updateError);
            return NextResponse.json(
                { error: "Failed to mark order as collected" },
                { status: 500 }
            );
        }

        return NextResponse.json({ order: updatedOrder });
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
