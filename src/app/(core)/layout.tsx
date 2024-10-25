import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import LeftSidebar from "./LeftSidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="mx-auto flex max-w-6xl">
        <LeftSidebar />
        <div className="w-full">{children}</div>
      </div>
    </SessionProvider>
  );
}
