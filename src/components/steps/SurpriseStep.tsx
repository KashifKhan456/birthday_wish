import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SurpriseStepProps {
  onBack: () => void;
  onTriggerCinematic: () => void;
}

export default function SurpriseStep({
  onBack,
  onTriggerCinematic
}: SurpriseStepProps) {
  return (
    <section className="flex flex-col items-center py-10 w-full animate-[stepFadeIn_0.8s_ease_forwards]">
      <div className="glass-card surprise-box p-12 text-center w-full max-w-2xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
          One Final Little Magic… ✨
        </h2>
        <p className="text-slate-300 mb-8 max-w-md mx-auto">
          Before you go, there is one last message waiting just for you.
        </p>

        {/* Step Navigation */}
        <div className="step-nav flex gap-4 w-full justify-center max-w-sm mx-auto">
          <button onClick={onBack} className="btn-secondary btn-step-back flex items-center justify-center w-24">
            <ChevronLeft size={20} className="shrink-0 mr-1.5 transition-transform" /> Back
          </button>
          <button
            onClick={onTriggerCinematic}
            className="btn-glow btn-step-next flex-1 flex items-center justify-center"
          >
            One More Surprise ✨ <ChevronRight size={20} className="shrink-0 ml-1.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
