export default function sitemap() {
  return [
    {
      url: "https://kyxis.my.id",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
  ];
}
