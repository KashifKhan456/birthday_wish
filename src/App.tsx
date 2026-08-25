import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  Music, 
  Pause, 
  Play, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Sparkles, 
  Mail, 
  Gift, 
  Smile 
} from 'lucide-react';

/* --- Interfaces & Defaults --- */
interface PhotoData {
  url: string;
  caption: string;
}

interface AppConfig {
  recipientName: string;
  messageText: string;
  photos: PhotoData[];
}

interface BalloonData {
  id: number;
  color: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  emoji?: string;
}

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
    // Reset page states if name/message changed
    if (newConfig.messageText !== undefined) {
      setTypedText("");
      setTypeIndex(0);
    }
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.removeItem('birthday_surprise_config');
    } catch (e) {
      console.warn("Could not reset localStorage:", e);
    }
    setTypedText("");
    setTypeIndex(0);
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

      // Stagger elements inside the next section
      const stepId = STEPS[nextIndex];
      if (stepId === 'reveal') {
        generateBalloons();
      } else if (stepId === 'message') {
        // Reset typewriter to start typing
        setTypedText("");
        setTypeIndex(0);
        setIsTypingPaused(false);
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
      el.play().catch(err => {
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
    // Cleanup synth on unmount
    return () => {
      stopSynth();
    };
  }, []);

  /* --- 4. CANVAS ENGINE (STARS & CONFETTI) --- */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Array<{ x: number; y: number; radius: number; alpha: number; speed: number; dir: number }>>([]);
  const confettiListRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number; size: number;
    color: string; rotation: number; rotationSpeed: number; opacity: number; gravity: number;
  }>>([]);

  const triggerConfetti = (originX?: number, originY?: number, count = 70) => {
    const colors = ['#ff4b8b', '#a855f7', '#ffd700', '#38bdf8', '#f43f5e', '#ffffff'];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const x = originX || canvas.width / 2;
    const y = originY || canvas.height / 3;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      confettiListRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        gravity: 0.25
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize Stars
    const numStars = Math.min(100, Math.floor((width * height) / 10000));
    starsRef.current = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      dir: Math.random() > 0.5 ? 1 : -1
    }));

    // Main Canvas Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Stars
      starsRef.current.forEach(s => {
        s.alpha += s.speed * s.dir;
        if (s.alpha >= 1 || s.alpha <= 0.1) s.dir *= -1;
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Confetti
      const confetti = confettiListRef.current;
      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += c.gravity;
        c.rotation += c.rotationSpeed;
        c.opacity -= 0.012;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, c.opacity);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
        ctx.restore();

        if (c.opacity <= 0 || c.y > height + 20) {
          confetti.splice(i, 1);
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  /* --- 5. FLOATING BALLOONS ENGINE (REVEAL PAGE) --- */
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

  /* --- 6. CANDLE BLOW ENGINE (REVEAL PAGE) --- */
  const [candlesBlown, setCandlesBlown] = useState(false);

  const blowCandles = () => {
    if (candlesBlown) return;
    setCandlesBlown(true);
    triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 120);

    setTimeout(() => {
      setCandlesBlown(false);
    }, 10000);
  };

  /* --- 7. TYPEWRITER ENGINE (MESSAGE PAGE) --- */
  const [typedText, setTypedText] = useState("");
  const [typeIndex, setTypeIndex] = useState(0);
  const [isTypingPaused, setIsTypingPaused] = useState(false);

  useEffect(() => {
    if (STEPS[currentStepIndex] !== 'message') return;
    if (isTypingPaused) return;

    const fullText = config.messageText;
    if (typeIndex < fullText.length) {
      const char = fullText.charAt(typeIndex);
      const delay = char === '.' ? 350 : (char === '\n' ? 500 : 40);
      const timer = setTimeout(() => {
        setTypedText(prev => prev + char);
        setTypeIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, typeIndex, isTypingPaused, config.messageText]);

  const toggleTypewriterPause = () => {
    setIsTypingPaused(!isTypingPaused);
  };

  const replayTypewriter = () => {
    setTypedText("");
    setTypeIndex(0);
    setIsTypingPaused(false);
  };

  const isMessageFullyTyped = typeIndex >= config.messageText.length;

  /* --- 8. PHOTO GALLERY 3D SWIPE STACK --- */
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const activeCardSwipeRef = useRef<{ swipeX?: string; swipeRotate?: string; swipeY?: string }>({});

  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const currentX = clientX - dragStartRef.current.x;
    const currentY = clientY - dragStartRef.current.y;
    setDragOffset({ x: currentX, y: currentY });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold) {
      const dir = dragOffset.x > 0 ? 'right' : 'left';
      swipeCard(dir);
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const swipeCard = (direction: 'left' | 'right') => {
    const swipeX = direction === 'right' ? '150%' : '-150%';
    const swipeRotate = direction === 'right' ? '30deg' : '-30deg';
    
    activeCardSwipeRef.current = {
      swipeX,
      swipeRotate,
      swipeY: `${dragOffset.y}px`
    };

    // Cycle index
    setTimeout(() => {
      setActivePhotoIndex(prev => {
        const next = prev + 1;
        if (next >= config.photos.length) {
          // Reset stack after all are swiped
          setTimeout(() => {
            setActivePhotoIndex(0);
            activeCardSwipeRef.current = {};
            setDragOffset({ x: 0, y: 0 });
          }, 400);
          return prev; // hold on last index briefly before reset animation
        }
        setDragOffset({ x: 0, y: 0 });
        return next;
      });
    }, 100);
  };

  /* --- 9. REASONS CARD FLIP ENGINE --- */
  const [flippedCards, setFlippedCards] = useState<boolean[]>([false, false, false, false]);

  const toggleCardFlip = (idx: number) => {
    setFlippedCards(prev => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  /* --- 10. CINEMATIC OVERLAY SYSTEM (SURPRISE PAGE) --- */
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
    setTimeout(() => setCinematicStage(3), 1000);
    setTimeout(() => setCinematicStage(4), 1800);
  };

  const closeCinematic = () => {
    setCinematicOverlayActive(false);
    setCinematicStage(0);
    goToStep(7); // Proceed to Final Step
  };

  /* --- 11. PERSONALIZER MODAL DRAWER --- */
  const [isPersonalizerOpen, setIsPersonalizerOpen] = useState(false);
  const [modalName, setModalName] = useState(config.recipientName);
  const [modalMessage, setModalMessage] = useState(config.messageText);

  const savePersonalizer = () => {
    saveConfig({ recipientName: modalName, messageText: modalMessage });
    setIsPersonalizerOpen(false);
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 80);
  };

  const resetPersonalizer = () => {
    resetConfig();
    setModalName(DEFAULT_CONFIG.recipientName);
    setModalMessage(DEFAULT_CONFIG.messageText);
    setIsPersonalizerOpen(false);
  };

  /* --- 12. FLOATING STEP DOTS NAVIGATION visibility --- */
  const isNavDotsVisible = currentStepIndex > 0 && currentStepIndex < STEPS.length - 1;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden font-body text-slate-100 pb-8 select-none">
      
      {/* Background Particle Canvas */}
      <canvas ref={canvasRef} id="particle-canvas" className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-1" />

      {/* Progress Dots Indicator */}
      <div 
        className={`step-progress-container fixed top-5 left-1/2 -translate-x-1/2 z-1000 flex items-center gap-3 bg-white/5 backdrop-blur-lg px-5 py-2.5 rounded-full border border-white/15 shadow-2xl transition-all duration-500 ${
          isNavDotsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {STEPS.map((_, idx) => (
          <button
            key={idx}
            className={`step-dot w-2.5 h-2.5 rounded-full border-none cursor-pointer transition-all duration-500 ${
              idx === currentStepIndex
                ? 'bg-primary shadow-[0_0_12px_#ff4b8b] scale-125'
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
        
        {/* --- 1. WELCOME SCREEN (HERO) --- */}
        {currentStepIndex === 0 && (
          <section className="flex flex-col items-center gap-6 text-center py-10 w-full animate-[stepFadeIn_0.8s_ease_forwards]">
            <h1 className="font-title text-6xl md:text-8xl font-bold leading-tight select-text">
              Hey, <span className="recipient-name gradient-text glowing-text">{config.recipientName}</span> ❤️
            </h1>
            <p className="text-xl md:text-3xl text-slate-300 font-light tracking-wide">
              I have a little surprise for you…
            </p>
            <button 
              onClick={() => {
                if (!isPlaying) toggleAudio(true);
                triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 100);
                goToStep(1);
              }}
              className="btn-glow cursor-pointer mt-4"
            >
              <span>Open Your Surprise 🎁</span>
            </button>
            <div className="hero-hint mt-10 text-sm text-white/60 animate-[bounce_2s_infinite]">
              <span>Tap to begin ✨</span>
            </div>
          </section>
        )}

        {/* --- 2. BIRTHDAY REVEAL & INTERACTIVE CAKE --- */}
        {currentStepIndex === 1 && (
          <section className="flex flex-col items-center text-center py-10 w-full animate-[stepFadeIn_0.8s_ease_forwards]">
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

            <h2 className="reveal-title font-heading text-3xl md:text-5xl tracking-widest gradient-text font-bold mb-2 z-10">
              🎉 HAPPY BIRTHDAY 🎂
            </h2>
            <div className="reveal-name font-title text-6xl md:text-8xl font-bold gold-text mb-4 z-10 animate-[floatName_4s_ease-in-out_infinite] select-text">
              {config.recipientName}
            </div>
            <p className="text-lg md:text-xl text-slate-300 mb-8 z-10">
              Today is all about celebrating <strong className="text-primary select-text">YOU</strong>. ❤️
            </p>

            {/* CSS Birthday Cake */}
            <div 
              onClick={blowCandles} 
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
              <button onClick={blowCandles} className="btn-secondary">
                <span>{candlesBlown ? '✨ Wish Made! ❤️' : '🕯️ Tap Cake to Blow Candles'}</span>
              </button>
            </div>

            {/* Step Navigation */}
            <div className="step-nav flex gap-4 w-full justify-center max-w-sm mt-4 z-10">
              <button onClick={() => goToStep(0)} className="btn-secondary btn-step-back flex items-center justify-center w-24">
                <ChevronLeft size={20} className="shrink-0 mr-1.5 transition-transform" /> Back
              </button>
              <button 
                onClick={() => goToStep(2)} 
                className={`btn-glow btn-step-next flex-1 flex items-center justify-center ${candlesBlown ? 'pulse-glow border-2 border-primary/80' : ''}`}
              >
                A little love for you <ChevronRight size={20} className="shrink-0 ml-1.5 transition-transform" />
              </button>
            </div>
          </section>
        )}

        {/* --- 3. PERSONAL MESSAGE (TYPING ANIMATION) --- */}
        {currentStepIndex === 2 && (
          <section className="flex flex-col items-center py-10 w-full animate-[stepFadeIn_0.8s_ease_forwards]">
            <div className="glass-card message-card w-full max-w-2xl text-left relative p-8">
              <span className="message-card-decoration absolute top-5 right-5 text-2xl animate-[floatFlower_4s_ease-in-out_infinite] select-none">🌸</span>
              
              <div className="message-card-header flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 mr-8 md:mr-10">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-primary" />
                  <h3 className="font-heading text-xl md:text-2xl text-primary font-bold">
                    A Little Message For You
                  </h3>
                </div>
                <div className="message-controls flex gap-2">
                  <button 
                    onClick={toggleTypewriterPause} 
                    disabled={isMessageFullyTyped}
                    className="btn-secondary text-xs! px-3! py-1.5! hover:border-primary disabled:opacity-50 disabled:hover:border-white/20"
                  >
                    <span className="flex items-center gap-1.5">
                      {isTypingPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                      {isTypingPaused ? 'Resume' : 'Pause'}
                    </span>
                  </button>
                  <button 
                    onClick={replayTypewriter} 
                    className="btn-secondary text-xs! px-3! py-1.5! hover:border-primary"
                  >
                    <span className="flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5" /> Replay
                    </span>
                  </button>
                </div>
              </div>

              <div className="typing-container text-lg md:text-xl font-normal leading-relaxed text-slate-100 min-h-40 whitespace-pre-wrap mb-6 select-text">
                <span>{typedText}</span>
                <span className={`typing-cursor inline-block w-0.75 h-[1.2em] bg-primary ml-0.5 align-middle ${isMessageFullyTyped ? 'hidden' : 'animate-[blink_0.8s_infinite]'}`} />
              </div>

              {/* Step Navigation */}
              <div className="step-nav flex gap-4 w-full justify-end max-w-none mt-4">
                <button onClick={() => goToStep(1)} className="btn-secondary btn-step-back flex items-center justify-center w-24">
                  <ChevronLeft size={20} className="shrink-0 mr-1.5 transition-transform" /> Back
                </button>
                <button 
                  onClick={() => goToStep(3)} 
                  className={`btn-glow btn-step-next flex items-center justify-center w-56 ${isMessageFullyTyped ? 'pulse-glow border-2 border-primary/80' : ''}`}
                >
                  Our memories <ChevronRight size={20} className="shrink-0 ml-1.5 transition-transform" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* --- 4. PHOTO MEMORIES GALLERY --- */}
        {currentStepIndex === 3 && (
          <section className="flex flex-col items-center py-10 w-full animate-[stepFadeIn_0.8s_ease_forwards]">
            <div className="section-header text-center mb-8">
              <h2 className="section-title text-3xl md:text-5xl font-bold tracking-tight gradient-text mb-3">
                Beautiful Memories 📸
              </h2>
              <p className="section-subtitle text-base md:text-lg text-slate-300">
                Moments frozen in time that bring a smile every single day.
              </p>
            </div>

            <div className="photo-stack-wrapper flex flex-col items-center justify-center w-full my-6 relative select-none">
              <div className="photo-stack relative w-70 h-85 md:w-77.5 md:h-95 z-10">
                
                {config.photos.map((photo, idx) => {
                  const isCurrent = idx === activePhotoIndex;
                  const isPast = idx < activePhotoIndex;
                  const stackOffset = idx - activePhotoIndex;
                  
                  // Setup transform styles based on stack position
                  let style: React.CSSProperties = {};
                  
                  if (isPast) {
                    const savedSwipe = activeCardSwipeRef.current;
                    style = {
                      transform: `translate3d(${savedSwipe.swipeX || '-150%'}, ${savedSwipe.swipeY || '0px'}, 0px) rotate(${savedSwipe.swipeRotate || '-30deg'})`,
                      opacity: 0,
                      pointerEvents: 'none'
                    };
                  } else if (isCurrent) {
                    style = {
                      transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0px) rotate(${dragOffset.x * 0.08}deg) scale(1)`,
                      opacity: 1,
                      pointerEvents: 'auto',
                      zIndex: 10,
                      cursor: isDragging ? 'grabbing' : 'grab'
                    };
                  } else {
                    if (stackOffset === 1) {
                      style = {
                        transform: 'translate3d(0, 8px, -15px) rotate(2deg) scale(0.96)',
                        opacity: 0.95,
                        zIndex: 9,
                        pointerEvents: 'none'
                      };
                    } else if (stackOffset === 2) {
                      style = {
                        transform: 'translate3d(0, 16px, -30px) rotate(-2deg) scale(0.92)',
                        opacity: 0.75,
                        zIndex: 8,
                        pointerEvents: 'none'
                      };
                    } else {
                      style = {
                        transform: 'translate3d(0, 24px, -45px) rotate(1deg) scale(0.88)',
                        opacity: 0,
                        zIndex: 7,
                        pointerEvents: 'none'
                      };
                    }
                  }

                  return (
                    <div
                      key={idx}
                      className="stack-card absolute w-full h-full bg-white p-3 pb-6 rounded-lg shadow-2xl transition-all duration-300 border border-slate-200 select-none touch-none"
                      style={style}
                      onMouseDown={(e) => {
                        if (isCurrent) handleDragStart(e.clientX, e.clientY);
                      }}
                      onMouseMove={(e) => {
                        if (isCurrent && isDragging) handleDragMove(e.clientX, e.clientY);
                      }}
                      onMouseUp={handleDragEnd}
                      onMouseLeave={handleDragEnd}
                      onTouchStart={(e) => {
                        if (isCurrent) handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
                      }}
                      onTouchMove={(e) => {
                        if (isCurrent && isDragging) {
                          handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
                        }
                      }}
                      onTouchEnd={handleDragEnd}
                      onClick={() => {
                        // If tiny gesture or tap, cycle card
                        if (Math.abs(dragOffset.x) < 5) {
                          swipeCard('right');
                        }
                      }}
                    >
                      <div className="stack-card-image-wrapper w-full h-57.5 md:h-67.5 overflow-hidden rounded border border-slate-200">
                        <img 
                          src={photo.url} 
                          alt={photo.caption} 
                          loading="lazy" 
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      </div>
                      <div className="stack-card-caption mt-3 md:mt-4 font-['Caveat',cursive] text-2xl font-bold text-slate-800 text-center leading-tight select-text">
                        {photo.caption}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="stack-instruction mt-6 text-sm text-slate-300 flex items-center gap-2">
                <span>Swipe or tap the photo to see the next memory</span>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="step-nav flex gap-4 w-full justify-center max-w-sm mt-4 z-10">
              <button onClick={() => goToStep(2)} className="btn-secondary btn-step-back flex items-center justify-center w-24">
                <ChevronLeft size={20} className="shrink-0 mr-1.5 transition-transform" /> Back
              </button>
              <button 
                onClick={() => goToStep(4)} 
                className="btn-glow btn-step-next flex-1 flex items-center justify-center"
              >
                Why you’re special <ChevronRight size={20} className="shrink-0 ml-1.5 transition-transform" />
              </button>
            </div>
          </section>
        )}

        {/* --- 5. REASONS YOU'RE SPECIAL --- */}
        {currentStepIndex === 4 && (
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
              <button onClick={() => goToStep(3)} className="btn-secondary btn-step-back flex items-center justify-center w-24">
                <ChevronLeft size={20} className="shrink-0 mr-1.5 transition-transform" /> Back
              </button>
              <button 
                onClick={() => goToStep(5)} 
                className="btn-glow btn-step-next flex-1 flex items-center justify-center"
              >
                Make a wish <ChevronRight size={20} className="shrink-0 ml-1.5 transition-transform" />
              </button>
            </div>
          </section>
        )}

        {/* --- 6. BIRTHDAY WISHES --- */}
        {currentStepIndex === 5 && (
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
                <p className="wish-text text-sm text-slate-300 italic">“May you always have endless reasons to smile and feel peace in your soul.”</p>
              </div>

              <div className="glass-card wish-card p-8 text-center flex flex-col items-center justify-center">
                <div className="wish-icon text-4xl mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">💫</div>
                <h3 className="wish-title text-lg font-bold mb-2 text-white">Success</h3>
                <p className="wish-text text-sm text-slate-300 italic">“May every dream you're chasing bring you closer to your grandest goals.”</p>
              </div>

              <div className="glass-card wish-card p-8 text-center flex flex-col items-center justify-center">
                <div className="wish-icon text-4xl mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">❤️</div>
                <h3 className="wish-title text-lg font-bold mb-2 text-white">Love</h3>
                <p className="wish-text text-sm text-slate-300 italic">“May your life always be surrounded by people who cherish and adore you.”</p>
              </div>

              <div className="glass-card wish-card p-8 text-center flex flex-col items-center justify-center">
                <div className="wish-icon text-4xl mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">🌸</div>
                <h3 className="wish-title text-lg font-bold mb-2 text-white">Beautiful Memories</h3>
                <p className="wish-text text-sm text-slate-300 italic">“May this year give you golden moments you'll remember forever.”</p>
              </div>

            </div>

            {/* Step Navigation */}
            <div className="step-nav flex gap-4 w-full justify-center max-w-sm mt-4 z-10">
              <button onClick={() => goToStep(4)} className="btn-secondary btn-step-back flex items-center justify-center w-24">
                <ChevronLeft size={20} className="shrink-0 mr-1.5 transition-transform" /> Back
              </button>
              <button 
                onClick={() => goToStep(6)} 
                className="btn-glow btn-step-next flex-1 flex items-center justify-center"
              >
                One last surprise <ChevronRight size={20} className="shrink-0 ml-1.5 transition-transform" />
              </button>
            </div>
          </section>
        )}

        {/* --- 7. INTERACTIVE SURPRISE TRIGGER --- */}
        {currentStepIndex === 6 && (
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
                <button onClick={() => goToStep(5)} className="btn-secondary btn-step-back flex items-center justify-center w-24">
                  <ChevronLeft size={20} className="shrink-0 mr-1.5 transition-transform" /> Back
                </button>
                <button 
                  onClick={triggerCinematic} 
                  className="btn-glow btn-step-next flex-1 flex items-center justify-center"
                >
                  One More Surprise ✨ <ChevronRight size={20} className="shrink-0 ml-1.5 transition-transform" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* --- 8. FINAL BIRTHDAY MESSAGE --- */}
        {currentStepIndex === 7 && (
          <section className="flex flex-col items-center text-center py-10 w-full animate-[stepFadeIn_0.8s_ease_forwards]">
            <div className="final-content flex flex-col items-center gap-5 w-full">
              <h2 className="final-title font-title text-6xl md:text-8xl font-bold gold-text select-text">
                Happy Birthday, <span className="recipient-name">{config.recipientName}</span> ❤️
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
                  onClick={() => {
                    setMaxStepVisited(0);
                    goToStep(0);
                  }} 
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
              <button 
                onClick={closeCinematic} 
                className="btn-glow cursor-pointer"
              >
                <span>Keep This Memory ❤️</span>
              </button>
            </div>
            
          </div>
        )}
      </div>

      {/* ==========================================================================
           FLOATING CONTROLS: MUSIC PLAYER & PERSONALIZER
           ========================================================================== */}
      
      {/* Music Control Button */}
      <div className="floating-controls fixed bottom-6 right-6 z-999 flex flex-col gap-3">
        <button 
          onClick={() => toggleAudio()} 
          className={`icon-btn w-12 h-12 rounded-full text-white text-xl flex items-center justify-center cursor-pointer shadow-lg transition-all duration-500 border border-white/20 bg-white/10 backdrop-blur ${
            isPlaying ? 'bg-linear-to-br from-primary to-secondary animate-spinSlow' : 'hover:bg-primary'
          }`}
          title="Play/Pause Background Music"
        >
          {isPlaying ? <Music className="w-5 h-5" /> : <Music className="w-5 h-5 opacity-60" />}
        </button>
      </div>

      {/* Settings Control Button */}
      <div className="floating-left-controls fixed bottom-6 left-6 z-999">
        <button 
          onClick={() => {
            setModalName(config.recipientName);
            setModalMessage(config.messageText);
            setIsPersonalizerOpen(true);
          }} 
          className="icon-btn w-12 h-12 rounded-full text-white text-xl flex items-center justify-center cursor-pointer shadow-lg transition-all duration-500 border border-white/20 bg-white/10 backdrop-blur hover:bg-primary"
          title="Personalize Birthday Surprise"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* ==========================================================================
           PERSONALIZER SETTINGS MODAL DRAWER
           ========================================================================== */}
      <div 
        className={`modal-overlay fixed inset-0 bg-slate-950/85 backdrop-blur-md z-3000 flex items-center justify-center p-4 transition-opacity duration-300 ${
          isPersonalizerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {isPersonalizerOpen && (
          <div className="glass-card modal-card w-full max-w-lg p-8 relative flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            
            <div className="modal-header flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="font-heading text-xl md:text-2xl text-primary font-bold flex items-center gap-2">
                <Gift className="w-6 h-6" /> Personalize Birthday Gift 🎁
              </h3>
              <button 
                onClick={() => setIsPersonalizerOpen(false)}
                className="text-slate-400 hover:text-white text-2xl font-bold bg-transparent border-none cursor-pointer p-1"
              >
                &times;
              </button>
            </div>

            <div className="form-group flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-300">Recipient Name</label>
              <input 
                type="text" 
                value={modalName}
                onChange={(e) => setModalName(e.target.value)}
                className="form-control w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                placeholder="Enter recipient name" 
              />
            </div>

            <div className="form-group flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-300">Personal Birthday Message</label>
              <textarea 
                value={modalMessage}
                onChange={(e) => setModalMessage(e.target.value)}
                rows={5}
                className="form-control w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors resize-none"
                placeholder="Enter custom heartfelt message"
              />
            </div>

            <div className="flex gap-3 justify-end mt-4">
              <button 
                onClick={resetPersonalizer}
                className="btn-secondary text-sm px-4 py-2.5"
              >
                Reset Default
              </button>
              <button 
                onClick={savePersonalizer}
                className="btn-glow text-sm px-6 py-2.5 cursor-pointer"
              >
                Save Changes ❤️
              </button>
            </div>
            
          </div>
        )}
      </div>

      {/* Hidden Audio Element for local audio file */}
      <audio ref={audioRef} id="bg-audio" loop preload="auto">
        <source src="/assets/birthday-music.mp3" type="audio/mpeg" />
      </audio>

    </div>
  );
}
