import Card from "@/app/components/ui/card";
type LinkExt = {
  id: number;
  name: string;
  link: string;
  desc: string;
};
const linkext: LinkExt[] = [
  {
    id: 0,
    name: "X",
    link: "https://x.com/asetdunia",
    desc: "My Trashtalk",
  },
  {
    id: 1,
    name: "Instagram",
    link: "https://www.instagram.com/syauqashdllh/",
    desc: "Limited gallery",
  },
  {
    id: 2,
    name: "Unsplash",
    link: "https://unsplash.com/id/@syauqashdllh",
    desc: "Public photo",
  },
  {
    id: 3,
    name: "Github",
    link: "https://github.com/qyzh",
    desc: "Vibe Coder",
  },
  {
    id: 4,
    name: "Strava",
    link: "https://www.strava.com/athletes/108607661",
    desc: "Recreational Runner",
  },
  {
    id: 5,
    name: "Steam",
    link: "https://steamcommunity.com/id/qyourbae",
    desc: "Gaming Stats",
  },
  {
    id: 6,
    name: "Dir-diare",
    link: "https://dir.kyxis.my.id/",
    desc: "Personal Blog",
  },
  {
    id: 7,
    name: "Apple Music",
    link: "https://music.apple.com/id/playlist/mentality-cooldown/pl.u-RRbVvlWTmpAgVG6",
    desc: "Mentality Cooldown",
  },
];
export default function OtherLink() {
  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-6">
      {linkext.map((link) => (
        <Card
          key={link.id}
          link={link.link}
          name={link.name}
          desc={link.desc}
        />
      ))}
    </div>
  );
}
