/*
  Warnings:

  - You are about to drop the column `redeemable` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `payment_status` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pointEarned` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_order_id_fkey";

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "redeemable";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "payment_status",
DROP COLUMN "pointEarned";

-- DropTable
DROP TABLE "Notification";

-- DropEnum
DROP TYPE "NotificationType";
