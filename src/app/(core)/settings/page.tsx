import NavigateBackButton from "@/components/NavigateBackButton";
import TrendingSidebar from "@/components/TrendingSidebar";
import Settings from "./Settings";

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-4">
      <div className="w-full min-w-0 py-4 sm:max-w-[600px] xl:max-w-none">
        <div className="mb-2 flex items-center gap-5 rounded-2xl border px-3 py-1">
          <NavigateBackButton />
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
        <Settings />
      </div>
      <TrendingSidebar />
    </main>
  );
}
