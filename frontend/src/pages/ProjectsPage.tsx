import { Projects } from '@/components/sections/Projects';
import { ArchitectureLab } from '@/components/sections/ArchitectureLab';
import { GitHubActivity } from '@/components/sections/GitHubActivity';

export function ProjectsPage() {
  return (
    <div className="pt-14">
      <Projects />
      <ArchitectureLab />
      <GitHubActivity />
    </div>
  );
}
