"use client";

import React from "react";

export default function GlitchEffects() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {/* CRT Scanlines with Red tint */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(60,0,0,0.15)_50%)] bg-[length:100%_4px] opacity-40" />

      {/* Red Vignette Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(100,0,0,0.3)_90%,rgba(50,0,0,0.8)_100%)]" />

      {/* Subtle Flickering */}
      <div className="animate-flicker absolute inset-0 bg-red-900/1 opacity-[0.03]" />

      {/* Red Spear Glitch Overlay */}
      <div className="absolute inset-0 mix-blend-screen opacity-15">
        <div className="animate-glitch-1 absolute inset-0 bg-[rgba(255,0,0,0.4)]" style={{ clipPath: 'inset(10% 0 80% 0)' }} />
        <div className="animate-glitch-2 absolute inset-0 bg-[rgba(180,0,0,0.3)]" style={{ clipPath: 'inset(40% 0 43% 0)' }} />
        <div className="animate-glitch-3 absolute inset-0 bg-[rgba(255,20,20,0.25)]" style={{ clipPath: 'inset(80% 0 5% 0)' }} />
      </div>

      <style jsx global>{`
        @keyframes flicker {
          0% { opacity: 0.02; }
          5% { opacity: 0.05; }
          10% { opacity: 0.03; }
          15% { opacity: 0.04; }
          25% { opacity: 0.02; }
          30% { opacity: 0.06; }
          100% { opacity: 0.02; }
        }

        .animate-flicker {
          animation: flicker 0.15s infinite;
        }

        @keyframes glitch-1 {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        .animate-glitch-1 {
          animation: glitch-1 4s infinite linear alternate-reverse;
        }
        
        .animate-glitch-2 {
          animation: glitch-1 2.5s infinite linear alternate;
        }

        .animate-glitch-3 {
          animation: glitch-1 3.2s infinite linear alternate-reverse;
        }
      `}</style>
    </div>
  );
}
