"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft,
    PackageCheck,
    XCircle,
    CheckCircle2,
    Loader2,
    Shield,
} from "lucide-react";
import Link from "next/link";

export default function VerifyPackagePage() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [orderStatus, setOrderStatus] = useState<string | null>(null);
    const [verifiedOrderId, setVerifiedOrderId] = useState<string | null>(null);

    // Reset form state when navigating back to this page
    useEffect(() => {
        setVerified(false);
        setOtp("");
        setError(null);
        setOrderStatus(null);
        setVerifiedOrderId(null);
    }, []);

    // Poll for collection status after verification
    useEffect(() => {
        if (!verified || !verifiedOrderId) return;

        const pollStatus = async () => {
            try {
                const res = await fetch("/api/orders");
                if (!res.ok) return;
                const data = await res.json();
                const order = data.orders?.find(
                    (o: { id: string; status: string }) => o.id === verifiedOrderId
                );
                if (order) {
                    setOrderStatus(order.status);
                }
            } catch {
                // Silently ignore polling errors
            }
        };

        pollStatus();
        const interval = setInterval(pollStatus, 3000);
        return () => clearInterval(interval);
    }, [verified, verifiedOrderId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/orders/retrieve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    otp: otp.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Verification failed");
                return;
            }

            setVerified(true);
            setVerifiedOrderId(data.order.id);
            setOrderStatus(data.order.status);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Show waiting screen after successful verification
    if (verified) {
        const isCollected = orderStatus === "collected";

        return (
            <div className="space-y-4 animate-fade-in">
                <Link
                    href="/protected"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <Card className="overflow-hidden border-0 slip-shadow max-w-sm mx-auto">
                    {/* Header */}
                    <div
                        className={`${isCollected ? "gradient-success" : "gradient-primary"
                            } text-white p-6 text-center transition-colors duration-500`}
                    >
                        <div className="flex justify-center mb-3">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                {isCollected ? (
                                    <CheckCircle2 className="w-10 h-10" />
                                ) : (
                                    <Shield className="w-10 h-10 animate-pulse" />
                                )}
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {isCollected ? "COLLECTED" : "VERIFIED"}
                        </h2>
                        <p className="text-sm text-white/80 mt-1">
                            {isCollected
                                ? "Package has been handed over!"
                                : "Waiting for security to hand over your package..."}
                        </p>
                    </div>

                    <CardContent className="p-5">
                        <div className="border-t-2 border-dashed border-border mb-4" />

                        <div className="text-center space-y-3">
                            <p className="text-sm font-mono font-medium">
                                OTP: {otp}
                            </p>

                            {!isCollected && (
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Security is reviewing your request...</span>
                                </div>
                            )}

                            {isCollected && (
                                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                    <p className="text-xs font-medium text-green-700 dark:text-green-400">
                                        ✅ Security has confirmed. You may collect your package.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-[10px] text-muted-foreground">
                                Show this screen to the security guard.
                                <br />
                                Status updates automatically.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {isCollected && (
                    <div className="text-center pt-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setVerified(false);
                                setOtp("");
                                setOrderStatus(null);
                                setVerifiedOrderId(null);
                            }}
                        >
                            Verify Another
                        </Button>
                    </div>
                )}
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
                            <CardTitle className="text-lg">Verify a Package</CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Enter the OTP you received when registering
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="otp-code">Verification OTP</Label>
                            <Input
                                id="otp-code"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="Enter your 6-digit OTP"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="font-mono text-center text-2xl tracking-[0.3em]"
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Enter the OTP code shown when you registered this order
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
                            {isLoading ? "Verifying..." : "Verify & Request Handover"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="text-center text-xs text-muted-foreground p-4">
                <p>
                    🔒 Only the person who registered this order can verify it
                    using their secret OTP. Security will hand it over once verified.
                </p>
            </div>
        </div>
    );
}
