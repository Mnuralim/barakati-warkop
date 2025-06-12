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
  const doc = new jsPDF();

  doc.setFont("helvetica");

  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("RESTAURANT INVOICE", 105, 15, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Jl. Contoh No. 123, Buton Tengah, Sulawesi Tenggara", 105, 23, {
    align: "center",
  });
  doc.text("Telp: (0401) 567890 | Email: info@barakati.com", 105, 29, {
    align: "center",
  });

  doc.setTextColor(0, 0, 0);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  const invoiceNumber = orderData.id;
  doc.text(`Invoice: ${invoiceNumber}`, 20, 50);
  doc.text(`Tanggal: ${formatDate(orderData.created_at.toString())}`, 20, 58);

  let yPos = 65;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(20, yPos - 3, 190, yPos - 3);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMASI PELANGGAN", 20, yPos);
  doc.text("STATUS & PEMBAYARAN", 120, yPos);

  yPos += 8;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const getStatusLabel = (status: string) => {
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
  };

  const customerInfo = [
    ["Nama:", orderData.customer_name],
    ["Kode Pesanan:", orderData.code],
    ["ID Pesanan:", orderData.id.substring(0, 8)],
    ["Catatan:", orderData.note || "-"],
  ];

  const paymentInfo = [
    ["Status Pesanan:", getStatusLabel(orderData.status)],
    ["Metode Pembayaran:", "Tunai"],
    ["Tanggal Cetak:", new Date().toLocaleDateString("id-ID")],
  ];

  customerInfo.forEach(([label, value], index) => {
    doc.setFont("helvetica", "bold");
    doc.text(label as string, 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(value as string, 55, yPos);

    if (paymentInfo[index]) {
      doc.setFont("helvetica", "bold");
      doc.text(paymentInfo[index][0], 120, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(paymentInfo[index][1], 160, yPos);
    }

    yPos += 5;
  });

  yPos = 95;
  doc.line(20, yPos - 3, 190, yPos - 3);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DETAIL PESANAN", 20, yPos);

  yPos += 10;

  doc.setFillColor(0, 0, 0);
  doc.rect(20, yPos - 6, 170, 10, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("ITEM", 25, yPos);
  doc.text("HARGA", 90, yPos);
  doc.text("QTY", 120, yPos);
  doc.text("CATATAN", 135, yPos);
  doc.text("SUBTOTAL", 170, yPos);

  doc.setTextColor(0, 0, 0);
  yPos += 10;

  orderData.orderItems.forEach((item, index) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    const itemName =
      item.menu.name.length > 20
        ? item.menu.name.substring(0, 20) + "..."
        : item.menu.name;
    doc.text(itemName, 25, yPos);

    doc.text(formatCurrency(item.menu.price), 90, yPos);

    doc.text(item.quantity.toString(), 120, yPos);

    const note = item.note || "-";
    const shortNote = note.length > 10 ? note.substring(0, 10) + "..." : note;
    doc.text(shortNote, 135, yPos);

    doc.text(formatCurrency(item.menu.price * item.quantity), 170, yPos);

    yPos += 6;

    if (index < orderData.orderItems.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(25, yPos - 1, 185, yPos - 1);
    }
  });

  yPos += 5;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.line(20, yPos, 190, yPos);

  yPos += 8;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  doc.text("Subtotal:", 130, yPos);
  doc.text(formatCurrency(orderData.total_price), 170, yPos);
  yPos += 6;

  doc.text("Pajak (0%):", 130, yPos);
  doc.text(formatCurrency(0), 170, yPos);
  yPos += 6;

  doc.setFillColor(0, 0, 0);
  doc.rect(125, yPos - 3, 65, 10, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL:", 130, yPos);
  doc.text(formatCurrency(orderData.total_price), 170, yPos);

  doc.setTextColor(0, 0, 0);

  yPos += 15;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("CATATAN:", 20, yPos);

  yPos += 6;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const notes = [
    "• Invoice ini adalah bukti transaksi yang sah",
    "• Terima kasih atas kunjungan Anda",
    "• Hubungi kami jika ada pertanyaan",
  ];

  notes.forEach((note) => {
    doc.text(note, 25, yPos);
    yPos += 4;
  });

  yPos += 10;
  const currentDate = new Date().toLocaleDateString("id-ID");
  doc.setFont("helvetica", "normal");
  doc.text(`Buton Tengah, ${currentDate}`, 140, yPos);

  yPos += 6;
  doc.text("Kasir", 140, yPos);

  yPos += 15;
  doc.line(140, yPos, 180, yPos);

  yPos += 5;
  doc.setFontSize(7);
  doc.text("Tanda Tangan & Nama", 140, yPos);

  return doc;
};
