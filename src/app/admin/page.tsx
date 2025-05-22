import { getStats, weeklySales } from "@/actions/stats";
import { Dashboard } from "./_components/dashboard";

export default async function AdminHomePage() {
  const [stats, sales] = await Promise.all([getStats(), weeklySales()]);

  return (
    <div>
      <Dashboard stats={stats} sales={sales} />
    </div>
  );
}
