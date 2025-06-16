/* eslint-disable @typescript-eslint/no-explicit-any */
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
  reportType?: string;
  startDate?: string;
  endDate?: string;
}

const PrintableReport = forwardRef<HTMLDivElement, Props>(
  ({ reports, reportType, startDate, endDate }, ref) => {
    const totalIncome = reports.reduce((sum, report) => sum + report.income, 0);
    const totalTransactions = reports.reduce(
      (sum, report) => sum + report.orders.length,
      0
    );
    const totalItemsSold = reports.reduce(
      (sum, report) => sum + report.total_items_sold,
      0
    );

    const getReportTypeLabel = () => {
      switch (reportType) {
        case "daily":
          return "Harian";
        case "monthly":
          return "Bulanan";
        case "yearly":
          return "Tahunan";
        default:
          return "Semua";
      }
    };

    const getPeriodInfo = () => {
      if (!startDate || !endDate) return null;

      const start = new Date(startDate);

      if (reportType === "monthly") {
        const monthNames = [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ];
        return `${monthNames[start.getMonth()]} ${start.getFullYear()}`;
      }

      if (reportType === "yearly") {
        return `Tahun ${start.getFullYear()}`;
      }

      // For custom date range or other types
      if (startDate === endDate) {
        return formatDate(startDate);
      }

      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    const getReportDescription = () => {
      const period = getPeriodInfo();

      if (reportType === "monthly" && period) {
        return `Laporan penjualan harian untuk bulan ${period}`;
      }

      if (reportType === "yearly" && period) {
        return `Laporan penjualan bulanan untuk ${period}`;
      }

      if (period && reportType !== "all") {
        return `Laporan penjualan periode ${period}`;
      }

      return "Laporan penjualan keseluruhan";
    };

    const formatPeriode = (report: SalesReportWithAdminOrders) => {
      if (reportType === "monthly" && (report as any).displayName) {
        return (report as any).displayName;
      }

      const formattedDate = formatDate(report.date.toString());
      if (reportType === "monthly") {
        return formattedDate.split(" ").slice(0, 3).join(" ");
      }

      if (reportType === "yearly") {
        const date = new Date(report.date);
        const monthNames = [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ];
        return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      }

      return formattedDate.split(" ").slice(0, 3).join(" ");
    };

    return (
      <div ref={ref} style={{ padding: 20, fontFamily: "Arial" }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <h1 style={{ fontSize: 24, marginBottom: 10 }}>
            Laporan Penjualan {getReportTypeLabel()}
          </h1>
          <p style={{ fontSize: 14, color: "#666" }}>
            Tanggal Cetak: {formatDate(new Date().toISOString())}
          </p>
          <p style={{ fontSize: 12, color: "#888", marginTop: 5 }}>
            {getReportDescription()}
          </p>
          {getPeriodInfo() && (
            <div
              style={{
                marginTop: 15,
                padding: "8px 16px",
                backgroundColor: "#f0f9ff",
                border: "2px solid #0ea5e9",
                borderRadius: "4px",
                display: "inline-block",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "#0369a1",
                  margin: 0,
                }}
              >
                Periode: {getPeriodInfo()}
              </p>
            </div>
          )}
        </div>

        <table
          style={{ borderCollapse: "collapse", width: "100%", marginTop: 20 }}
        >
          <thead>
            <tr>
              <th style={th}>No</th>
              <th style={th}>
                {reportType === "monthly"
                  ? "Tanggal"
                  : reportType === "yearly"
                  ? "Bulan"
                  : "Periode"}
              </th>
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
                <td style={td}>{formatPeriode(report)}</td>
                <td style={td}>{report.orders.length}</td>
                <td style={td}>{report.total_items_sold}</td>
                <td style={td}>{formatCurrency(report.income)}</td>
                <td style={td}>{report.admin?.username}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td style={totalRowStyle} colSpan={2}>
                <strong>TOTAL</strong>
              </td>
              <td style={totalRowStyle}>
                <strong>{totalTransactions}</strong>
              </td>
              <td style={totalRowStyle}>
                <strong>{totalItemsSold}</strong>
              </td>
              <td style={totalRowStyle}>
                <strong>{formatCurrency(totalIncome)}</strong>
              </td>
              <td style={totalRowStyle}>-</td>
            </tr>
          </tfoot>
        </table>

        <div
          style={{
            marginTop: 30,
            padding: 20,
            backgroundColor: "#f9f9f9",
            border: "1px solid #ddd",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 15 }}>Ringkasan Laporan</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 15,
            }}
          >
            <div>
              <p style={{ margin: "5px 0", fontSize: 14 }}>
                <strong>Total Pemasukan:</strong>
              </p>
              <p style={{ margin: "5px 0", fontSize: 16, color: "#16a34a" }}>
                <strong>{formatCurrency(totalIncome)}</strong>
              </p>
            </div>
            <div>
              <p style={{ margin: "5px 0", fontSize: 14 }}>
                <strong>Total Transaksi:</strong>
              </p>
              <p style={{ margin: "5px 0", fontSize: 16, color: "#2563eb" }}>
                <strong>{totalTransactions}</strong>
              </p>
            </div>
            <div>
              <p style={{ margin: "5px 0", fontSize: 14 }}>
                <strong>Total Menu Terjual:</strong>
              </p>
              <p style={{ margin: "5px 0", fontSize: 16, color: "#7c3aed" }}>
                <strong>{totalItemsSold}</strong>
              </p>
            </div>
          </div>

          {/* Additional Report Info */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 15,
              borderTop: "1px solid #ddd",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 15,
              }}
            >
              <div>
                <p style={{ margin: "5px 0", fontSize: 14 }}>
                  <strong>Jenis Laporan:</strong>
                </p>
                <p style={{ margin: "5px 0", fontSize: 14, color: "#374151" }}>
                  {getReportTypeLabel()}
                </p>
              </div>
              {getPeriodInfo() && (
                <div>
                  <p style={{ margin: "5px 0", fontSize: 14 }}>
                    <strong>Periode:</strong>
                  </p>
                  <p
                    style={{ margin: "5px 0", fontSize: 14, color: "#374151" }}
                  >
                    {getPeriodInfo()}
                  </p>
                </div>
              )}
              <div>
                <p style={{ margin: "5px 0", fontSize: 14 }}>
                  <strong>Jumlah Data:</strong>
                </p>
                <p style={{ margin: "5px 0", fontSize: 14, color: "#374151" }}>
                  {reports.length} laporan
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ marginTop: 40, borderTop: "1px solid #ddd", paddingTop: 20 }}
        >
          <p style={{ fontSize: 12, color: "#666", textAlign: "center" }}>
            Laporan ini dicetak pada {formatDate(new Date().toISOString())}
          </p>
          <p
            style={{
              fontSize: 12,
              color: "#666",
              textAlign: "center",
              marginTop: 5,
            }}
          >
            {getReportDescription()} • Menampilkan {reports.length} data laporan
          </p>
        </div>
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
  textAlign: "center",
  fontWeight: "bold",
};

const td: React.CSSProperties = {
  border: "1px solid black",
  padding: 8,
  textAlign: "center",
};

const totalRowStyle: React.CSSProperties = {
  border: "1px solid black",
  padding: 8,
  backgroundColor: "#e5e7eb",
  textAlign: "center",
  fontWeight: "bold",
};
