import { DeveloperLab } from '@/components/sections/DeveloperLab';

export function LabPage({ onMatrix }: { onMatrix?: () => void }) {
  return (
    <div className="pt-14">
      <DeveloperLab onMatrix={onMatrix} />
    </div>
  );
}
