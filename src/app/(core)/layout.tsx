import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
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
      <div className="flex min-h-screen flex-col px-4">
        {children}
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 bg-red-400 p-5">
          <p>main</p>
        </div>
      </div>
    </SessionProvider>
  );
}
