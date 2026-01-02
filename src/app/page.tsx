"use client";

import React, { useState, useEffect } from "react";
import { RetroChat } from "~/components/retro-chat/retro-chat";
import TerminalBoot from "~/components/TerminalBoot";
import HackerBackground from "~/components/HackerBackground";
import GlitchEffects from "~/components/GlitchEffects";
import Noise from "~/components/noise/noise";
import TargetCursor from "~/components/target-cursor/target-cursor";
import { AnimatePresence, motion } from "framer-motion";

const SIDEBAR_LOGS = [
  "ERR_SIGNAL_LOSS",
  "DECRYPTING_PACKET_331",
  "XYLARIS_RELAY_OK",
  "SYNCING_BIO_METRICS",
  "ATMOSPHERE_STABLE",
  "SOLAR_FLARE_DETECTED",
  "REBOOTING_COMMS_ARRAY",
  "UPDATING_STAR_MAPS",
];

function DataFeed() {
  const [data, setData] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setData(Math.random().toString(16).substring(2, 10).toUpperCase());
    }, 200); // Slower updates
    return () => clearInterval(interval);
  }, []);
  return <>{data}</>;
}

export default function FbxPage() {
  const [bootComplete, setBootComplete] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (bootComplete) {
      const interval = setInterval(() => {
        setLogs(prev => [SIDEBAR_LOGS[Math.floor(Math.random() * SIDEBAR_LOGS.length)]!, ...prev].slice(0, 10));
      }, 2000); // Slower log updates
      return () => clearInterval(interval);
    }
  }, [bootComplete]);

  return (
    <main className="relative w-[100vw] h-[100vh] bg-black overflow-hidden font-mono selection:bg-green-500/30 selection:text-white">
      <AnimatePresence>
        {!bootComplete && (
          <TerminalBoot onComplete={() => setBootComplete(true)} />
        )}
      </AnimatePresence>

      <TargetCursor spinDuration={5} />

      {/* Main Content Layout */}
      <AnimatePresence>
        {bootComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-full h-full flex items-center justify-center bg-[#050505]"
          >
            <HackerBackground />

            {/* Fancy ARG HUD - Left Side Logs */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute left-10 top-1/2 -translate-y-1/2 w-48 h-[500px] border border-green-900/30 bg-black/40 backdrop-blur-sm p-4 text-[9px] text-green-500/60 overflow-hidden"
            >
              <div className="mb-4 border-b border-green-900/30 pb-2 font-bold tracking-widest text-green-500 uppercase">System Logs</div>
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="text-green-900">[{new Date().toLocaleTimeString([], { hour12: false })}]</span> {log}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Fancy ARG HUD - Right Side Data Feed */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute right-10 top-1/2 -translate-y-1/2 w-48 h-[500px] border border-green-900/30 bg-black/40 backdrop-blur-sm p-4 text-[9px] text-green-500/60 overflow-hidden flex flex-col justify-end"
            >
              <div className="space-y-4">
                <div className="border-t border-green-900/30 pt-2">
                  <div className="text-green-900 uppercase mb-1">Packet Stream</div>
                  <div className="grid grid-cols-2 gap-1 text-green-500/40">
                    <DataFeed /> <DataFeed />
                    <DataFeed /> <DataFeed />
                    <DataFeed /> <DataFeed />
                  </div>
                </div>
                <div className="border-t border-green-900/30 pt-2">
                  <div className="text-green-900 uppercase mb-1">Encryption Cache</div>
                  <div className="animate-pulse text-green-500 text-xs text-center">BUFFER_SYNCED</div>
                </div>
              </div>
            </motion.div>

            {/* Fancy ARG HUD - Center Frame */}
            <div className="absolute inset-0 border-[40px] border-black/80 pointer-events-none z-10" />
            <div className="absolute inset-0 border border-green-900/10 pointer-events-none z-10" />

            {/* Decorative Corner Elements */}
            <div className="absolute top-14 left-14 w-10 h-10 border-t-2 border-l-2 border-green-700/50 z-20" />
            <div className="absolute top-14 right-14 w-10 h-10 border-t-2 border-r-2 border-green-700/50 z-20" />
            <div className="absolute bottom-14 left-14 w-10 h-10 border-b-2 border-l-2 border-green-700/50 z-20" />
            <div className="absolute bottom-14 right-14 w-10 h-10 border-b-2 border-r-2 border-green-700/50 z-20" />

            {/* Original Chat Container Restored & Weighted */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.1 }}
              className="relative z-30 w-[600px] h-[800px]"
            >
              <RetroChat />
            </motion.div>

            {/* Atmospheric Overlay Texts */}
            <div className="absolute top-10 w-full flex justify-center text-[10px] text-green-800 tracking-[0.5em] uppercase z-20">
              Direct Terminal Link - AB_DEV_NODE_07
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Full-Screen Overlays - Topmost Layer */}
      <div className="fixed inset-0 z-[1000] pointer-events-none">
        <Noise patternAlpha={18} patternRefreshInterval={3} />
        <GlitchEffects />
      </div>
    </main>
  );
}
