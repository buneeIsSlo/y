import NavigateBackButton from "@/components/NavigateBackButton";
import TrendingSidebar from "@/components/TrendingSidebar";
import Image from "next/image";
import meme from "@/assets/nothing-to-see-here.webp";

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-4">
      <div className="w-full min-w-0 py-4 sm:max-w-[600px] xl:max-w-none">
        <div className="mb-2 flex items-center gap-5 rounded-2xl border bg-card/70 px-3 py-1 backdrop-blur-3xl">
          <NavigateBackButton />
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
        <div className="flex h-auto w-full justify-center rounded-3xl border bg-card/70 shadow-sm backdrop-blur-3xl">
          <Image
            src={meme}
            alt="Nothing to see here"
            style={{
              width: "80%",
              height: "auto",
            }}
            aria-label="Nothing to see here"
          />
        </div>
      </div>
      <TrendingSidebar />
    </main>
  );
}
