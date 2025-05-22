/*
  Warnings:

  - You are about to drop the column `user_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `PointLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PointSetting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Redemption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Table` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_table_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_user_id_fkey";

-- DropForeignKey
ALTER TABLE "PointLog" DROP CONSTRAINT "PointLog_order_id_fkey";

-- DropForeignKey
ALTER TABLE "PointLog" DROP CONSTRAINT "PointLog_redemption_id_fkey";

-- DropForeignKey
ALTER TABLE "PointLog" DROP CONSTRAINT "PointLog_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Redemption" DROP CONSTRAINT "Redemption_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "Redemption" DROP CONSTRAINT "Redemption_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_admin_id_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "user_id";

-- DropTable
DROP TABLE "PointLog";

-- DropTable
DROP TABLE "PointSetting";

-- DropTable
DROP TABLE "Redemption";

-- DropTable
DROP TABLE "Table";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "PointType";

-- DropEnum
DROP TYPE "RedemptionStatus";
