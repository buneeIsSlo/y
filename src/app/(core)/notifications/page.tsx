import { Metadata } from "next";
import Notifications from "./Notifications";
import TrendingSidebar from "@/components/TrendingSidebar";
import NavigateBackButton from "@/components/NavigateBackButton";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-4">
      <div className="w-full min-w-0">
        <div className="mb-2 flex items-center gap-5 rounded-2xl border px-3 py-1">
          <NavigateBackButton />
          <h1 className="text-xl font-bold">Notifications</h1>
        </div>
        <Notifications />
      </div>
      <TrendingSidebar />
    </main>
  );
}
