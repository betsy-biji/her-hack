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
        const { orderTrackingId, expectedDate } = body;

        if (!orderTrackingId || !expectedDate) {
            return NextResponse.json(
                { error: "Order tracking ID and expected date are required" },
                { status: 400 }
            );
        }

        // Check if this tracking ID already exists for this user with status 'expected'
        const { data: existing } = await supabase
            .from("orders")
            .select("id")
            .eq("user_id", authData.user.id)
            .eq("order_tracking_id", orderTrackingId)
            .eq("status", "expected")
            .single();

        if (existing) {
            return NextResponse.json(
                { error: "You already have an expected order with this tracking ID" },
                { status: 409 }
            );
        }

        const { data, error } = await supabase
            .from("orders")
            .insert({
                user_id: authData.user.id,
                order_tracking_id: orderTrackingId,
                expected_date: expectedDate,
                status: "expected",
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating order:", error);
            return NextResponse.json(
                { error: "Failed to create order" },
                { status: 500 }
            );
        }

        return NextResponse.json({ order: data }, { status: 201 });
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
