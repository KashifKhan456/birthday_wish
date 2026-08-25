import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReasonsStepProps {
  onBack: () => void;
  onNext: () => void;
}

export default function ReasonsStep({ onBack, onNext }: ReasonsStepProps) {
  const [flippedCards, setFlippedCards] = useState<boolean[]>([false, false, false, false]);

  const toggleCardFlip = (idx: number) => {
    setFlippedCards(prev => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  return (
    <section className="flex flex-col items-center py-10 w-full animate-[stepFadeIn_0.8s_ease_forwards]">
      <div className="section-header text-center mb-8">
        <h2 className="section-title text-3xl md:text-5xl font-bold tracking-tight gradient-text mb-3">
          A Few Reasons You're Special ❤️
        </h2>
        <p className="section-subtitle text-base md:text-lg text-slate-300">
          Just a few among thousands of reasons why you mean so much.
        </p>
      </div>

      <div className="reasons-grid grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4 select-none mb-8">
        {/* Reason 1 */}
        <div onClick={() => toggleCardFlip(0)} className="flip-card w-full h-55 cursor-pointer">
          <div className={`flip-card-inner relative w-full h-full text-center ${flippedCards[0] ? 'flipped' : ''}`}>
            <div className="glass-card flip-card-front absolute inset-0 flex flex-col items-center justify-center p-6">
              <span className="reason-number absolute top-5 left-5 text-sm font-bold text-primary tracking-wider">01</span>
              <div className="question-mark-container w-16 h-16 rounded-full bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center mb-3">
                <span className="question-mark text-3xl font-bold text-primary">?</span>
              </div>
              <span className="click-to-reveal text-[10px] text-slate-300 tracking-widest uppercase">Tap to reveal ❤️</span>
            </div>
            <div className="glass-card flip-card-back absolute inset-0 border border-primary flex flex-col items-start justify-center px-8 py-6 text-left">
              <span className="reason-number absolute top-5 left-5 text-sm font-bold text-primary tracking-wider">01</span>
              <div className="reason-title text-xl font-bold text-white flex items-center gap-2 mb-2 select-text">
                <span>Your Smile</span> 😊
              </div>
              <p className="reason-desc text-sm text-slate-300 leading-relaxed select-text">
                Because it has the power to make an ordinary day feel truly bright and extraordinary.
              </p>
            </div>
          </div>
        </div>

        {/* Reason 2 */}
        <div onClick={() => toggleCardFlip(1)} className="flip-card w-full h-55 cursor-pointer">
          <div className={`flip-card-inner relative w-full h-full text-center ${flippedCards[1] ? 'flipped' : ''}`}>
            <div className="glass-card flip-card-front absolute inset-0 flex flex-col items-center justify-center p-6">
              <span className="reason-number absolute top-5 left-5 text-sm font-bold text-primary tracking-wider">02</span>
              <div className="question-mark-container w-16 h-16 rounded-full bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center mb-3">
                <span className="question-mark text-3xl font-bold text-primary">?</span>
              </div>
              <span className="click-to-reveal text-[10px] text-slate-300 tracking-widest uppercase">Tap to reveal ❤️</span>
            </div>
            <div className="glass-card flip-card-back absolute inset-0 border border-primary flex flex-col items-start justify-center px-8 py-6 text-left">
              <span className="reason-number absolute top-5 left-5 text-sm font-bold text-primary tracking-wider">02</span>
              <div className="reason-title text-xl font-bold text-white flex items-center gap-2 mb-2 select-text">
                <span>Your Heart</span> 💖
              </div>
              <p className="reason-desc text-sm text-slate-300 leading-relaxed select-text">
                Because your genuine kindness and compassion make the world a gentler, brighter place.
              </p>
            </div>
          </div>
        </div>

        {/* Reason 3 */}
        <div onClick={() => toggleCardFlip(2)} className="flip-card w-full h-55 cursor-pointer">
          <div className={`flip-card-inner relative w-full h-full text-center ${flippedCards[2] ? 'flipped' : ''}`}>
            <div className="glass-card flip-card-front absolute inset-0 flex flex-col items-center justify-center p-6">
              <span className="reason-number absolute top-5 left-5 text-sm font-bold text-primary tracking-wider">03</span>
              <div className="question-mark-container w-16 h-16 rounded-full bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center mb-3">
                <span className="question-mark text-3xl font-bold text-primary">?</span>
              </div>
              <span className="click-to-reveal text-[10px] text-slate-300 tracking-widest uppercase">Tap to reveal ❤️</span>
            </div>
            <div className="glass-card flip-card-back absolute inset-0 border border-primary flex flex-col items-start justify-center px-8 py-6 text-left">
              <span className="reason-number absolute top-5 left-5 text-sm font-bold text-primary tracking-wider">03</span>
              <div className="reason-title text-xl font-bold text-white flex items-center gap-2 mb-2 select-text">
                <span>Your Energy</span> ✨
              </div>
              <p className="reason-desc text-sm text-slate-300 leading-relaxed select-text">
                Because you bring warmth, joy, and unforgettable spark wherever you go.
              </p>
            </div>
          </div>
        </div>

        {/* Reason 4 */}
        <div onClick={() => toggleCardFlip(3)} className="flip-card w-full h-55 cursor-pointer">
          <div className={`flip-card-inner relative w-full h-full text-center ${flippedCards[3] ? 'flipped' : ''}`}>
            <div className="glass-card flip-card-front absolute inset-0 flex flex-col items-center justify-center p-6">
              <span className="reason-number absolute top-5 left-5 text-sm font-bold text-primary tracking-wider">04</span>
              <div className="question-mark-container w-16 h-16 rounded-full bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center mb-3">
                <span className="question-mark text-3xl font-bold text-primary">?</span>
              </div>
              <span className="click-to-reveal text-[10px] text-slate-300 tracking-widest uppercase">Tap to reveal ❤️</span>
            </div>
            <div className="glass-card flip-card-back absolute inset-0 border border-primary flex flex-col items-start justify-center px-8 py-6 text-left">
              <span className="reason-number absolute top-5 left-5 text-sm font-bold text-primary tracking-wider">04</span>
              <div className="reason-title text-xl font-bold text-white flex items-center gap-2 mb-2 select-text">
                <span>Simply You</span> 🌸
              </div>
              <p className="reason-desc text-sm text-slate-300 leading-relaxed select-text">
                Because in the entire universe, there is absolutely nobody quite as wonderful as you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="step-nav flex gap-4 w-full justify-center max-w-sm mt-4 z-10">
        <button onClick={onBack} className="btn-secondary btn-step-back flex items-center justify-center w-24">
          <ChevronLeft size={20} className="shrink-0 mr-1.5 transition-transform" /> Back
        </button>
        <button onClick={onNext} className="btn-glow btn-step-next flex-1 flex items-center justify-center">
          Make a wish <ChevronRight size={20} className="shrink-0 ml-1.5 transition-transform" />
        </button>
      </div>
    </section>
  );
}
