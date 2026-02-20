import { Package } from "lucide-react";

export default function Loading() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome skeleton */}
            <div>
                <div className="h-8 w-48 bg-muted/50 rounded-lg animate-pulse" />
                <div className="h-4 w-64 bg-muted/50 rounded-lg animate-pulse mt-2" />
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                    <div
                        key={i}
                        className="h-20 rounded-xl border border-border/50 bg-muted/30 animate-pulse"
                    />
                ))}
            </div>

            {/* Action cards skeleton */}
            <div className="space-y-3">
                {[1, 2].map((i) => (
                    <div
                        key={i}
                        className="h-[82px] rounded-xl border border-border/50 bg-muted/30 animate-pulse"
                    />
                ))}
            </div>

            {/* Recent orders skeleton */}
            <div>
                <div className="h-4 w-28 bg-muted/50 rounded-lg animate-pulse mb-3" />
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-16 rounded-xl bg-muted/50 animate-pulse"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
