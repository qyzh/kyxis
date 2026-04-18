import Image from 'next/image';

export default function PhotoAttachment({ src, alt, caption = "ATTACHMENT A - SUBJECT IMAGE" }: { src: string, alt: string, caption?: string }) {
  return (
    <div className="flex flex-col mb-6 md:mb-0 md:mr-8 w-full md:w-[150px] lg:w-[200px] shrink-0">
      <div className="border border-[var(--color-border)] p-[3px] bg-[#fafafa] mb-2">
        <div className="relative w-full aspect-[4/5] border border-[var(--color-border)] overflow-hidden grayscale contrast-125 sepia-[0.2]">
          <Image 
            src={src} 
            alt={alt} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 200px"
            priority
          />
        </div>
      </div>
      <p className="text-[11px] text-[var(--color-ink-faint)] uppercase tracking-wide leading-tight">{caption}</p>
    </div>
  );
}
