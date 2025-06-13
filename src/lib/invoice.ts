import type { Prisma } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import jsPDF from "jspdf";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        menu: true;
      };
    };
  };
}>;

export const invoiceDoc = (orderData: OrderWithItems) => {
  const width = 80 * 2.83465;

  const margin = 15;
  const contentWidth = width - margin * 2;

  let estimatedHeight = 0;

  estimatedHeight += 60;

  estimatedHeight += 40;

  estimatedHeight += 20;
  const customerInfo = [
    ["Nama", orderData.customer_name],
    ["Kode", orderData.code],
    ["Status", getStatusLabel(orderData.status)],
    ["Pembayaran", "Tunai"],
    ["Catatan", orderData.note || "-"],
  ];

  customerInfo.forEach(([, value]) => {
    const textLength = (value || "-").length;
    const estimatedLines = Math.ceil(textLength / 20);
    estimatedHeight += Math.max(12, estimatedLines * 10);
  });

  estimatedHeight += 25;

  estimatedHeight += 30;

  orderData.orderItems.forEach((item) => {
    const itemText = item.note
      ? `${item.menu.name} (${item.note})`
      : item.menu.name;
    const estimatedLines = Math.ceil(itemText.length / 20);
    estimatedHeight += Math.max(18, estimatedLines * 12) + 3;
  });

  estimatedHeight += 80;

  estimatedHeight += 60;

  estimatedHeight += 40;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [width, estimatedHeight],
  });

  doc.setFont("helvetica");

  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, width, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("RESTAURANT INVOICE", width / 2, 15, { align: "center" });

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Jl. Contoh No. 123, Buton Tengah, Sulawesi Tenggara",
    width / 2,
    25,
    {
      align: "center",
      maxWidth: contentWidth,
    }
  );
  doc.text("Telp: (0401) 567890 | Email: info@barakati.com", width / 2, 32, {
    align: "center",
    maxWidth: contentWidth,
  });

  doc.setTextColor(0, 0, 0);

  let yPos = 50;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const shortInvoiceId = orderData.id.substring(0, 8) + "...";
  doc.text(`Invoice: ${shortInvoiceId}`, margin, yPos);
  yPos += 12;
  doc.text(
    `Tanggal: ${formatDate(orderData.created_at.toString())}`,
    margin,
    yPos
  );

  yPos += 15;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.line(margin, yPos, width - margin, yPos);

  yPos += 15;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMASI PELANGGAN", margin, yPos);
  yPos += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  customerInfo.forEach(([label, value]) => {
    const labelText = `${label}:`;
    const valueText = value || "-";

    doc.setFont("helvetica", "bold");
    doc.text(labelText, margin, yPos);
    doc.setFont("helvetica", "normal");

    const lines = doc.splitTextToSize(valueText, contentWidth - 40);
    doc.text(lines, margin + 40, yPos);
    yPos += Math.max(10, lines.length * 8);
  });

  yPos += 10;
  doc.setLineWidth(1);
  doc.line(margin, yPos, width - margin, yPos);

  yPos += 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("DETAIL PESANAN", margin, yPos);
  yPos += 12;

  doc.setFillColor(0, 0, 0);
  doc.rect(margin, yPos, contentWidth, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("ITEM", margin + 3, yPos + 8);
  doc.text("QTY", width - margin - 50, yPos + 8, { align: "center" });
  doc.text("TOTAL", width - margin - 3, yPos + 8, { align: "right" });

  doc.setTextColor(0, 0, 0);
  yPos += 15;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  orderData.orderItems.forEach((item, index) => {
    if (index % 2 === 1) {
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, yPos - 2, contentWidth, 16, "F");
    }

    const itemText = item.note
      ? `${item.menu.name}\n(${item.note})`
      : item.menu.name;

    const lines = doc.splitTextToSize(itemText, contentWidth - 60);

    doc.text(lines, margin + 3, yPos + 5);

    doc.text(item.quantity.toString(), width - margin - 50, yPos + 5, {
      align: "center",
    });

    doc.text(
      formatCurrency(item.menu.price * item.quantity),
      width - margin - 3,
      yPos + 5,
      { align: "right" }
    );

    const lineHeight = Math.max(16, lines.length * 8 + 4);
    yPos += lineHeight;

    if (index < orderData.orderItems.length - 1) {
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, width - margin, yPos);
      yPos += 3;
    }
  });

  yPos += 10;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.line(margin, yPos, width - margin, yPos);

  yPos += 15;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");

  doc.text("Subtotal:", width - margin - 60, yPos);
  doc.text(formatCurrency(orderData.total_price), width - margin - 3, yPos, {
    align: "right",
  });
  yPos += 10;

  doc.text("Pajak (0%):", width - margin - 60, yPos);
  doc.text(formatCurrency(0), width - margin - 3, yPos, { align: "right" });
  yPos += 15;

  doc.setFillColor(0, 0, 0);
  doc.rect(margin, yPos, contentWidth, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("TOTAL:", margin + 5, yPos + 10);
  doc.text(
    formatCurrency(orderData.total_price),
    width - margin - 5,
    yPos + 10,
    { align: "right" }
  );

  doc.setTextColor(0, 0, 0);
  yPos += 25;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.line(margin, yPos, width - margin, yPos);

  yPos += 15;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Terima kasih atas kunjungan Anda!", width / 2, yPos, {
    align: "center",
  });
  yPos += 12;
  doc.text(
    `Buton Tengah, ${new Date().toLocaleDateString("id-ID")}`,
    margin,
    yPos
  );
  yPos += 15;
  doc.text("Kasir: ___________________", margin, yPos);

  return doc;
};

function getStatusLabel(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Selesai";
    case "PROCESSING":
      return "Diproses";
    case "CANCELLED":
      return "Dibatalkan";
    default:
      return "Diterima";
  }
}
