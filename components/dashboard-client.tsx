"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Package,
    PackageCheck,
    ArrowRight,
    Clock,
    CheckCircle2,
} from "lucide-react";

interface Order {
    id: string;
    order_tracking_id: string;
    expected_date: string;
    status: string;
    created_at: string;
    retrieved_at: string | null;
}

interface DashboardClientProps {
    username: string;
    roomNumber: string;
}

export function DashboardClient({ username, roomNumber }: DashboardClientProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            setOrders(data.orders || []);
        } catch {
            console.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const expectedCount = orders.filter((o) => o.status === "expected").length;
    const retrievedCount = orders.filter((o) => o.status === "retrieved").length;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold">
                    Hi, {username.split(" ")[0]}! 👋
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Room {roomNumber} • Manage your hostel packages
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="border-border/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span className="text-xs text-muted-foreground">Expected</span>
                        </div>
                        <p className="text-2xl font-bold mt-1">{expectedCount}</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs text-muted-foreground">Retrieved</span>
                        </div>
                        <p className="text-2xl font-bold mt-1">{retrievedCount}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Action Cards */}
            <div className="space-y-3">
                <Link href="/protected/expect" className="block group">
                    <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex items-center gap-4 p-4">
                                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                                    <Package className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-base">Expect a Package</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Register an incoming delivery
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/protected/retrieve" className="block group">
                    <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex items-center gap-4 p-4">
                                <div className="w-14 h-14 rounded-xl gradient-success flex items-center justify-center shrink-0 shadow-md shadow-green-500/20 group-hover:scale-105 transition-transform">
                                    <PackageCheck className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-base">Retrieve a Package</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Verify & collect your delivery
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Recent Orders */}
            <div>
                <h2 className="font-semibold text-sm text-muted-foreground mb-3">
                    Recent Orders
                </h2>
                {loading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-16 rounded-xl bg-muted/50 animate-pulse"
                            />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <Card className="border-border/50 border-dashed">
                        <CardContent className="py-8 text-center">
                            <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                                No orders yet. Start by expecting a package!
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {orders.slice(0, 10).map((order) => (
                            <Card
                                key={order.id}
                                className="border-border/50 animate-slide-up"
                            >
                                <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${order.status === "expected"
                                                        ? "bg-amber-100 dark:bg-amber-950/30"
                                                        : "bg-emerald-100 dark:bg-emerald-950/30"
                                                    }`}
                                            >
                                                {order.status === "expected" ? (
                                                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                                ) : (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium font-mono">
                                                    {order.order_tracking_id}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    Expected:{" "}
                                                    {new Date(order.expected_date).toLocaleDateString(
                                                        "en-IN",
                                                        { day: "numeric", month: "short" }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${order.status === "expected"
                                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                                                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                                }`}
                                        >
                                            {order.status === "expected" ? "Pending" : "Retrieved"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
