import NavigateBackButton from "@/components/NavigateBackButton";
import TrendingSidebar from "@/components/TrendingSidebar";
import SearchResults from "./SearchResults";
import { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{ q: string }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q;
  return {
    title: `Search results for "${q}"`,
  };
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q;
  return (
    <main className="flex w-full min-w-0 gap-4">
      <div className="w-full min-w-0 py-4 sm:max-w-[600px] xl:max-w-none">
        <div className="mb-2 flex items-center gap-5 rounded-2xl border bg-card/70 px-3 py-1 backdrop-blur-3xl">
          <NavigateBackButton />
          <h1 className="line-clamp-2 break-all text-xl font-bold">
            Search results for &quot;{q}&quot;
          </h1>
        </div>
        <SearchResults query={q} />
      </div>
      <TrendingSidebar />
    </main>
  );
}
