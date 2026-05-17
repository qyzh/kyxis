import { profile } from "@/lib/content";
import ReportHeader from "./components/ReportHeader";
import ReportField from "./components/ReportField";
import SectionDivider from "./components/SectionDivider";
import Redacted from "./components/Redacted";
import SocialLink from "./components/SocialLink";
import Stamp from "./components/Stamp";

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
            sameAs: [
              "https://github.com/qyzh",
              "https://x.com/asetdunia",
              "https://www.instagram.com/syauqashdllh/",
              "https://unsplash.com/id/@syauqashdllh",
            ],
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
          <ReportField label="NAME" value={<Redacted length={profile.name.length} />} />
          <ReportField label="LOCATION" value={`[${profile.location}]`} />
        </div>
        
        <SectionDivider number={1} title="DESCRIPTION" />
        <div className="text-[14px] leading-loose max-w-[550px] mb-8 font-medium">
          <p>{profile.bio}</p>
        </div>

        <SectionDivider number={2} title="ASSOCIATED FILES" />
        <div className="flex flex-col mb-16 w-full">
          {profile.links.map((link, idx) => (
            <SocialLink key={idx} label={link.label} url={link.url} />
          ))}
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-b border-[var(--color-border)] py-4 relative">
          <Redacted length={24} />
          <Stamp text="CLASSIFIED" className="absolute right-4 -top-8 bg-[var(--color-paper)]" />
        </div>

      </main>
    </div>
  );
}

