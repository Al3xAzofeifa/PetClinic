import { PrismaClient } from "@prisma/client";
import { categorias } from "./seeds/categorias";
import { estados } from "./seeds/estados";

const prisma = new PrismaClient();
const main = async () => {
  try {
    //Categorias - no tiene relaciones
    await prisma.categoria.createMany({
      data: categorias,
    });

    //estados no tienen relaciones
    await prisma.estado.createMany({
      data: estados,
    });
  } catch (error) {
    throw error;
  }
};
main().catch((err) => {
  console.warn("Error al ejecutar el seeder:\n", err);
});
