import { getReports } from "@/actions/report";
import { ListReport } from "./_components/list-report";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function ReportPage({ searchParams }: Props) {
  const { startDate, endDate, sortBy, sortReport, reportType } =
    await searchParams;
  const reports = await getReports(
    startDate,
    endDate,
    sortBy,
    sortReport,
    reportType
  );
  return (
    <main className="w-full px-3 sm:px-3 md:px-8 py-8 min-h-screen bg-neutral-50">
      <div className="mx-auto">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 rounded-none">
          <div className="mb-6 border-b-4 border-indigo-600 pb-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-neutral-800">
              Laporan Penjualan
            </h1>
            <p className="text-gray-700 font-bold mt-2">
              Kelola laporan penjualan Anda dengan mudah.
            </p>
          </div>

          <ListReport
            reports={reports}
            currentSortReport={sortReport}
            reportType={reportType}
          />
        </div>
      </div>
    </main>
  );
}
