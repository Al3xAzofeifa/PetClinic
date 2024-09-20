/*
  Warnings:

  - You are about to drop the column `pregunta1` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `pregunta2` on the `reserva` table. All the data in the column will be lost.
  - You are about to drop the column `pregunta3` on the `reserva` table. All the data in the column will be lost.
  - Added the required column `habitos_dieta` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `historial_medico` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razon_visita` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reserva` DROP COLUMN `pregunta1`,
    DROP COLUMN `pregunta2`,
    DROP COLUMN `pregunta3`,
    ADD COLUMN `habitos_dieta` VARCHAR(191) NOT NULL,
    ADD COLUMN `historial_medico` VARCHAR(191) NOT NULL,
    ADD COLUMN `razon_visita` VARCHAR(191) NOT NULL;
