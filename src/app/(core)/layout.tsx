import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import LeftSidebar from "./LeftSidebar";
import SessionProvider from "./SessionProvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="mx-auto flex max-w-7xl gap-4">
        <LeftSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </SessionProvider>
  );
}
