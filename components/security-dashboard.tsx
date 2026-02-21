"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Shield,
    User,
    MapPin,
    Package,
    Clock,
    CheckCircle2,
    Loader2,
    PackageCheck,
} from "lucide-react";

interface VerifiedOrder {
    id: string;
    orderTrackingId: string;
    expectedDate: string;
    verifiedAt: string;
    studentName: string;
    roomNumber: string;
}

export function SecurityDashboard() {
    const [orders, setOrders] = useState<VerifiedOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [collectingId, setCollectingId] = useState<string | null>(null);
    const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set());
    const prevCountRef = useRef(0);

    const fetchVerifiedOrders = useCallback(async () => {
        try {
            const res = await fetch("/api/orders/verified");
            if (!res.ok) return;
            const data = await res.json();
            const newOrders: VerifiedOrder[] = data.orders || [];

            // Play alert if new orders appeared
            if (newOrders.length > prevCountRef.current && prevCountRef.current > 0) {
                // Vibrate on mobile if supported
                if (navigator.vibrate) {
                    navigator.vibrate([200, 100, 200]);
                }
            }
            prevCountRef.current = newOrders.length;

            setOrders(newOrders);
        } catch {
            console.error("Failed to fetch verified orders");
        } finally {
            setLoading(false);
        }
    }, []);

    // Poll every 5 seconds
    useEffect(() => {
        fetchVerifiedOrders();
        const interval = setInterval(fetchVerifiedOrders, 5000);
        return () => clearInterval(interval);
    }, [fetchVerifiedOrders]);

    const handleCollect = async (orderId: string) => {
        setCollectingId(orderId);
        try {
            const res = await fetch("/api/orders/collect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId }),
            });

            if (res.ok) {
                // Animate out, then remove
                setCollectedIds((prev) => new Set(prev).add(orderId));
                setTimeout(() => {
                    setOrders((prev) => prev.filter((o) => o.id !== orderId));
                    setCollectedIds((prev) => {
                        const next = new Set(prev);
                        next.delete(orderId);
                        return next;
                    });
                }, 600);
            }
        } catch {
            console.error("Failed to collect order");
        } finally {
            setCollectingId(null);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Shield className="w-6 h-6 text-amber-500" />
                    Package Verification
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Orders verified by students will appear here in real-time.
                    Hand over the package once you see it.
                </p>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Polling for verified orders...
            </div>

            {/* Orders list */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-28 rounded-xl bg-muted/50 animate-pulse"
                        />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <Card className="border-border/50 border-dashed">
                    <CardContent className="py-12 text-center">
                        <PackageCheck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground font-medium">
                            No pending verifications
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            When a student verifies their package, it will appear here
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => {
                        const isCollected = collectedIds.has(order.id);
                        const isCollecting = collectingId === order.id;
                        const verifiedDate = new Date(order.verifiedAt);

                        return (
                            <Card
                                key={order.id}
                                className={`border-border/50 overflow-hidden transition-all duration-500 ${isCollected
                                        ? "opacity-0 scale-95 -translate-x-4"
                                        : "animate-slide-up"
                                    }`}
                            >
                                <div className="border-l-4 border-amber-500">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-muted-foreground" />
                                                    <span className="font-semibold text-sm">
                                                        {order.studentName}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        Room {order.roomNumber}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-sm font-mono">
                                                        {order.orderTrackingId}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">
                                                        Verified{" "}
                                                        {verifiedDate.toLocaleTimeString("en-IN", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => handleCollect(order.id)}
                                                disabled={isCollecting || isCollected}
                                                className="gradient-success text-white hover:opacity-90 transition-opacity shrink-0"
                                            >
                                                {isCollecting ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : isCollected ? (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                                        Done
                                                    </>
                                                ) : (
                                                    "Hand Over"
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
