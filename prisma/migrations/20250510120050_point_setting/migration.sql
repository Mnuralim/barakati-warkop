-- CreateEnum
CREATE TYPE "MenuType" AS ENUM ('FOOD', 'BEVERAGE', 'OTHER');

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "menuType" "MenuType" NOT NULL DEFAULT 'OTHER',
ALTER COLUMN "redeemable" SET DEFAULT false;
