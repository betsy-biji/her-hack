import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Security guard polls this endpoint to see newly verified orders
export async function GET() {
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

        // Fetch all verified orders with student profile info
        const { data: orders, error } = await supabase
            .from("orders")
            .select(`
                id,
                order_tracking_id,
                expected_date,
                verified_at,
                status,
                user_id
            `)
            .eq("status", "verified")
            .order("verified_at", { ascending: false });

        if (error) {
            console.error("Error fetching verified orders:", error);
            return NextResponse.json(
                { error: "Failed to fetch orders" },
                { status: 500 }
            );
        }

        // Fetch profile info for each order's user
        const enrichedOrders = await Promise.all(
            (orders || []).map(async (order) => {
                const { data: studentProfile } = await supabase
                    .from("profiles")
                    .select("username, room_number")
                    .eq("user_id", order.user_id)
                    .single();

                return {
                    id: order.id,
                    orderTrackingId: order.order_tracking_id,
                    expectedDate: order.expected_date,
                    verifiedAt: order.verified_at,
                    studentName: studentProfile?.username || "Unknown",
                    roomNumber: studentProfile?.room_number || "N/A",
                };
            })
        );

        return NextResponse.json({ orders: enrichedOrders });
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
