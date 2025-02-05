import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import LeftSidebar from "./LeftSidebar";
import SessionProvider from "./SessionProvider";
import MobileTopNavbar from "./MobileTopNavbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="relative">
        <div className="fixed left-0 top-0 -z-10 h-full w-full">
          <div className="absolute top-[-5%] h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-50%,rgba(249,115,22,0.8),transparent)]"></div>
          <div className="absolute bottom-[-50%] left-[-25%] right-0 h-[500px] w-[800px] rounded-full bg-transparent sm:bg-[radial-gradient(ellipse_farthest-side,rgba(249,115,22,0.8),transparent)]"></div>
        </div>
        <MobileTopNavbar />
        <div className="mx-auto flex max-w-7xl sm:gap-4">
          <LeftSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </SessionProvider>
  );
}
