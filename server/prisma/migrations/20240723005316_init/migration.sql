/*
  Warnings:

  - You are about to drop the column `rangoHoras` on the `horario` table. All the data in the column will be lost.
  - You are about to drop the column `sucursalId` on the `horario` table. All the data in the column will be lost.
  - The values [LUNES,MARTES,MIERCOLES,JUEVES,VIERNES,SABADO,DOMINGO] on the enum `Horario_diaSemana` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `horaFin` to the `Horario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horaInicio` to the `Horario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoHorario` to the `Horario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `horario` DROP FOREIGN KEY `Horario_sucursalId_fkey`;

-- AlterTable
ALTER TABLE `horario` DROP COLUMN `rangoHoras`,
    DROP COLUMN `sucursalId`,
    ADD COLUMN `horaFin` DATETIME(3) NOT NULL,
    ADD COLUMN `horaInicio` DATETIME(3) NOT NULL,
    ADD COLUMN `tipoHorario` BOOLEAN NOT NULL,
    MODIFY `diaSemana` ENUM('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo') NOT NULL;

-- CreateTable
CREATE TABLE `SucursalHorario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sucursalId` INTEGER NOT NULL,
    `horarioId` INTEGER NOT NULL,

    UNIQUE INDEX `SucursalHorario_sucursalId_horarioId_key`(`sucursalId`, `horarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SucursalHorario` ADD CONSTRAINT `SucursalHorario_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SucursalHorario` ADD CONSTRAINT `SucursalHorario_horarioId_fkey` FOREIGN KEY (`horarioId`) REFERENCES `Horario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
