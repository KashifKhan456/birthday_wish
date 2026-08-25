import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WishesStepProps {
  onBack: () => void;
  onNext: () => void;
}

export default function WishesStep({ onBack, onNext }: WishesStepProps) {
  return (
    <section className="flex flex-col items-center py-10 w-full animate-[stepFadeIn_0.8s_ease_forwards]">
      <div className="section-header text-center mb-8">
        <h2 className="section-title text-3xl md:text-5xl font-bold tracking-tight gold-text mb-3">
          My Wishes For You ✨
        </h2>
        <p className="section-subtitle text-base md:text-lg text-slate-300">
          Sending my deepest wishes for the year ahead.
        </p>
      </div>

      <div className="wishes-grid grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4 select-text mb-8">
        <div className="glass-card wish-card p-8 text-center flex flex-col items-center justify-center">
          <div className="wish-icon text-4xl mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">🌟</div>
          <h3 className="wish-title text-lg font-bold mb-2 text-white">Happiness</h3>
          <p className="wish-text text-sm text-slate-300 italic">
            “May you always have endless reasons to smile and feel peace in your soul.”
          </p>
        </div>

        <div className="glass-card wish-card p-8 text-center flex flex-col items-center justify-center">
          <div className="wish-icon text-4xl mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">💫</div>
          <h3 className="wish-title text-lg font-bold mb-2 text-white">Success</h3>
          <p className="wish-text text-sm text-slate-300 italic">
            “May every dream you're chasing bring you closer to your grandest goals.”
          </p>
        </div>

        <div className="glass-card wish-card p-8 text-center flex flex-col items-center justify-center">
          <div className="wish-icon text-4xl mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">❤️</div>
          <h3 className="wish-title text-lg font-bold mb-2 text-white">Love</h3>
          <p className="wish-text text-sm text-slate-300 italic">
            “May your life always be surrounded by people who cherish and adore you.”
          </p>
        </div>

        <div className="glass-card wish-card p-8 text-center flex flex-col items-center justify-center">
          <div className="wish-icon text-4xl mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">🌸</div>
          <h3 className="wish-title text-lg font-bold mb-2 text-white">Beautiful Memories</h3>
          <p className="wish-text text-sm text-slate-300 italic">
            “May this year give you golden moments you'll remember forever.”
          </p>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="step-nav flex gap-4 w-full justify-center max-w-sm mt-4 z-10">
        <button onClick={onBack} className="btn-secondary btn-step-back flex items-center justify-center w-24">
          <ChevronLeft size={20} className="shrink-0 mr-1.5 transition-transform" /> Back
        </button>
        <button onClick={onNext} className="btn-glow btn-step-next flex-1 flex items-center justify-center">
          One last surprise <ChevronRight size={20} className="shrink-0 ml-1.5 transition-transform" />
        </button>
      </div>
    </section>
  );
}
