/** Each theme restyles the whole page: background scene, colours and panel. */
export type ThemeId = "space" | "library" | "d2";

export type Chapter = {
  title: string;
  url: string;
  note: string;
  theme: ThemeId;
};

/** Per-theme copy (card ornament). Colours live in app/globals.css, scenes in app/components/scenes/. */
export const themes: Record<ThemeId, { ornament: string }> = {
  space: { ornament: "* .  +   ." },
  library: { ornament: "— ex libris —" },
  d2: { ornament: "GG · WP" },
};

export const site = {
  name: "thisnot.my.id",
  // Add new chapters to the end of this list; numbering is automatic.
  chapters: [
    { title: "DIR-DIARE", url: "https://dir.thisnot.my.id", note: "diary", theme: "space" },
    { title: "UKBOOK", url: "https://buku.thisnot.my.id", note: "bookshelf", theme: "library" },
    { title: "PERSONAL-D2", url: "https://d2.thisnot.my.id", note: "dota 2 stats", theme: "d2" },
  ] satisfies Chapter[] as Chapter[],
};
