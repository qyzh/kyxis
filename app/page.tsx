import { profile } from "@/lib/content";
import ReportHeader from "./components/ReportHeader";
import ReportField from "./components/ReportField";
import SocialLink from "./components/SocialLink";

export default function Home() {
  const dateStr = new Date().toISOString().split('T')[0];

  return (
    <div className="flex min-h-[100dvh] justify-center px-5 py-6 sm:px-10 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Syauqi Ashadullah",
            alternateName: "@qyzh",
            url: "https://kyxis.my.id",
            sameAs: profile.links.map((l) => l.url),
          }),
        }}
      />
      <main className="w-full max-w-[680px]">
        <ReportHeader dept="RESEARCH DEPARTMENT" caseFile={profile.caseFile} date={dateStr} />

        <h1 className="sr-only">Syauqi Ashadullah</h1>
        <p className="text-[20px] uppercase font-bold tracking-widest mb-8 border-b-2 border-double border-[var(--color-border)] pb-2 inline-block">Incident Report — Subject Profile</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-1 mb-8">
          <ReportField label="TYPE" value="Personal" />
          <ReportField label="STATUS" value={<span className="font-bold">[{profile.status}]</span>} />
          <ReportField label="ID" value={profile.handle} />
          <ReportField label="SINCE" value={`[${profile.since}]`} />
          <ReportField label="NAME" value={<span role="img" aria-label="redacted" className="text-[var(--color-redact)] tracking-[-1px]">{'█'.repeat(profile.name.length)}</span>} />
          <ReportField label="LOCATION" value={`[${profile.location}]`} />
        </div>

        <Section title="DESCRIPTION" number={1} />
        <div className="text-[14px] leading-loose max-w-[550px] mb-8 font-medium">
          <p>{profile.bio}</p>
        </div>

        <Section title="ASSOCIATED FILES" number={2} />
        <div className="flex flex-col mb-16 w-full">
          {profile.links.map((link, idx) => (
            <SocialLink key={idx} label={link.label} url={link.url} />
          ))}
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-b border-[var(--color-border)] py-4 relative">
          <span role="img" aria-label="redacted" className="inline-block text-[var(--color-redact)] leading-none align-baseline tracking-[-1px]">{'█'.repeat(24)}</span>
          <span className="stamp absolute right-4 -top-8 bg-[var(--color-paper)]">CLASSIFIED</span>
        </div>

      </main>
    </div>
  );
}

function Section({ title, number }: { title: string, number: number }) {
  return (
    <div className="flex items-center w-full my-8 border-y border-[var(--color-border)] py-[6px] bg-[var(--color-surface)] px-2">
      <span className="font-bold mr-4 text-[14px]">{number}</span>
      <span className="uppercase text-[14px] font-bold tracking-widest">{title}</span>
    </div>
  );
}