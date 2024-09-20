-- DropForeignKey
ALTER TABLE `facturadetalle` DROP FOREIGN KEY `FacturaDetalle_productoId_fkey`;

-- DropForeignKey
ALTER TABLE `facturadetalle` DROP FOREIGN KEY `FacturaDetalle_servicioId_fkey`;

-- AlterTable
ALTER TABLE `facturadetalle` MODIFY `productoId` INTEGER NULL,
    MODIFY `servicioId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `FacturaDetalle` ADD CONSTRAINT `FacturaDetalle_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FacturaDetalle` ADD CONSTRAINT `FacturaDetalle_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `Servicio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
