import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type RefTarget = React.RefObject<HTMLElement | null>;

const get = (el: HTMLElement | null) => (el ? el : undefined);

export const fadeIn = (ref: RefTarget, delay = 0) => {
  const el = get(ref.current);
  if (!el) return;
  gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.8, delay, ease: 'power2.out' });
};

export const slideUp = (ref: RefTarget, delay = 0, y = 30) => {
  const el = get(ref.current);
  if (!el) return;
  gsap.fromTo(
    el,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration: 0.9, delay, ease: 'power3.out' }
  );
};

export const reveal = (ref: RefTarget, trigger?: RefTarget, start = 'top 85%') => {
  const el = get(ref.current);
  if (!el) return;
  gsap.fromTo(
    el,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: trigger?.current ?? el,
        start,
        toggleActions: 'play none none none',
      },
    }
  );
};

export const textReveal = (ref: RefTarget, delay = 0) => {
  const el = get(ref.current);
  if (!el) return;
  const lines = el.querySelectorAll('[data-reveal-line]');
  if (!lines.length) {
    slideUp(ref, delay);
    return;
  }
  gsap.fromTo(
    lines,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay,
      stagger: 0.12,
      ease: 'power3.out',
    }
  );
};

export const stagger = (
  ref: RefTarget,
  selector: string,
  delay = 0,
  trigger?: RefTarget,
  start = 'top 85%'
) => {
  const el = get(ref.current);
  if (!el) return;
  const items = el.querySelectorAll(selector);
  if (!items.length) return;
  gsap.fromTo(
    items,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: trigger?.current ?? el,
        start,
        toggleActions: 'play none none none',
      },
    }
  );
};

export const parallax = (
  ref: RefTarget,
  strength = 80,
  trigger?: RefTarget,
  start = 'top bottom',
  end = 'bottom top'
) => {
  const el = get(ref.current);
  if (!el) return;
  gsap.to(el, {
    yPercent: strength / 10,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger?.current ?? el,
      start,
      end,
      scrub: true,
    },
  });
};

export const magnetic = (ref: RefTarget, strength = 0.3) => {
  const el = get(ref.current);
  if (!el) return;
  const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

  const onMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    xTo(x * strength);
    yTo(y * strength);
  };
  const onLeave = () => {
    xTo(0);
    yTo(0);
  };

  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);
  return () => {
    el.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseleave', onLeave);
  };
};

export const scrollProgress = (ref: RefTarget, bar: RefTarget) => {
  const el = get(ref.current);
  const barEl = get(bar.current);
  if (!el || !barEl) return;
  gsap.to(barEl, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    },
  });
};

export { gsap, ScrollTrigger };
