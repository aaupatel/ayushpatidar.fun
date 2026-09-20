type Props = {
  command: string;
  title: string;
  subtitle?: string;
};

export function SectionHeading({ command, title, subtitle }: Props) {
  return (
    <div className="mb-6 sm:mb-8 md:mb-10">
      <div className="mono flex items-center gap-2 text-xs sm:text-sm text-terminal-green mb-2 sm:mb-3">
        <span className="text-terminal-dim">$</span>
        <span>{command}</span>
      </div>
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-terminal-text leading-[1.15]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 sm:mt-3 text-terminal-dim max-w-2xl text-sm sm:text-base leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
