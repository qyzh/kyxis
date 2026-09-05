export default function ReportField({ label, value, index = 0 }: { label: string, value: React.ReactNode, index?: number }) {
  return (
    <div className="reveal-up flex flex-col sm:flex-row sm:items-end w-full mb-[10px]" style={{ ["--i" as string]: index, ["--base-delay" as string]: "160ms" } as React.CSSProperties}>
      <span className="text-[12px] text-[var(--color-ink-faint)] uppercase whitespace-nowrap font-bold">{label}</span>
      <span className="hidden sm:inline-block flex-grow border-b border-dotted border-[var(--color-ink-faint)] mx-2 mb-[4px] min-w-[20px]"></span>
      <span className="text-[14px] font-medium text-[var(--color-ink)] mt-1 sm:mt-0">{value}</span>
    </div>
  );
}
