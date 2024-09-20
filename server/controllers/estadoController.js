const { PrismaClient } = require("@prisma/client");
const { connect } = require("http2");
const prisma = new PrismaClient();

//Listado Estados
module.exports.get = async (request, response, next) => {
  try {
    let listado = await prisma.estado.findMany({});
    response.json(listado);
  } catch (error) {
    next(error);
  }
};

//Obtener estado Por Id
module.exports.getById = async (request, response, next) => {
  try {
    let idEstado = parseInt(request.params.id);
    let categoria = await prisma.estado.findFirst({
      where: { id: idEstado },
    });
    response.json(categoria);
  } catch (error) {
    next(error);
  }
};
