import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PhotoData } from '../../types';

interface GalleryStepProps {
  photos: PhotoData[];
  onBack: () => void;
  onNext: () => void;
}

export default function GalleryStep({
  photos,
  onBack,
  onNext
}: GalleryStepProps) {
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

    setTimeout(() => {
      setActivePhotoIndex(prev => {
        const next = prev + 1;
        if (next >= photos.length) {
          // Reset stack after all are swiped
          setTimeout(() => {
            setActivePhotoIndex(0);
            activeCardSwipeRef.current = {};
            setDragOffset({ x: 0, y: 0 });
          }, 400);
          return prev;
        }
        setDragOffset({ x: 0, y: 0 });
        return next;
      });
    }, 100);
  };

  return (
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
          {photos.map((photo, idx) => {
            const isCurrent = idx === activePhotoIndex;
            const isPast = idx < activePhotoIndex;
            const stackOffset = idx - activePhotoIndex;

            let style: React.CSSProperties = {};

            if (isPast) {
              const savedSwipe = activeCardSwipeRef.current;
              style = {
                transform: `translate3d(${savedSwipe.swipeX || '-150%'}, ${savedSwipe.swipeY || '0px'
                  }, 0px) rotate(${savedSwipe.swipeRotate || '-30deg'})`,
                opacity: 0,
                pointerEvents: 'none'
              };
            } else if (isCurrent) {
              style = {
                transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0px) rotate(${dragOffset.x * 0.08
                  }deg) scale(1)`,
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
                  if (isCurrent) {
                    e.preventDefault();
                    handleDragStart(e.clientX, e.clientY);
                  }
                }}
                onMouseMove={(e) => {
                  if (isCurrent && isDragging) {
                    handleDragMove(e.clientX, e.clientY);
                  }
                }}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={(e) => {
                  if (isCurrent) {
                    const touch = e.touches[0];
                    handleDragStart(touch.clientX, touch.clientY);
                  }
                }}
                onTouchMove={(e) => {
                  if (isCurrent && isDragging) {
                    const touch = e.touches[0];
                    handleDragMove(touch.clientX, touch.clientY);
                  }
                }}
                onTouchEnd={handleDragEnd}
                onClick={() => {
                  if (isCurrent && Math.abs(dragOffset.x) < 5) {
                    swipeCard('right');
                  }
                }}
              >
                <div className="stack-card-image-wrapper w-full h-57.5 md:h-67.5 overflow-hidden rounded border border-slate-200">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover pointer-events-none select-none"
                    draggable="false"
                  />
                </div>
                <div className="stack-card-caption mt-3 md:mt-4 font-['Caveat',cursive] text-2xl font-bold text-slate-800 text-center leading-tight select-text">
                  {photo.caption}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stack Control/Info Indicators */}
        <div className="photo-indicators mt-12 text-sm text-slate-300 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 z-10 flex items-center gap-2 select-none">
          <span className="font-semibold text-primary">{activePhotoIndex + 1}</span>
          <span className="opacity-55">/</span>
          <span>{photos.length}</span>
          <span className="ml-2 text-white/50 text-xs italic">Swipe or tap photo to see next</span>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="step-nav flex gap-4 w-full justify-center max-w-sm mt-4 z-10">
        <button onClick={onBack} className="btn-secondary btn-step-back flex items-center justify-center w-24">
          <ChevronLeft size={20} className="shrink-0 mr-1.5 transition-transform" /> Back
        </button>
        <button onClick={onNext} className="btn-glow btn-step-next flex-1 flex items-center justify-center">
          Why you’re special <ChevronRight size={20} className="shrink-0 ml-1.5 transition-transform" />
        </button>
      </div>
    </section>
  );
}
