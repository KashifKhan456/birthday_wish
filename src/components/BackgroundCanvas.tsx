import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

export interface BackgroundCanvasRef {
  triggerConfetti: (originX?: number, originY?: number, count?: number) => void;
}

const BackgroundCanvas = forwardRef<BackgroundCanvasRef, {}>((_, ref) => {
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

    const x = originX !== undefined ? originX : canvas.width / 2;
    const y = originY !== undefined ? originY : canvas.height / 3;

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

  useImperativeHandle(ref, () => ({
    triggerConfetti
  }));

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

  return <canvas ref={canvasRef} className="stars-canvas fixed inset-0 pointer-events-none z-0" />;
});

BackgroundCanvas.displayName = 'BackgroundCanvas';

export default BackgroundCanvas;
