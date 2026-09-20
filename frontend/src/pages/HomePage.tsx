import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { ArchitectureLab } from '@/components/sections/ArchitectureLab';
import { Experience } from '@/components/sections/Experience';
import { GitHubActivity } from '@/components/sections/GitHubActivity';
import { DeveloperLab } from '@/components/sections/DeveloperLab';
import { Contact } from '@/components/sections/Contact';

export function HomePage({ onMatrix }: { onMatrix?: () => void }) {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <ArchitectureLab />
      <Experience />
      <GitHubActivity />
      <DeveloperLab onMatrix={onMatrix} />
      <Contact />
    </>
  );
}
