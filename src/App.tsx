import { useState, useEffect, useRef } from 'react';
import { AppConfig, BalloonData } from './types';

// Core Components
import BackgroundCanvas, { BackgroundCanvasRef } from './components/BackgroundCanvas';
import PersonalizerModal from './components/PersonalizerModal';
import FloatingControls from './components/FloatingControls';

// Step Components
import HeroStep from './components/steps/HeroStep';
import CakeStep from './components/steps/CakeStep';
import MessageStep from './components/steps/MessageStep';
import GalleryStep from './components/steps/GalleryStep';
import ReasonsStep from './components/steps/ReasonsStep';
import WishesStep from './components/steps/WishesStep';
import SurpriseStep from './components/steps/SurpriseStep';
import FinalStep from './components/steps/FinalStep';

/* --- Constants & Defaults --- */
const DEFAULT_CONFIG: AppConfig = {
  recipientName: "Noor",
  messageText: "Today isn't just another day. It's a reminder of how special you are and how much happiness you bring into the lives of the people around you.\n\nI hope this new year of your life brings you beautiful memories, endless smiles, unexpected happiness, and everything your heart wishes for.\n\nYou deserve all the wonderful things life has to offer. ❤️",
  photos: [
    { url: "/assets/anime1.png", caption: "A romantic moment under the blossoms 🌸" },
    { url: "/assets/anime2.png", caption: "Your beautiful, bright smile ✨" },
    { url: "/assets/anime3.png", caption: "Under the magical starry night sky 🌟" },
    { url: "/assets/anime4.png", caption: "Cozy quiet afternoons together 💖" },
    { url: "/assets/anime5.png", caption: "Walking hand in hand at sunset 🌅" },
    { url: "/assets/anime6.png", caption: "Lantern lights reflecting in our eyes 🏮" }
  ]
};

const STEPS = [
  'hero',
  'reveal',
  'message',
  'gallery',
  'reasons',
  'wishes',
  'surprise',
  'final'
];

export default function App() {
  /* --- 1. CONFIG & PERSISTENCE --- */
  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const saved = localStorage.getItem('birthday_surprise_config');
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
    return DEFAULT_CONFIG;
  });

  const saveConfig = (newConfig: Partial<AppConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    try {
      localStorage.setItem('birthday_surprise_config', JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.removeItem('birthday_surprise_config');
    } catch (e) {
      console.warn("Could not reset localStorage:", e);
    }
  };

  /* --- 2. STEPS STATE --- */
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [maxStepVisited, setMaxStepVisited] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  const goToStep = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= STEPS.length) return;

    setFadeState('out');
    setTimeout(() => {
      setCurrentStepIndex(nextIndex);
      if (nextIndex > maxStepVisited) {
        setMaxStepVisited(nextIndex);
      }
      setFadeState('in');
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Action triggers for specific steps
      const stepId = STEPS[nextIndex];
      if (stepId === 'reveal') {
        generateBalloons();
      } else if (stepId === 'final') {
        // Double confetti burst
        triggerConfetti(window.innerWidth / 2, window.innerHeight / 3, 120);
        for (let i = 1; i <= 3; i++) {
          setTimeout(() => {
            triggerConfetti(Math.random() * window.innerWidth, Math.random() * (window.innerHeight * 0.4), 60);
          }, i * 800);
        }
      }
    }, 600);
  };

  /* --- 3. DUAL AUDIO ENGINE (AUDIO EL + SYNTH) --- */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<number | null>(null);

  const stopSynth = () => {
    if (synthIntervalRef.current) {
      window.clearTimeout(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  const playSynth = () => {
    if (synthIntervalRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;

      const notes = [
        { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.8 }, { f: 261.63, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 329.63, d: 1.2 },
        { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.8 }, { f: 261.63, d: 0.8 }, { f: 392.00, d: 0.8 }, { f: 349.23, d: 1.2 },
        { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 523.25, d: 0.8 }, { f: 440.00, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 329.63, d: 0.8 }, { f: 293.66, d: 1.2 }
      ];

      let idx = 0;
      const playNextNote = () => {
        if (!audioCtxRef.current) return;
        const n = notes[idx];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, ctx.currentTime);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + n.d * 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + n.d * 1.2);

        idx = (idx + 1) % notes.length;
        synthIntervalRef.current = window.setTimeout(playNextNote, n.d * 1000);
      };

      playNextNote();
    } catch (e) {
      console.warn("Synth audio error:", e);
    }
  };

  const toggleAudio = (forcePlay?: boolean) => {
    const el = audioRef.current;
    if (!el) return;

    const startPlaying = forcePlay !== undefined ? forcePlay : !isPlaying;

    if (startPlaying) {
      setIsPlaying(true);
      el.play().catch(() => {
        console.log("Local audio blocked or unavailable, switching to Web Audio API Synth");
        playSynth();
      });
    } else {
      setIsPlaying(false);
      el.pause();
      stopSynth();
    }
  };

  useEffect(() => {
    return () => {
      stopSynth();
    };
  }, []);

  /* --- 4. CANVAS CONFETTI REF --- */
  const canvasRef = useRef<BackgroundCanvasRef | null>(null);
  const triggerConfetti = (x?: number, y?: number, count?: number) => {
    canvasRef.current?.triggerConfetti(x, y, count);
  };

  /* --- 5. FLOATING BALLOONS ENGINE --- */
  const [balloons, setBalloons] = useState<BalloonData[]>([]);

  const generateBalloons = () => {
    const colors = [
      'rgba(255, 75, 139, 0.85)',   // Primary Pink
      'rgba(168, 85, 247, 0.85)',  // Secondary Purple
      'rgba(255, 215, 0, 0.85)',    // Accent Gold
      'rgba(56, 189, 248, 0.85)',   // Sky Blue
      'rgba(244, 63, 94, 0.85)',    // Rose Red
      'rgba(16, 185, 129, 0.85)'    // Emerald Green
    ];
    const emojis = ['🎈', '✨', '💖', '🎉', '🎁', '🎂'];

    const spawned: BalloonData[] = Array.from({ length: 16 }, (_, i) => {
      const sizeWidth = Math.random() * 15 + 50; // 50px to 65px
      return {
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 90 + 5, // 5% to 95%
        size: sizeWidth,
        duration: Math.random() * 6 + 10, // 10s to 16s
        delay: Math.random() * 5,
        emoji: Math.random() > 0.4 ? emojis[Math.floor(Math.random() * emojis.length)] : undefined
      };
    });
    setBalloons(spawned);
  };

  /* --- 6. CANDLE BLOW ENGINE --- */
  const [candlesBlown, setCandlesBlown] = useState(false);

  const blowCandles = () => {
    if (candlesBlown) return;
    setCandlesBlown(true);
    triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 120);

    setTimeout(() => {
      setCandlesBlown(false);
    }, 10000);
  };

  /* --- 7. CINEMATIC OVERLAY SYSTEM (SURPRISE PAGE) --- */
  const [cinematicOverlayActive, setCinematicOverlayActive] = useState(false);
  const [cinematicStage, setCinematicStage] = useState(0); // 0: off, 1: fade-in, 2: title, 3: subtitle, 4: button

  const triggerCinematic = () => {
    setCinematicOverlayActive(true);
    setCinematicStage(1);

    // Burst confetti multiple times
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        triggerConfetti(
          Math.random() * window.innerWidth,
          Math.random() * (window.innerHeight * 0.5),
          60
        );
      }, i * 300);
    }

    setTimeout(() => setCinematicStage(2), 400);
    setTimeout(() => setCinematicStage(3), 1600);
    setTimeout(() => setCinematicStage(4), 2800);
  };

  const closeCinematic = () => {
    setCinematicOverlayActive(false);
    setCinematicStage(0);
    goToStep(7); // Move to final Step
  };

  /* --- 8. PERSONALIZER MODAL CONTROLS --- */
  const [isPersonalizerOpen, setIsPersonalizerOpen] = useState(false);

  const savePersonalizer = (name: string, message: string) => {
    saveConfig({
      recipientName: name,
      messageText: message
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-between py-6">
      {/* Background Starfield and Confetti Canvas */}
      <BackgroundCanvas ref={canvasRef} />

      {/* ==========================================================================
           SURPRISE PROGRESS STEPS HEADER INDICATOR
           ========================================================================== */}
      <div className="steps-progress hidden md:flex items-center justify-center gap-2 md:gap-3 z-10 w-full px-4 select-none">
        {STEPS.map((_, idx) => (
          <button
            key={idx}
            className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border border-white/30 transition-all duration-500 cursor-pointer ${
              idx === currentStepIndex
                ? 'bg-primary border-primary scale-125 shadow-[0_0_8px_var(--color-primary)]'
                : idx <= maxStepVisited
                ? 'bg-secondary/80'
                : 'bg-white/20'
            }`}
            title={`Go to Step ${idx + 1}`}
            aria-label={`Go to page ${idx + 1}`}
            disabled={idx > maxStepVisited}
            onClick={() => goToStep(idx)}
          />
        ))}
      </div>

      {/* ==========================================================================
           MAIN CONTENT WRAPPER WITH SCROLL-IN/OUT FADE TRANSITIONS
           ========================================================================== */}
      <main
        className={`w-full max-w-4xl mx-auto px-4 z-10 flex flex-col items-center justify-center min-h-[85vh] transition-all duration-700 ${
          fadeState === 'in' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-95 pointer-events-none'
        }`}
      >
        {/* Step 0: Welcome Cover Screen */}
        {currentStepIndex === 0 && (
          <HeroStep
            recipientName={config.recipientName}
            isPlaying={isPlaying}
            onToggleAudio={toggleAudio}
            onTriggerConfetti={triggerConfetti}
            onNext={() => goToStep(1)}
          />
        )}

        {/* Step 1: Birthday Reveal & Interactive Cake */}
        {currentStepIndex === 1 && (
          <CakeStep
            recipientName={config.recipientName}
            balloons={balloons}
            candlesBlown={candlesBlown}
            onBlowCandles={blowCandles}
            onBack={() => goToStep(0)}
            onNext={() => goToStep(2)}
          />
        )}

        {/* Step 2: Personal Message (Typing Animation) */}
        {currentStepIndex === 2 && (
          <MessageStep
            messageText={config.messageText}
            onBack={() => goToStep(1)}
            onNext={() => goToStep(3)}
          />
        )}

        {/* Step 3: Photo Memories Polaroid Gallery */}
        {currentStepIndex === 3 && (
          <GalleryStep
            photos={config.photos}
            onBack={() => goToStep(2)}
            onNext={() => goToStep(4)}
          />
        )}

        {/* Step 4: Reasons You're Special */}
        {currentStepIndex === 4 && (
          <ReasonsStep
            onBack={() => goToStep(3)}
            onNext={() => goToStep(5)}
          />
        )}

        {/* Step 5: Gold Wishes Grid */}
        {currentStepIndex === 5 && (
          <WishesStep
            onBack={() => goToStep(4)}
            onNext={() => goToStep(6)}
          />
        )}

        {/* Step 6: Interactive Surprise Giftbox Trigger */}
        {currentStepIndex === 6 && (
          <SurpriseStep
            onBack={() => goToStep(5)}
            onTriggerCinematic={triggerCinematic}
          />
        )}

        {/* Step 7: Final Birthday Quote & Restart Trigger */}
        {currentStepIndex === 7 && (
          <FinalStep
            recipientName={config.recipientName}
            onRestart={() => {
              setMaxStepVisited(0);
              goToStep(0);
            }}
          />
        )}
      </main>

      {/* ==========================================================================
           CINEMATIC SURPRISE OVERLAY
           ========================================================================== */}
      <div
        className={`cinematic-overlay fixed inset-0 bg-black z-2000 flex flex-col items-center justify-center p-6 transition-opacity duration-1000 ${
          cinematicOverlayActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {cinematicOverlayActive && (
          <div className="cinematic-content text-center max-w-3xl flex flex-col items-center gap-6">
            <h2
              className={`cinematic-title font-title text-5xl md:text-8xl font-bold text-white tracking-wide transition-all duration-1200 ease-out ${
                cinematicStage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
              style={{ textShadow: '0 0 30px rgba(255, 75, 139, 0.4)' }}
            >
              YOU ARE TRULY SPECIAL ❤️
            </h2>

            <p
              className={`cinematic-sub text-lg md:text-3xl text-slate-300 font-light tracking-wide transition-all duration-1200 ease-out delay-600 ${
                cinematicStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              And I hope you never forget that.
            </p>

            <div
              className={`cinematic-close mt-8 transition-opacity duration-1000 delay-1500 ${
                cinematicStage >= 4 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <button onClick={closeCinematic} className="btn-glow cursor-pointer">
                <span>Keep This Memory ❤️</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================================================
           FLOATING CONTROLS: MUSIC PLAYER & PERSONALIZER
           ========================================================================== */}
      <FloatingControls
        isPlaying={isPlaying}
        onToggleAudio={() => toggleAudio()}
        onOpenPersonalizer={() => setIsPersonalizerOpen(true)}
      />

      {/* ==========================================================================
           PERSONALIZER SETTINGS MODAL DRAWER
           ========================================================================== */}
      <PersonalizerModal
        isOpen={isPersonalizerOpen}
        onClose={() => setIsPersonalizerOpen(false)}
        recipientName={config.recipientName}
        messageText={config.messageText}
        onSave={savePersonalizer}
        onReset={resetConfig}
      />

      {/* Hidden Audio Element for local audio file */}
      <audio ref={audioRef} id="bg-audio" loop preload="auto">
        <source src="/assets/birthday-music.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
