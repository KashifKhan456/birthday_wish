# 🌸 Romantic Birthday Surprise Slide-Deck

An immersive, highly interactive, and premium multi-step birthday slideshow application built for a modern, romantic, and tactile storytelling experience. This application guides the recipient through a beautifully paced narrative containing custom animations, typewriter messaging, gestural swipe mechanics, and canvas-rendered celebrations.

---

## ✨ Features

### 1. 🎬 Cinematic Entry Screen
*   A welcoming glassmorphic card customized with the recipient's name.
*   Clicking **"Enter the Magic"** initiates background romantic ambient audio and launches custom confetti bursts.

### 2. 🎂 Interactive Candle Blowing
*   A beautifully structured, CSS-nested birthday cake layers element.
*   **Tactile interaction**: Clicking the top layer of the cake "blows out" the candles, producing a celebratory confetti burst and triggering the path forward.

### 3. ✍️ Custom Typewriter Message
*   A dedicated writing page that slowly types out a heartfelt message letter-by-letter.
*   Includes **Pause/Resume** and **Replay** controls utilizing outline SVG indicators.
*   Decorated with a subtle, non-intrusive floating Cherry Blossom (`🌸`) ornament in the top-right corner.

### 4. 📸 3D Stacked Polaroid Swipe Deck
*   Instead of a traditional flat grid, photos are stacked like physical Polaroid pictures with realistic paper borders and washi tape.
*   **Gesture Mechanics**: Recipients can click-and-drag (desktop) or swipe (mobile) cards to flick them off the screen with organic rotating physics.
*   **Fallback Tap**: Tapping a photo triggers an automatic swipe animation.
*   **Infinite Loop**: Once all memories are swiped away, the stack automatically resets back into place.

### 5. 🔮 3D "Reasons You're Special" Cards
*   An interactive grid of mystery cards each marked with a pulsing question mark (`?`).
*   Tapping a card triggers a smooth, gradual 3D flip animation (`1.2s` with custom easing) to reveal personal reasons.

### 6. 🎆 Cinematic Firework Surprise
*   A dramatic fullscreen night-sky overlay with hardware-accelerated canvas fireworks and exploding particles.

### 7. 🎉 Celebration Final Screen
*   A joyous confetti-shower backdrop featuring the final greeting header.
*   Includes a customized loop restart button using clean vector SVGs to replay the entire experience.

---

## 🛠️ Technical Stack

*   **Core**: HTML5, Vanilla JavaScript (ES6).
*   **Styling**: Raw Vanilla CSS3 featuring custom properties (Variables), glassmorphic design systems, and responsive `@media` layouts.
*   **Canvas Engine**: Custom HTML5 2D Canvas particles for stars, balloons, confetti, and fireworks.
*   **Build Utility**: [Vite](https://vite.dev/) for high-speed local serving and optimized production code bundling.

---

## ⚙️ Configuration & Customization

The application is designed to be easily customized. Inside [script.js](file:///c:/Users/Kashif/Documents/Kashif_Khan_Workspace/birthday_wish/script.js), modify the `DEFAULT_CONFIG` object:

```javascript
const DEFAULT_CONFIG = {
  recipientName: "Noor",
  messageText: "Your custom message text here...",
  photos: [
    { url: "assets/photo1.png", caption: "Caption 1 🌸" },
    { url: "assets/photo2.png", caption: "Caption 2 ✨" },
    // Add up to 6 or more photos
  ]
};
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
*Serves the site locally at `http://localhost:3000` (or the next available port).*

### 3. Build for Production
```bash
npm run build
```
*Compiles and optimizes all assets into the `/dist` directory, ready to be hosted on services like Vercel, Netlify, or GitHub Pages.*
