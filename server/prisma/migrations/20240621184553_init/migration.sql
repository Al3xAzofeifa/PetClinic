/*
  Warnings:

  - Added the required column `pregunta1` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pregunta2` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pregunta3` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reserva` ADD COLUMN `pregunta1` VARCHAR(191) NOT NULL,
    ADD COLUMN `pregunta2` VARCHAR(191) NOT NULL,
    ADD COLUMN `pregunta3` VARCHAR(191) NOT NULL;
