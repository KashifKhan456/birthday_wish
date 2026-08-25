# 🌸 Romantic Birthday Surprise Experience

An immersive, highly interactive, and premium multi-step birthday slideshow application built for a modern, romantic, and tactile storytelling experience. This application guides the recipient through a beautifully paced narrative containing custom animations, typewriter messaging, gestural swipe mechanics, and canvas-rendered celebrations.

---

## ✨ Features

### 1. 🎬 Cinematic Entry Screen
*   A welcoming glassmorphic card customized with the recipient's name.
*   Clicking **"Open Your Surprise 🎁"** initiates background romantic ambient audio and launches custom confetti bursts.

### 2. 🎂 Interactive Candle Blowing
*   A beautifully structured, CSS-nested birthday cake layers element.
*   **Tactile interaction**: Clicking the top layer of the cake "blows out" the candles, producing a celebratory confetti burst, spawning floating balloons, and unlocking the path forward.

### 3. ✍️ Custom Typewriter Message
*   A dedicated writing page that slowly types out a heartfelt message letter-by-letter.
*   Includes **Pause/Resume** and **Replay** controls utilizing outline SVG indicators.
*   Decorated with a subtle, non-intrusive floating Cherry Blossom (`🌸`) ornament in the top-right corner.

### 4. 📸 3D Stacked Polaroid Swipe Deck
*   Instead of a traditional flat grid, photos are stacked like physical Polaroid pictures with realistic paper borders.
*   **Gesture Mechanics**: Recipients can click-and-drag (desktop) or swipe (mobile) cards to flick them off the screen with organic rotating physics.
*   **Infinite Loop**: Once all memories are swiped away, the stack automatically resets back into place.

### 5. 🔮 3D "Reasons You're Special" Cards
*   An interactive grid of mystery cards each marked with a pulsing question mark (`?`).
*   Tapping a card triggers a smooth, gradual 3D flip animation to reveal personal reasons.

### 6. 🌟 My Wishes For You
*   A beautiful grid of customizable gold-themed wishes highlighting Happiness, Success, Love, and Beautiful Memories.

### 7. 🎁 Interactive Surprise Box
*   A dramatic fullscreen night-sky overlay with hardware-accelerated canvas fireworks and exploding particles triggered by clicking the cinematic next button.

### 8. 🎉 Celebration Final Screen
*   A joyous confetti-shower backdrop featuring the final greeting header.
*   Includes a customized loop restart button using clean vector SVGs to replay the entire experience.

---

## 🛠️ Technical Stack

*   **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Canvas Engine**: Custom HTML5 2D Canvas particles for stars, balloons, and confetti bursts.
*   **Build Utility**: [Vite](https://vite.dev/) for high-speed local serving and optimized production code bundling.

---

## ⚙️ Configuration & Customization

The application supports direct in-app customization through the **Settings Gear** button in the bottom-left corner of the viewport. Configuration parameters (Recipient Name and Herzfelt Message text) are persisted in the browser's `localStorage` and synced instantly.

Default values can also be adjusted inside `src/App.tsx` by modifying the `DEFAULT_CONFIG` constant.

---

## 📂 Project Directory Structure

```text
src/
├── types/
│   └── index.ts                 # Shared Types/Interfaces (PhotoData, AppConfig, BalloonData)
├── components/
│   ├── BackgroundCanvas.tsx     # Canvas rendering loop (star fields & confetti bursts)
│   ├── BalloonsOverlay.tsx      # Emitter logic for floating birthday balloons
│   ├── PersonalizerModal.tsx    # Dialog card for modifying recipient name & letter message
│   ├── FloatingControls.tsx     # Settings gear & music toggle absolute controllers
│   └── steps/
│       ├── HeroStep.tsx         # Step 0: Welcome page
│       ├── CakeStep.tsx         # Step 1: Interactive candle blow cake page
│       ├── MessageStep.tsx      # Step 2: Letter page with typewriter typing controls
│       ├── GalleryStep.tsx      # Step 3: Polaroid 3D swipe memory gallery
│       ├── ReasonsStep.tsx      # Step 4: 3D Reasons Flip Cards
│       ├── WishesStep.tsx       # Step 5: Gold Wishes grid page
│       ├── SurpriseStep.tsx     # Step 6: Final Cinematic trigger box page
│       └── FinalStep.tsx        # Step 7: Ending birthday page
├── App.tsx                      # Primary layout orchestrator & state manager
├── index.css                    # Custom styles and Tailwind theme modifications
└── main.tsx                     # React root initialization
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```
*Compiles and optimizes all assets into the `/dist` directory, ready to be hosted on services like Vercel, Netlify, or GitHub Pages.*
