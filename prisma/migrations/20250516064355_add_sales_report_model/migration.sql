/*
  Warnings:

  - You are about to drop the column `cash` on the `SalesReport` table. All the data in the column will be lost.
  - You are about to drop the column `gross_income` on the `SalesReport` table. All the data in the column will be lost.
  - You are about to drop the column `net_income` on the `SalesReport` table. All the data in the column will be lost.
  - You are about to drop the column `qris` on the `SalesReport` table. All the data in the column will be lost.
  - You are about to drop the column `total_discount` on the `SalesReport` table. All the data in the column will be lost.
  - You are about to drop the column `transfer` on the `SalesReport` table. All the data in the column will be lost.
  - Added the required column `income` to the `SalesReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SalesReport" DROP COLUMN "cash",
DROP COLUMN "gross_income",
DROP COLUMN "net_income",
DROP COLUMN "qris",
DROP COLUMN "total_discount",
DROP COLUMN "transfer",
ADD COLUMN     "income" DOUBLE PRECISION NOT NULL;
