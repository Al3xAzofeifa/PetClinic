const { PrismaClient, Rol } = require("@prisma/client");
const { response } = require("express");
const { connect } = require("http2");
const { request } = require("https");
const prisma = new PrismaClient();

//Listado horario
module.exports.get = async (request, response, next) => {
  try {
    let listado = await prisma.sucursalHorario.findMany({
      include: {
        sucursal: true,
        horario: true,
      },
    });
    response.json(listado);
  } catch (error) {
    next(error);
  }
};

//Obtener Sucursalhorario Por IdSucursal
module.exports.getById = async (request, response, next) => {
  try {
    let idSucursal = parseInt(request.params.id); 
    let horario = await prisma.sucursalHorario.findMany({
      where: { sucursalId: idSucursal },
      include:{
        horario: true
      },
      orderBy: {
        horario: {
          fecha: 'asc' 
        }
      }
    });
    response.json(horario);
  } catch (error) {
    next(error);
  }
};


