"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, PackageCheck, XCircle } from "lucide-react";
import { VerificationSlip } from "@/components/verification-slip";
import Link from "next/link";

interface RetrievalResult {
    order: {
        order_tracking_id: string;
        expected_date: string;
        retrieved_at: string;
    };
    profile: {
        username: string;
        room_number: string;
    };
}

export default function RetrieveOrderPage() {
    const [trackingId, setTrackingId] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<RetrievalResult | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch("/api/orders/retrieve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderTrackingId: trackingId.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Verification failed");
                return;
            }

            setResult(data);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Show the verification slip if retrieval was successful
    if (result) {
        return (
            <div className="space-y-4 animate-fade-in">
                <Link
                    href="/protected"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <VerificationSlip
                    username={result.profile.username}
                    roomNumber={result.profile.room_number}
                    orderTrackingId={result.order.order_tracking_id}
                    expectedDate={result.order.expected_date}
                    retrievedAt={result.order.retrieved_at}
                />

                <div className="text-center pt-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setResult(null);
                            setTrackingId("");
                        }}
                    >
                        Retrieve Another
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
                        <div className="w-10 h-10 rounded-xl gradient-success flex items-center justify-center">
                            <PackageCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Retrieve a Package</CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Verify ownership & get your approval slip
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
                                placeholder="Enter the tracking ID from the parcel"
                                required
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                                className="font-mono"
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Type the tracking number shown on the package
                            </p>
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded-md">
                                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full gradient-success text-white hover:opacity-90 transition-opacity"
                            disabled={isLoading}
                        >
                            {isLoading ? "Verifying..." : "Verify & Retrieve"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="text-center text-xs text-muted-foreground p-4">
                <p>
                    🔒 Only the person who registered this tracking ID can retrieve the
                    package. Show the approval slip to security.
                </p>
            </div>
        </div>
    );
}
