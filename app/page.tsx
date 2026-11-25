import { site } from "@/lib/content";
import Landing from "./components/Landing";

export default function Home() {
  return <Landing name={site.name} chapters={site.chapters} />;
}
