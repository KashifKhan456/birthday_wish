import React from 'react';

interface HeroStepProps {
  recipientName: string;
  onNext: () => void;
  isPlaying: boolean;
  onToggleAudio: (forcePlay?: boolean) => void;
  onTriggerConfetti: (x?: number, y?: number, count?: number) => void;
}

export default function HeroStep({
  recipientName,
  onNext,
  isPlaying,
  onToggleAudio,
  onTriggerConfetti
}: HeroStepProps) {
  const handleOpenSurprise = () => {
    if (!isPlaying) onToggleAudio(true);
    onTriggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 100);
    onNext();
  };

  return (
    <section className="flex flex-col items-center gap-6 text-center py-10 w-full animate-[stepFadeIn_0.8s_ease_forwards]">
      <h1 className="font-title text-6xl md:text-8xl font-bold leading-tight select-text">
        Hey, <span className="recipient-name glowing-text gradient-text">{recipientName}</span> ❤️
      </h1>
      <p className="text-xl md:text-3xl text-slate-300 font-light tracking-wide">
        I have a little surprise for you…
      </p>
      <button
        onClick={handleOpenSurprise}
        className="btn-glow cursor-pointer mt-4"
      >
        <span>Open Your Surprise 🎁</span>
      </button>
      <div className="hero-hint mt-10 text-sm text-white/60 animate-[bounce_2s_infinite]">
        <span>Tap to begin ✨</span>
      </div>
    </section>
  );
}
