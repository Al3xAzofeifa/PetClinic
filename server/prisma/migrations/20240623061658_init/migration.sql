/*
  Warnings:

  - You are about to drop the column `color` on the `reserva` table. All the data in the column will be lost.
  - Added the required column `color` to the `Estado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `estado` ADD COLUMN `color` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `reserva` DROP COLUMN `color`;
