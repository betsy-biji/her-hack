"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Package, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ExpectOrderPage() {
    const [trackingId, setTrackingId] = useState("");
    const [expectedDate, setExpectedDate] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    // Get today's date in YYYY-MM-DD format for the min attribute
    const today = new Date().toISOString().split("T")[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Prevent past dates
        if (expectedDate < today) {
            setError("Expected arrival date cannot be in the past.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/orders/expect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderTrackingId: trackingId.trim(),
                    expectedDate,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to create order");
                return;
            }

            setSuccess(true);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold mb-1">Order Registered!</h2>
                <p className="text-sm text-muted-foreground text-center mb-6">
                    Tracking ID <span className="font-mono font-semibold">{trackingId}</span> has been
                    registered. You&apos;ll be able to retrieve it when it arrives.
                </p>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSuccess(false);
                            setTrackingId("");
                            setExpectedDate("");
                        }}
                    >
                        Add Another
                    </Button>
                    <Button
                        className="gradient-primary text-white hover:opacity-90"
                        onClick={() => router.push("/protected")}
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Back Button */}
            <Link
                href="/protected"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </Link>

            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Expect a Package</CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Register your incoming delivery
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="tracking-id">Order / Tracking ID</Label>
                            <Input
                                id="tracking-id"
                                type="text"
                                placeholder="e.g. AWB123456789 or OD40912345"
                                required
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                                className="font-mono"
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Enter the tracking number from your order confirmation
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="expected-date">Expected Arrival Date</Label>
                            <Input
                                id="expected-date"
                                type="date"
                                required
                                min={today}
                                value={expectedDate}
                                onChange={(e) => setExpectedDate(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 p-2 rounded-md">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
                            disabled={isLoading}
                        >
                            {isLoading ? "Registering..." : "Register Expected Package"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="text-center text-xs text-muted-foreground p-4">
                <p>
                    💡 Tip: Register your order as soon as you place it online so the
                    tracking ID is on record before the package arrives.
                </p>
            </div>
        </div>
    );
}
