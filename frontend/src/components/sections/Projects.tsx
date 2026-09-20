import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { projects } from '@/data/projects';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function Projects() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!root.current) return;

    if (reduced) {
      const ctx = gsap.context(() => {
        gsap.set('[data-project-card]', { opacity: 1, y: 0 });
      }, root);
      return () => ctx.revert();
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-project-card]',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        },
      );
    }, root);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <Section id="projects" animate={false}>
      <div ref={root}>
        <SectionHeading
          command="ls ./projects"
          title="Projects"
          subtitle="Real software systems I've designed and shipped."
        />
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
}
