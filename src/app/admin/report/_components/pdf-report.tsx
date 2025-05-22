import React, { forwardRef } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { type Prisma } from "@prisma/client";

type SalesReportWithAdminOrders = Prisma.SalesReportGetPayload<{
  include: {
    orders: true;
    admin: { select: { username: true } };
  };
}>;

interface Props {
  reports: SalesReportWithAdminOrders[];
}

// ✅ Pakai forwardRef agar ref bisa dikirim ke div HTML
const PrintableReport = forwardRef<HTMLDivElement, Props>(
  ({ reports }, ref) => {
    return (
      <div ref={ref} style={{ padding: 20, fontFamily: "Arial" }}>
        <h1>Laporan Penjualan</h1>
        <p>Tanggal Cetak: {formatDate(new Date().toISOString())}</p>

        <table
          style={{ borderCollapse: "collapse", width: "100%", marginTop: 20 }}
        >
          <thead>
            <tr>
              <th style={th}>No</th>
              <th style={th}>Tanggal</th>
              <th style={th}>Total Transaksi</th>
              <th style={th}>Menu Terjual</th>
              <th style={th}>Pendapatan</th>
              <th style={th}>Kasir</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={report.id}>
                <td style={td}>{index + 1}</td>
                <td style={td}>
                  {formatDate(report.date.toString())
                    .split(" ")
                    .slice(0, 3)
                    .join(" ")}
                </td>
                <td style={td}>{report.orders.length}</td>
                <td style={td}>{report.total_items_sold}</td>
                <td style={td}>{formatCurrency(report.income)}</td>
                <td style={td}>{report.admin?.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

PrintableReport.displayName = "PrintableReport";
export default PrintableReport;

const th: React.CSSProperties = {
  border: "1px solid black",
  padding: 8,
  backgroundColor: "#f3f4f6",
};

const td: React.CSSProperties = {
  border: "1px solid black",
  padding: 8,
};
