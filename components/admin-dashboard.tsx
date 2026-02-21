"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Crown,
    Shield,
    Users,
    Package,
    UserPlus,
    Trash2,
    Loader2,
    CheckCircle2,
    XCircle,
    Clock,
    PackageCheck,
} from "lucide-react";

interface SecurityGuard {
    user_id: string;
    username: string;
    room_number: string;
    created_at: string;
}

interface Stats {
    total: number;
    expected: number;
    verified: number;
    collected: number;
}

interface UserStats {
    totalUsers: number;
    totalSecurity: number;
    totalAdmin: number;
}

export function AdminDashboard() {
    const [securities, setSecurities] = useState<SecurityGuard[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Add security form
    const [newUsername, setNewUsername] = useState("");
    const [addLoading, setAddLoading] = useState(false);
    const [addMessage, setAddMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Remove security
    const [removingId, setRemovingId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const [secRes, statsRes] = await Promise.all([
                fetch("/api/admin/securities"),
                fetch("/api/admin/stats"),
            ]);

            if (secRes.ok) {
                const secData = await secRes.json();
                setSecurities(secData.securities || []);
            }

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData.stats);
                setUserStats(statsData.userStats);
            }
        } catch {
            console.error("Failed to fetch admin data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddSecurity = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddLoading(true);
        setAddMessage(null);

        try {
            const res = await fetch("/api/admin/securities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: newUsername.trim() }),
            });

            const data = await res.json();

            if (res.ok) {
                setAddMessage({ type: "success", text: data.message });
                setNewUsername("");
                fetchData(); // Refresh list
            } else {
                setAddMessage({ type: "error", text: data.error });
            }
        } catch {
            setAddMessage({ type: "error", text: "Something went wrong" });
        } finally {
            setAddLoading(false);
        }
    };

    const handleRemoveSecurity = async (userId: string, username: string) => {
        if (!confirm(`Remove security role from ${username}?`)) return;

        setRemovingId(userId);
        try {
            const res = await fetch(`/api/admin/securities?userId=${userId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setSecurities((prev) => prev.filter((s) => s.user_id !== userId));
                setAddMessage({ type: "success", text: `${username} has been demoted to regular user` });
            } else {
                const data = await res.json();
                setAddMessage({ type: "error", text: data.error });
            }
        } catch {
            setAddMessage({ type: "error", text: "Failed to remove security role" });
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Crown className="w-6 h-6 text-violet-500" />
                    Admin Dashboard
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Manage security accounts and monitor system activity.
                </p>
            </div>

            {/* Stats Overview */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-20 rounded-xl bg-muted/50 animate-pulse" />
                    ))}
                </div>
            ) : (
                <>
                    {/* User Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <Card className="border-border/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs text-muted-foreground">Students</span>
                                </div>
                                <p className="text-2xl font-bold mt-1">{userStats?.totalUsers || 0}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-amber-500" />
                                    <span className="text-xs text-muted-foreground">Security</span>
                                </div>
                                <p className="text-2xl font-bold mt-1">{userStats?.totalSecurity || 0}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-4 h-4 text-violet-500" />
                                    <span className="text-xs text-muted-foreground">Admins</span>
                                </div>
                                <p className="text-2xl font-bold mt-1">{userStats?.totalAdmin || 0}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <Card className="border-border/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Total</span>
                                </div>
                                <p className="text-2xl font-bold mt-1">{stats?.total || 0}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    <span className="text-xs text-muted-foreground">Expected</span>
                                </div>
                                <p className="text-2xl font-bold mt-1">{stats?.expected || 0}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs text-muted-foreground">Verified</span>
                                </div>
                                <p className="text-2xl font-bold mt-1">{stats?.verified || 0}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <PackageCheck className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs text-muted-foreground">Collected</span>
                                </div>
                                <p className="text-2xl font-bold mt-1">{stats?.collected || 0}</p>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}

            {/* Add Security Guard */}
            <Card className="border-border/50">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Add Security Guard</CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Promote an existing user account to security role
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddSecurity} className="flex gap-3">
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="username" className="sr-only">
                                Username
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter the username to promote"
                                required
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={addLoading}
                            className="bg-amber-500 text-white hover:bg-amber-600 shrink-0"
                        >
                            {addLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4 mr-1" />
                                    Promote
                                </>
                            )}
                        </Button>
                    </form>

                    {addMessage && (
                        <div
                            className={`mt-3 flex items-start gap-2 text-sm p-3 rounded-md ${addMessage.type === "success"
                                    ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400"
                                    : "text-red-500 bg-red-50 dark:bg-red-950/30"
                                }`}
                        >
                            {addMessage.type === "success" ? (
                                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                            ) : (
                                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            )}
                            <p>{addMessage.text}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Security Guards List */}
            <div>
                <h2 className="font-semibold text-sm text-muted-foreground mb-3">
                    Active Security Guards ({securities.length})
                </h2>

                {loading ? (
                    <div className="space-y-2">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-16 rounded-xl bg-muted/50 animate-pulse" />
                        ))}
                    </div>
                ) : securities.length === 0 ? (
                    <Card className="border-border/50 border-dashed">
                        <CardContent className="py-8 text-center">
                            <Shield className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                                No security guards yet. Add one above.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {securities.map((guard) => (
                            <Card
                                key={guard.user_id}
                                className="border-border/50 animate-slide-up"
                            >
                                <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
                                                <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {guard.username}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    Added{" "}
                                                    {new Date(guard.created_at).toLocaleDateString(
                                                        "en-IN",
                                                        { day: "numeric", month: "short", year: "numeric" }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                            onClick={() => handleRemoveSecurity(guard.user_id, guard.username)}
                                            disabled={removingId === guard.user_id}
                                        >
                                            {removingId === guard.user_id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </Button>
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
