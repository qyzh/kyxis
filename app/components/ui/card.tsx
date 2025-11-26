interface CardProps {
  link: string;
  name: string;
  desc: string;
}
export default function Card({ link, name, desc }: CardProps) {
  return (
    <a href={link} target="_blank">
      <div className="flex flex-col group p-2 border-color border">
        <span className="font-semibold text-main">{name}</span>
        <span className="text-sm text-second">{desc}</span>
      </div>
    </a>
  );
}
