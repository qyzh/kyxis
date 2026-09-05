export default function ReportHeader({ dept, caseFile, date }: { dept: string, caseFile: string, date?: string }) {
  return (
    <div className="reveal-fade flex border-b border-[var(--color-border)] pb-4 mb-6 flex-col md:flex-row md:justify-between text-[var(--color-ink-faint)] text-[12px] font-medium uppercase tracking-wide" style={{ ["--base-delay" as string]: "40ms" }}>
      <div>
        <p>{dept}</p>
      </div>
      <div className="md:text-right mt-2 md:mt-0">
        <p>CASE FILE: {caseFile}</p>
        {date && <p>DATE: {date}</p>}
      </div>
    </div>
  );
}
