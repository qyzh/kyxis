import { PhotoProfile } from "./components/photoprofile";
import Naming from "./components/naming";
import OtherLink from "./components/otherlink";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-mono bg-[#11111]">
      <main className="flex w-full max-w-3xl flex-col border-color border sm:items-start">
        <section className="flex w-full border-b border-color px-6 py-2 items-center space-x-1.5">
          <h1 className="uppercase font-semibold text-main">About</h1>
          <span className="text-sm italic text-[#808080]">who am i</span>
        </section>
        <section className="flex border-b border-color flex-col md:flex-row px-6 py-2 justify-center md:justify-between">
          <PhotoProfile />
          <Naming />
        </section>
        <section className="flex w-full border-b border-color px-6 py-2 items-center space-x-1.5">
          <h1 className="uppercase font-semibold text-main">Link</h1>
          <span className="text-sm italic text-second">
            where am i on the internet
          </span>
        </section>
        <section className="flex w-full border-b border-color flex-col md:flex-row px-6 py-4 justify-center md:justify-between">
          <OtherLink />
        </section>
        {/* <Wavy /> */}
        <Footer />
      </main>
    </div>
  );
}
