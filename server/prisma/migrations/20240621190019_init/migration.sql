/*
  Warnings:

  - You are about to drop the column `habitos_dieta` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `historial_medico` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `razon_visita` on the `reserva` table. All the data in the column will be lost.
  - Added the required column `habitos` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `historial` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razon` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reserva` DROP COLUMN `habitos_dieta`,
    DROP COLUMN `historial_medico`,
    DROP COLUMN `razon_visita`,
    ADD COLUMN `habitos` VARCHAR(191) NOT NULL,
    ADD COLUMN `historial` VARCHAR(191) NOT NULL,
    ADD COLUMN `razon` VARCHAR(191) NOT NULL;
