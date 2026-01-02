import React, { useRef, useEffect } from "react";

interface NoiseProps {
  patternRefreshInterval?: number;
  patternAlpha?: number;
}

const Noise: React.FC<NoiseProps> = ({
  patternRefreshInterval = 3,
  patternAlpha = 8,
}) => {
  const grainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // High resolution for ultra-fine grain
    const canvasSize = 1024;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Pre-generate a set of noise frames
    const frameCount = 8;
    const frames: ImageData[] = [];

    for (let f = 0; f < frameCount; f++) {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // More subtle random distribution
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }
      frames.push(imageData);
    }

    let frameIndex = 0;
    let tick = 0;
    let animationId: number;

    const loop = () => {
      if (tick % patternRefreshInterval === 0) {
        ctx.putImageData(frames[frameIndex]!, 0, 0);
        frameIndex = (frameIndex + 1) % frameCount;
      }
      tick++;
      animationId = window.requestAnimationFrame(loop);
    };

    const startLoop = () => {
      animationId = window.requestAnimationFrame(loop);
    };

    startLoop();

    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, [patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.4] mix-blend-overlay"
      ref={grainRef}
      style={{
        objectFit: "cover",
      }}
    />
  );
};

export default Noise;

