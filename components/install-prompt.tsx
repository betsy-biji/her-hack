"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

export function InstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if already installed (standalone mode)
        if (window.matchMedia("(display-mode: standalone)").matches) return;

        // Detect iOS
        const isIOSDevice =
            /iPad|iPhone|iPod/.test(navigator.userAgent) &&
            !(window as unknown as { MSStream?: unknown }).MSStream;

        if (isIOSDevice) {
            setIsIOS(true);
        }

        // Show prompt after a brief delay for a smoother experience
        const timer = setTimeout(() => setShowPrompt(true), 800);
        return () => clearTimeout(timer);
    }, []);

    if (!showPrompt) return null;

    return (
        <>
            <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .install-popup {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
            <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm install-popup">
                <div className="bg-card border border-border/50 rounded-2xl shadow-xl p-4">
                    <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                            <Download className="w-5 h-5 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm">Install App</h3>
                            {isIOS ? (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Tap{" "}
                                    <span className="font-medium">Share ↑</span>{" "}
                                    then &quot;Add to Home Screen&quot;
                                </p>
                            ) : (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Add to your home screen for quick access
                                </p>
                            )}
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setShowPrompt(false)}
                            className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                            aria-label="Dismiss"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
