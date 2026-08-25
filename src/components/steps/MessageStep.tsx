import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Mail, Play, Pause, RotateCcw } from 'lucide-react';

interface MessageStepProps {
  messageText: string;
  onBack: () => void;
  onNext: () => void;
}

export default function MessageStep({
  messageText,
  onBack,
  onNext
}: MessageStepProps) {
  const [typedText, setTypedText] = useState('');
  const [typeIndex, setTypeIndex] = useState(0);
  const [isTypingPaused, setIsTypingPaused] = useState(false);

  // Re-initialize or reset when messageText changes
  useEffect(() => {
    setTypedText('');
    setTypeIndex(0);
    setIsTypingPaused(false);
  }, [messageText]);

  useEffect(() => {
    if (isTypingPaused) return;

    if (typeIndex < messageText.length) {
      const char = messageText.charAt(typeIndex);
      const delay = char === '.' ? 350 : (char === '\n' ? 500 : 40);
      const timer = setTimeout(() => {
        setTypedText(prev => prev + char);
        setTypeIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [typeIndex, isTypingPaused, messageText]);

  const togglePause = () => {
    setIsTypingPaused(!isTypingPaused);
  };

  const handleReplay = () => {
    setTypedText('');
    setTypeIndex(0);
    setIsTypingPaused(false);
  };

  const isMessageFullyTyped = typeIndex >= messageText.length;

  return (
    <section className="flex flex-col items-center py-10 w-full animate-[stepFadeIn_0.8s_ease_forwards]">
      <div className="glass-card message-card w-full max-w-2xl text-left relative p-8">
        <span className="message-card-decoration absolute top-5 right-5 text-2xl animate-[floatFlower_4s_ease-in-out_infinite] select-none">
          🌸
        </span>

        <div className="message-card-header flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 mr-8 md:mr-10">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-primary" />
            <h3 className="font-heading text-xl md:text-2xl text-primary font-bold">
              A Little Message For You
            </h3>
          </div>
          <div className="message-controls flex gap-2">
            <button
              onClick={togglePause}
              disabled={isMessageFullyTyped}
              className="btn-secondary text-xs! px-3! py-1.5! hover:border-primary disabled:opacity-50 disabled:hover:border-white/20"
            >
              <span className="flex items-center gap-1.5">
                {isTypingPaused ? (
                  <Play className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                )}
                {isTypingPaused ? 'Resume' : 'Pause'}
              </span>
            </button>
            <button
              onClick={handleReplay}
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
          <span
            className={`typing-cursor inline-block w-0.75 h-[1.2em] bg-primary ml-0.5 align-middle ${
              isMessageFullyTyped ? 'hidden' : 'animate-[blink_0.8s_infinite]'
            }`}
          />
        </div>

        {/* Step Navigation */}
        <div className="step-nav flex gap-4 w-full justify-end max-w-none mt-4">
          <button onClick={onBack} className="btn-secondary btn-step-back flex items-center justify-center w-24">
            <ChevronLeft size={20} className="shrink-0 mr-1.5 transition-transform" /> Back
          </button>
          <button
            onClick={onNext}
            className={`btn-glow btn-step-next flex items-center justify-center w-56 ${
              isMessageFullyTyped ? 'pulse-glow border-2 border-primary/80' : ''
            }`}
          >
            Our memories <ChevronRight size={20} className="shrink-0 ml-1.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
