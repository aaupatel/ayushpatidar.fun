import { useCallback, useEffect, useRef, useState } from 'react';
import { AssistantChat } from '@/components/assistant/AssistantChat';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/utils/cn';

type CharacterState = 'idle' | 'walking-left' | 'walking-right' | 'returning' | 'open';

const IDLE_DELAY = 1000;
const WALK_SPEED = 28;
const RETURN_SPEED = 50;
const WALK_RANGE = 0.35;

const SIZE_DESKTOP = 56;
const SIZE_MOBILE = 44;
const MARGIN_DESKTOP = 1;
const MARGIN_MOBILE = 1;

const SPRITE_URL = '/assets/ai-walk-sprite.webp';
const SPRITE_FRAMES = 4;
const WALK_ANIM_DURATION = '0.7s';
const IDLE_BOB_DURATION = '3s';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<CharacterState>('idle');
  const positionRef = useRef(0);
  const lastActivityRef = useRef(Date.now());
  const pendingOpenRef = useRef(false);
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);

  const updateState = useCallback((next: CharacterState) => {
    stateRef.current = next;
    if (next === 'open') setIsOpen(true);
    else if (next === 'idle') setIsOpen(false);

    const sprite = spriteRef.current;
    if (!sprite || reduced) return;

    const walking = next === 'walking-left' || next === 'walking-right' || next === 'returning';
    const flip = next === 'walking-left' ? -1 : 1;

    if (walking) {
      sprite.style.animation = `aiWalk ${WALK_ANIM_DURATION} steps(${SPRITE_FRAMES}) infinite`;
    } else {
      sprite.style.animation = 'none';
    }
    sprite.style.transform = `scaleX(${flip})`;
  }, [reduced]);

  const applyTransform = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    btn.style.transform = `translate3d(${-positionRef.current}px, 0, 0)`;
  }, []);

  const markActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    const current = stateRef.current;
    if (current === 'open' || current === 'idle' || current === 'returning') return;
    updateState('returning');
  }, [updateState]);

  useEffect(() => {
    if (reduced) return;
    const events: (keyof WindowEventMap)[] = ['scroll', 'click', 'keydown', 'touchstart', 'pointerdown'];
    events.forEach((e) => window.addEventListener(e, markActivity, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, markActivity));
  }, [markActivity, reduced]);

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      if (stateRef.current !== 'idle') return;
      if (Date.now() - lastActivityRef.current >= IDLE_DELAY) {
        updateState('walking-left');
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [reduced, updateState]);

  useEffect(() => {
    if (reduced) return;

    const step = (now: number) => {
      const dt = lastFrameRef.current ? (now - lastFrameRef.current) / 1000 : 0;
      lastFrameRef.current = now;

      const current = stateRef.current;

      if (current === 'walking-left') {
        const boundary = window.innerWidth * WALK_RANGE;
        const next = positionRef.current + WALK_SPEED * dt;
        if (next >= boundary) {
          positionRef.current = boundary;
          updateState('walking-right');
        } else {
          positionRef.current = next;
        }
        applyTransform();
      } else if (current === 'walking-right') {
        const next = positionRef.current - WALK_SPEED * dt;
        if (next <= 0) {
          positionRef.current = 0;
          updateState('idle');
          lastActivityRef.current = Date.now();
        } else {
          positionRef.current = next;
        }
        applyTransform();
      } else if (current === 'returning') {
        const next = positionRef.current - RETURN_SPEED * dt;
        if (next <= 0) {
          positionRef.current = 0;
          if (pendingOpenRef.current) {
            pendingOpenRef.current = false;
            updateState('open');
          } else {
            updateState('idle');
            lastActivityRef.current = Date.now();
          }
        } else {
          positionRef.current = next;
        }
        applyTransform();
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = 0;
    };
  }, [reduced, applyTransform, updateState]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        updateState('idle');
        lastActivityRef.current = Date.now();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, updateState]);

  useEffect(() => {
    if (!reduced) return;
    positionRef.current = 0;
    applyTransform();
    stateRef.current = isOpen ? 'open' : 'idle';
    const sprite = spriteRef.current;
    if (sprite) {
      sprite.style.animation = 'none';
      sprite.style.transform = 'scaleX(1)';
    }
  }, [reduced, isOpen, applyTransform]);

  const handleClick = () => {
    if (stateRef.current === 'open') return;
    if (positionRef.current > 0) {
      pendingOpenRef.current = true;
      updateState('returning');
    } else {
      updateState('open');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    updateState('idle');
    lastActivityRef.current = Date.now();
  };

  const size = isMobile ? SIZE_MOBILE : SIZE_DESKTOP;
  const margin = isMobile ? MARGIN_MOBILE : MARGIN_DESKTOP;
  const bobAnim = !reduced && !isOpen ? `aiBob ${IDLE_BOB_DURATION} ease-in-out infinite` : undefined;

  return (
    <>
      <style>{`
        @keyframes aiWalk {
          0%   { background-position: 0% 0; }
          100% { background-position: 100% 0; }
        }
        @keyframes aiBob {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-2px); }
        }
      `}</style>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        aria-label="Open AI Assistant"
        data-cursor="button"
        className={cn(
          'fixed z-[150] touch-manipulation',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-terminal-accent focus-visible:outline-offset-2',
        )}
        style={{
          right: `${margin}px`,
          bottom: `${margin}px`,
          width: `${size}px`,
          height: `${size}px`,
          willChange: 'transform',
        }}
      >
        <div
          className="w-full h-full"
          style={{ animation: bobAnim }}
        >
          <div
            ref={spriteRef}
            className="w-full h-full"
            style={{
              backgroundImage: `url(${SPRITE_URL})`,
              backgroundSize: `${SPRITE_FRAMES * 100}% 100%`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '0% 0',
              transform: 'scaleX(1)',
              transition: 'transform 0.25s ease',
            }}
          />
        </div>
      </button>

      {isOpen && (
        <div
          className="fixed z-[160]"
          style={{ bottom: `${size + margin + 8}px`, right: `${margin}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <AssistantChat onClose={handleClose} />
        </div>
      )}
    </>
  );
}
