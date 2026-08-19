/* ==========================================================================
   ROMANTIC BIRTHDAY SURPRISE - VANILLA JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. DEFAULT CONFIGURATION (EASY TO CUSTOMIZE) --- */
  const DEFAULT_CONFIG = {
    recipientName: "Noor",
    messageText: "Today isn't just another day. It's a reminder of how special you are and how much happiness you bring into the lives of the people around you.\n\nI hope this new year of your life brings you beautiful memories, endless smiles, unexpected happiness, and everything your heart wishes for.\n\nYou deserve all the wonderful things life has to offer. ❤️",
    photos: [
      { url: "assets/anime1.png", caption: "A romantic moment under the blossoms 🌸" },
      { url: "assets/anime2.png", caption: "Your beautiful, bright smile ✨" },
      { url: "assets/anime3.png", caption: "Under the magical starry night sky 🌟" },
      { url: "assets/anime4.png", caption: "Cozy quiet afternoons together 💖" },
      { url: "assets/anime5.png", caption: "Walking hand in hand at sunset 🌅" },
      { url: "assets/anime6.png", caption: "Lantern lights reflecting in our eyes 🏮" }
    ]
  };

  // Load configuration from LocalStorage if available
  let appConfig = loadConfig();

  function loadConfig() {
    try {
      const saved = localStorage.getItem('birthday_surprise_config');
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Could not access localStorage:", e);
    }
    return { ...DEFAULT_CONFIG };
  }

  function saveConfig(newConfig) {
    appConfig = { ...appConfig, ...newConfig };
    try {
      localStorage.setItem('birthday_surprise_config', JSON.stringify(appConfig));
    } catch (e) {
      console.warn("Failed to save to localStorage:", e);
    }
    applyConfigToDOM();
  }

  // Apply Name & Text to DOM
  function applyConfigToDOM() {
    document.querySelectorAll('.recipient-name').forEach(el => {
      el.textContent = appConfig.recipientName;
    });

    // Update input fields in modal if open
    const nameInput = document.getElementById('input-name');
    const msgInput = document.getElementById('input-message');
    if (nameInput) nameInput.value = appConfig.recipientName;
    if (msgInput) msgInput.value = appConfig.messageText;

    // Render Photo Gallery
    renderGallery();

    // Restart Typewriter
    startTypewriter();
  }

  /* --- 2. CANVAS ENGINE (STARS, FLOATING HEARTS & FIREWORKS) --- */
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle Stores
  const stars = [];
  const fireworks = [];
  const confettiList = [];

  // Initialize Background Stars
  const numStars = Math.min(100, Math.floor((width * height) / 10000));
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      dir: Math.random() > 0.5 ? 1 : -1
    });
  }

  // Trigger Firework / Confetti Burst
  function spawnConfetti(originX, originY, count = 70) {
    const colors = ['#ff4b8b', '#a855f7', '#ffd700', '#38bdf8', '#f43f5e', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      confettiList.push({
        x: originX || width / 2,
        y: originY || height / 3,
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
  }

  // Render Loop
  function renderLoop() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Stars
    stars.forEach(s => {
      s.alpha += s.speed * s.dir;
      if (s.alpha >= 1 || s.alpha <= 0.1) s.dir *= -1;
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Draw Confetti
    for (let i = confettiList.length - 1; i >= 0; i--) {
      const c = confettiList[i];
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
        confettiList.splice(i, 1);
      }
    }

    requestAnimationFrame(renderLoop);
  }

  requestAnimationFrame(renderLoop);

  /* --- 3. DUAL AUDIO ENGINE (FILE + SYNTHESIZER FALLBACK) --- */
  const audioEl = document.getElementById('bg-audio');
  const btnMusicToggle = document.getElementById('btn-music-toggle');
  let isPlaying = false;
  let audioCtx = null;
  let synthInterval = null;

  // Web Audio API Synthesizer (Plays soft music-box Happy Birthday melody)
  function playSynthMelody() {
    if (synthInterval) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioCtx = new AudioCtx();

      // Note frequencies
      const notes = [
        { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.8 }, { f: 261.63, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 329.63, d: 1.2 },
        { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.8 }, { f: 261.63, d: 0.8 }, { f: 392.00, d: 0.8 }, { f: 349.23, d: 1.2 },
        { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 523.25, d: 0.8 }, { f: 440.00, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 329.63, d: 0.8 }, { f: 293.66, d: 1.2 }
      ];

      let idx = 0;
      function playNextNote() {
        if (!isPlaying || !audioCtx) return;
        const n = notes[idx];
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine'; // Soft tone
        osc.frequency.setValueAtTime(n.f, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + n.d * 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + n.d * 1.2);

        idx = (idx + 1) % notes.length;
        synthInterval = setTimeout(playNextNote, n.d * 1000);
      }

      playNextNote();
    } catch (e) {
      console.warn("Synth audio error:", e);
    }
  }

  function stopSynthMelody() {
    if (synthInterval) {
      clearTimeout(synthInterval);
      synthInterval = null;
    }
  }

  function toggleAudio() {
    if (isPlaying) {
      audioEl.pause();
      stopSynthMelody();
      isPlaying = false;
      btnMusicToggle.classList.remove('playing');
      btnMusicToggle.innerHTML = "🎵";
    } else {
      isPlaying = true;
      btnMusicToggle.classList.add('playing');
      btnMusicToggle.innerHTML = "🎶";

      // Try playing audio file first
      audioEl.play().catch(err => {
        console.log("Local MP3 audio unavailable or blocked, switching to Web Audio API Synth");
        playSynthMelody();
      });
    }
  }

  btnMusicToggle.addEventListener('click', toggleAudio);

  /* --- 4. STEP-BY-STEP SURPRISE NAVIGATOR --- */
  const steps = [
    'hero',
    'reveal',
    'message',
    'gallery',
    'reasons',
    'wishes',
    'surprise',
    'final'
  ];

  let currentStepIndex = 0;
  let maxStepVisited = 0;

  const progressContainer = document.getElementById('step-progress');

  function initProgressDots() {
    if (!progressContainer) return;
    progressContainer.innerHTML = "";
    steps.forEach((step, idx) => {
      const dot = document.createElement('button');
      dot.className = 'step-dot';
      dot.title = `Go to Step ${idx + 1}`;
      dot.setAttribute('aria-label', `Go to page ${idx + 1}`);
      dot.addEventListener('click', () => {
        if (idx <= maxStepVisited) {
          goToStep(idx);
        }
      });
      progressContainer.appendChild(dot);
    });
    updateProgressDots();
  }

  function updateProgressDots() {
    if (!progressContainer) return;
    const dots = progressContainer.querySelectorAll('.step-dot');
    dots.forEach((dot, idx) => {
      dot.classList.remove('active', 'visited');
      if (idx === currentStepIndex) {
        dot.classList.add('active');
      } else if (idx < currentStepIndex) {
        dot.classList.add('visited');
      }
    });

    // Hide progress bar on first and last step
    if (currentStepIndex === 0 || currentStepIndex === steps.length - 1) {
      progressContainer.style.opacity = '0';
      progressContainer.style.pointerEvents = 'none';
    } else {
      progressContainer.style.opacity = '1';
      progressContainer.style.pointerEvents = 'auto';
    }
  }

  function revealStepElements(stepId) {
    const stepEl = document.getElementById(stepId);
    if (!stepEl) return;
    const elements = stepEl.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el, idx) => {
      el.classList.remove('visible');
      setTimeout(() => {
        el.classList.add('visible');
      }, idx * 150); // Stagger element fades
    });
  }

  function goToStep(nextIndex) {
    if (nextIndex < 0 || nextIndex >= steps.length) return;

    const currentStepId = steps[currentStepIndex];
    const nextStepId = steps[nextIndex];

    const currentEl = document.getElementById(currentStepId);
    const nextEl = document.getElementById(nextStepId);

    if (!currentEl || !nextEl) return;

    // Pause typewriter if leaving message page
    if (currentStepId === 'message') {
      isTypingPaused = true;
      updatePauseButtonState(true);
    }

    currentEl.classList.add('fade-out');

    setTimeout(() => {
      currentEl.classList.remove('active', 'fade-out');
      nextEl.classList.add('active');

      currentStepIndex = nextIndex;
      if (currentStepIndex > maxStepVisited) {
        maxStepVisited = currentStepIndex;
      }

      updateProgressDots();
      revealStepElements(nextStepId);

      window.scrollTo({ top: 0, behavior: 'instant' });

      // Page specific logic
      if (nextStepId === 'reveal') {
        spawnBalloons();
        // Remove pulse glow initially if resetting or starting
        const nextBtn = document.getElementById('btn-reveal-next');
        if (nextBtn && !candlesBlown) nextBtn.classList.remove('pulse-glow');
      } else if (nextStepId === 'message') {
        startTypewriter();
        const nextBtn = document.getElementById('btn-message-next');
        if (nextBtn) nextBtn.classList.remove('pulse-glow');
      } else if (nextStepId === 'final') {
        spawnConfetti(window.innerWidth / 2, window.innerHeight / 3, 150);
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            spawnConfetti(Math.random() * window.innerWidth, Math.random() * (window.innerHeight * 0.4), 80);
          }, (i + 1) * 1000);
        }
      }
    }, 600);
  }

  /* --- BALLOON SPARKLE GENERATOR --- */
  function spawnBalloons() {
    const wrapper = document.getElementById('balloons-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = ""; // Clear old balloons

    const colors = [
      'rgba(255, 75, 139, 0.85)',   // Primary Pink
      'rgba(168, 85, 247, 0.85)',  // Secondary Purple
      'rgba(255, 215, 0, 0.85)',    // Accent Gold
      'rgba(56, 189, 248, 0.85)',   // Sky Blue
      'rgba(244, 63, 94, 0.85)',    // Rose Red
      'rgba(16, 185, 129, 0.85)'    // Emerald Green
    ];

    const emojis = ['🎈', '✨', '💖', '🎉', '🎁', '🎂'];

    const numBalloons = 16;
    for (let i = 0; i < numBalloons; i++) {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';

      const color = colors[Math.floor(Math.random() * colors.length)];
      balloon.style.backgroundColor = color;

      const leftOffset = Math.random() * 90 + 5; // 5% to 95%
      const sizeWidth = Math.random() * 15 + 50; // 50px to 65px
      const sizeHeight = sizeWidth * 1.25;
      const animDuration = Math.random() * 6 + 10; // 10s to 16s
      const animDelay = Math.random() * 5;

      balloon.style.left = `${leftOffset}%`;
      balloon.style.width = `${sizeWidth}px`;
      balloon.style.height = `${sizeHeight}px`;
      balloon.style.animationDuration = `${animDuration}s`;
      balloon.style.animationDelay = `${animDelay}s`;

      if (Math.random() > 0.4) {
        balloon.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      }

      wrapper.appendChild(balloon);
    }
  }

  /* --- WELCOME BUTTON & INITIAL TRANSITION --- */
  const btnOpenSurprise = document.getElementById('btn-open-surprise');
  if (btnOpenSurprise) {
    btnOpenSurprise.addEventListener('click', () => {
      if (!isPlaying) toggleAudio();
      spawnConfetti(window.innerWidth / 2, window.innerHeight / 2, 100);
      goToStep(1);
    });
  }

  /* --- 5. INTERACTIVE CAKE & CANDLE BLOWING --- */
  const cakeEl = document.getElementById('cake');
  const btnBlowCandles = document.getElementById('btn-blow-candles');
  const flames = document.querySelectorAll('.flame');
  const smokes = document.querySelectorAll('.smoke');
  let candlesBlown = false;

  function blowOutCandles() {
    if (candlesBlown) return;
    candlesBlown = true;

    flames.forEach(f => f.classList.add('out'));
    smokes.forEach(s => s.classList.add('active'));

    spawnConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 120);

    btnBlowCandles.querySelector('span').textContent = "✨ Wish Made! ❤️";

    const nextBtn = document.getElementById('btn-reveal-next');
    if (nextBtn) {
      nextBtn.classList.add('pulse-glow');
    }

    setTimeout(() => {
      flames.forEach(f => f.classList.remove('out'));
      smokes.forEach(s => s.classList.remove('active'));
      candlesBlown = false;
      btnBlowCandles.querySelector('span').textContent = "🕯️ Tap Cake to Blow Candles";
    }, 10000);
  }

  if (cakeEl) cakeEl.addEventListener('click', blowOutCandles);
  if (btnBlowCandles) btnBlowCandles.addEventListener('click', blowOutCandles);

  /* --- 6. TYPEWRITER ANIMATION ENGINE --- */
  const typingTextEl = document.getElementById('typing-text');
  const btnTypePause = document.getElementById('btn-type-pause');
  const btnTypeReplay = document.getElementById('btn-type-replay');

  let typeIndex = 0;
  let isTypingPaused = false;
  let typewriterTimeout = null;

  function updatePauseButtonState(paused) {
    if (!btnTypePause) return;
    const span = btnTypePause.querySelector('span');
    if (!span) return;
    if (paused) {
      span.innerHTML = `<svg class="btn-nav-icon btn-nav-icon-left" style="width: 14px; height: 14px; margin-right: 6px; display: inline-block; vertical-align: middle; stroke: currentColor;" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>Resume`;
    } else {
      span.innerHTML = `<svg class="btn-nav-icon btn-nav-icon-left" style="width: 14px; height: 14px; margin-right: 6px; display: inline-block; vertical-align: middle; stroke: currentColor;" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg>Pause`;
    }
  }

  function startTypewriter() {
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    typingTextEl.textContent = "";
    typeIndex = 0;
    isTypingPaused = false;
    updatePauseButtonState(false);

    const nextBtn = document.getElementById('btn-message-next');
    if (nextBtn) nextBtn.classList.remove('pulse-glow');

    typeNextChar();
  }

  function typeNextChar() {
    const fullText = appConfig.messageText;
    if (typeIndex < fullText.length) {
      if (!isTypingPaused) {
        typingTextEl.textContent += fullText.charAt(typeIndex);
        typeIndex++;
      }
      const delay = fullText.charAt(typeIndex - 1) === '.' ? 350 : (fullText.charAt(typeIndex - 1) === '\n' ? 500 : 40);
      typewriterTimeout = setTimeout(typeNextChar, delay);
    } else {
      const nextBtn = document.getElementById('btn-message-next');
      if (nextBtn) {
        nextBtn.classList.add('pulse-glow');
      }
    }
  }

  if (btnTypePause) {
    btnTypePause.addEventListener('click', () => {
      isTypingPaused = !isTypingPaused;
      updatePauseButtonState(isTypingPaused);
    });
  }

  if (btnTypeReplay) {
    btnTypeReplay.addEventListener('click', startTypewriter);
  }

  /* --- 7. PHOTO GALLERY 3D SWIPE STACK --- */
  const photoStackEl = document.getElementById('photo-stack');
  let activeIndex = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  function renderGallery() {
    if (!photoStackEl) return;
    photoStackEl.innerHTML = "";
    
    appConfig.photos.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'stack-card';
      card.innerHTML = `
        <div class="stack-card-image-wrapper">
          <img src="${photo.url}" alt="${photo.caption}" loading="lazy" />
        </div>
        <div class="stack-card-caption">${photo.caption}</div>
      `;
      setupCardDrag(card, idx);
      photoStackEl.appendChild(card);
    });

    updateStackLayout();

    if (steps[currentStepIndex] === 'gallery') {
      revealStepElements('gallery');
    }
  }

  function updateStackLayout() {
    if (!photoStackEl) return;
    const cards = photoStackEl.querySelectorAll('.stack-card');
    cards.forEach((card, idx) => {
      if (idx < activeIndex) {
        card.style.transform = `translate3d(${card.dataset.swipeX || '-150%'}, ${card.dataset.swipeY || '0px'}, 0px) rotate(${card.dataset.swipeRotate || '-30deg'})`;
        card.style.opacity = "0";
        card.style.pointerEvents = "none";
      } else if (idx === activeIndex) {
        card.style.transform = "translate3d(0, 0, 0) rotate(0deg) scale(1)";
        card.style.opacity = "1";
        card.style.pointerEvents = "auto";
        card.style.zIndex = "10";
      } else {
        const stackOffset = idx - activeIndex;
        if (stackOffset === 1) {
          card.style.transform = "translate3d(0, 8px, -15px) rotate(2deg) scale(0.96)";
          card.style.opacity = "0.95";
          card.style.zIndex = "9";
        } else if (stackOffset === 2) {
          card.style.transform = "translate3d(0, 16px, -30px) rotate(-2deg) scale(0.92)";
          card.style.opacity = "0.75";
          card.style.zIndex = "8";
        } else {
          card.style.transform = "translate3d(0, 24px, -45px) rotate(1deg) scale(0.88)";
          card.style.opacity = "0";
          card.style.zIndex = "7";
        }
        card.style.pointerEvents = "none";
      }
    });
  }

  function setupCardDrag(card, idx) {
    const onStart = (e) => {
      if (idx !== activeIndex) return;
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      startX = clientX;
      startY = clientY;
      card.style.transition = "none";
      card.style.cursor = "grabbing";
    };

    const onMove = (e) => {
      if (!isDragging || idx !== activeIndex) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      currentX = clientX - startX;
      currentY = clientY - startY;
      const rotate = currentX * 0.08;
      card.style.transform = `translate3d(${currentX}px, ${currentY}px, 0px) rotate(${rotate}deg)`;
    };

    const onEnd = () => {
      if (!isDragging || idx !== activeIndex) return;
      isDragging = false;
      card.style.cursor = "grab";
      card.style.transition = "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease";

      const threshold = 100;
      if (Math.abs(currentX) > threshold) {
        swipeCard(card, currentX > 0 ? "right" : "left");
      } else {
        currentX = 0;
        currentY = 0;
        updateStackLayout();
      }
    };

    card.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    card.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', (e) => {
      if (isDragging && idx === activeIndex) {
        if (e.cancelable) e.preventDefault();
        onMove(e);
      }
    }, { passive: false });
    document.addEventListener('touchend', onEnd);

    card.addEventListener('click', () => {
      if (Math.abs(currentX) < 5) {
        swipeCard(card, "right");
      }
    });
  }

  function swipeCard(card, direction) {
    const swipeX = direction === "right" ? "150%" : "-150%";
    const swipeRotate = direction === "right" ? "30deg" : "-30deg";
    
    card.dataset.swipeX = swipeX;
    card.dataset.swipeRotate = swipeRotate;
    card.dataset.swipeY = `${currentY}px`;
    
    card.style.transition = "transform 0.6s ease-out, opacity 0.6s ease-out";
    card.style.transform = `translate3d(${swipeX}, ${currentY}px, 0px) rotate(${swipeRotate})`;
    card.style.opacity = "0";
    card.style.pointerEvents = "none";
    
    activeIndex++;
    
    if (activeIndex >= appConfig.photos.length) {
      setTimeout(() => {
        activeIndex = 0;
        const cards = photoStackEl.querySelectorAll('.stack-card');
        cards.forEach(c => {
          c.style.transition = "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.8s ease";
          delete c.dataset.swipeX;
          delete c.dataset.swipeRotate;
          delete c.dataset.swipeY;
        });
        updateStackLayout();
      }, 800);
    } else {
      setTimeout(updateStackLayout, 200);
    }
    
    currentX = 0;
    currentY = 0;
  }

  /* --- 8. INTERACTIVE CINEMATIC SURPRISE --- */
  const btnTriggerSurprise = document.getElementById('btn-trigger-surprise');
  const cinematicOverlay = document.getElementById('cinematic-overlay');
  const cinematicTitle = document.getElementById('cinematic-title');
  const cinematicSub = document.getElementById('cinematic-sub');
  const cinematicCloseBtn = document.querySelector('.cinematic-close');
  const btnCloseCinematic = document.getElementById('btn-close-cinematic');

  if (btnTriggerSurprise) {
    btnTriggerSurprise.addEventListener('click', () => {
      cinematicOverlay.classList.add('active');
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          spawnConfetti(
            Math.random() * width,
            Math.random() * (height * 0.5),
            80
          );
        }, i * 300);
      }
      setTimeout(() => cinematicTitle.classList.add('show'), 400);
      setTimeout(() => cinematicSub.classList.add('show'), 1000);
      setTimeout(() => cinematicCloseBtn.classList.add('show'), 1800);
    });
  }

  if (btnCloseCinematic) {
    btnCloseCinematic.addEventListener('click', () => {
      cinematicOverlay.classList.remove('active');
      cinematicTitle.classList.remove('show');
      cinematicSub.classList.remove('show');
      cinematicCloseBtn.classList.remove('show');

      goToStep(7); // Proceed to Final step (index 7)
    });
  }

  /* --- STEP-BY-STEP GENERAL BACK & NEXT NAVIGATION BUTTONS --- */
  document.querySelectorAll('.btn-step-back').forEach(btn => {
    btn.addEventListener('click', () => {
      goToStep(currentStepIndex - 1);
    });
  });

  const nextBtnMap = {
    'btn-reveal-next': 2,    // Go to message
    'btn-message-next': 3,   // Go to gallery
    'btn-gallery-next': 4,   // Go to reasons
    'btn-reasons-next': 5,   // Go to wishes
    'btn-wishes-next': 6,    // Go to surprise
  };

  Object.entries(nextBtnMap).forEach(([btnId, targetIndex]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        goToStep(targetIndex);
      });
    }
  });

  const btnFinalRestart = document.getElementById('btn-final-restart');
  if (btnFinalRestart) {
    btnFinalRestart.addEventListener('click', () => {
      maxStepVisited = 0;
      goToStep(0);
    });
  }

  /* --- 9. PERSONALIZER MODAL DRAWER --- */
  const btnOpenPersonalizer = document.getElementById('btn-open-personalizer');
  const modalPersonalizer = document.getElementById('modal-personalizer');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnSavePersonalizer = document.getElementById('btn-save-personalizer');
  const btnResetPersonalizer = document.getElementById('btn-reset-personalizer');

  if (btnOpenPersonalizer) {
    btnOpenPersonalizer.addEventListener('click', () => {
      modalPersonalizer.classList.add('active');
    });
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => {
      modalPersonalizer.classList.remove('active');
    });
  }

  if (btnSavePersonalizer) {
    btnSavePersonalizer.addEventListener('click', () => {
      const newName = document.getElementById('input-name').value.trim() || "Noor";
      const newMsg = document.getElementById('input-message').value.trim() || appConfig.messageText;

      saveConfig({ recipientName: newName, messageText: newMsg });
      modalPersonalizer.classList.remove('active');
      spawnConfetti(window.innerWidth / 2, window.innerHeight / 2, 60);
    });
  }

  if (btnResetPersonalizer) {
    btnResetPersonalizer.addEventListener('click', () => {
      saveConfig(DEFAULT_CONFIG);
      modalPersonalizer.classList.remove('active');
    });
  }

  /* --- 9.5 REASONS CARD FLIP EVENT LISTENERS --- */
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  /* --- INITIALIZATION --- */
  applyConfigToDOM();
  initProgressDots();
  revealStepElements('hero');

});
