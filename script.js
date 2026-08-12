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
  const floatingHearts = [];
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

  // Heart Constructor
  function createHeart() {
    return {
      x: Math.random() * width,
      y: height + 20,
      size: Math.random() * 14 + 10,
      speedY: Math.random() * 1.5 + 0.8,
      swaySpeed: Math.random() * 0.03 + 0.01,
      swayRange: Math.random() * 30 + 10,
      angle: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.6 + 0.3,
      color: ['#ff4b8b', '#a855f7', '#ff80bf', '#ffd700'][Math.floor(Math.random() * 4)]
    };
  }

  for (let i = 0; i < 20; i++) {
    floatingHearts.push(createHeart());
  }

  // Draw Heart Helper
  function drawHeart(x, y, size, color, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    // top left curve
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    // bottom left curve
    ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
    // bottom right curve
    ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    // top right curve
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
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

    // 2. Draw Floating Hearts
    floatingHearts.forEach((h, idx) => {
      h.y -= h.speedY;
      h.angle += h.swaySpeed;
      h.x += Math.sin(h.angle) * 0.5;

      drawHeart(h.x, h.y, h.size, h.color, h.opacity);

      if (h.y < -30) {
        floatingHearts[idx] = createHeart();
      }
    });

    // 3. Draw Confetti
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

  /* --- 4. WELCOME BUTTON & TRANSITION --- */
  const btnOpenSurprise = document.getElementById('btn-open-surprise');
  btnOpenSurprise.addEventListener('click', () => {
    // 1. Play Music
    if (!isPlaying) toggleAudio();

    // 2. Confetti Burst
    spawnConfetti(window.innerWidth / 2, window.innerHeight / 2, 100);

    // 3. Smooth Scroll to Birthday Reveal
    document.getElementById('reveal').scrollIntoView({ behavior: 'smooth' });
  });

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

    // Trigger celebration confetti
    spawnConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 120);

    btnBlowCandles.querySelector('span').textContent = "✨ Wish Made! ❤️";

    // Reset after 10 seconds
    setTimeout(() => {
      flames.forEach(f => f.classList.remove('out'));
      smokes.forEach(s => s.classList.remove('active'));
      candlesBlown = false;
      btnBlowCandles.querySelector('span').textContent = "🕯️ Tap Cake to Blow Candles";
    }, 10000);
  }

  cakeEl.addEventListener('click', blowOutCandles);
  btnBlowCandles.addEventListener('click', blowOutCandles);

  /* --- 6. TYPEWRITER ANIMATION ENGINE --- */
  const typingTextEl = document.getElementById('typing-text');
  const btnTypePause = document.getElementById('btn-type-pause');
  const btnTypeReplay = document.getElementById('btn-type-replay');

  let typeIndex = 0;
  let isTypingPaused = false;
  let typewriterTimeout = null;

  function startTypewriter() {
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    typingTextEl.textContent = "";
    typeIndex = 0;
    isTypingPaused = false;
    btnTypePause.querySelector('span').textContent = "⏸️ Pause";
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
    }
  }

  btnTypePause.addEventListener('click', () => {
    isTypingPaused = !isTypingPaused;
    btnTypePause.querySelector('span').textContent = isTypingPaused ? "▶️ Resume" : "⏸️ Pause";
  });

  btnTypeReplay.addEventListener('click', startTypewriter);

  /* --- 7. PHOTO GALLERY & LIGHTBOX MODAL --- */
  const photoGridEl = document.getElementById('photo-grid');
  const lightboxModal = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentPhotoIndex = 0;

  function renderGallery() {
    photoGridEl.innerHTML = "";
    appConfig.photos.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'photo-card reveal-on-scroll';
      card.innerHTML = `
        <img src="${photo.url}" alt="${photo.caption}" loading="lazy" />
        <div class="photo-overlay">
          <div class="photo-caption">${photo.caption}</div>
        </div>
      `;
      card.addEventListener('click', () => openLightbox(idx));
      photoGridEl.appendChild(card);
    });
    observeScrollElements();
  }

  function openLightbox(index) {
    currentPhotoIndex = index;
    updateLightbox();
    lightboxModal.classList.add('active');
  }

  function updateLightbox() {
    const photo = appConfig.photos[currentPhotoIndex];
    lightboxImg.src = photo.url;
    lightboxCaption.textContent = photo.caption;
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => {
    currentPhotoIndex = (currentPhotoIndex - 1 + appConfig.photos.length) % appConfig.photos.length;
    updateLightbox();
  });
  lightboxNext.addEventListener('click', () => {
    currentPhotoIndex = (currentPhotoIndex + 1) % appConfig.photos.length;
    updateLightbox();
  });

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  /* --- 8. INTERACTIVE CINEMATIC SURPRISE --- */
  const btnTriggerSurprise = document.getElementById('btn-trigger-surprise');
  const cinematicOverlay = document.getElementById('cinematic-overlay');
  const cinematicTitle = document.getElementById('cinematic-title');
  const cinematicSub = document.getElementById('cinematic-sub');
  const cinematicCloseBtn = document.querySelector('.cinematic-close');
  const btnCloseCinematic = document.getElementById('btn-close-cinematic');

  btnTriggerSurprise.addEventListener('click', () => {
    // 1. Activate Overlay
    cinematicOverlay.classList.add('active');

    // 2. Firework shower
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        spawnConfetti(
          Math.random() * width,
          Math.random() * (height * 0.5),
          80
        );
      }, i * 300);
    }

    // 3. Sequential Reveal
    setTimeout(() => cinematicTitle.classList.add('show'), 400);
    setTimeout(() => cinematicSub.classList.add('show'), 1000);
    setTimeout(() => cinematicCloseBtn.classList.add('show'), 1800);
  });

  btnCloseCinematic.addEventListener('click', () => {
    cinematicOverlay.classList.remove('active');
    cinematicTitle.classList.remove('show');
    cinematicSub.classList.remove('show');
    cinematicCloseBtn.classList.remove('show');
  });

  /* --- 9. PERSONALIZER MODAL DRAWER --- */
  const btnOpenPersonalizer = document.getElementById('btn-open-personalizer');
  const modalPersonalizer = document.getElementById('modal-personalizer');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnSavePersonalizer = document.getElementById('btn-save-personalizer');
  const btnResetPersonalizer = document.getElementById('btn-reset-personalizer');

  btnOpenPersonalizer.addEventListener('click', () => {
    modalPersonalizer.classList.add('active');
  });

  btnCloseModal.addEventListener('click', () => {
    modalPersonalizer.classList.remove('active');
  });

  btnSavePersonalizer.addEventListener('click', () => {
    const newName = document.getElementById('input-name').value.trim() || "Noor";
    const newMsg = document.getElementById('input-message').value.trim() || appConfig.messageText;

    saveConfig({ recipientName: newName, messageText: newMsg });
    modalPersonalizer.classList.remove('active');
    spawnConfetti(window.innerWidth / 2, window.innerHeight / 2, 60);
  });

  btnResetPersonalizer.addEventListener('click', () => {
    saveConfig(DEFAULT_CONFIG);
    modalPersonalizer.classList.remove('active');
  });

  /* --- 10. SCROLL REVEAL OBSERVER --- */
  function observeScrollElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
  }

  /* --- INITIALIZATION --- */
  applyConfigToDOM();
  observeScrollElements();

});
