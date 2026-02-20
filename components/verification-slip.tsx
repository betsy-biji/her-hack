"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Package, User, MapPin, CalendarDays, Clock } from "lucide-react";

interface VerificationSlipProps {
    username: string;
    roomNumber: string;
    orderTrackingId: string;
    expectedDate: string;
    retrievedAt: string;
}

export function VerificationSlip({
    username,
    roomNumber,
    orderTrackingId,
    expectedDate,
    retrievedAt,
}: VerificationSlipProps) {

    const retrievedDate = new Date(retrievedAt);

    return (
        <div className="animate-scale-in">
            <Card className="overflow-hidden slip-shadow border-0 max-w-sm mx-auto">
                {/* Header */}
                <div className="gradient-success text-white p-6 text-center">
                    <div className="flex justify-center mb-3">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse-slow">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">APPROVED</h2>
                    <p className="text-sm text-white/80 mt-1">Package Retrieval Verified</p>
                </div>

                {/* Details */}
                <CardContent className="p-5">
                    {/* Dashed separator */}
                    <div className="border-t-2 border-dashed border-border mb-4" />

                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Student Name</p>
                                <p className="font-semibold text-sm">{username}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Room Number</p>
                                <p className="font-semibold text-sm">{roomNumber}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Package className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Order / Tracking ID</p>
                                <p className="font-semibold text-sm font-mono">{orderTrackingId}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <CalendarDays className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Expected Date</p>
                                <p className="font-semibold text-sm">
                                    {new Date(expectedDate).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Clock className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Retrieved At</p>
                                <p className="font-semibold text-sm">
                                    {retrievedDate.toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}{" "}
                                    at{" "}
                                    {retrievedDate.toLocaleTimeString("en-IN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>



                    <div className="mt-4 text-center">
                        <p className="text-[10px] text-muted-foreground">
                            Show this slip to the security guard at the package center.
                            <br />
                            This slip is valid for this retrieval only.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


