import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { orderTrackingId } = body;

        if (!orderTrackingId) {
            return NextResponse.json(
                { error: "Order tracking ID is required" },
                { status: 400 }
            );
        }

        // Check if the order exists AND belongs to this user AND is in 'expected' status
        const { data: order, error: findError } = await supabase
            .from("orders")
            .select("*")
            .eq("order_tracking_id", orderTrackingId)
            .eq("user_id", authData.user.id)
            .eq("status", "expected")
            .single();

        if (findError || !order) {
            return NextResponse.json(
                {
                    error:
                        "No expected order found with this tracking ID for your account. Either the order doesn't exist, has already been retrieved, or belongs to another user.",
                },
                { status: 404 }
            );
        }

        // Update order status to retrieved
        const now = new Date().toISOString();
        const { data: updatedOrder, error: updateError } = await supabase
            .from("orders")
            .update({
                status: "retrieved",
                retrieved_at: now,
            })
            .eq("id", order.id)
            .select()
            .single();

        if (updateError) {
            console.error("Error updating order:", updateError);
            return NextResponse.json(
                { error: "Failed to update order status" },
                { status: 500 }
            );
        }

        // Fetch user profile for the slip
        const { data: profile } = await supabase
            .from("profiles")
            .select("username, room_number")
            .eq("user_id", authData.user.id)
            .single();

        return NextResponse.json({
            order: updatedOrder,
            profile: profile || { username: authData.user.email, room_number: "N/A" },
        });
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
