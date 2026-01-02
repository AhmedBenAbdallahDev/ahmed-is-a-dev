"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Noise from "./noise/noise";

const BOOT_SEQUENCE = [
    "> SEARCHING_FOR_UPLINK...",
    "> RELAY_0xAF4_OPEN",
    "> AUTH: AHMED BEN ABDALLAH",
    "> ACCESS_ING_RESTRICTED_PROTOCOL",
    "> WARN: CORRUPT_MEMORY_BLOCK_77",
    "> OVERRIDE_SAFETY_CHECK",
    "> SYNCING_NEURAL_LINK...",
    "> SYNC_STABLE_98%",
    "> DECRYPTING_STREAM...",
    "> CONNECTION_ESTABLISHED",
];

const WALKER_FRAMES = [
    "   (^_^)  \n  /|   |\\ \n   /   \\  ",
    "   (o_o)  \n  /|___|\\ \n   |   |  ",
    "   (ô_ô)  \n  /|___|\\ \n  /     \\ "
];

export default function TerminalBoot({ onComplete }: { onComplete: () => void }) {
    const [lines, setLines] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [walkerFrame, setWalkerFrame] = useState(0);
    const [bgData, setBgData] = useState<string[]>([]);
    const [rebootStep, setRebootStep] = useState<"none" | "flash" | "dark">("none");

    useEffect(() => {
        const interval = setInterval(() => {
            setWalkerFrame(prev => (prev + 1) % WALKER_FRAMES.length);
        }, 300);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setBgData(prev => [Math.random().toString(16).substring(2, 20), ...prev].slice(0, 40));
        }, 50);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (currentIndex < BOOT_SEQUENCE.length) {
            const delay = Math.random() * 400 + 100;
            const timer = setTimeout(() => {
                setLines((prev) => [...prev, BOOT_SEQUENCE[currentIndex]!]);
                setCurrentIndex((prev) => prev + 1);
            }, delay);
            return () => clearTimeout(timer);
        } else {
            // Sequence: Flash -> Dark -> Complete
            const timer = setTimeout(() => {
                setRebootStep("flash");
                setTimeout(() => {
                    setRebootStep("dark");
                    setTimeout(() => {
                        onComplete();
                    }, 800);
                }, 150); // Sharp flash duration
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, onComplete]);

    if (rebootStep === "flash") {
        return (
            <div className="fixed inset-0 z-[1000] bg-red-600 overflow-hidden">
                <Noise patternAlpha={60} patternRefreshInterval={1} />
                <div className="absolute inset-0 flex items-center justify-center font-mono text-black text-6xl font-black italic">
                    WARN_SIGNAL_PEAK_
                </div>
            </div>
        );
    }

    if (rebootStep === "dark") {
        return (
            <div className="fixed inset-0 z-[1000] bg-black flex items-center justify-center font-mono text-red-600">
                <div className="text-xl tracking-[0.5em] animate-pulse">SYSTEM_REBOOTING_</div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black font-mono text-red-600/80 overflow-hidden"
        >
            {/* Super Intense Grain */}
            <Noise patternAlpha={40} patternRefreshInterval={1} />

            {/* Background Data Stream (The "Raw" feel) */}
            <div className="absolute inset-0 opacity-5 text-[8px] leading-none whitespace-pre select-none pointer-events-none p-2 overflow-hidden">
                {bgData.join("\n")}
            </div>

            <div className="relative z-10 p-6 md:p-12 h-full flex flex-col justify-between">
                <div>
                    <pre className="text-[10px] md:text-[14px] leading-tight mb-8 text-red-900">
                        {`
 █████╗     ██████╗ ███████╗███╗   ██╗
██╔══██╗    ██╔══██╗██╔════╝████╗  ██║
███████║    ██████╔╝█████╗  ██╔██╗ ██║
██╔══██║    ██╔══██╗██╔══╝  ██║╚██╗██║
██║  ██║    ██████╔╝███████╗██║ ╚████║
╚═╝  ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═══╝
`}
                    </pre>

                    <div className="space-y-1">
                        {lines.map((line, i) => (
                            <div key={i} className="text-xs md:text-sm tracking-widest animate-pulse">
                                {line}
                            </div>
                        ))}
                        <div className="w-2 h-4 bg-red-600 animate-fade" />
                    </div>
                </div>

                <div className="flex flex-col items-center mb-10">
                    <pre className="text-sm leading-none text-red-500 mb-4 whitespace-pre">
                        {WALKER_FRAMES[walkerFrame]}
                    </pre>
                    <div className="text-[8px] tracking-[1em] uppercase opacity-40">AHMED_BEN_ABDALLAH_DEV</div>
                </div>

                <div className="flex justify-between items-end opacity-30 text-[9px]">
                    <div>
                        USR: [AHMED BEN ABDALLAH]<br />
                        NODE: AB_DEV_SECRET<br />
                        STATUS: UNLICENSED_ACCESS
                    </div>
                    <div>
                        KEEPER: A.BEN_PENDING
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .animate-fade {
                    animation: fade 0.8s infinite;
                }
            `}</style>
        </motion.div>
    );
}
