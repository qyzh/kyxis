/** Each theme restyles the whole page: background scene, colours and panel. */
export type ThemeId = "space" | "library" | "d2";

export type Chapter = {
  title: string;
  url: string;
  note: string;
  tagline: string;
  theme: ThemeId;
};

/** Per-theme copy (card ornament, world label, code prefix, CTA). Colours live in app/globals.css, scenes in app/components/scenes/. */
export const themes: Record<
  ThemeId,
  { ornament: string; worldLabel: string; codePrefix: string; cta: string }
> = {
  space: {
    ornament: "* .  +   .",
    worldLabel: "DEEP SPACE",
    codePrefix: "SEC",
    cta: "TRANSMIT",
  },
  library: {
    ornament: "— ex libris —",
    worldLabel: "ARCHIVE STACKS",
    codePrefix: "CAT",
    cta: "OPEN",
  },
  d2: {
    ornament: "GG · WP",
    worldLabel: "PIXEL ARCADE",
    codePrefix: "STG",
    cta: "ENTER",
  },
};

export const site = {
  name: "thisnot.my.id",
  // Add new chapters to the end of this list; numbering is automatic.
  chapters: [
    {
      title: "DIR-DIARE",
      url: "https://dir.thisnot.my.id",
      note: "diary",
      tagline: "Late-night notes, dispatches & thoughts.",
      theme: "space",
    },
    {
      title: "UKBOOK",
      url: "https://buku.thisnot.my.id",
      note: "bookshelf",
      tagline: "Shelf of books read, kept & annotated.",
      theme: "library",
    },
    {
      title: "PERSONAL-D2",
      url: "https://d2.thisnot.my.id",
      note: "dota 2 stats",
      tagline: "Match history, heroes & winrate ledger.",
      theme: "d2",
    },
  ] satisfies Chapter[] as Chapter[],
};
