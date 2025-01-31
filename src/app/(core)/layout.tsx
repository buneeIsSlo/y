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
      <div>
        <div className="fixed left-0 top-0 -z-10 h-full w-full">
          <div className="absolute top-[-5%] z-[-2] h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-50%,#f97316_0.8,transparent)]"></div>
          <div className="absolute bottom-[-50%] left-[-25%] right-0 h-[500px] w-[800px] rounded-full bg-[radial-gradient(ellipse_farthest-side,#f97316_0.8,transparent)]"></div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-4">
          <LeftSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </SessionProvider>
  );
}
