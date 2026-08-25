import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BalloonData } from '../../types';
import BalloonsOverlay from '../BalloonsOverlay';

interface CakeStepProps {
  recipientName: string;
  balloons: BalloonData[];
  candlesBlown: boolean;
  onBlowCandles: () => void;
  onBack: () => void;
  onNext: () => void;
}

export default function CakeStep({
  recipientName,
  balloons,
  candlesBlown,
  onBlowCandles,
  onBack,
  onNext
}: CakeStepProps) {
  return (
    <section className="flex flex-col items-center text-center py-10 w-full animate-[stepFadeIn_0.8s_ease_forwards]">
      {/* Animated balloons overlay */}
      <BalloonsOverlay balloons={balloons} />

      <h2 className="reveal-title font-heading text-3xl md:text-5xl tracking-widest gradient-text font-bold mb-2 z-10">
        🎉 HAPPY BIRTHDAY 🎂
      </h2>
      <div className="reveal-name font-title text-6xl md:text-8xl font-bold gold-text mb-4 z-10 animate-[floatName_4s_ease-in-out_infinite] select-text">
        {recipientName}
      </div>
      <p className="text-lg md:text-xl text-slate-300 mb-8 z-10">
        Today is all about celebrating <strong className="text-primary select-text">YOU</strong>. ❤️
      </p>

      {/* CSS Birthday Cake */}
      <div
        onClick={onBlowCandles}
        className="cake-wrapper relative w-56 h-56 flex flex-col items-center justify-end cursor-pointer mb-6 z-10"
        title="Tap candles to blow them out!"
      >
        <div className="cake relative w-50 h-30 rounded-2xl rounded-b-xl">
          {/* Candles Row */}
          <div className="candles-row absolute -top-16.25 left-1/2 -translate-x-1/2 w-30 flex justify-around z-20">
            {[0, 1, 2].map(idx => (
              <div key={idx} className="candle w-3 h-10 rounded shadow-md relative">
                <div className="candle-wick" />
                <div className={`flame ${candlesBlown ? 'out' : ''}`} />
                <div className={`smoke ${candlesBlown ? 'active' : ''}`} />
              </div>
            ))}
          </div>

          <div className="cake-top-layer absolute -top-7 left-5 w-40 h-12.5 rounded-xl rounded-b-md">
            <div className="drips absolute top-0 left-0 w-full h-4 bg-white rounded-t-xl" />
          </div>
          <div className="drips absolute top-0 left-0 w-full h-4 bg-white rounded-t-xl" />
        </div>
      </div>

      <div className="z-10 mb-8">
        <button onClick={onBlowCandles} className="btn-secondary">
          <span>{candlesBlown ? '✨ Wish Made! ❤️' : '🕯️ Tap Cake to Blow Candles'}</span>
        </button>
      </div>

      {/* Step Navigation */}
      <div className="step-nav flex gap-4 w-full justify-center max-w-sm mt-4 z-10">
        <button onClick={onBack} className="btn-secondary btn-step-back flex items-center justify-center w-24">
          <ChevronLeft size={20} className="shrink-0 mr-1.5 transition-transform" /> Back
        </button>
        <button
          onClick={onNext}
          className={`btn-glow btn-step-next flex-1 flex items-center justify-center ${
            candlesBlown ? 'pulse-glow border-2 border-primary/80' : ''
          }`}
        >
          A little love for you <ChevronRight size={20} className="shrink-0 ml-1.5 transition-transform" />
        </button>
      </div>
    </section>
  );
}
