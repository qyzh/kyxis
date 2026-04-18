export default function ReportField({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end w-full mb-[10px]">
      <span className="text-[12px] text-[var(--color-ink-faint)] uppercase whitespace-nowrap font-bold">{label}</span>
      <span className="hidden sm:inline-block flex-grow border-b border-dotted border-[var(--color-ink-faint)] mx-2 mb-[4px] min-w-[20px]"></span>
      <span className="text-[14px] font-medium text-[var(--color-ink)] mt-1 sm:mt-0">{value}</span>
    </div>
  );
}
