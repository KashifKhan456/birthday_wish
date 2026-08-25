import React from 'react';
import { RotateCcw } from 'lucide-react';

interface FinalStepProps {
  recipientName: string;
  onRestart: () => void;
}

export default function FinalStep({ recipientName, onRestart }: FinalStepProps) {
  return (
    <section className="flex flex-col items-center text-center py-10 w-full animate-[stepFadeIn_0.8s_ease_forwards]">
      <div className="final-content flex flex-col items-center gap-5 w-full">
        <h2 className="final-title font-title text-6xl md:text-8xl font-bold gold-text select-text">
          Happy Birthday, <span className="recipient-name">{recipientName}</span> ❤️
        </h2>
        <p className="final-quote font-heading text-xl md:text-3xl text-slate-300 max-w-xl italic leading-relaxed select-text">
          “May this year be your most beautiful chapter yet.”
        </p>
        <p className="text-xl text-primary font-bold tracking-wide mt-2">
          Keep smiling. Keep dreaming. Keep being YOU. ✨
        </p>

        {/* Reset Control */}
        <div className="step-nav flex justify-center w-full max-w-xs mt-6 z-10">
          <button
            onClick={onRestart}
            className="btn-secondary flex items-center justify-center w-full gap-2 hover:border-primary hover:text-white"
          >
            <RotateCcw className="w-4 h-4 scale-x-[-1]" /> Restart Surprise
          </button>
        </div>

        <div className="final-footer mt-16 text-sm text-slate-300/80 flex items-center gap-1.5 select-none">
          <span>Made with</span>
          <span className="beating-heart text-primary text-xl animate-heartPulse">❤️</span>
          <span>just for you</span>
        </div>
      </div>
    </section>
  );
}
