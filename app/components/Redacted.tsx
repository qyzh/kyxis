export default function Redacted({ length = 10, className = "" }: { length?: number, className?: string }) {
  // block character: █
  const text = '█'.repeat(length);
  return (
    <span role="img" aria-label="redacted" className={`inline-block text-[var(--color-redact)] leading-none align-baseline tracking-[-1px] ${className}`}>
      {text}
    </span>
  );
}
