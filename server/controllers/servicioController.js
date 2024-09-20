const { PrismaClient } = require("@prisma/client");
const { response } = require("express");
const { connect } = require("http2");
const { request } = require("https");
const prisma = new PrismaClient();

//Listado servicio
module.exports.get = async (request, response, next) => {
  try {
    let listado = await prisma.servicio.findMany({});
    response.json(listado);
  } catch (error) {
    next(error);
  }
};

//Obtener servicio Por Id
module.exports.getById = async (request, response, next) => {
  try {
    let idservicio = parseInt(request.params.id);
    let servicio = await prisma.servicio.findFirst({
      where: { id: idservicio },
    });
    response.json(servicio);
  } catch (error) {
    next(error);
  }
};

//Crear
module.exports.create = async (request, response, next) => {
  let body = request.body;
  const newServicio = await prisma.servicio.create({
    data: {
      descripcion: body.descripcion,
      precio: body.precio,
      duracion: body.duracion,
      beneficio: body.beneficio,
      requerimiento: body.requerimiento,
      estado: false,
    },
  });
  response.json(newServicio);
};

//Actualizar
module.exports.update = async (request, response, next) => {
  let body = request.body;
  let idServicio = parseInt(request.params.id);

  const updateServicio = await prisma.servicio.update({
    where: {
      id: idServicio,
    },
    data: {
      descripcion: body.descripcion,
      precio: body.precio,
      duracion: body.duracion,
      beneficio: body.beneficio,
      requerimiento: body.requerimiento,
      estado: false,
    },
  });
  response.json(updateServicio);
};
