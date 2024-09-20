const { PrismaClient } = require("@prisma/client");
const { connect } = require("http2");
const prisma = new PrismaClient();

//Listado Categoria
module.exports.get = async (request, response, next) => {
  try {
    let listado = await prisma.categoria.findMany({});
    response.json(listado);
  } catch (error) {
    next(error);
  }
};

//Obtener categoria Por Id
module.exports.getById = async (request, response, next) => {
  try {
    let idcategoria = parseInt(request.params.id);
    let categoria = await prisma.categoria.findFirst({
      where: { id: idcategoria },
    });
    response.json(categoria);
  } catch (error) {
    next(error);
  }
};
