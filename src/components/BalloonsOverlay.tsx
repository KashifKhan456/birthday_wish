import React from 'react';
import { BalloonData } from '../types';

interface BalloonsOverlayProps {
  balloons: BalloonData[];
}

export default function BalloonsOverlay({ balloons }: BalloonsOverlayProps) {
  return (
    <div className="balloons-container absolute inset-0 pointer-events-none overflow-hidden z-1">
      {balloons.map(b => (
        <div
          key={b.id}
          className="balloon absolute -bottom-25 flex items-center justify-center text-white/80"
          style={{
            backgroundColor: b.color,
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size * 1.25}px`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            fontSize: `${b.size * 0.3}px`
          }}
        >
          {b.emoji}
        </div>
      ))}
    </div>
  );
}
