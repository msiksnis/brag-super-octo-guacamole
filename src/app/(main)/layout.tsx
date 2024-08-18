import { redirect } from "next/navigation";

import { validateRequest } from "@/auth";
import SessionProvider from "./SessionProvider";
import Navbar from "@/components/Navbar";
import MenuBar from "@/components/MenuBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex flex-col min-h-screen sm:px-6 xl:px-0">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-4 px-4 sm:px-0">
          <MenuBar className="sticky top-28 h-fit hidden sm:block flex-none space-y-3 rounded-2xl bg-card px-2 py-6 shadow-sm xl:w-80" />
          {children}
        </div>
      </div>
      <MenuBar className="sticky bottom-0 flex w-full justify-center gap-4 border-t backdrop-blur bg-card/60 p-3 sm:hidden" />
    </SessionProvider>
  );
}
