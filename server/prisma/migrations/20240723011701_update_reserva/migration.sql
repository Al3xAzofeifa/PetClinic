/*
  Warnings:

  - Added the required column `horaFin` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reserva` ADD COLUMN `horaFin` DATETIME(3) NOT NULL;
