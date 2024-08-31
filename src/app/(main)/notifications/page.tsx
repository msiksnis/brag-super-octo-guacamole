import { Metadata } from "next";
import TrendsSidebar from "@/components/TrendsSidebar";
import Notifications from "./Notifications";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function NotificationsPage() {
  return (
    <main className="flex w-full min-w-0 gap-4 pt-8">
      <div className="w-full min-w-0 space-y-4">
        <div className="rounded-2xl bg-card p-4 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Notifications</h1>
        </div>
        <Notifications />
      </div>
      <TrendsSidebar />
    </main>
  );
}
