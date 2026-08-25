import { Music, Settings } from 'lucide-react';

interface FloatingControlsProps {
  isPlaying: boolean;
  onToggleAudio: () => void;
  onOpenPersonalizer: () => void;
}

export default function FloatingControls({
  isPlaying,
  onToggleAudio,
  onOpenPersonalizer
}: FloatingControlsProps) {
  return (
    <>
      {/* Music Control Button */}
      <div className="floating-controls fixed top-6 md:top-auto bottom-auto md:bottom-6 right-6 z-999 flex flex-col gap-3">
        <button
          onClick={onToggleAudio}
          className={`icon-btn w-12 h-12 rounded-full text-white text-xl flex items-center justify-center cursor-pointer shadow-lg transition-all duration-500 border border-white/20 bg-white/10 backdrop-blur ${
            isPlaying ? 'bg-linear-to-br from-primary to-secondary animate-spinSlow' : 'hover:bg-primary'
          }`}
          title="Play/Pause Background Music"
        >
          {isPlaying ? <Music className="w-5 h-5" /> : <Music className="w-5 h-5 opacity-60" />}
        </button>
      </div>

      {/* Settings Control Button */}
      <div className="floating-left-controls fixed top-6 md:top-auto bottom-auto md:bottom-6 left-6 z-999">
        <button
          onClick={onOpenPersonalizer}
          className="icon-btn w-12 h-12 rounded-full text-white text-xl flex items-center justify-center cursor-pointer shadow-lg transition-all duration-500 border border-white/20 bg-white/10 backdrop-blur hover:bg-primary"
          title="Personalize Birthday Surprise"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
