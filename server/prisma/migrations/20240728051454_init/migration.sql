/*
  Warnings:

  - You are about to drop the column `horaFin` on the `reserva` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `reserva` DROP COLUMN `horaFin`,
    MODIFY `hora` VARCHAR(191) NOT NULL;
