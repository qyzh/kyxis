export default function SectionDivider({ number, title }: { number: number, title: string }) {
  return (
    <div className="flex items-center w-full my-8 border-y border-[var(--color-border)] py-[6px] bg-[var(--color-surface)] px-2">
      <span className="font-bold mr-4 text-[14px]">{number}</span>
      <span className="uppercase text-[14px] font-bold tracking-widest">{title}</span>
    </div>
  );
}
