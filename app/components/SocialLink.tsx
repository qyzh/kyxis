export default function SocialLink({ label, url }: { label: string, url: string }) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      aria-label={`Open ${label} profile`}
      className="flex items-end w-full hover:underline hover:decoration-[var(--color-ink)] min-h-[44px] py-1 cursor-pointer group"
    >
      <span className="text-[14px] font-bold uppercase whitespace-nowrap text-[var(--color-ink)]">- {label}</span>
      <span className="flex-grow border-b border-dotted border-[var(--color-ink-faint)] mx-3 mb-[6px] opacity-60"></span>
      <span className="text-[12px] font-medium text-[var(--color-ink-faint)] truncate max-w-[50%] sm:max-w-none group-hover:text-[var(--color-ink)] transition-colors">{url.replace(/^https?:\/\//, '')}</span>
    </a>
  );
}
